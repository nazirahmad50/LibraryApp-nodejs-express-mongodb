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
    
    renderFormPage(res, "new", new Book());

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
        res.redirect(`books/${newBook.id}`)
        
    } catch (err){
        renderFormPage(res, "new", book, true);
    }
    
})

// show book route
router.get("/:id", async (req,res) =>{
    try {
        // 'populate' will populate the author var inside the book object with all the author info 
        // because at the moment the books object stores teh author id not its info
        const book = await Book.findById(req.params.id).populate("author").exec();
        res.render("books/show", {book});
    } catch {
        res.redirect("/")
        
    }
})

// edit book page
router.get("/:id/edit", async (req,res) =>{

    try {
        const book = await Book.findById(req.params.id);
        renderFormPage(res,book,"edit");
        
    } catch{
        res.redirect("/")
    }
})

// Update Book
router.put("/:id", async (req,res) =>{
    let book;

    try {
        const book = await Book.findById(req.params.id);
        // update the book object values
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;

        if (req.body.cover != null && req.body.cover !== ""){
            saveCover(book, req.body.cover);
        }

        await book.save();
   
        // show the updated book
        res.redirect(`/books/${book.id}`);
        
    } catch (err){
        if (book != null){
            renderFormPage(res, "edit", book);
        } else{
            res.redirect("/");
        }
       
    }
    
})

// Delete book
router.delete("/:id", async(req,res) =>{
    let book;
    try {

        const book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect("/books");
        
    } catch {
        if (book != null){
            res.render("books/show", {
                book,
                errorMessage: "Could not remove book"
            });
        }else{
            res.redirect("/");
        }
    }
})


async function renderFormPage(res, book,form, hasError = false){
    try {
        const authors = await Author.find({});
        const params = {authors, book};
        if (hasError){
            if(form === "edit"){
                params.errorMessage = "Error updating Book"

            }else{
                params.errorMessage = "Error creating Book"
            }
        }
        res.render(`books/${form}`, params);
        
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