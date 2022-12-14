const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  list_name: {
    type: String,
    required: true,
  },
  color: {
    type: String
  }
});

const List = mongoose.model('List', ListSchema);

module.exports = { List }
