/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

const isDevelopment = true;

const entries = {};
const htmlPlugins = [];

const pagesDir = path.resolve('./src/pages');

fs.readdirSync(pagesDir).forEach(fname => {
	if (fs.statSync(path.join(pagesDir, fname)).isFile()) {
		if (/\.tsx?$/.test(fname)) {
			const noext = fname.replace(/\.tsx?$/, '');

			entries[noext] = path.join(pagesDir, fname);

			if (fs.existsSync(path.join(pagesDir, `${noext}.html`))) {
				htmlPlugins.push(
					new HtmlWebpackPlugin({
						chunks: [noext],
						template: path.join(pagesDir, `${noext}.html`),
						filename: `${noext}.html`,
					}),
				);
			}
		}
	}
});

module.exports = {
	mode: 'development',
	entry: entries,

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
	},

	plugins: [
		new CleanWebpackPlugin(),
		new webpack.ProgressPlugin(),
		...htmlPlugins,
		new MiniCssExtractPlugin({
			filename: isDevelopment ? '[name].css' : '[name].[hash].css',
			chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
		}),
	],

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: [/node_modules/],
			},
			{
				test: /\.module\.s(a|c)ss$/,
				loader: [
					isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: true,
							sourceMap: isDevelopment,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDevelopment,
						},
					},
				],
			},
			{
				test: /\.s(a|c)ss$/,
				exclude: /\.module.(s(a|c)ss)$/,
				loader: [
					isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDevelopment,
						},
					},
				],
			},
		],
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/,
				},
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true,
		},
	},

	devServer: {
		open: true,
		proxy: {
			'/api': 'http://localhost:3000',
		},
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
	},
};
