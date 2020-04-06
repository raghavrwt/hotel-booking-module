module.exports = {
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: function (modulePath) {
					return /node_modules/.test(modulePath) && !/node_modules\/jd-library/.test(modulePath);
				},
				loader: 'babel-loader',
				query: {
					presets: [
						'@babel/preset-react',
						[
							'@babel/preset-env',
							{
								modules: false
							}
						]
					],
					plugins: [
						[
							'@babel/plugin-transform-runtime',
							{
								regenerator: true
							}
						],
						'@babel/plugin-proposal-class-properties'
					]
				}
			}
		]
	}
};
