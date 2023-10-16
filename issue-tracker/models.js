const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
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

// For Test the DB doc
// (async () => {
//   await Issues.create({
//     _id: '61657912022d375e28ad1b85',
//     project: 'apitest',
//     issue_title: 'test',
//     issue_text: 'test',
//     created_by: 'test',
//   });
// })();

exports.Issues = Issues;
