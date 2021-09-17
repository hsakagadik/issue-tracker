'use strict';

const projectsSchema = require('../schema/projects');
const ObjectId = require('mongodb').ObjectId;

module.exports = function (app, database) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      const project = req.params.project;
      let query = req.query;
      if(req.query.hasOwnProperty('_id')){query._id = new ObjectId(req.query._id)}
      try {
        const result = await database.collection(project).find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(400);
        res.send({error: error.errmsg || error.message});
      }
    }) 

    .post(async function (req, res){
      // Constants
      const project = req.params.project;
      const mandatoryFields = ["issue_title" , "issue_text", "created_by"];
      const ERR_NOT_NULL = 'required field(s) missing';
      
      try {
        const collectionList = await database.listCollections().toArray();
        if(collectionList.filter(obj => obj.name === project).length <= 0){
          await createCollectionWithSchema(database, project);
        } else {
          try {
            if (!mandatoryFields.every(prop => req.body.hasOwnProperty(prop))){throw new Error(ERR_NOT_NULL)}
            let issue = {
              issue_title: req.body.issue_title,
              issue_text: req.body.issue_text,
              created_by: req.body.created_by,
              created_on: new Date(req.body.created_on || Date.now()),
              updated_on: new Date(req.body.updated_on || Date.now()),
              assigned_to: req.body.assigned_to,
              status_text: req.body.status_text,
              open: Boolean(req.body.open) || true
            };
            // Clean undefined optional fields
            //Object.keys(issue).forEach(key => issue[key] === undefined ? delete issue[key] : {});
            const result = await database.collection(project).insertOne(issue);
            issue['_id'] =  result.insertedId;
            res.send(issue);
          } catch (error) {
            res.status(400);
            res.send({error: error.errmsg || error.message});
          }
        }
      } catch (error) {
        res.send(error);
      }
    })
    
    .put(async function (req, res){
      // Constants
      const project = req.params.project;
      try {
        if(!req.body.hasOwnProperty('_id')){throw new Error('missing _id')} 
        else if(Object.keys(req.body).length <= 1){throw new Error('no update field(s) sent')}
        const issue = {
          _id: new ObjectId(req.body._id),
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          created_on: req.body.created_on,
          updated_on: new Date(Date.now()),
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          open: Boolean(req.body.open)
        };
        // Clean undefined optional fields
        Object.keys(issue).forEach(key => issue[key] === undefined || issue[key] === ''  ? delete issue[key] : {});
        const result = await database.collection(project).updateOne({"_id": issue._id}, {$set: issue});
        if(result.modifiedCount < 1){
          throw new Error("could not update");
        } else {
          res.send({result: 'successfully updated', _id: issue._id.toString()});
        }
      } catch (error) {
        res.status(400);
        error === 'missing id' ? res.send({error: error.message}) : res.send({error: error.errmsg || error.message, _id: req.body._id});
      }
    })
    
    .delete(async function (req, res){
      // Constants
      const project = req.params.project;
      try {
        const issueId =  new ObjectId(req.body._id);
        if(!req.body.hasOwnProperty('_id')){throw new Error('missing _id')}
        const result = await database.collection(project).deleteOne({"_id": issueId});
        if(result.deletedCount < 1){throw new Error('could not delete')}
        res.send({result: 'successfully deleted', _id: issueId.toString()});
      } catch (error) {
        res.status(400);
        error === 'missing id' ? res.send({error: error.message}) : res.send({error: error.errmsg || error.message, _id: req.body._id});
      }      
    });
    
    async function createCollectionWithSchema(db, project){
      try {
        await db.createCollection(project, {validator:{$jsonSchema:projectsSchema}});
      } catch (err) {
        throw new Error(`Collection ${project} could not be created. Error details: ${err}`);
      }
    }
};
