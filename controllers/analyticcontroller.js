var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserLabel = require('../models/userlabel');
var bodyParser = require('body-parser');
var config = require('../config/database');



router.post('/save', function (req, res) {
	var user = req.body.user;
	var url = req.body.url;
	var label = req.body.label;

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
				res.json({ success: true, msg: 'successfully saved' });
			});

		} else {
			userlabel.label = label;
			userlabel.save(function (err) {
				if (err) {
					throw err;
				}
				res.json({ success: true, msg: 'successfully modified' });
			});



		}
	});


});

router.get('/', function (req, res) {
	res.send('analytic component <br/> /save');
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
