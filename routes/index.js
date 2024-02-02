var express = require('express');
var router = express.Router();
const usermodel=require("./users");
const postmodel=require("./posts");
const passport=require("passport");
const localstrategy=require("passport-local");
const upload=require("./multer");
passport.use(new localstrategy(usermodel.authenticate()));
//ye above do lines se user login hota h

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash('error')});
});
router.post("/register", function(req,res){
  const userdata=new usermodel({
    username:req.body.username ,
    email: req.body.email,
  fullname:req.body.fullname
  })

  usermodel.register(userdata,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/login");
    })
  })
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true// for flash msgs...itne steps se ye hua ki /login route me jab aap console.log(req.flash("error")) karaoge
  //toh aapko terminal pe vo error dikkhne lagegi ki username/passwd is incorrect
}), function(req,res){ })

router.get('/logout',isLoggedIn,function(req,res,next){
  req.logout(function(err){
    if(err) return next(err);
    res.redirect('/login');
  })
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){//agar logged in ho
    return next();
  }
  res.redirect("/login");
}
router.get('/profile',isLoggedIn, async function(req,res,next){//account bante hi user yaha ayega
 const user=await usermodel.findOne({
  username:req.session.passport.user
 })
 .populate("posts");
  res.render('profile',{user});

});

router.get('/show/posts',isLoggedIn, async function(req,res,next){//account bante hi user yaha ayega
  const user=await usermodel.findOne({
   username:req.session.passport.user
  })
  .populate("posts");
   res.render('show',{user});
 
 });
router.get('/add',isLoggedIn, async function(req,res,next){//account bante hi user yaha ayega
  const user=await usermodel.findOne({
   username:req.session.passport.user
  })
res.render("add",{user});
});
router.post('/fileupload',isLoggedIn,  upload.single("image") ,async function(req, res, next) {
  const user= await usermodel.findOne({username:req.session.passport.user});
user.profileImage=req.file.filename;
await user.save();
res.redirect("/profile");
});
router.post('/createpost',isLoggedIn,  upload.single("image") ,async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
 const user= await usermodel.findOne({username:req.session.passport.user});
const post=await postmodel.create({
image:req.file.filename,
imageText: req.body.imageText,
description:req.body.Description,
user: user._id
});
 user.posts.push(post._id);
 await user.save();
res.redirect("/profile");
});
module.exports = router;
