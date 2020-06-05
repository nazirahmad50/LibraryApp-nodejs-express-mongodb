const mongoose = require("mongoose");


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
    coverImage:{
        type: Buffer, // buffer of the data representing the entire image
        required:true,
    },
    // in order to render the iamge we need to know the type of iamge it is such as png...
    coverImageType:{
        type: String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId, // references the another object inside the mongo db collection
        required:true,
        ref: "Author" // the ref to the table in mongodb collection and it must match
    },
})

// the virtual will allow to derive value from any of the schema vars
bookSchema.virtual("coverImagePath").get(function() {
    if (this.coverImage != null && this.coverImageType != null){

        // the 'data' object in html allows us to take buffer data and use it as source for the iamge
        return `data:${this.coverImageType};charset=utf-8;base64, ${this.coverImage.toString("base64")}`;
    }
});

// 'Author' will be the name of the table inside db
module.exports = mongoose.model("Book", bookSchema);
