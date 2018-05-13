/*
@author : Nilanka Manoj
@package : models
@description : data storing model for labels of analysed users
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model
var UserLabelSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },

    label: {
        type: String,
        required: true
    }



});


module.exports = mongoose.model('UserLabel', UserLabelSchema);