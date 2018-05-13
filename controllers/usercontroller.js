/*
@author : Nilanka Manoj
@package : controllers
@description : controller of user componenet, supplies API to communicate with dashboard web pages.
*/

var express = require('express');
var User = require('../models/user');
var WebPage = require('../models/webpage');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var jwt = require('jwt-simple');
require('../config/passport')(passport);
var validator = require('../utilities/validator');

var router = express.Router();

//add new user to the system
router.post('/signup', function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Please pass email and password.' });
    }
    if (!validator.validateEmail(req.body.email)) {
        res.json({ success: false, msg: 'invalid email.' });
    }
    else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Useremail already exists.' });
            }
            res.json({ success: true, msg: 'Successful created new user.' });
        });
    }
});

//sign in to the system
router.post('/authenticate', function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Please pass email and password.' });
    }
    if (!validator.validateEmail(req.body.email)) {
        res.json({ success: false, msg: 'invalid email.' });
    }
    else {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = jwt.encode(user, config.secret);
                        // return the information including token as JSON
                        res.json({ success: true, token: 'JWT ' + token });
                    } else {
                        res.json({ success: false, msg: 'Authentication failed. Wrong password.' });
                    }
                });
            }
        });
    }
});


// route to a restricted info : webpages
router.get('/memberinfo', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);

        User.findOne({
            email: decoded.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                WebPage.find({
                    user: user.email
                }, { '_id': 0, 'url': 1 }, function (err, result) {
                    if (err) throw err;

                    else {


                        res.json({ success: true, msg: 'Welcome in the member area ' + user.email + '!', webpages: result });
                    }
                });





                //res.json({success: true, msg: 'Welcome in the member area ' + user.email + '!'});
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }
});

// route to a restricted info : add web pages
router.post('/memberinfo', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.secret);

        User.findOne({
            email: decoded.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                if (!req.body.url) {
                    res.json({ success: false, msg: 'Please pass url.' });
                } else {
                    var newWebPage = new WebPage({
                        url: validator.refineURL(req.body.url),
                        user: user.email
                    });
                    // save the web page
                    newWebPage.save(function (err) {
                        if (err) {
                            return res.json({ success: false, msg: 'web page already exists.' });
                        }
                        res.json({ success: true, msg: 'Successful added new url.' });
                    });
                }

            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }
});

// route to a restricted info : delete web pages
router.post('/deletepage', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.secret);

        User.findOne({
            email: decoded.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                if (!req.body.url) {
                    res.json({ success: false, msg: 'Please pass url.' });
                } else {
                    WebPage.findOne({
                        url: req.body.url
                    }, function (err, webPage) {
                        if (!webPage) {
                            res.json({ success: false, msg: 'Url dosent exist.' });
                        }
                        else {
                            webPage.remove(function (err) {
                                if (err) throw err;
                                else {
                                    res.json({ success: true, msg: 'URL deleted.' });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }
});

//information of api in root get
router.get('/', function (req, res) {
    res.send('user controller component <br/> /signup <br/> /authenticate <br/> /memberinfo <br/> /deletepage');
});

//extract token from headers
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
module.exports = router;