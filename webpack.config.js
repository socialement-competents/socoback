var path = require('path')
var nodeExternals = require('webpack-node-externals')
module.exports = {
  entry: './src/index.ts',
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules')],
    extensions: ['.ts']
  }
}
