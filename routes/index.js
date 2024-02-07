var express = require('express');
const passport = require('passport');
var router = express.Router();
var localStrategy = require('passport-local');
const userModel = require('./users');

passport.use(new localStrategy(userModel.authenticate()));

// GET

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed', isLoggedIn ,function(req, res) {
  res.render('feed', {footer: true});
});

router.get('/profile', isLoggedIn ,function(req, res) {
  res.render('profile', {footer: true});
});

router.get('/search', isLoggedIn ,function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit', isLoggedIn ,function(req, res) {
  res.render('edit', {footer: true});
});

router.get('/upload', isLoggedIn ,function(req, res) {
  res.render('upload', {footer: true});
});

router.get("/logout",function(req,res,next){
  req.logOut(function(err){
    if(err){return next(err)}
    res.redirect('/login')
  })
})

// POST

router.post('/register',function(req,res){
  var user = {
    username : req.body.username,
    name : req.body.name,
    email : req.body.email,
  }

  userModel.register(user,req.body.password)
  .then(function(registeredUser){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})

router.post('/login',passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect : "/login"
}),function(req,res){})



// MIDDLEWARES

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

// EXPORTS

module.exports = router;
