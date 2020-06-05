const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");


// All authors
router.get("/", async (req,res) =>{

    let searchOptions = {};

    if (req.query.name != null && req.query.name !== ""){
        // 'i' for case insensitive
        searchOptions.name = new RegExp(req.query.name, "i")
    }

    try{
        // get all authors if 'searchOptions' is an empty object
        const authors = await Author.find(searchOptions);
        res.render("authors/index", {authors:authors, searchOptions:req.query});

    }catch{
        res.redirect("/");
    }
})

// New Author
router.get("/new", (req,res) =>{
    res.render("authors/new", {author: new Author()});
})

// create Author
router.post("/", async (req,res) =>{
    const author = new Author({
        name: req.body.name
    });

    try{
        const newAuthor = await author.save();
        // go back to the author page based on the id
        res.redirect(`authors/${newAuthor.id}`);

    }catch{
        res.render("authors/new", {
            author: author,
            errorMessage: "Error Creating author"
        });
    }
})


// show author
router.get("/:id", async (req, res) =>{
    try {

        const author = await Author.findById(req.params.id);
        const books = await Book.find({author:author.id}).limit(6).exec();
        res.render("authors/show", {
            author,
            booksByAuthor: books
        })
        
    } catch{
        res.redirect("/");
    }
})

// get the edit page of the author based on the id
router.get("/:id/edit", async (req, res) =>{

    try {
        // find author by id
        const author = await Author.findById(req.params.id);
        res.render("authors/edit",{author});
    } catch {
        res.redirect("authors")
    }

})

// update author
router.put("/:id", async (req, res) =>{
    let author
    try{
         // find author by id
        author = await Author.findById(req.params.id);
        author.name = req.body.name; // change the name based on the user input
        await author.save();

        // go back to the author page based on the id
        res.redirect(`/authors/${author.id}`);

    }catch{
        if (author == null){
            res.redirect("/"); // redirect to homepage
        } 
        else{
            res.render("authors/edit", {
                author: author,
                errorMessage: "Error updating author"
            });
        }
       
    }
})

// delete author
router.delete("/:id", async (req, res) =>{
    let author
    try{
         // find author by id
        author = await Author.findById(req.params.id);
        await author.remove();

        // go back to the author page based on the id
        res.redirect("/authors");

    }catch{
        if (author == null){
            res.redirect("/"); // redirect to homepage
        } 
        else{
            // redirect back to the author based on the id
            res.redirect(`/authors/${author.id}`);
        }
       
    }
})

module.exports = router;