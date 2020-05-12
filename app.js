var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var methodOverride=require('method-override');
var flash=require('connect-flash');
var timeout=require('connect-timeout');
var Campground=require('./models/campgrounds');
var seedDB=require('./seeds');
var Comment=require('./models/comments');
var User=require('./models/user');
var campgroundsRoutes=require('./routes/campgrounds');
var commentsRoutes=require('./routes/comments');
var indexRoutes=require('./routes/index');
const options={
	 useUnifiedTopology: true, 
	 useNewUrlParser: true 
};

mongoose.connect("mongodb://localhost/yelp_camp",options);
//mongoose.connect("mongodb+srv://adith99:$tephenCurry30@cluster0-4yc1x.mongodb.net/test?retryWrites=true&w=majority",options);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(timeout('5s'))
app.set("view engine","ejs");

//seedDB();

//Passport configuration
app.use(require('express-session')({
	secret:"This is a secret",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);

app.listen(process.env.PORT || 3000,function()
{
	console.log("The YelpCamp server has started");
});