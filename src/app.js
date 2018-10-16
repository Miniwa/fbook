const express = require("express");

let app = express();
let routes = require("../routes");

app.use(routes);
module.exports = app;
