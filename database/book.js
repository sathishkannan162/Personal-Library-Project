let mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    comments: {
        type: [ String ],
        default: []
    },
    // this property is needed for one to set commentcount for documents returned
    // from find and update methods
    commentcount: Number
})

module.exports = mongoose.model('Book',bookSchema);