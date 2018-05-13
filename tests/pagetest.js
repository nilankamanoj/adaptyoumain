/*
@author : Nilanka Manoj
@package : tests
@description : testing for web page operation services
*/

var request = require('request');
var expect = require('chai').expect;
var querystring = require('querystring');
var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);
var app = 'https://adaptyoumain.herokuapp.com';

exports.test = function () {

    describe("page actions", function () {

        describe("page addition", function () {

            it("add1", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'password1',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        chai.request(app)
                            .post('/api/memberinfo')
                            .send({
                                authorization: res.body.token,
                                url: 'url1'
                            })
                            .end(function (err, res) {
                                expect(res.body.success).to.equal(true);
                                done();
                            });

                    });
            });

            it("add2", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'password1',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        chai.request(app)
                            .post('/api/memberinfo')
                            .send({
                                authorization: res.body.token,
                                url: 'url1'
                            })
                            .end(function (err, res) {
                                expect(res.body.success).to.equal(false);
                                done();
                            });

                    });
            });

            it("add3", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/memberinfo')
                    .send({
                        authorization: "obovbqeivbqeib eqb  gyq ycwybc8ywbcyeb 9uunw9unw0",
                        url: 'url2'
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(false);
                        done();
                    });
            });

        });

        describe("page deletion", function () {

            it("delete1", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/deletepage')
                    .send({
                        authorization: "obovbqeivbqeib eqb  gyq ycwybc8ywbcyeb 9uunw9unw0",
                        url: 'url1'
                    })
                    .end(function (err, res) {
                        expect(res.body.success).to.equal(false);
                        done();
                    });
            });

            it("delete2", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'password1',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        chai.request(app)
                            .post('/api/deletepage')
                            .send({
                                authorization: res.body.token,
                                url: 'url1'
                            })
                            .end(function (err, res) {
                                expect(res.body.success).to.equal(true);
                                done();
                            });

                    });
            });

            it("delete3", function (done) {
                // Send some Form Data
                chai.request(app)
                    .post('/api/authenticate')
                    .send({
                        password: 'password1',
                        email: 'user1@email.com'
                    })
                    .end(function (err, res) {
                        chai.request(app)
                            .post('/api/deletepage')
                            .send({
                                authorization: res.body.token,
                                url: 'url1'
                            })
                            .end(function (err, res) {
                                expect(res.body.success).to.equal(false);
                                done();
                            });

                    });
            });

        });
    });

}