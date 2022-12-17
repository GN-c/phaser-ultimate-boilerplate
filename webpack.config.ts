import path from "path";
import webpack from "webpack";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import AssetOptimizationPlugin from "./webpack/AssetOptimization";
import { ESBuildMinifyPlugin } from "esbuild-loader";

const MODE = process.env.WEBPACK_DEV_SERVER ? "development" : "production";

const config: webpack.Configuration = {
  devtool: MODE == "development" ? "source-map" : false,
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[chunkhash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "esbuild-loader",

        options: {
          loader: "tsx",
          target: "es2015",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin({})],
    alias: {
      eventemitter3: path.resolve(__dirname, "./node_modules/eventemitter3"),
    },
    modules: [
      path.resolve(__dirname, "./node_modules/phaser/src"),
      path.resolve(__dirname, "./node_modules"),
    ],
  },
  optimization: {
    minimizer: [new ESBuildMinifyPlugin({ legalComments: "none" })],
  },

  plugins: [
    new webpack.DefinePlugin({
      "typeof WEBGL_RENDERER": JSON.stringify(true),
      "typeof CANVAS_RENDERER": JSON.stringify(false),
      "typeof WEBGL_DEBUG": JSON.stringify(false),
      "typeof EXPERIMENTAL": JSON.stringify(false),
      "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
      "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new AssetOptimizationPlugin(MODE),
  ],
};

module.exports = config;
