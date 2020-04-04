const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    /**
     * __dirname: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/example'
     * dir: 'bar'
     * entry: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/example/bar/index.js'
     * 
     * entries: {
     *    bar: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/example/bar/index.js'
     * }
     */
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'index.js')
    if (fs.statSync(fullDir).isDirectory()) {
      fs.readdirSync(fullDir).map((subDir) => {
        const subFullDir = path.join(__dirname, dir, subDir)
        const subEntry = path.join(subFullDir, 'index.js')

        if (fs.statSync(subFullDir).isDirectory() && fs.existsSync(subEntry)) {
          entries[dir + '-' + subDir] = ['webpack-hot-middleware/client?noInfo=true&reload=true', subEntry]
        }
      })
    }

    return entries
  }, {}),
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },

  devtool: 'cheap-module-source-map',

  resolve: {
    alias: {
      // chart: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/dist/chart.js'
      'kchart': path.resolve(__dirname, '../dist/kchart.js'),
      'kchart.css': path.resolve(__dirname, '../dist/kchart.css')
    }
  },

  externals: {
    'd3': 'd3',
    'jquery': 'jQuery',
    'konva': 'Konva',
    'moment': 'moment'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'kchart',
          filename: 'kchart.js',
          chunks: 'initial'
        }
      }
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]

}
