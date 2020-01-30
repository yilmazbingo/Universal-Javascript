const path = require("path");
const nodeWebExternals = require("webpack-node-externals");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
  entry: { main: "./src/index.js" },

  target: "node",

  externals: [nodeWebExternals()],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  }
});
