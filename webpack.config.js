var webpack = require('webpack')
var path = require('path')

module.exports = {
	entry: {
		app: './src/index.js'
	},
	output: {
		filename: 'dist/bundle.js',
		sourceMapFilename: 'dist/bundle.map'
	},
	devtool: '#source-map',
	plugins: process.env.NODE_ENV === 'production' ? [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: true,
				drop_console: true
			}
		})
	] : [],
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				exclude: /(node_modules)/,
				query: {
					presets: ['react', 'es2015']
				}
			}
		]
	}
}