const express = require("express");

let routes = express.Router();
let authed = express.Router();

// Statics
routes.use(express.static("static"));

// Routes related to authentication.
routes.get("/login.html", (req, res) => {
    res.sendFile("views/login.html", {root: __dirname});
});

routes.post("/auth", (req, res) => {
    console.log(req);
});

// Setup auth routes
// Router requires user to be logged in.
authed.use((req, res, next) => {
    if(req.user == null) {
        res.redirect("login.html");
    } else {
        next();
    }
});

authed.get("/", (req, res) => {
    res.sendFile("views/index.html", {root: __dirname});
});

routes.use(authed);

module.exports = routes;
