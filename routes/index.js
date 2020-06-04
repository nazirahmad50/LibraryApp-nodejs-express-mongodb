const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// root of the applicaiton
router.get("/", async (req,res) =>{

    let books;

    try {
        // get the top 10 recent books
        books = await Book.find().sort({createdAt:"desc"}).limit(10).exec();
        
    } catch{
        books = [];
    }
    res.render("index", {books});
})

module.exports = router;