const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

// all the different image types that we accept
 const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"] 

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

router.post("/", async (req,res) =>{

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
    });

    saveCover(book, req.body.cover);

    try {
        const newBook = await book.save();
        res.redirect("books")
        
    } catch (err){
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

function saveCover(book, coverEncoded){

    if (coverEncoded == null) return

    const cover = JSON.parse(coverEncoded);
    // check if the cover type is in the allowed image types
    if (cover != null && imageMimeTypes.includes(cover.type)){
        // create a buffer from some set of data
        // second param is how we want to convert it from
        book.coverImage = new Buffer.from(cover.data, "base64");
        book.coverImageType = cover.type;
    }
}

module.exports = router;