var express = require("express");
var router  = express.Router();
var db = require("../models");

router.get("/", (req, res) => {
    db.Article.find({})
    .then(function(dbArticle) {
        console.log(dbArticle);
        res.render("index", dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("comment")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
    });
});

module.exports = router;