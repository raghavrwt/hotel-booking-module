const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackNodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.common.js');

const config = {
	target: 'node',
	node: {
		__filename: false,
		__dirname: false
	},
	mode: 'development',
	entry: {
		server_api: './src/server_api.js',
	},
	externals: [webpackNodeExternals({
		whitelist : ['jd-library']
	})],
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, 'build')
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.hbs$/,
				loader: 'handlebars-loader',
				options: {
					partialDirs: [
						path.join(__dirname, 'src','helpers', 'common_component')
					],
					precompileOptions: {
						knownHelpersOnly: false,
					},
				}
			},
			{
				test: /\.s?css$/,
				exclude: /(node_modules|bower_components|src\/font|src\/helpers\/styles)/,
				use: [
					{
						loader: 'css-loader',
						options: {
							url: false,
							onlyLocals: true,
							modules: {
								localIdentName: '[local]'
							}
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.s?css$/,
				include: /jd-library/,
				use: [
					{
						loader: 'css-loader',
						options: {
							url: false,
							onlyLocals: true,
							modules: {
								localIdentName: '[hash:base64:4]'
							}
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.s?css$/,
				include: /(node_modules|bower_components|src\/font)/,
				exclude: /jd-library/,
				use: [
					{
						loader: 'css-loader',
						options: {
							url: false,
							onlyLocals: true
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.scss$/,
				include: /src\/helpers\/styles/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '/[path][name].css',
							context: path.resolve(__dirname,"src")
						}
					},
					{
						loader: 'sass-loader',
						options:{
							sourceMap: true
						}
					}
				]
			}
			
		]
	},
	plugins:[
		new webpack.DefinePlugin({
			__isBrowser__: false
		})
	]
};

module.exports = merge(baseConfig,config);
