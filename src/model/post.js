const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
        required: true,
    },
});

postSchema.query.withAuthor = function() {
    return this.populate("author");
};

postSchema.query.authoredBy = function(userId) {
    return this.where({author: userId});
};

postSchema.query.withReceiver = function() {
    return this.populate("receiver");
};

postSchema.query.receivedBy = function(userId) {
    return this.where({receiver: userId});
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
