const passport = require("passport");

passportOptions = {
    successRedirect: "/",
    failureRedirect: "/login.html?failed=true",
};
const login = passport.authenticate("local", passportOptions);

function logout(req, res) {
    req.logout();
    res.redirect("login.html");
};

module.exports = {
    login, logout,
};
