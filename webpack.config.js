const production = process.env.NODE_ENV == 'production';
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./webpack.common.js');
const LoadablePlugin = require('@loadable/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const commonPlugins = [
	new webpack.DefinePlugin({
		__isBrowser__: true
	}),
	new MiniCssExtractPlugin({
		filename: `styles/${production ? '' : 'dev.'}[name].[contenthash:8].css?1-VZJ-ver`
	}),
	new LoadablePlugin({
		filename: `${production ? '' : 'dev.'}loadable-stats.json`,
		writeToDisk: {
			filename: path.resolve('./build')
		}
	})
];

const config = {
	mode: production ? 'production' : 'development',
	...(!production && { devtool: 'source-map' }),
	entry: {
		main: './src/client/client.js',
		'error-page': './src/client/not-found'
	},
	output: {
		path: path.resolve('./dist'),
		filename: `${production ? '' : 'dev.'}[name].[contenthash:8].js?1-VZJ-ver`,
		chunkFilename: `${production ? '' : 'dev.'}[name].[contenthash:8].js?1-VZJ-ver`
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				exclude: /(node_modules|bower_components|src\/font)/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: {
								localIdentName: '[local]'
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.s?css$/,
				include: /jd-library/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: {
								localIdentName: '[hash:base64:4]'
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.s?css$/,
				include: /(node_modules|bower_components|src\/font)/,
				exclude: /jd-library/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(ttf|eot|woff|woff2|svg|gif)/,
				use: {
					loader: 'file-loader',
					options: {
						name: function name(fileName) {
							fileName = fileName.replace(/.*(node_modules|src\/font)\//i, '');
							fileName = fileName.replace(/\.(.+)/, '.[contenthash:8].$1?1-VZJ-ver')
							return fileName
						},
						publicPath: '../'
					}
				}
			}
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					name: 'vendor',
					chunks: 'all',
					priority: 1000,
					minSize: 0
				},
				common: {
					name: 'common',
					chunks: 'all',
					minChunks: 2,
					priority: 100,
					minSize: 0
				},
				default: false,
				configs: {
					test: /config/,
					name: 'manifest',
					chunks: 'all',
					//priority:500,
					minSize: 0
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		},
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: false,
					},
				},
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: !production
		? [...commonPlugins]
		: [
			new webpack.optimize.OccurrenceOrderPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				}
			}),
			...commonPlugins
		]
};

module.exports = merge(baseConfig, config);
