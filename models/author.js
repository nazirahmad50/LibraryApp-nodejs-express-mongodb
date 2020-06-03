const mongoose = require("mongoose");

// create a schema to define the db table for authors
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    }
})

// 'Author' will be the name of the table inside db
module.exports = mongoose.model("Author", authorSchema);