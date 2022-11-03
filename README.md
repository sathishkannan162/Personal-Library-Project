# Personal Library

This project was done as a part of Quality Assurance course on Freecodecamp and is a exact replica of [https://personal-library.freecodecamp.rocks/](https://personal-library.freecodecamp.rocks/).

This project was built using `express`. Tests for this project were writtien using `chai`, `chai-http` and `mocha`. UI tests were written using headless browser `zombie.js` along with former packages. Database used here is `MongoDB` and `mongoose` was used for validation of records that are sent to database.

You can send GET,POST and DELETE requests to server on `\api\books` and `\api\books\[_id]`. Using them, you can add books, add comments to books, get data on a specific book or all books, delete a single book or all books. Refer user stories below for instructions on how to use them. 

Check out the package.json for different scripts that can be run. To start the server with tests. You need to uncomment the `NODE_ENV=test` in your .env file.

## User stories completed

- You can provide your own project, not the example URL.
- You can send a POST request to /api/books with title as part of the form data to add a book. The returned response will be an object with the title and a unique _id as keys. If title is not included in the request, the returned response should be the string missing required field title.
- You can send a GET request to /api/books and receive a JSON response representing all the books. The JSON response will be an array of objects with each object (book) containing title, _id, and commentcount properties.
- You can send a GET request to /api/books/{_id} to retrieve a single object of a book containing the properties title, _id, and a comments array (empty array if no comments present). If no book is found, return the string no book exists.
- You can send a POST request containing comment as the form body data to /api/books/{_id} to add a comment to a book. The returned response will be the books object similar to GET /api/books/{_id} request in an earlier test. If comment is not included in the request, return the string missing required field comment. If no book is found, return the string no book exists.
- You can send a DELETE request to /api/books/{_id} to delete a book from the collection. The returned response will be the string delete successful if successful. If no book is found, return the string no book exists.
- You can send a DELETE request to /api/books to delete all books in the database. The returned response will be the string 'complete delete successful if successful.
- All 10 functional tests required are complete and passing.


## Hosted project
The project is hosted on replit: [https://Personal-Library-Project.sathishkannan16.repl.co](https://Personal-Library-Project.sathishkannan16.repl.co).