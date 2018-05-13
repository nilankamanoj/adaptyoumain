/*
@author : Nilanka Manoj
@package : tests
@description : testing for common utility functions
*/

var request = require('request');
var should = require('chai').should();
var validator = require('../utilities/validator');
var connector = require('../utilities/connector');

exports.test = function (params) {
    describe('utility functions', function () {
        describe('email validation', function () {
            it('valid email1', function (done) {
                var ret = validator.validateEmail("assaafa")
                ret.should.equal(false);
                done();
            });

            it('valid email2', function (done) {
                var ret = validator.validateEmail("assaafa@")
                ret.should.equal(false);
                done();
            });

            it('valid email3', function (done) {
                var ret = validator.validateEmail("assaafa@asd")
                ret.should.equal(false);
                done();
            });

            it('valid email4', function (done) {
                var ret = validator.validateEmail("assaafa@asd@")
                ret.should.equal(false);
                done();
            });

            it('valid email5', function (done) {
                var ret = validator.validateEmail("assaafa@asd.")
                ret.should.equal(false);
                done();
            });

            it('valid email6', function (done) {
                var ret = validator.validateEmail("assaafa@asd.com")
                ret.should.equal(true);
                done();
            });

        });

        describe('url refine', function () {
            it('url1', function (done) {
                var ret = validator.refineURL("asd.com")
                ret.should.equal("asd.com");
                done();
            });
            it('url2', function (done) {
                var ret = validator.refineURL("asd.com/")
                ret.should.equal("asd.com/");
                done();
            });
            it('url3', function (done) {
                var ret = validator.refineURL("asd.com/index.html")
                ret.should.equal("asd.com/");
                done();
            });
            it('url4', function (done) {
                var ret = validator.refineURL("asd.com/index.html?val=val")
                ret.should.equal("asd.com/");
                done();
            });
            it('url5', function (done) {
                var ret = validator.refineURL("asd.com/page.html")
                ret.should.equal("asd.com/page.html");
                done();
            });
            it('url6', function (done) {
                var ret = validator.refineURL("asd.com/page.html?val=val")
                ret.should.equal("asd.com/page.html");
                done();
            });

        });

        describe('token string', function () {

            it('token1', function (done) {
                var ret = connector.getToken().length;
                ret.should.equal(50);
                done();
            });

            it('token2', function (done) {
                var ret = connector.getToken().length;
                ret.should.equal(50);
                done();
            });

            it('token3', function (done) {
                var ret = connector.getToken().length;
                ret.should.equal(50);
                done();
            });

        });


    });
}