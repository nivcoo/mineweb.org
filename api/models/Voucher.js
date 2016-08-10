/**
 * Voucher.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id: {
			type: 'integer',
			unique: true,
    	autoIncrement: true,
    	primaryKey: true,
		},

    code: {
      type: 'string',
      required: true
    },

    amount: {
      type: 'float',
      required: true
    },

    itemType: {
      type: 'string',
      in: ['LICENSE', 'HOSTING']
    },

    itemId: {
      type: 'integer'
    }

    usedBy: {
      model: 'User'
    },

    usedAt: {
			type: 'datetime'
		},

		usedLocation: {
			type: 'string',
			ip: true
		}

  }
};
