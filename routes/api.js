/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';
let BookModel = require('../database/book');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel.aggregate([
        {
          $addFields: {
            commentcount: {
              $size: '$comments',
            },
          }
        }
      ])
      .then(docs=>{
        console.log('send all book docs to api: '+ docs.length);
        res.json(docs);
        })
        .catch(err=>{
        console.log(err); 
        })
    })
   

    .post(function (req, res) {
      //response will contain new book object including atleast _id and title
      if (req.body.hasOwnProperty('title')) {
        let title = req.body.title;
        BookModel.create({
          title: title,
        })
          .then((docs) => {
            console.log('inserted book with id:' + docs.id);
            res.json({
              _id: docs._id,
              title: docs.title,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send('missing required title field');
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
