/*
@author : Nilanka Manoj
@package : tests
@description : testing for analytic server connecter
*/

var _this = this;
var Connector = require('../utilities/connector');

exports.test = function (params) {
    Connector.sendData('http://nilankamanoj.tk/adaptyouclients/client1/');
    Connector.getData(5, 'url1');
    Connector.generateToken("url3", "send");
}