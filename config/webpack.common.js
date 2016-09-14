var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
	entry: {
		'polyfills': './app/scripts/polyfills.ts',
		'vendor': './app/scripts/vendor.ts',
		'popup': './app/scripts/popup.ts'
	},

	resolve: {
		extensions: ['', '.js', '.ts']
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: ['ts', 'angular2-template-loader']
			},
			{
				test: /\.html$/,
				loader: 'html'
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file?name=assets/[name].[hash].[ext]'
			},
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass?sourceMap']
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['popup', 'vendor', 'polyfills']
		}),

		new HtmlWebpackPlugin({
			template: './app/popup.html'
		})
	]
};
