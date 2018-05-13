/*
@author : Nilanka Manoj
@package : models
@description : data storing model for authentication tokens for analytic server communication.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model
var AuthTokenSchema = new Schema({
      token: {
            type: String,
            required: true
      },
      url: {
            type: String,
            required: true
      },

      action: {
            type: String,
            required: true

      }

});


module.exports = mongoose.model('AuthToken', AuthTokenSchema);