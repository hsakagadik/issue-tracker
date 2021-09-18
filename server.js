'use strict';
const express     = require('express');
const formData = require('express-form-data');
const cors        = require('cors');
const database = require('./connection');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();
app.use('/public', express.static(process.cwd() + '/public'));
//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

database(async (client) => {
  const db = await client.db('projects');
  app.use(cors({origin: 'https://www.freecodecamp.org'})); //For FCC testing purposes only
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(formData.parse());
  app.route('/:project/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/issue.html');
    });

  //For FCC testing purposes
  fccTestingRoutes(app);

  //Routing for API 
  apiRoutes(app, db);
  
  //Start our server and tests!
  const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          console.log('Tests are not valid:');
          console.error(e);
        }
      }, 3500);
    }
  });

}).catch((e) => {
  app.route('/').get((req, res) => {
    res.send({ title: e, message: 'Unable to connect' });
  });
});


module.exports = app; //for testing