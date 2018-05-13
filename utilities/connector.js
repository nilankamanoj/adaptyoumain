/*
@author : Nilanka Manoj
@package : utilities
@description : utility functions for analytic server communication
*/

var mongoose = require('mongoose');
var UserData = require('../models/userdata');
var request = require('request');
var UserLabel = require('../models/userlabel');
var AuthToken = require('../models/authtoken');
var Conf = require('../config/webconfig');

var _this = this;

//send user behavioural data to the analytic server
exports.sendData = async function (url) {
    UserData.find({
        url: url
    }, function (err, result) {
        if (err) throw err;

        else {
            result.forEach(function (userData) {
                request.post({
                    url: Conf.analytic_save,
                    json: userData
                }, function (error, response, body) {
                    console.log(response.body);
                });
            });
        }
    });
}

//get analysed user labels from analytic server
exports.getData = async function (count, url) {
    while (count > 0) {
        var headers = {
            'index': count,
            'url': url
        }
        var options = {
            url: Conf.analytic_getone,
            method: 'GET',
            headers: headers,

        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res_data = JSON.parse(body)

                var user = res_data.username;
                var url = res_data.url;
                var label = res_data.label;


                UserLabel.findOne({
                    url: url,
                    username: user,

                }, function (err, userlabel) {
                    if (err) throw err;

                    if (!userlabel) {
                        var newUserLabel = new UserLabel({
                            url: url,
                            username: user,
                            label: label
                        });
                        newUserLabel.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            console.log("saved new" + user + url + label);
                        });

                    } else {
                        userlabel.label = label;
                        userlabel.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            console.log("modified" + user + url + label);
                        });



                    }
                });
            }
        });

        count--;
    }
}

//generate and authenticate tokens for communication with analytic server
exports.generateToken = function generateToken(url, action) {
    var token = this.getToken();
    AuthToken.findOne({
        token: token
    }, function (err, authtoken) {
        if (err) console.log(err);;
        if (!authtoken) {
            var authToken = new AuthToken({
                url: url,
                token: token,
                action: action
            });
            console.log(authToken);
            authToken.save(function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log("new token saved");
                request.post({
                    url: Conf.analytic_authentication,
                    json: authToken
                }, function (error, response, body) {
                    console.log(response.body);
                });

            });

            return authToken;

        } else {
            return this.generateToken(url, action);
        }
    });
}


//generate random string token
exports.getToken = function getToken() {
    len = 50;
    var token = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++) {
        token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return token;
}
