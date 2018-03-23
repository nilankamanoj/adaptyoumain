var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model
var WebPageSchema = new Schema({
  user: {
        type: String,
        required: true
    },
  url: {
        type: String,
        required: true,
        unique: true
    }

});


module.exports = mongoose.model('webpage', WebPageSchema);
