const chai = require('chai');
const assert = chai.assert;
const server = require('./server');
const BookModel = require('./database/book');
const Browser = require('zombie');
const { stdout } = require('process');
let sampleBooks = require('./database/sampleBooks')
require('dotenv').config();

Browser.localhost('example.com', process.env.PORT);

suite('Browser tests with zombie', function () {
  this.timeout(5000);
  let browser = new Browser();
  let zombieBook;

  suiteSetup(function (done) {
    BookModel.insertMany(sampleBooks)
    .then(docs=>{
    console.log('inserted sample books: '+ docs.length);
    })
    .catch(err=>{
    console.log(err)
    });
    
    return browser.visit('/', done);
  });

  suite('Test whether browser has site property', function () {
    test('browser has site property', function (done) {
      assert.isNotNull(browser.site);
      done();
    });
  });

  suite('Test post /api/books form', function () {
    test('click submit', function (done) {
      browser.fill('#title', 'Zombie Here').then(() => {
        browser.pressButton('Submit', (res) => {
          browser.assert.success();
          // console.log(browser.html('body'))
          assert.match(browser.html('body'), /\_id/);
          assert.match(browser.html('body'), /[a-f\d]{24}/);
          assert.match(browser.html('body'), /"Zombie Here"/);
          assert.isFalse(browser.redirected);
          // browser.dump();
          // return browser.visit('/',done); /// this works but it is not needed.
          browser.back(); // this also works
          // browser.visit('/')
          console.log('browser goes back');
          // browser.dump();
          done();
        });
      });
    });
  });

  suite('Test post /api/books/{bookid} form', function () {
    test(' fill details & click submit comment button', function (done) {
      BookModel.findOne({
        title: 'Zombie Here',
      })
        .then((doc) => {
          zombieBook = doc;
          // console.log(browser.field('#comment'))
          // console.log(browser.query('input#idinputtest'));
          browser.fill('#idinputtest', zombieBook._id.toString());
        })
        .then(() => {
          // console.log(browser.field('#comment'));
          browser.fill('#comment', 'fill 1');
        })
        .then(() => {
          browser.pressButton('Submit Comment', () => {
            browser.assert.success();
            // browser.dump();
            // browser goes to a new page
            browser.back(); // gives a message event loop idle
            // browser.visit('/')
            done();
          });
        });
    });
  });

  //sample front end
  suite('Test post submit New book form', function () {
    test('submit New Book', function (done) {
      // bug: no validation error occurs if zombie fills the form with no value,
      // but there is a validation error when it is done through normal UI browser
      browser.fill('#bookTitleToAdd', 'Again zombie').then(() => {
        browser.pressButton('Submit New Book!', () => {
          browser.assert.success();
          // browser.dump(); // gets console.log message event loop idle
          // console.log(browser.redirected);
          done();
        });
      });
    });
    //done();
  });

  suite('Test click book links and check elements', function () {
    test('click book links in sample UI', function (done) {
      browser.click('li.bookItem', () => {
        // console.log(browser.redirected);
        browser.assert.success();
        // console.log(browser.html('#bookDetail'));
        // browser.dump();
        done();
      });
    });
  });

  suite('Test new comment in opened books', function () {
    test('submit new comment in opened form', function (done) {
      browser.fill('#commentToAdd', 'Zombie comment 1').then(() => {
        browser.pressButton('Add Comment').then(() => {
          // console.log(browser.html('ul'));
          done();
        });
      });
    });
  });

  suite('Test delete book in opened form', function () {
    test('click delete book', function (done) {
      browser.click('li.bookItem', () => {
        // console.log(browser.redirected);
        browser.assert.success();
        // console.log(browser.html('#bookDetail'));
        browser.pressButton('Delete Book', () => {
          browser.reload().then(() => {
            // console.log(browser.html('ul'));
            done();
          });
        });
        // browser.dump();
      });
    });

    //done();
  });

  suite('Test delete all books', function () {
    test('click delete all books', function (done) {
      browser.pressButton('Delete all books...', () => {
        browser.reload()
        .then(()=>{
          // console.log(browser.html('ul'));
          done();
        })
        
        
      });
    });
    //done();
  });
});
