const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  name: '@irving/audio-player',
  displayName: '@irving/audio-player',
  setupFiles: ['<rootDir>/config/jest.setup.js'],
};
