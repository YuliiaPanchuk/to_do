const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  sub_task_name: {
    type: String,
    required: true,
  },
  task_id: {
    type: Number,
    required: true,
  },
});

export const Subtask = mongoose.model('Subtask', SubtaskSchema);
