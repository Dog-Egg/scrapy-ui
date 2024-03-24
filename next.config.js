const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: "build",
  webpack(config, options) {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.PACKAGE_VERSION": JSON.stringify(
          process.env.PACKAGE_VERSION,
        ),
        "process.env.PACKAGE_VERSION_VERBOSE": JSON.stringify(
          process.env.PACKAGE_VERSION_VERBOSE,
        ),
      }),
    );
    return config;
  },
};

module.exports = nextConfig;
