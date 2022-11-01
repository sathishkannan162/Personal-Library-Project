let sampleData = require("./sampleBooks");
let BookModel = require("./book");
let myDB = require('./connection');

myDB(()=>{});

BookModel.insertMany(sampleData)
  .then((docs) => {
    console.log("inserted sample data: "+ docs.length);
  })
  .catch((err) => {
    console.log(err);
  });

