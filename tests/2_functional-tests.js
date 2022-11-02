/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const BookModel = require('../database/book');
const sampleBooks = require('../database/sampleBooks');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let sampleBookIds;
  suiteSetup(function (done) {
    BookModel.insertMany(sampleBooks)
      .then((docs) => {
        sampleBookIds = docs.map((item) => item._id);
        console.log('inserted sample books for testing:' + docs.length);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({
              title: 'chaiTest1',
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'Body should be a object');
              assert.property(
                res.body,
                'title',
                'response body should have property title'
              );
              assert.equal(res.body.title, 'chaiTest1');
              assert.property(
                res.body,
                '_id',
                'response body should have property _id'
              );
              assert.match(res.body._id, /[a-f\d]{24}/);
              done();
            });
        });

        test('Test POST /api/books with no title given', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({})
            .then((res) => {
              assert.equal(res.status, 200);
              assert.isString(res.text, 'res.body should be a string');
              assert.equal(res.text, 'missing required field title');
            })
            .catch((err) => {
              console.log(err);
            });
          done();
        });
      }
    );

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'comments');
            assert.property(res.body[0], 'title');
            assert.isArray(res.body[0].comments);
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/63622fd28f8c5af66c0e9fd7')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get('/api/books/' + sampleBookIds[0])
          .end(function (err, res) {
            if (err) {
              console.log(err);
            }
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'commentcount');
            assert.property(
              res.body,
              '_id',
              'response body should have property _id'
            );
            assert.equal(
              res.body._id,
              sampleBookIds[0].toString(),
              'book _id should match'
            );
            assert.isArray(res.body.comments);
            assert.match(res.body._id, /[a-f\d]{24}/);
            done();
          });
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          chai
            .request(server)
            .post(`/api/books/${sampleBookIds[1]}`)
            .send({
              comment: 'chaiTest comment 1',
            })
            .end(function (err, res) {
              if (err) {
                console.log(err);
              }
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'title');
              assert.property(res.body, 'comments');
              assert.property(res.body, 'commentcount');
              assert.property(
                res.body,
                '_id',
                'response body should have property _id'
              );
              assert.equal(
                res.body._id,
                sampleBookIds[1].toString(),
                'book _id should match'
              );
              assert.isArray(res.body.comments);
              assert.match(res.body._id, /[a-f\d]{24}/);
              assert.include(res.body.comments, 'chaiTest comment 1');
              done();
            });
        });

        test('Test POST /api/books/[id] without comment field', function (done) {
          chai
            .request(server)
            .post(`/api/books/${sampleBookIds[2]}`)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isString(res.text);
              assert.equal(res.text, 'missing required field comment');
              done();
            });
        });

        test('Test POST /api/books/[id] with comment, id not in db', function (done) {
          chai
            .request(server)
            .post(`/api/books/63622fd28f8c5af66c0e9fd7`)
            .send({
              comment: 'chaiTest comment 2',
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isString(res.text);
              assert.equal(res.text, 'no book exists');
              done();
            });
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${sampleBookIds[2]}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete('/api/books/63622fd28f8c5af66c0e9fd7')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
    // Remove sample data
    suiteTeardown(function (done) {
      let testBooks = sampleBooks.map((item) => item.title);
      testBooks.push('chaiTest1');
      BookModel.deleteMany({ title: { $in: testBooks } })
        .then((docs) => {
          console.log('deleted sample data: ', docs.deletedCount);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
  });
});
