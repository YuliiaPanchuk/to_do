const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  task_name: {
    type: String,
  },
  status_id: {
    type: Number,
  },
});

export const Task = mongoose.model('Task', TaskSchema);
