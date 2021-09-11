const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done){
        const date = new Date(Date.now()).toISOString();
        const fullIssue = {
            issue_title: "issue",
            issue_text: "issue text",
            created_by: "nayla",
            created_on: date,
            assigned_to: "nayla",
            status_text: "in-progress",
            updated_on: date,
            open: false
        };  
        chai
        .request(server)
        .post("/api/issues/minion")
        .send(fullIssue)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            expect(res.body).to.have.property('_id');
            for (const property in fullIssue){
                expect(res.body).to.have.property(property).to.be.equal(fullIssue[property]);
            }
            done();
        });
    });
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done){
        const minIssue = {
            issue_title: "issue",
            issue_text: "issue text",
            created_by: "nayla",
        };  
        chai
        .request(server)
        .post("/api/issues/minion")
        .send(minIssue)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            expect(res.body).to.have.property('_id');
            for (const property in minIssue){
                expect(res.body).to.have.property(property).to.be.equal(minIssue[property]);
            }
            done();
        });
    });
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done){
        const missingReq = {
            issue_title: "issue",
            issue_text: "issue text"
        };
        chai
        .request(server)
        .post("/api/issues/minion")
        .send(missingReq)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing')
            done();
        });
    });
    test('View issues on a project: GET request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .get("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .get("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .get("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .put("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .put("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .put("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .put("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .put("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Delete an issue: DELETE request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .delete("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .delete("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done){
        //const response = ;
        /**
        chai
        .request(server)
        .delete("/api/issues/{project}")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, );
            done();
        }); */
        assert.fail();
    });
});
