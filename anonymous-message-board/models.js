const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  createdon_: { type: Date, required: true },
  reported: { type: Boolean, required: true },
});

const threadSchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  board: { type: String, required: true },
  createdon_: { type: Date, required: true },
  bumpedon_: { type: Date, required: true },
  reported: { type: Boolean, required: true },
  replies: [replySchema],
});

exports.Reply = mongoose.model('Reply', replySchema);
exports.Thread = mongoose.model('Thread', threadSchema);
