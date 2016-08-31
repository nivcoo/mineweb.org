/**
 * Hosting.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('node-uuid')
var exec = require('ssh-exec')

module.exports = {

  price: 1.5,

  attributes: {

		id : {
			type: 'integer',
			unique: true,
    	autoIncrement: true,
    	primaryKey: true,
		},

		user: {
			model: 'User',
			required: true
		},

		key: {
			type: 'string',
			unique: true,
      defaultsTo: function () {
				return uuid.v4().substr(4, 24);
			},
      size: 19
		},

		state: {
			type: 'boolean',
			defaultsTo: true
		},

    hostType: {
			type: 'string',
			required: true,
      defaultsTo: 'SUBDOMAIN',
			in: ['SUBDOMAIN', 'DOMAIN'],
      size: 9
		},

		host: {
			type: 'string',
      required: true
		},

		secretKey: {
			type: 'string',
			alphanumeric: true
		},

    endDate: {
			type: 'datetime',
      defaultsTo: function () {
        var d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
      }
		},

		suspended: {
			type: 'text',
			defaultsTo: null
		},

    purchase: {
      model: 'Purchase'
    }

  },

  generate: function(userId, host, next) {
    // Save hosting
    Hosting.create({
      user: userId,
      host: host
    }).exec(function (err, hosting) {

      if (err) {
        sails.log.error(err)
        return false
      }
/* TODO -> save ids into config file
      // Send command to server for generate hosting
      exec('/home/mineweb.sh creation '+hosting.id+' '+hosting.host+' sdomain', {
        user: 'root',
        host: '188.165.141.113',
        port: '2435',
        password: 'Ly9bt5Q2'
      }, function (err, stdout, stderr) {

        if (err) {
          sails.log.error(err)
          return false
        }
*/
        // TODO -> Save ftp ids

        // Return hosting id
        return next(err, hosting.id)

    //  })

    })
  }

};
