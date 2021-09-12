const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');
const database = require('../connection');
const ObjectId = require('mongodb').ObjectId;
chai.use(chaiHttp);

suite('Functional Tests', function() {
    const iss = {
        issue_title: "issue",
        issue_text: "issue text",
        created_by: "nayla",
        created_on: new Date(Date.now()).toISOString(),
        assigned_to: "nayla",
        updated_on: new Date(Date.now()).toISOString(),
        status_text: "in-progress",
        open: false
    };
    const issues = [new Issue(iss), new Issue(Object.assign({},iss, {issue_title: "other"})), new Issue(Object.assign({},iss, {issue_title: "other", issue_text: "othertext"}))];
    beforeEach('clean and load db', function(done){
        database(async (client) => {
            try {
                const db = await client.db('projects').collection('minion');
                await db.deleteMany({});
                console.log('deleted all');
                await db.insertMany(issues); //acaaaa
                console.log('issue loaded');
                done();
            } catch (error) {
                console.log(error);
            }
        })
    });
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done){
        chai
        .request(server)
        .post("/api/issues/minion")
        .send(iss)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            expect(res.body).to.have.property('_id');
            for (const property in iss){
                expect(res.body).to.have.property(property).to.be.equal(iss[property]);
            }
            done();
        });
    });
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done){
        const minIssue = {
            issue_title: iss.issue_title,
            issue_text: iss.issue_text,
            created_by: iss.created_by
        }
        
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
        chai
        .request(server)
        .post("/api/issues/minion")
        .send({ issue_title: "issue", issue_text: "issue text" })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing')
            done();
        });
    });
    test('View issues on a project: GET request to /api/issues/{project}', function(done){
        const response = [...issues];
        chai
        .request(server)
        .get("/api/issues/minion")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, JSON.stringify(response));
            done();
        });
    });
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done){
        const response = [...issues].filter(elm => elm.issue_title === "other");
        chai
        .request(server)
        .get("/api/issues/minion?issue_title=other")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, JSON.stringify(response));
            done();
        });
    });
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done){
        const response = [...issues].filter(elm => (elm.issue_title === "other" && elm.issue_text === "othertext"));
        chai
        .request(server)
        .get("/api/issues/minion?issue_title=other&issue_text=othertext")
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, JSON.stringify(response));
            done();
        });
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

function Issue(obj){
    this._id = new ObjectId();
    this.issue_title = obj.issue_title;
    this.issue_text = obj.issue_text;
    this.created_by = obj.created_by;
    this.created_on = new Date(obj.created_on);
    this.assigned_to = obj.assigned_to;
    this.status_text = obj.status_text;
    this.updated_on = new Date(obj.updated_on);
    this.open = obj.open;
}