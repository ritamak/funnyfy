require("dotenv/config");
require("./db");
const express = require("express");
const hbs = require("hbs");
const app = express();
require("./config")(app);

const projectName = "Funnyfy";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();
app.locals.title = `${capitalized(projectName)} `;
/*
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
      maxAge: 1000 * 24* 60 * 60 
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/rita",
      ttl: 24* 60 * 60 
    })
  }));
*/
const index = require("./routes/index");
app.use("/", index);
const authRoutes = require("./routes/auth.route");
app.use("/", authRoutes)
require("./error-handling")(app);

module.exports = app;
