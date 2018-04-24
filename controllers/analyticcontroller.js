var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserLabel = require('../models/userlabel');
var bodyParser = require('body-parser');
var config = require('../config/database');
var validator = require('../utilities/validator');


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

module.exports = router;
