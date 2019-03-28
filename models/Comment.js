var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    // Saving the title as a string
    body: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;