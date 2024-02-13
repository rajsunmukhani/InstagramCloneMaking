var express = require('express');
const passport = require('passport');
var router = express.Router();
var localStrategy = require('passport-local');
const userModel = require('./users');
const upload = require("./multer")
const postModel = require('./post');
const timingFunc = require('../utils/timingFunc');

passport.use(new localStrategy(userModel.authenticate()));

// GET

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed', isLoggedIn ,async function(req, res) {
  var posts = await postModel.find().populate('user');
  var user = await userModel.findOne({username : req.session.passport.user})

  res.render('feed', {footer: true, user,posts,timer : timingFunc});
});

router.get('/profile', isLoggedIn ,async function(req, res) {
  var user = await userModel.findOne({username : req.session.passport.user}).populate('posts');
  res.render('profile', {footer: true,user});
});

router.get('/search', isLoggedIn ,async function(req, res) {
  var user = await userModel.findOne({username : req.session.passport.user})
  res.render('search', {footer: true,user});
});

router.get('/edit', isLoggedIn ,async function(req, res) {
  var user = await userModel.findOne({username : req.session.passport.user})
  res.render('edit', {footer: true,user});
});

router.get('/upload', isLoggedIn ,async function(req, res) {
  var user = await userModel.findOne({username : req.session.passport.user})
  res.render('upload', {footer: true,user});
});

router.get("/logout",function(req,res,next){
  req.logOut(function(err){
    if(err){return next(err)}
    res.redirect('/login')
  })
})

router.get('/like/:postID',async function(req,res,next){
  const user = await userModel.findOne({username : req.session.passport.user})
  const post = await postModel.findOne({_id : req.params.postID})

  if(post.likes.indexOf(user._id) === -1) {
    post.likes.push(user._id);
  }else{
    var userId = post.likes.indexOf(user._id)
    post.likes.splice(user._id, 1);
  }

  await post.save();
  res.json(post);
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



router.post('/upload', isLoggedIn, upload.single("profileImage") ,async function(req, res) {
  let user = await userModel.findOne({username : req.session.passport.user})
  if (req.file){
    user.picture = req.file.filename;
  }
  await user.save();
  res.redirect('/edit')
});


router.post('/update', isLoggedIn, async function(req, res) {
  var user = await userModel.findOneAndUpdate({username : req.session.passport.user},
    {username : req.body.username,name : req.body.name,bio : req.body.bio} ,{new : true});

  req.logIn(user, function(err){
    if(err) throw err;
    res.redirect('/profile');
  })
});

router.post('/createPost', isLoggedIn, upload.single('postImage') ,async function(req,res){
  let user = await userModel.findOne({username : req.session.passport.user});

  const post = await postModel.create({
    media : req.file.filename,
    user : user._id,
    caption : req.body.caption
  })

  user.posts.push(post._id);
  await user.save();

  res.redirect('/profile');
});


// MIDDLEWARES

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

// EXPORTS

module.exports = router;
