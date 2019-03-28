var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Local server
var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Require Handlebars
var exphbs = require("express-handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set Handlebars as default rendering engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// When the server starts, create and save a new User document to the db
// The "unique" rule in the User model's schema will prevent duplicate users from being added to the server
db.User.create({ name: "Ernest Hemingway" })
  .then(function(dbUser) {
    console.log(dbUser);
  })
  .catch(function(err) {
    console.log(err.message);
});

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.cargurus.com/Cars/autos/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
  
        // Now, we grab every h2 within an article tag, and do the following:
        $("article").each(function(i, element) {
            // Save an empty result object
            var result = {};

            result.title = $(element).children("a").children("h3").text();
            result.summary = $(element).children("a").children(".cg-research-article-preview").children("p").text();
            result.link = $(element).children("a").attr("href");

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err);
            });
        });
    
        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// Routes

// Route for retrieving all Notes from the db
// app.get("/notes", function(req, res) {
//   // Find all Notes
//   db.Note.find({})
//     .then(function(dbNote) {
//       // If all Notes are successfully found, send them back to the client
//       res.json(dbNote);
//     })
//     .catch(function(err) {
//       // If an error occurs, send the error back to the client
//       res.json(err);
//     });
// });

// Route for retrieving all Users from the db
// app.get("/user", function(req, res) {
//   // Find all Users
//   db.User.find({})
//     .then(function(dbUser) {
//       // If all Users are successfully found, send them back to the client
//       res.json(dbUser);
//     })
//     .catch(function(err) {
//       // If an error occurs, send the error back to the client
//       res.json(err);
//     });
// });

// Route for saving a new Note to the db and associating it with a User
// app.post("/submit", function(req, res) {
//   // Create a new Note in the db
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.User.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
//     })
//     .then(function(dbUser) {
//       // If the User was updated successfully, send it back to the client
//       res.json(dbUser);
//     })
//     .catch(function(err) {
//       // If an error occurs, send it back to the client
//       res.json(err);
//     });
// });

// Route to get all User's and populate them with their notes
// app.get("/populateduser", function(req, res) {
//   // Find all users
//   db.User.find({})
//     // Specify that we want to populate the retrieved users with any associated notes
//     .populate("notes")
//     .then(function(dbUser) {
//       // If able to successfully find and associate all Users and Notes, send them back to the client
//       res.json(dbUser);
//     })
//     .catch(function(err) {
//       // If an error occurs, send it back to the client
//       res.json(err);
//     });
// });

// Start the server

var routes = require("./routes/routes");
app.use(routes);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
