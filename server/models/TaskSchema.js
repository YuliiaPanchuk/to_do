const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  task_name: {
    type: String,
  },
  list_id: {
    type: String,
  },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task }
