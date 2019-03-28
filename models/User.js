var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    comments: {
        type: Array,
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = User;