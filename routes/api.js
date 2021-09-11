'use strict';

const projectsSchema = require('../schema/projects');

module.exports = function (app, database) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      database.collection(project).command({ collMod: project, validator: { $jsonSchema: projectsSchema}});
      database.collection(project).findOne({ project: project }, function (err, project) {
        if (err) {
          next(err);
        } else if (project) {
          res.send(project);
        }
      });
    }) 

    .post(async function (req, res){
      // Constants
      const project = req.params.project;
      const mandatoryFields = ["issue_title" , "issue_text", "created_by"];
      const ERR_NOT_NULL = 'required field(s) missing';
      
      // Schema validation
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
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
