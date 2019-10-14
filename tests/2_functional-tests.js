onst CHAI_HTTP = require('chai-http');
const CHAI = require('chai');
CHAI.use(CHAI_HTTP);

const SERVER = require('../server');
const ID_TO_TEST = '5c7f1f84cc6a4734e26651e8';
const ISSUE = require('../models/issueModel');
const assert = CHAI.assert;


suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

        test('Every field filled in', function(done) {
            CHAI.request(SERVER)
            .post('/api/issues/test')
            .send({
                project_name: 'test',
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Every field filled in',
                assigned_to: 'Chai and Mocha',
                status_text: 'In QA'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.project_name, 'test');
                assert.equal(res.body.issue_title, 'Title');
                assert.equal(res.body.issue_text, 'text');
                assert.equal(
                  res.body.created_by,
                  'Functional Test - Every field filled in'
                );
                assert.equal(res.body.assigned_to, 'Chai and Mocha');
                assert.equal(res.body.status_text, 'In QA');
                done();
            });
             });

        test('Required fields filled in', function(done) {
            CHAI.request(SERVER)
            .post('/api/issues/test')
            .send({
                project_name: 'test',
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Every field filled in',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isNotOk(res.body.assigned_to);
                assert.isNotOk(res.body.status_text);
                done();
            })
        });

        test('Missing required fields', function(done) {
            CHAI.request(SERVER)
            .post('/api/issues/test')
            .send({
             assigned_to: 'Chai and Mocha',
             status_text: 'In QA'
            })
           .end(function(err, res){
             assert.equal(res.status, 200);
             assert.isNotOk(res.body.project_name);
             assert.isNotOk(res.body.issue_title);
             assert.isNotOk(res.body.issue_text);
             assert.isNotOk(res.body.created_by);
             done();
           });
       });

   });


    suite('PUT /api/issues/{project} => text', function() {

        test('No body', function(done) {
            CHAI.request(SERVER)
            .put('/api/issues/test')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no updated field sent');
              done();
            })

        });

        test('One field to update', function(done) {
            CHAI.request(SERVER)
            .put('/api/issues/test')
            .send({
              update_issue_id: '5c7f0e594c31d51929eaac8e',
              update_issue_title: 'This is a new title #3'
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'successfully updated');
              done();
            })
        });

        test('Multiple fields to update', function(done) {
            CHAI.request(SERVER)
            .put('/api/issues/test')
            .send({
                update_issue_id: '5c7f0e594c31d51929eaac8e',
                update_issue_title: 'This is a new title #3',
                update_assigned_to: 'You and Me'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'successfully updated');
                done();
            })
        });

    });


    suite(
        'GET /api/issues/{project} => Array of objects with issue data', () => {
 test('No filter', function(done) {
            CHAI.request(SERVER)
            .get('/api/issues/test')
            .query({})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], 'issue_title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'created_by');
              assert.property(res.body[0], 'assigned_to');
              assert.property(res.body[0], 'open');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              done();
            });
        });

        test('One filter', function(done) {
            CHAI.request(SERVER)
            .get('/api/issues/test')
            .query({ open: 'false' })
            .end(function(err, res){
                assert.equal(res.status, 200);
                res.body.forEach(elem => {
                  assert.isNotTrue(elem.open);
                })
                done();
            })
        });

        test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
            CHAI.request(SERVER)
            .get('/api/issues/test')
            .query({
                open: 'false',
                issue_title: 'Title'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                res.body.forEach(elem => {
                  assert.isNotTrue(elem.open);
                    assert.equal(elem.issue_title, 'Title')
                })
                done();
            })
        });

    });


    suite('DELETE /api/issues/{project} => text', function() {

        test('No _id', function(done) {
            CHAI.request(SERVER)
            .delete('/api/issues/test')
            .send({})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, '_id error')
              done();
            })
        });

        test('Valid _id', function(done) {
            CHAI.request(SERVER)
            .delete('/api/issues/test')
            .send({ _id: ID_TO_TEST })
            .end(function(err, res){
                assert.equal(res.status, 200);
                /* Look for the ID in the database, and make sure it returns the success message if it does exist, and the error message if it doesn't exist. */
                ISSUE.findOne({ _id: ID_TO_TEST }, (err, result) => {
                  if (err) {
                      assert.equal(res.text, 'could not delete ' + ID_TO_TEST)
                  }
                  assert.equal(res.text, '_id error')
                })
                done();
            })
        });

    });

});
