'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();
//require('./db-connection');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

db().catch((err) => console.log(err));

async function db() {
  await mongoose.connect(process.env.DB);
  console.log('connected to DB');
}

const issueSchema = new mongoose.Schema({
  project: {
    type: String,
    default: 'apitest',
  },
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: new Date(),
  },
  updated_on: {
    type: Date,
    default: new Date(),
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: '',
  },
  open: {
    type: Boolean,
    default: true,
  },
  status_text: {
    type: String,
    default: '',
  },
});
const Issues = mongoose.model('Issues', issueSchema);
Issues.create(
  {
    _id: '61657912022d375e28ad1b85',
    project: 'apitest',
    issue_title: 'test',
    issue_text: 'test',
    created_by: 'test',
  },
  (err, result) => {
    err ? console.log(err) : console.log(result);
  },
);

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app, Issues);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        //runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
