var express = require("express");
var router  = express.Router();
var db = require("../models");

router.get("/", (req, res) => {
    db.Article.find({})
    .then(function(dbArticle) {
        res.render("index", dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

module.exports = router;