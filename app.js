const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./src/model/user");

let app = express();
let routes = require("./routes");

app.use(express.static("static"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(session({secret: "test"}));

// Setup auth strategy
passport.use(new LocalStrategy((username, password, done) => {
    User.byUsername(username).then((user) => {
        if(user === null) {
            done(null, false);
        } else if(user.password !== password) {
            done(null, false);
        } else {
            done(null, user);
        }
    }).catch((err) => {
        done(err);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    User.byUsername(username).then((user) => {
        if(user === null) {
            done(null, false);
        } else {
            done(null, user);
        }
    }).catch((err) => {
        done(err, null);
    });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

module.exports = app;
