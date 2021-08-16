var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var blogRouter = require("./routes/blog");
var loginRouter = require("./routes/login");
var apiRouter = require("./routes/api");
var editorRouter = require("./routes/editor");

var app = express();
var db = require("./db");

// view engine setup
app.set("views", path.join(__dirname, "views")); //where to look for the templates
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json()); //Express can now recognize incoming request object as json
app.use(express.urlencoded({ extended: false })); //Express can now recognize incoming request object as strings or arrays
app.use(cookieParser()); // helps us parse cookies
app.use("/editor", editorRouter);
app.use(express.static(path.join(__dirname, "public")));

//conect to server at the beginning

db.connect("mongodb://localhost:27017/", function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log("Connected to the server successfully");
    app.use("/", indexRouter); // if you get this path go to that router
    app.use("/users", usersRouter); //same here
    app.use("/blog", blogRouter); // /blog endpoints get handled by blogRouter.
    app.use("/login", loginRouter); //Login endpoints get handled by loginRouter.
    app.use("/api", apiRouter);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
