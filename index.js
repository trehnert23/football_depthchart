var express = require('express'),
    bodyParser = require('body-parser'),
    db = require("./models"),
    session = require("express-session"),
    path = require("path"),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("bower_components"));

// create our session
app.use(
  session({
    secret: 'super-secret-private-keyyy',
    resave: false,
    saveUninitialized: true
  })
);


// extending the `req` object to help manage sessions
app.use(function (req, res, next) {
  // login a user
  req.login = function (user) {
    req.session.userId = user._id;
  };
  // find the current user
  req.currentUser = function (cb) {
    db.User.findOne({ _id: req.session.userId }, function (err, user) {
        req.user = user;
        cb(null, user);
      })
  };
  // logout the current user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }
  // call the next middleware in the stack
  next(); 
});



var views = path.join(process.cwd(), "views");

app.get("/", function (req, res) {
    res.sendFile(path.join(views, "main.html"));
});

app.get("/signup", function (req, res) {
    res.sendFile(path.join(views, "signup.html"));
});

app.get("/profile", function (req,res) {
  res.sendFile(path.join(views, "profile.html"));
});

app.get("/logout", function (req,res) {
  req.logout();
  res.redirect("/");
});


// where the user submits the sign-up form
app.post(["/users", "/signup"], function signup(req, res) {
  // grab the user from the params
  var user = req.body.user;
  // pull out their email & password
  var username = user.username;
  var password = user.password; 
  // create the new user
  db.User.createSecure(username, password, function (err,user) {
    if(err) {console.log(err)}
    else {
      req.login(user);
      res.redirect("/profile");
    }
  });
});


// where the user submits the login form
app.post(["/sessions", "/"], function login(req, res) {
  var user = req.body.user;
  var username = user.username;
  var password = user.password;
  db.User.authenticate(username, password, function (err, user) {
      if(err) {
        console.log(err);
        res.redirect("/");
      }
      else { 
          req.login(user);
          res.redirect("/profile"); 
      }
    });

});


// show the current user
app.get("/getUserName", function userShow(req, res) {
  req.currentUser(function (err, user) {
    if(err){return console.log(err);}
    res.send(user.username);
  })
});





var listener = app.listen(3000, function () {
  console.log("Listening on port 3000");
});

