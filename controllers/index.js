/*
@author : Nilanka Manoj
@package : controllers
@description : controller initializer for all components.
*/

var express = require('express');
let fs = require('fs')


var router = express.Router()

//initialize base url patterns for each controller
router.use('/api', require('./usercontroller'));
router.use('/capture', require('./captutecontroller'));
router.use('/analytic', require('./analyticcontroller'));

//information of api in root get
router.get('/', function (req, res) {
    
    let content = fs.readFileSync(process.cwd() + "/" + "test.txt").toString()
    res.send(content);
});

module.exports = router
