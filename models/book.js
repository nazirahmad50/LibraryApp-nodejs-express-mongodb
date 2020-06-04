const mongoose = require("mongoose");
const path = require("path");
// base path to where all the cover image swill be stored
const coverImgBasePath = "uploads/bookCovers";

// create a schema to define the db table for authors
const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
    },
    publishDate:{
        type: Date,
        required:true
    },
    pageCount:{
        type: Number,
        required:true
    },
    createdAt:{
        type: Date,
        required:true,
        default: Date.now
    },
    coverImageName:{
        type: String,
        required:true,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId, // references the another object inside the mongo db collection
        required:true,
        ref: "Author" // the ref to the table in mongodb collection and it must match
    },
})

// the virtual will allow to derive value from any of the schema vars
bookSchema.virtual("coverImagePath").get(function() {
    // return the full path to 'bookCovers' folder with the 'coverImageName'
    if (this.coverImageName != null){
        return path.join("/", coverImgBasePath, this.coverImageName);
    }
});

// 'Author' will be the name of the table inside db
module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImgBasePath = coverImgBasePath;