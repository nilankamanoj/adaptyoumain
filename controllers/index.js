var express = require('express')
var router = express.Router()



router.use('/api', require('./usercontroller'));
router.use('/capture', require('./captutecontroller'));
router.use('/analytic', require('./analyticcontroller'));

router.get('/', function (req, res) {
    res.send('adapt you main server api <br/> /api <br/> /capture <br/> /analytic');
});

module.exports = router
