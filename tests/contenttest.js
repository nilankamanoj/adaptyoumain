/*
@author : Nilanka Manoj
@package : tests
@description : testing for root info display for each connector
*/

var request = require('request');
var expect = require('chai').expect;

exports.test = function (params) {
    describe('api root info', function () {

        it('root content', function (done) {
            request('https://adaptyoumain.herokuapp.com/', function (error, response, body) {
                expect(body).to.equal('adapt you main server api <br/> /api <br/> /capture <br/> /analytic');
                done();
            });
        });

        it('api content', function (done) {
            request('https://adaptyoumain.herokuapp.com/api', function (error, response, body) {
                expect(body).to.equal('user controller component <br/> /signup <br/> /authenticate <br/> /memberinfo <br/> /deletepage');
                done();
            });
        });

        it('capture content', function (done) {
            request('https://adaptyoumain.herokuapp.com/capture', function (error, response, body) {
                expect(body).to.equal('capture component <br/> /save <br/> /control');
                done();
            });
        });

        it('analytic content', function (done) {
            request('https://adaptyoumain.herokuapp.com/analytic', function (error, response, body) {
                expect(body).to.equal('analytic component <br/> /save <br/> /authenticate');
                done();
            });
        });


    });
}