var express = require('express');
var router = express.Router();
var User = require('../models/user');
var WebPage = require('../models/webpage');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var jwt = require('jwt-simple');
require('../config/passport')(passport);

router.post('/signup', function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Please pass email and password.' });
    }
    if (!validateEmail(req.body.email)) {
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
//sign in post
router.post('/authenticate', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});


// route to a restricted info (GET http://localhost:8080/api/memberinfo)
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

// route to a restricted info (post http://localhost:8080/api/memberinfo)
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
                        url: refineURL(req.body.url),
                        user: user.email
                    });
                    // save the user
                    newWebPage.save(function (err) {
                        if (err) {
                            return res.json({ success: false, msg: 'web page already exists.' });
                        }
                        res.json({ success: true, msg: 'Successful added new url.' });
                    });
                }
                //res.json({success: true, msg: 'Welcome in the member area ' + user.email + '!'});

            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }
});
router.get('/', function (req, res) {
    res.send('user controller component <br/> /signup <br/> /authenticate <br/> /memberinfo');
});

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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function refineURL(url) {
    var currURL = url;
    var afterDomain = currURL.substring(currURL.lastIndexOf('/') + 1);
    var beforeQueryString = afterDomain.split("?")[0];
    if (beforeQueryString == "index.html" || beforeQueryString == "index.php") {
        return currURL.substring(0, currURL.lastIndexOf('/') + 1);
    }
    else {
        return currURL.substring(0, currURL.lastIndexOf('/') + 1) + beforeQueryString;
    }
}

module.exports = router;
