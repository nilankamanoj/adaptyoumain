/*
@author : Nilanka Manoj
@package : controllers
@description : controller initializer for all components.
*/

var express = require('express');

var router = express.Router()

//initialize base url patterns for each controller
router.use('/api', require('./usercontroller'));
router.use('/capture', require('./captutecontroller'));
router.use('/analytic', require('./analyticcontroller'));

//information of api in root get
router.get('/', function (req, res) {
    res.send('adapt you main server api <br/> /api <br/> /capture <br/> /analytic');
});

module.exports = router
