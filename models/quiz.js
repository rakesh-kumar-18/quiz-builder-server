const mongoose = require('mongoose');

const quizeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  quizeName: {
    type: String,
    required: true,
  },
  quizeType: {
    type: String,
    required: true,
  },
  impressionCount: {
    type: Number,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  slides: {
    type: Array,
    required: true,
  },
  timer: {
    type: String,
    required: true,
  },
  analytics: {
    type: Array,
    required: true,
  },
});

const Quize = mongoose.model('Quize', quizeSchema);
module.exports = Quize;
