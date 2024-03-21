var path = require('path');
var webpack = require('webpack');

module.exports = {
  // other webpack configuration...
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      }
    ]
  }
};
