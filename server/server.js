const express = require('express');
const mongoose = require('mongoose');
const Router = require("./routes"); // needed?
const uri = process.env.MONGODB;

const PORT = 3001;
const app = express();
app.use(express.json());
app.use(cors());
/*
const connect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`An error occured ${error}`);
  }
}
*/

async function main() {
  await mongoose.connect(uri)
}

// To make sure your connection was successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", function () {
  console.log("Connected successfully");
})

app.use(Router)

app.listen(PORT, () => {
  console.log(`Assignment project listening on port ${PORT}`);
});