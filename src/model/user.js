const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    userName: String,
    name: {
        first: String,
        last: String,
    },
    password: String,
});

userSchema.query.byUserName = function(userName) {
    return this.where({
        userName: userName,
    });
};

const User = mongoose.Model("User", userSchema);

module.exports = User;
