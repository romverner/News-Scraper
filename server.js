var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Local server
var PORT = 3000;

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
        res.redirect("/");
    });
});

var routes = require("./routes/routes");
app.use(routes);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
