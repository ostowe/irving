const getConfigFromFiles = require('../../config/getConfigFromFiles');
const { appRoot } = require('../../config/paths');
const coreMonitorService = require('.');
const defaultMonitorService = require('./defaultService');

/**
 * Get the configured cache service or use core's service.
 */
const getService = () => {
  const service = getConfigFromFiles(
    'services/monitorService.js',
    appRoot,
    coreMonitorService
  )();

  if (! service) {
    return defaultMonitorService;
  }

  return service;
};

module.exports = getService;
