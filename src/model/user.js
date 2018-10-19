const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: {
            first: {
                type: String,
                required: true,
            },
            last: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
});

userSchema.query.byNameQuery = function(query) {
    let firstNameQuery = {
        "name.first": new RegExp(query, "i"),
    };
    let lastNameQuery = {
        "name.last": new RegExp(query, "i"),
    };
    return this.or([firstNameQuery, lastNameQuery]);
};

userSchema.query.byUsername = function(username) {
    return this.where({
        username: username,
    });
};

userSchema.query.withFriends = function() {
    return this.populate("friends");
};

userSchema.statics.byNameQuery = function(query) {
    return this.find().byNameQuery(query).exec();
};

userSchema.statics.byUsername = function(username) {
    return this.findOne().byUsername(username).exec();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
