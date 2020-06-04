// check if were running in production process 
// becasue we want to load the .env variables in developnment mode
// if its in developnment then the the variables in the '.env' file will be loaded in the 'proccess.env'
if (process.env.NODE_ENV !== "production") require("dotenv").config();


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressLayout = require("express-ejs-layouts");

// routes
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");



app.set("view engine", "ejs");
// point to the location where all the views are loacted
app.set("views", __dirname + "/views");
// set the layouts locaiton, use layouts so we dont need to repeat the header and footer
app.set("layout", "layouts/layout")
app.use(expressLayout)
app.use(express.static("public"));

// body parser
app.use(bodyParser.urlencoded({limit:"10mb", extended:false}));

// all the imported routers should go to their respective routes
app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);


// setup mongodb
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on("error", err => console.log(err));
db.once("open", () => console.log("Connected to mongoose")); // connection for the first time

app.listen(process.env.PORT || 3000);