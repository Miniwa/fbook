const express = require("express");
const controllers = require("./src/controllers");
const auth = require("./src/auth");

let routes = express.Router();

// Routes related to authentication.
routes.post("/auth", auth.login);
routes.get("/login.html", controllers.view);
routes.get("/signup.html", controllers.view);
routes.post("/user", controllers.createUser);

// Setup auth routes
// Router requires user to be logged in.
let authed = express.Router();
authed.use((req, res, next) => {
    if(req.user === null || req.user === undefined) {
        res.redirect("login.html");
    } else {
        next();
    }
});

authed.get("/logout", auth.logout);
authed.get("/", controllers.view);
authed.get("/search.html", controllers.view);
authed.get("/user/search", controllers.getUsersByNameQuery);
authed.post("/addFriend", controllers.addFriend);
authed.get("/getFriends", controllers.getFriends);
authed.get("/getOwnReceivedPosts", controllers.getOwnReceivedPosts);
authed.post("/createOwnPost", controllers.createOwnPost);
routes.use(authed);

module.exports = routes;
