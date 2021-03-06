/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

var pmx         = require('pmx');
var winston     = require('winston');
var ESTransport = require('winston-elasticsearch');

var TRANSPORTS = [];
TRANSPORTS.push(new winston.transports.Console({ json: false, colorize: true }))

// define winston logger as global
var logger = new (winston.Logger)({
  transports: TRANSPORTS,
  exitOnError: false
});

module.exports.log = {
  level: 'info',
  custom: logger,
  inspect: false
};
