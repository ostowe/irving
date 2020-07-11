const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  name: '@irvingjs/loadable',
  displayName: '@irvingjs/loadable',
  setupFiles: ['<rootDir>/config/jest.setup.js'],
};
