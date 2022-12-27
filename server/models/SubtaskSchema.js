const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  sub_task_name: {
    type: String,
    required: true,
  },
  task_id: {
    type: String,
    required: true,
  },
});

const Subtask = mongoose.model('Subtask', SubtaskSchema);

module.exports = { Subtask }
