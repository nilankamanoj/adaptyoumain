/*
@author : Nilanka Manoj
@package : main
@description : all test functions executes
*/

var ContentTest = require('./tests/contenttest');
var UtilTest = require('./tests/utiltest');
var AuthTest = require('./tests/authtest');
var PageTest = require('./tests/pagetest');

ContentTest.test();
UtilTest.test();
AuthTest.test();
PageTest.test();