const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../public');

const config = {
  entry: './index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.gql$/,
        use: 'graphql-tag/loader',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.css', '.mjs', '.js', '.jsx', '.json', '.gql'],
  },
};

module.exports = config;
