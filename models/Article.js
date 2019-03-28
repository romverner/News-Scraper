var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    // Saving the title as a string
    title: {
        type: String,
        unique: true
    },
    // Saving the article summary as a string
    summary: String,
    // Saving the link to the actual article as a string
    link: String,
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;