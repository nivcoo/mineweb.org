/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  // inject pmx to get custom http var
  var pmx = require('pmx').init({
    http          : true,
    errors        : true,
    custom_probes : true,
    network       : true,
    ports         : false
  });

	// register background jobs
	const schedule = require('node-schedule');
	sails.config.crontabs.forEach(function (cron) {
		schedule.scheduleJob(cron.interval, cron.task);
	});

  // UserLog.native(function (err, collection) {
  //   collection.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 604800 } ); // 1 week
    cb();
  // });
};
