const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
  name: { type: String, required: true },
  likes: { type: Number, default: 0 },
  ips: [String],
});
const Stock = mongoose.model('Stock', stockSchema);

exports.Stock = Stock;
