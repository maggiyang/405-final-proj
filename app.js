var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ejs = require('ejs');
var AdminController = require('./controllers/AdminController');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/User');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());
app.use(session({ secret: 'super-secret', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: 'ssshhhhh',
    resave: true,
    saveUninitialized: true
}));
//app.use(cookieSession());
//app.use(app.router);

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.find({
            where: {
                username: username,
                password: password
            }
        }).then(function(user) {
            if (!user) {
                done(null, false, { message: 'Invalid username' });
            } else if (password != user.password) {
                done(null, false, { message: 'Invalid password'});
            } else {
                done(null, user);
            }
        });
    }
));

// Serialize sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.find({where: {id: id}}).then(function(user){
        done(null, user);
    });
});


app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    });
});

app.get('/login', function(req, res){
    res.render('login', {
        message: req.flash('error')
    });
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.get('/admin', AdminController.admin);
app.get('/admin/projects', AdminController.projects);
app.get('/admin/create-project', AdminController.createProject);
app.get('/admin/users', AdminController.users);
app.get('/admin/update-project', AdminController.updateProject);

app.post('/admin/projects', AdminController.addProject);
//app.get('/dvds', DvdController.dvds);

app.listen(3000, function() {
    console.log('Listening on localhost:3000');
});



