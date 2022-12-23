const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  status_name: {
    type: String,
    required: true,
  },
});

export const Status = mongoose.model('Status', StatusSchema);
