const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Router = require('./routes');
const uri = process.env.MONGODB;

const PORT = 3001;
const app = express();
app.use(express.json());
app.use(cors());

// To make sure your connection was successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

app.use(Router);

async function main() {
  await mongoose.connect(uri);

  app.listen(PORT, () => {
    console.log(`Assignment project listening on port ${PORT}`);
  });
}

main();

module.exports = app;
