/*
@author : Nilanka Manoj
@package : controllers
@description : controller of analytic componenet, supplies API to communicate with analytic server.
*/

var express = require('express');
var mongoose = require('mongoose');
var UserLabel = require('../models/userlabel');
var bodyParser = require('body-parser');
var config = require('../config/database');
var validator = require('../utilities/validator');
var AuthToken = require('../models/authtoken');

var router = express.Router();

//saves one labeled user that feed from the analytic server
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

//token authentication to communicate with analytic server
router.post('/authenticate', function (req, res) {

	var url = req.body.url
	var action = req.body.action
	var token = req.body.token

	AuthToken.findOne({
		url: url,
		action: action,
		token: token

	}, function (err, authtoken) {
		if (err) throw err;

		if (!authtoken) {

			res.send('invalid');

		} else {

			res.send('valid');
		}

	});

});

//information of api in root get
router.get('/', function (req, res) {
	res.send('analytic component <br/> /save <br/> /authenticate');
});


module.exports = router;
