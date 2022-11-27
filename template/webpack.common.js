const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
{{#typescript}}
{{#css_modules}}
const { WatchIgnorePlugin } = require('webpack');
{{/css_modules}}
{{/typescript}}

module.exports = {
  entry: {
    {{#typescript}}
    {{#react}}
    main: './src/main.tsx',
    {{/react}}
    {{#no_react}}
    main: './src/main.ts',
    {{/no_react}}
    {{/typescript}}
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      { test: /\.css$/, use: [
        'style-loader',
        {{#css_modules}}
        {{#typescript}}
        'css-modules-typescript-loader',
        {{/typescript}}
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
        {{/css_modules}}
        {{#no_css_modules}}
        'css-loader',
        {{/no_css_modules}}
      ]},
      {{#typescript}}
      { test: /\.tsx?$/, exclude: /node_modules/, use: [
        {{#preact}}
        'babel-loader',
        {{/preact}}
        'ts-loader',
      ]},
      {{/typescript}}
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [
    {{#typescript}}
    {{#css_modules}}
    new WatchIgnorePlugin({
      paths: [
        /css\.d\.ts$/
      ],
    }),
    {{/css_modules}}
    {{/typescript}}
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'public/favicon.png',
      template: 'public/index.html',
    }),
  ],
};
