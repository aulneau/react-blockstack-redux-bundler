const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const Stylish = require('webpack-stylish');
const NameAllModulesPlugin = require('name-all-modules-plugin');
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
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const webpackServeWaitpage = require('webpack-serve-waitpage');

const analyze = process.env.ANALYZE;
const isDev = process.env.NODE_ENV !== 'production';

const serve = isDev
  ? {
      serve: {
        content: [__dirname],
        devMiddleware: {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
              'X-Requested-With, content-type, Authorization',
          },
        },
        add: (app, middleware, options) => {
          const historyOptions = {
            // ... see: https://github.com/bripkens/connect-history-api-fallback#options
          };
          app.use(webpackServeWaitpage(options));
          app.use(convert(history(historyOptions)));
        },
      },
    }
  : {};

module.exports = {
  stats: 'none',
  entry: {
    main: [path.resolve(__dirname, 'src/index.js')],
  },
  output: {
    filename: isDev
      ? 'static/js/[name].js'
      : 'static/js/[name].[contenthash].js',
    chunkFilename: isDev
      ? 'static/js/[name].chunk.js'
      : 'static/js/[name].chunk.[contenthash].js',
    path: path.resolve(__dirname, './dist'),
    globalObject: 'this',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(css|less|s[ac]ss|styl)$/,
        use: [
          !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isDev,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [autoprefixer({ browsers: ['> 0.25%', 'IE >= 9'] })],
            },
          },
        ],
      },
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
                  debug: true,
                  useBuiltIns: 'usage',
                },
              ],
              require.resolve('@babel/preset-react'),
            ],
            plugins: [
              require.resolve('react-hot-loader/babel'),
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
              require.resolve(
                '@babel/plugin-proposal-logical-assignment-operators',
              ),
              require.resolve('@babel/plugin-proposal-optional-chaining'),
              [
                require.resolve('@babel/plugin-proposal-pipeline-operator'),
                {
                  proposal: 'minimal',
                },
              ],
              require.resolve(
                '@babel/plugin-proposal-nullish-coalescing-operator',
              ),
              require.resolve('@babel/plugin-proposal-do-expressions'),
              require.resolve('@babel/plugin-proposal-function-bind'),
              [require.resolve('fast-async'), { spec: true }],
            ],
          },
        },
      },
      {
        test: /\.worker\.js$/,
        use: [
          {
            loader: 'workerize-loader',
          },
        ],
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
    namedModules: false,
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
    new NameAllModulesPlugin(),
    new Stylish(),
    new HtmlWebPackPlugin({
      template: `${path.resolve(__dirname, 'public', 'index.html')}`,
      filename: path.resolve(__dirname, 'dist', 'index.html'),
      inlineSource: 'runtime~.+\\.js',
      inject: true,
      compile: true,
      minify: !isDev && {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: !isDev
        ? 'static/css/[name].[contenthash:5].css'
        : 'static/css/[name].css',
      chunkFilename: !isDev
        ? 'static/css/[id].chunk.[contenthash:5].css'
        : 'static/css/[id].chunk.css',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([
      { context: `${__dirname}/src/assets`, from: `*.js`, to: 'static/js' },
      { context: `${__dirname}/src/assets`, from: `*.css`, to: 'static/css' },
      {
        context: `${__dirname}/src/assets`,
        from: `*.*`,
        ignore: ['*.js', '*.css'],
      },
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
  ...serve,
};
