/*
@author : Nilanka Manoj
@package : tests
@description : testing for user authentication services
*/

var request = require('request');
var expect = require('chai').expect;
var querystring = require('querystring');
var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);
var app = 'https://adaptyoumain.herokuapp.com';

exports.test = function () {

    describe("user controller", function () {

        describe("login attempts", function () {
            it("login1", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'password1',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(true);
                        done();
                    });
            });

            it("login2", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: '',
                        email: ''
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(false);
                        done();
                    });
            });

            it("login3", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: '',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(false);
                        done();
                    });
            });

            it("login4", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'password1',
                        email: ''
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(false);
                        done();
                    });
            });

            it("login5", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'passwocdscdscdss',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(false);
                        done();
                    });
            });

        });

        describe("Load member area", function () {

            it("load1", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'password1',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        chai.request(app)
                            .get('/api/memberinfo')
                            .send({
                                authorization: res.body.token
                            })
                            .end(function (err, res) {
                                expect(res.body.success).to.equal(true);
                                done();
                            });

                    });
            });

            it("load 2", function (done) {
                // Send some Form Data
                chai.request(app)
                    .get('/api/memberinfo')
                    .send({
                        authorization: "obovbqeivbqeib eqb  gyq ycwybc8ywbcyeb 9uunw9unw0"
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(false);
                        done();
                    });
            });

        });
    });

}