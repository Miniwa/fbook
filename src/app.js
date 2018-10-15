const express = require("express");

let app = express();
app.use(express.static("static"));

module.exports = app;
