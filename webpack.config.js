const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const TerserPlugin = require('terser-webpack-plugin');
const SizePlugin = require('size-plugin');
const Webpackbar = require('webpackbar');
const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const analyze = process.env.ANALYZE;
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    main: [path.resolve(__dirname, 'src/index.js')],
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].chunk.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    historyApiFallback: true,
    port: 5050,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@bundles': path.resolve(__dirname, 'src/bundles'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@containers': path.resolve(__dirname, 'src/containers'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@screens': path.resolve(__dirname, 'src/screens'),
    },
  },
  optimization: {
    nodeEnv: JSON.stringify(process.env.NODE_ENV),
    minimize: JSON.stringify(process.env.NODE_ENV) === 'production',
    concatenateModules: JSON.stringify(process.env.NODE_ENV) === 'production',
    runtimeChunk: JSON.stringify(process.env.NODE_ENV) === 'production',
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      name: true,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'initial',
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          test: /[\\/]src[\\/]/,
          priority: -5,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new SizePlugin(),
    new Webpackbar(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
      ),
    }),
    new webpack.NamedChunksPlugin((chunk) => {
      // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      // https://github.com/webpack/webpack/issues/1315#issuecomment-386267369
      if (chunk.name) {
        return chunk.name;
      }

      // eslint-disable-next-line no-underscore-dangle
      return [...chunk._modules]
        .map((m) =>
          path.relative(
            m.context,
            m.userRequest.substring(0, m.userRequest.lastIndexOf('.')),
          ),
        )
        .join('_');
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackPwaManifest({
      name: 'Blockstack React + Redux Bundler Starter',
      short_name: 'Blockstack Starter',
      description:
        'A starter repo for building Blockstack apps with React and Redux Bundler.',
      background_color: '#ffffff',
      filename: '[name][ext]',
      start_url: 'http://react-blockstack.now.sh/',
      fingerprints: false,
      inject: false,
      publicPath: 'http://react-blockstack.now.sh/',
      icons: [
        {
          src: path.resolve('src/assets/app-icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: path.resolve(__dirname, 'dist', 'index.html'),
      inlineSource: 'runtime~.+\\.js',
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ].concat(analyze ? [new BundleAnalyzerPlugin()] : []),
};
