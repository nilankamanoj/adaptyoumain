/*
@author : Nilanka Manoj
@package : controllers
@description : controller of capture componenet, supplies API to communicate with registered web pages.
*/

var express = require('express');
var mongoose = require('mongoose');
var UserData = require('../models/userdata');
var WebPage = require('../models/webpage');
var bodyParser = require('body-parser');
var config = require('../config/database');
var UserLabel = require('../models/userlabel');
var validator = require('../utilities/validator');

var router = express.Router();

//save user data for web components of web pages
router.post('/save', function (req, res) {
    var user = req.body.user;
    var id = req.body.id;
    var value = parseInt(req.body.value);
    var page = validator.refineURL(req.get('referer'));
    var clicks = 0;
    if (value == 0) {
        clicks = 1;
    }
    WebPage.findOne({
        url: page
    }, function (err, webpage) {
        if (err) throw err;

        if (!webpage) {
            res.send({ success: false, msg: 'page not registerd' });
        } else {
            UserData.findOne({
                url: page,
                username: user,
                component: id
            }, function (err, userdata) {
                if (err) throw err;

                if (!userdata) {
                    var newUserData = new UserData({
                        url: page,
                        username: user,
                        component: id,
                        mouseover: value,
                        clicks: clicks
                    });
                    newUserData.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        res.json({ success: true, msg: 'successfully saved' });
                    });

                } else {
                    userdata.clicks = userdata.clicks + clicks;
                    userdata.mouseover = userdata.mouseover + value;
                    userdata.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        res.json({ success: true, msg: 'successfully modified' });
                    });



                }
            });

        }
    });
});

//returns the user label for control UI if analysed
router.post('/control', function (req, res) {

    var user = req.body.user;
    var url = validator.refineURL(req.get('referer'));
    WebPage.findOne({
        url: url
    }, function (err, webpage) {
        if (err) throw err;

        if (!webpage) {
            res.send({ success: false, msg: 'page not registerd' });
        } else {

            UserLabel.findOne({
                url: url,
                username: user,

            }, function (err, userlabel) {
                if (err) throw err;

                if (!userlabel) {
                    res.json({ success: false, msg: 'not labeled' });

                } else {
                    var label = userlabel.label;

                    res.json({ success: true, label: label });


                }

            });
        }
    });
});

//information of api in root get
router.get('/', function (req, res) {
    res.send('capture component <br/> /save <br/> /control');
});

module.exports = router;
