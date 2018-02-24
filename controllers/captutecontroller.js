var express = require('express');
var router = express.Router();

router.post('/save', function(req, res) {


    var user= req.body.user;
    var id = req.body.id;
    var value = req.body.value;

    res.send({success: true, msg: 'data received :' + ","+user + ","+id + ","+value});
});

router.get('/control', function(req, res) {
    res.send({success: true, msg: 'this is control data'});

});

module.exports = router;
