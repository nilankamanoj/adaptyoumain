var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserData = require('../models/userdata');
var WebPage = require('../models/webpage');
var bodyParser = require('body-parser');
var config = require('../config/database');



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

router.get('/control', function (req, res) {
    res.send({ success: true, msg: 'this is control data' });

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
