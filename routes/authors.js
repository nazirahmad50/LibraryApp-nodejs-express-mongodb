const express = require("express");
const router = express.Router();
const Author = require("../models/author");

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

        //res.redirect(`authors/${newAuthor.id}`);
        res.redirect("authors");

    }catch{
        res.render("authors/new", {
            author: author,
            errorMessage: "Error Creating author"
        });
    }
})

module.exports = router;