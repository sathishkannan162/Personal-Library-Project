/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';
const { default: mongoose } = require('mongoose');
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
          },
        },
      ])
        .then((docs) => {
          console.log('send all book docs to API: ' + docs.length);
          res.json(docs);
        })
        .catch((err) => {
          console.log(err);
        });
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
      BookModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(bookid),
          },
        },
        {
          $addFields: {
            commentcount: {
              $size: '$comments',
            },
          },
        },
      ])
        .then((docs) => {
          if (docs[0] == null) {
            console.log('no book with _id ' + bookid + ' exists');
            res.send('no book exists');
          } else {
            console.log(`sent book ${docs[0].title} to API`);
            res.json(docs[0]);
          }
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      //json res format same as .get
      if (req.body.hasOwnProperty('comment')) {
        let comment = req.body.comment;
        BookModel.findOneAndUpdate(
          {
            _id: mongoose.Types.ObjectId(bookid),
          },
          {
            $push: {
              comments: comment,
            },
          },
          { new: true }
        )
          .then((docs) => {
            if (docs==null) {
              console.log(`no book exists with id: ${bookid}`)
              res.send('no book exists');
            } else {
              console.log('New comment added on book: '+docs._id);
              docs.commentcount = docs.comments.length;
              res.json(docs);
            } 
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      } else {
        res.send('missing required field comment');
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
