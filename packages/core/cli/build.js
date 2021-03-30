const webpack = require('webpack');
const chalk = require('chalk');
const getConfig = require('../config/webpack.config.js');

// Compile.
module.exports = (program) => {
  const config = getConfig({}, {
    mode: 'production',
    analyze: program.analyze,
  });

  webpack(
    config,
    (err, stats) => {
      // Log fatal webpack errors.
      if (err) {
        if (err.details) {
          throw new Error(err.details);
        } else {
          throw new Error(err.stack || err);
        }
      }

      const info = stats.toJson();
      const messageRegExp = /(\([^)]*\))([\s\S]*)/;

      // Log compile errors.
      if (stats.hasErrors()) {
        info.errors.forEach((error) => {
          if (error.message) {
            const errorParts = error.message.match(messageRegExp);
            console.error( // eslint-disable-line no-console
              chalk.black.bgRed(errorParts[1]),
              chalk.red(errorParts[2])
            );
          } else {
            console.error(chalk.red(error));
          }
        });

        process.exitCode = 1;
        throw new Error('build failed');
      }

      // Log compile warnings.
      if (stats.hasWarnings()) {
        info.warnings.forEach((warning) => {
          if (warning.message) {
            const warnParts = warning.message.match(messageRegExp);
            console.warn( // eslint-disable-line no-console
              chalk.black.bgYellow(warnParts[1]),
              chalk.yellow(warnParts[2])
            );
          } else {
            console.warn(chalk.yellow(warning));
          }
        });
      }

      console.log('build complete'); // eslint-disable-line no-console
    }
  );
};
