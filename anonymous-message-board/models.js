const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: { type: Date, required: true },
  bumped_on: { type: Date, required: true },
  reported: { type: Boolean, required: true },
});

const threadSchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  board: { type: String, required: true },
  created_on: { type: Date, required: true },
  bumped_on: { type: Date, required: true },
  reported: { type: Boolean, required: true },
  replies: [replySchema],
});

exports.Reply = mongoose.model('Reply', replySchema);
exports.Thread = mongoose.model('Thread', threadSchema);
