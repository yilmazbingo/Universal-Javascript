const path = require("path");

module.exports = {
  //first resolve the given directory modules first
  resolve: {
    modules: [path.resolve(__dirname, "./src"), "node_modules"]
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  }
};
