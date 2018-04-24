var mongoose = require('mongoose');
var UserData = require('../models/userdata');
var request = require('request');


var _this = this;

exports.sendData = async function (url) {
    UserData.find({
        url: url
    }, function (err, result) {
        if (err) throw err;

        else {
            result.forEach(function (userData) {
                request.post({
                    url: 'https://auanalytic.herokuapp.com/api/save', 
                    json: userData
                }, function(error, response, body) {
                    console.log(response.body);
                });
            });
        }
    });
}
