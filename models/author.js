const mongoose = require("mongoose");
const Book = require("./book");
// create a schema to define the db table for authors
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    }
})

// runs before the remove function thats run from mongoose
// the 'next' callback means that our code is good to go forward unless we pass an error
authorSchema.pre("remove", function(next){
    Book.find({author:this.id}, (err, books) =>{
        // going to pass the error to the next function and prevents us from removing
        if (err) {
            next(err);
        }else if (books.length > 0){
            // still prevents the code from removing due to passing an error
            next(new Error("this author still has books"))
        }else{
            // now it wil delete as we are not passing any params
            next();
        }
    })
});

// 'Author' will be the name of the table inside db
module.exports = mongoose.model("Author", authorSchema);