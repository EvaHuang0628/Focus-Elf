const path = require('path');

module.exports = {
  mode: 'development',
  entry: './gemini.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'GeminiModule',
    libraryTarget: 'window'
  },
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '/'),
    },
    compress: true,
    port: 8080,
    hot: true,
    host: '0.0.0.0', // 允许外部访问
    allowedHosts: 'all', // 允许所有主机访问
  },
};