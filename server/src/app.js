const express = require("express");
const app = express();
const user_router = require("./routes/users");
const login_router = require("./routes/login");
const friends_router = require("./routes/friends");
const login_handler = require("./login_handler");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api/users", user_router);
app.use("/api/login", login_router);
//app.use("/app", application_router);
app.use('/api/friends', friends_router);
app.use('/app', express.static(__dirname + '/public/application.html'))

//debug -----------
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.get("/test", (req, res) => {
    const token = login_handler.parse_token(req.get("authorization"));
    const t = login_handler.validate_token(token);
    res.send(`<html><h1>${t}</h1></html>`);
});
//-------------

module.exports = app;
