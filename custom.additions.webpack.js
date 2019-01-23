const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"]
        }
      },
      { test: /\.(png|jpg)$/, loader: "url-loader", include: [path.join(__dirname, 'static')] }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      main: path.resolve(__dirname, "src/main/"),
      renderer: path.resolve(__dirname, "src/renderer/")
    }
  }
};
