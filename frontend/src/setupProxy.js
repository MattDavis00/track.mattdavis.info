const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
        target: 'http://localhost:4020',
        changeOrigin: true,
        pathRewrite: {
            '^/api/': '/', // Remove base API path
            '^/api': '', // Remove base API path
        }
    })
  );
};