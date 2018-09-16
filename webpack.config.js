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
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HSWP = require('hard-source-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const analyze = process.env.ANALYZE;
const isDev = process.env.NODE_ENV !== 'production';

const basePlugins = [
  require.resolve('@babel/plugin-proposal-class-properties'),
  require.resolve('@babel/plugin-transform-async-to-generator'),
  require.resolve('@babel/plugin-transform-react-jsx'),
  require.resolve('@babel/plugin-syntax-dynamic-import'),
  require.resolve('@babel/plugin-syntax-import-meta'),
  require.resolve('@babel/plugin-proposal-json-strings'),
  [
    require.resolve('@babel/plugin-proposal-decorators'),
    {
      legacy: true,
    },
  ],
  require.resolve('@babel/plugin-proposal-function-sent'),
  require.resolve('@babel/plugin-proposal-export-namespace-from'),
  require.resolve('@babel/plugin-proposal-numeric-separator'),
  require.resolve('@babel/plugin-proposal-throw-expressions'),
  require.resolve('@babel/plugin-proposal-export-default-from'),
  require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
  require.resolve('@babel/plugin-proposal-optional-chaining'),
  [
    require.resolve('@babel/plugin-proposal-pipeline-operator'),
    {
      proposal: 'minimal',
    },
  ],
  require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
  require.resolve('@babel/plugin-proposal-do-expressions'),
  require.resolve('@babel/plugin-proposal-function-bind'),
  [require.resolve('fast-async'), { spec: true }],
];

const devPlugins = [require.resolve('react-hot-loader/babel'), ...basePlugins];
module.exports = {
  entry: {
    main: [path.resolve(__dirname, 'src/index.js')],
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].chunk.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',

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
          options: {
            babelrc: false,
            presets: [
              [
                require.resolve('@babel/preset-env'),
                {
                  loose: true,
                  targets: {
                    browsers: ['>1%', 'last 2 versions', 'not ie < 10'],
                  },
                  modules: false,
                  exclude: [
                    'transform-regenerator',
                    'transform-async-to-generator',
                  ],
                },
              ],
              require.resolve('@babel/preset-react'),
            ],
            plugins: isDev ? devPlugins : basePlugins,
          },
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
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    'utf-8-validate:': 'empty',
    dram: 'empty',
    dgram: 'empty',
    preact: 'empty',
    module: 'empty',
    bufferutil: 'empty',
    ws: 'empty',
    child_process: 'empty',
    __filename: true,
    __dirname: true,
  },

  optimization: {
    nodeEnv: JSON.stringify(process.env.NODE_ENV),
    minimize: !isDev,
    concatenateModules: !isDev,
    runtimeChunk: !isDev,
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
    new HSWP(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        !isDev ? 'production' : 'development',
      ),
    }),
    new SizePlugin(),
    new Webpackbar(),
    new webpack.NoEmitOnErrorsPlugin(),
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
      short_name: 'Starter',
      description:
        'A starter repo for building Blockstack apps with React and Redux Bundler.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      filename: '[name][ext]',
      start_url: '/',
      fingerprints: false,
      inject: false,
      publicPath: 'https://react-blockstack.now.sh/',
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
    new CopyWebpackPlugin([
      { context: `${__dirname}/src/assets`, from: `*.*` },
    ]),
  ]
    .concat(analyze ? [new BundleAnalyzerPlugin()] : [])
    .concat(
      !isDev
        ? [
          new GenerateSW({
            swDest: 'sw.js',
            importWorkboxFrom: 'local',
            skipWaiting: true,
            clientsClaim: true,
            runtimeCaching: [
              {
                urlPattern: '/',
                handler: 'networkFirst',
                options: {
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
            ],
          }),
        ]
        : [],
    ),
};
