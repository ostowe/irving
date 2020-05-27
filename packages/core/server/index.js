/* eslint-disable global-require, no-console, import/order */
// Start monitor service as early as possible.
const getService = require('../services/monitorService');
getService().start();

// Shim some browser-only global variables.
require('../utils/shimWindow');

const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookiesMiddleware = require('universal-cookie-express');
const getConfigField = require('../utils/getConfigField');
const { getConfigArray } = require('../utils/getConfigValue');
const purgeCache = require('./purgeCache');
const getCacheKeys = require('./getCacheKeys');
const customizeRedirect = require('./customizeRedirect');
const getLogService = require('../services/logService');
const log = getLogService('irving:server');
const app = express();
const {
  API_ROOT_URL,
  API_ORIGIN,
} = process.env;
const test = 'development';

// Clearing the Redis cache.
app.post('/purge-cache', bodyParser.json(), purgeCache);
app.get('/cache-keys', getCacheKeys);

// Set view engine.
app.set('view engine', 'ejs');

// Run all customize server functions.
const irvingServerMiddleware = getConfigField('customizeServer');
irvingServerMiddleware.forEach((middleware) => middleware(app));

// Set up a reusable proxy for responses that should be served directly.
const proxyPassthrough = getConfigArray('proxyPassthrough');
const passthrough = createProxyMiddleware({
  changeOrigin: true,
  followRedirects: true,
  secure: 'development' !== process.env.NODE_ENV,
  target: API_ORIGIN || API_ROOT_URL.replace('/wp-json/irving/v1', ''),
  xfwd: true,
});

// Create proxies for each configured proxy pattern.
proxyPassthrough.forEach((pattern) => {
  app.use(pattern, passthrough);
});

// Add universal cookies middleware.
app.use(cookiesMiddleware());

// Naked Redirect.
app.use(customizeRedirect());

// Only load the appropriate middleware for the current env.
if (test === process.env.NODE_ENV) {
  require('./development').default(app);
} else {
  require('./production').default(app);
}

// Default error handler
app.use((err, req, res, next) => {
  log.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.sendStatus(500);
});

module.exports = app;
