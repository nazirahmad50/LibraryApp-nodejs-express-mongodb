const express = require("express");
const router = express.Router();

// root of the applicaiton
router.get("/", (req,res) =>{
    res.render("index");
})

module.exports = router;