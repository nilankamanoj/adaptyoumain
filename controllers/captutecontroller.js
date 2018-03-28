var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserData = require('../models/userdata');
var WebPage = require('../models/webpage');
var bodyParser = require('body-parser');
var config = require('../config/database');
var UserLabel = require('../models/userlabel');


router.post('/save', function (req, res) {
    var user = req.body.user;
    var id = req.body.id;
    var value = parseInt(req.body.value);
    var page = refineURL(req.get('referer'));
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

router.post('/control', function (req, res) {

    var user = req.body.user;
    var url = refineURL(req.get('referer'));
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

router.get('/', function (req, res) {
    res.send('capture component <br/> /save <br/> /control');
});

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
