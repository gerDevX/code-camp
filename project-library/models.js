const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comments: {
    type: [String],
  },
});
const Books = mongoose.model('Books', bookSchema);

// For Test the DB doc
// (async () => {
//   await Books.create([
//     {
//       _id: '63657911922d375e25ad1b85',
//       title: 'The nya nya test book',
//       comments: ['mew', 'meow', 'NYA'],
//     },
//     {
//       _id: '63680748dad31302a987eaed',
//       title: 'Comment modification testnya',
//     },
//   ]);
// })();

exports.Books = Books;
