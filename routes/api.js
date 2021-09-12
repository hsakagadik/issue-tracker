'use strict';

const projectsSchema = require('../schema/projects');
const ObjectId = require('mongodb').ObjectId;

module.exports = function (app, database) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      const project = req.params.project;
      const query = req.query;
      const schemaRes =  await database.command({ collMod: project, validator: { $jsonSchema: projectsSchema}});
      if(schemaRes.ok){
        try {
          const result = await database.collection(project).find(query).toArray();
          res.send(result);
        } catch (error) {
          res.send({error: error.errmsg || error.message});
        }
      }
    }) 

    .post(async function (req, res){
      // Constants
      const project = req.params.project;
      const mandatoryFields = ["issue_title" , "issue_text", "created_by"];
      const ERR_NOT_NULL = 'required field(s) missing';
      
      // Schema validation for project
      const schemaRes =  await database.command({ collMod: project, validator: { $jsonSchema: projectsSchema}});
      if(schemaRes.ok){
        try {
          if (!mandatoryFields.every(prop => req.body.hasOwnProperty(prop))){throw new Error(ERR_NOT_NULL)}
          const issue = {
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            created_on: new Date(req.body.created_on || Date.now()),
            updated_on: new Date(req.body.updated_on || Date.now()),
            assigned_to: req.body.assigned_to,
            status_text: req.body.status_text,
            open: Boolean(req.body.open) || false
          };
          // Clean undefined optional fields
          Object.keys(issue).forEach(key => issue[key] === undefined ? delete issue[key] : {});
          const result = await database.collection(project).insertOne(issue);
          issue['_id'] =  result.insertedId;
          res.send(issue);
        } catch (error) {
          res.send({error: error.errmsg || error.message});
        }
      } else {
        res.send('Something went wrong');
      }
    })
    
    .put(async function (req, res){
      // Constants
      const project = req.params.project;
      try {
        if(!req.body.hasOwnProperty('_id')){throw new Error('missing _id')} 
        else if(Object.keys(req.body).length <= 1){throw new Error("no update field(s) sent")}
        const issue = {
          _id: new ObjectId(req.body._id),
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          created_on: new Date(req.body.created_on),
          updated_on: new Date(Date.now()),
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          open: Boolean(req.body.open)
        };
        // Clean undefined optional fields
        Object.keys(issue).forEach(key => issue[key] === undefined ? delete issue[key] : {});
        const result = await database.collection(project).updateOne({_id: issue._id}, { $set: issue });
        if(result.modifiedCount < 1){throw new Error("could not update")}
        res.send({result: 'successfully updated', _id: issue._id.toHexString()});
      } catch (error) {
        res.send({error: error.errmsg || error.message, _id: req.body._id});
      }
    })
    
    .delete(async function (req, res){
      // Constants
      const project = req.params.project;
      try {
        const issueId =  new ObjectId(req.body._id);
        if(!req.body.hasOwnProperty('_id')){throw new Error("missing _id")}
        const result = await database.collection(project).deleteOne({_id: issueId});
        if(result.deletedCount < 1){throw new Error("could not delete")}
        res.send({result: 'successfully deleted', _id: issueId.toHexString()});
      } catch (error) {
        res.send({error: error.errmsg || error.message, _id: req.body._id});
      }      
    });
    
};
