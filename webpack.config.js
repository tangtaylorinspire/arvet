/* Old Config
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    disableHostCheck: true,
    // other options
}
}*/
const path = require('path');
module.exports = {
  entry: {
    main: "./es6/main.js",
    main_vessel: "./es6/main_vessel.js"
  },
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    disableHostCheck: true,
    // other options
  },
  module: {
    rules: [
      {
        test: path.join(__dirname, 'es6'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}