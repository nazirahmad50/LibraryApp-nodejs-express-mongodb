const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

// create path for the cover image
const path = require("path")
const fs = require("fs");
const uploadPath = path.join("public", Book.coverImgBasePath)
// all the different image types that we accept
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"] 

// using multer
const multer = require("multer");
const upload = multer({
    dest:uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
})


// All Books
router.get("/", async (req,res) =>{

    // return a query object which we can build a query from or exceute later
    let query = Book.find();

    if (req.query.title != null && req.query.title != ""){
        // check on the title which is the db param
        query = query.regex("title", new RegExp(req.query.title, "i"));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != ""){

        // if the 'publishedDate' is less than or equal to (lte) 'publishedBefore' then return that object
        query = query.lte("publishDate", req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != ""){

        // if the 'publishedDate' is greater than or equal to (lte) 'publishedAfter' then return that object
        query = query.gte("publishDate", req.query.publishedAfter);
    }

    try {
        const books = await query.exec(); // exceutes the query
        res.render("books/index", {
            books,
            searchOptions:req.query
        });
        
    } catch {
        res.redirect("/")
        
    }

   
})

// New Book
router.get("/new", async (req,res) =>{
    
  renderNewPage(res, new Book());

})

// create Book
// the 'cover' is the name what we set for the input
// now were telling multer that were uploading single file with the name of cover
router.post("/", upload.single("cover"), async (req,res) =>{

    // this multer library will also add a variable called file
   const fileName = req.file != null ? req.file.filename : null;

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description,
    });

    try {
        const newBook = await book.save();
        res.redirect("books")
        
    } catch (err){
        if (book.coverImageName != null) removeBookCover(book.coverImageName);

        renderNewPage(res, book, true);
    }
    
})

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({});
        const params = {authors, book};
        if (hasError) params.errorMessage = "Error creating Book"
        res.render("books/new", params);
        
    } catch {
        res.redirect("/books")
    }
}

function removeBookCover(fileName){
    // delete the file of 'fileName' from the bookCovers folder
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if (err) console.log(err);
    });
}

module.exports = router;