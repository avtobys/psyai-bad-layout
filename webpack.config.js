'use strict';

const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  PurgeCSSPlugin
} = require('purgecss-webpack-plugin');
const glob = require('glob');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const rimraf = require('rimraf');
const crypto = require('crypto');
const {
  execSync
} = require('child_process');

// Генерация уникального значения
const generateHash = () => crypto.randomBytes(8).toString('hex');

// Определение путей в зависимости от проекта
const getProjectPaths = (project) => {
  const basePath = path.resolve(__dirname, 'layout', project);
  return {
    src: path.join(basePath, 'src'),
    dist: path.join(basePath, 'dist'),
    public: path.join(__dirname, 'app', 'public', project, 'assets')
  };
};

module.exports = (env, argv) => {
  const project = env.project || 'provider'; // Default to 'provider' if no project specified
  const paths = getProjectPaths(project);

  // Папка с HTML файлами
  const htmlPagesPath = paths.src;
  const htmlPlugins = fs.readdirSync(htmlPagesPath).filter(file => {
    return file.endsWith('.html');
  }).map(file => {
    const cssHash = generateHash();
    const jsHash = generateHash();
    return new HtmlWebpackPlugin({
      template: path.join(htmlPagesPath, file),
      filename: file,
      inject: false,
      templateParameters: {
        cssHash,
        jsHash
      },
      minify: false,
      scriptLoading: 'blocking',
      cache: false
    });
  });

  // Определение, запущена ли сборка в режиме production
  const isProduction = argv.mode === 'production';

  if (isProduction) {
    // Очистка каталога перед каждой сборкой
    rimraf.sync(paths.dist);

    // Очистка public каталога перед копированием
    rimraf.sync(paths.public);

    // Копирование файлов из dist в public
    const copyAssets = () => {
      fs.mkdirSync(paths.public, {
        recursive: true
      });
      execSync(`cp -r ${paths.dist}/assets/. ${paths.public}`);
    };

    // Выполнение копирования после сборки
    htmlPlugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CopyAssetsPlugin', copyAssets);
      }
    });
  }

  const plugins = [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    })
  ];

  // Добавление PurgeCSSPlugin только для продакшна
  if (isProduction) {
    plugins.push(
      new PurgeCSSPlugin({
        paths: glob.sync(`${path.join(paths.src)}/**/*`, {
          nodir: true
        }),
        safelist: {
          standard: [
            'fade', 'show', 'collapsing', 'overflow',
            'modal', 'modal-dialog', 'modal-open', 'modal-backdrop', 'offcanvas-backdrop',
            'dropdown', 'dropdown-menu', 'dropdown-toggle',
            'popover', 'popover-header', 'popover-body', 'bs-popover-auto', 'h3',
            'tooltip', 'tooltip-inner', 'arrow', 'bs-popover-top-arrow', 'bs-popover-right-arrow', 'bs-popover-bottom-arrow', 'bs-popover-left-arrow',
            'carousel', 'carousel-inner', 'carousel-item',
            'flatpickr-calendar', 'flatpickr-wrapper', 'flatpickr-months', 'flatpickr-days', 'flatpickr-time',
            'flatpickr-weekdays', 'flatpickr-current-month', 'numInputWrapper'
          ],
          deep: [
            /^modal-/, /^carousel-/, /^tooltip-/, /^popover-/, /^dropdown-/, /^bs-popover-.*-arrow$/, /^bs-popover-/, /^offcanvas-/,
            /^flatpickr-/, /^numInputWrapper/, /^span.flatpickr-/, /^dayContainer/, /^rangeMode/, /^bs-tooltip/, /^tooltip/
          ],
          greedy: [],
          keyframes: [
            'fade', 'collapse', 'modal', 'carousel',
            'fpFadeInDown'
          ],
          variables: []
        },
      })
    );
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.join(paths.src, 'js', 'main.js'),
    output: {
      filename: 'assets/js/[name].js',
      chunkFilename: 'assets/js/[name].js',
      path: paths.dist,
      publicPath: '/' // Абсолютный путь для ресурсов
    },
    devServer: {
      static: paths.dist,
      port: 8080,
      hot: true,
      open: ['/']
    },
    plugins: plugins,
    module: {
      rules: [{
          test: /\.(scss)$/,
          use: [{
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: () => [
                    autoprefixer
                  ]
                }
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]'
          }
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/img',
            },
          }, ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true
                }
              },
            ],
          },
        }),
      ],
    },
    performance: {
      maxAssetSize: 1024 * 1024, // 1024 KiB
      maxEntrypointSize: 1024 * 1024, // 1024 KiB
    },
  };
};