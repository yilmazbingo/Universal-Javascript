const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
  entry: { main: "./src/client/client.js" },
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "public")
  },
  devServer: { overlay: true }
});
