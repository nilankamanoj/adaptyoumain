/*
@author : Nilanka Manoj
@package : models
@description : data storing model for stor user behavioural data
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var UserDataSchema = new Schema({
      username: {
            type: String,
            required: true
      },
      url: {
            type: String,
            required: true
      },

      clicks: {
            type: Number,
            required: true
      },

      mouseover: {
            type: Number,
            required: true
      },
      component: {
            type: String,
            required: true
      }



});


module.exports = mongoose.model('UserData', UserDataSchema);