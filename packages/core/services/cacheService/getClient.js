/* eslint-disable global-require */
const getRedisOptions = require('./getRedisOptions');
let client = null;

const getClient = () => {
  // Set user- or package-configured cache service, if applicable.
  if (configClient) {
    client = configClient;
  }

  if (client) {
    return client;
  }

  const retryStrategy = (times) => (
    // Wait 2 seconds maximum before attempting reconnection
    Math.min(times * 50, 2000)
  );
  const [host, port, password] = getRedisOptions();
  console.log(host, port);

  // Redis env variables have not been configured.
  if ((! host || ! port) && 'test' !== process.env.BABEL_ENV) {
    return client;
  }

  // We need to be explicit that redis is only imported when not executing
  // within a browser context, so that webpack can ignore this execution path
  // while compiling.
  if (
    'production_server' === process.env.IRVING_EXECUTION_CONTEXT ||
    'development_server' === process.env.IRVING_EXECUTION_CONTEXT
  ) {
    let Redis;

    // Check if optional redis client and cache-stampede are installed.
    try {
      // eslint-disable-next-line global-require
      Redis = require('ioredis');
    } catch (err) {
      return false;
    }

    client = new Redis({
      host,
      port,
      password,
      retryStrategy,
      enableOfflineQueue: true,
      maxRetriesPerRequest: process.env.QUEUED_CONNECTION_ATTEMPTS,
    });

    client.on('error', (err) => {
      console.error(err); // eslint-disable-line no-console
    });
  }

  return client;
};

module.exports = getClient;
