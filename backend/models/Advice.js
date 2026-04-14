const mongoose = require('mongoose');

const adviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  items: [{
    type: String
  }]
});

module.exports = mongoose.model('Advice', adviceSchema);