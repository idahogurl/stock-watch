const nodeExternals = require('webpack-node-externals');

const config = {
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'index.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        include: /(node_modules)/,
        type: 'javascript/auto',
      },
      {
        test: /\.gql$/,
        use: 'graphql-tag/loader',
      },
    ],
  },
  target: 'node',
  resolve: {
    extensions: ['*', '.mjs', '.js', '.json', '.gql', '.graphql'],
  },
  externals: [nodeExternals()],
};

module.exports = config;
