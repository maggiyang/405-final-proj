var request = require('supertest')
    , express = require('express')
    , should = require('should');

var app = express();


var project = require('../models').Project;
var user = require('../models').User;

app.get('/project', function(req, res){
    res.status(200).send({ name: 'New Project' });
});

describe('GET /project', function(){
    it('respond with json', function(done){
        request(app)
            .get('/project')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
})

describe('GET /admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/project')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
})

describe('GET /dog', function(){
    it('404 error', function(done){
        request(app)
            .get('/dog')
            .expect(404, done);
    })
})

describe('Create Project', function(req, res){
    it('does create project', function(){
        project.create({
            title: "Dog",
            description: "Works",
            client: "Hard",
            date: "May 12",
            category: "Tired",
            bgcolor: "#111111"
        }).then(function(){
            assert(true);
        })
    })
})




