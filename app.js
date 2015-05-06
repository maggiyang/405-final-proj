var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ejs = require('ejs');
var AdminController = require('./controllers/AdminController');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var multer = require('multer');
var done=false;
var UploadController = require('./controllers/UploadController');
var UserController = require('./controllers/UserController');
var models = require('./models');

var expressApiCache = require('express-api-cache');

var User = require('./models').User;
var ProjectFeedController = require('./controllers/ProjectFeedController');
var app = express();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
//app.use(connectEnsureLogin);

app.use(express.static(path.join(__dirname, 'public')));
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

app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done=true;
    }
}));

app.use('/uploads', express.static(__dirname + '/uploads'));

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

///**
// * This method checks if the user is Authenticated. If not, redirects to login page
// * @param req
// * @param res
// * @param next
// * @returns {*}
// */
//var isAuthenticated = function (req, res, next) {
//    if (req.isAuthenticated())
//        return next();
//    console.log('req.originalUrl: %s', req.originalUrl);
//    req.session.urlAfterLogin = req.originalUrl;
//    res.redirect('/login');
//}

app.set('view engine', 'ejs');
app.get('/', ProjectFeedController.showFeed);

app.get('/login', function(req, res){
    res.render('login', {
        message: req.flash('error')
    });
});

app.post('/login',
        passport.authenticate('local', {
            successReturnToOrRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        })
);

app.get('/admin', ensureLoggedIn('/login'), AdminController.admin);
//module.exports = function(app) {
//    app.get('/hello', ensureLoggedIn('/login'), function (req, res) {
//        res.send('look at me!');
//    });
//}
app.get('/huge', UserController.user);

app.get('/admin/projects', ensureLoggedIn('/login'), AdminController.projects);
app.get('/admin/create-project', ensureLoggedIn('/login'), AdminController.createProject);
app.get('/admin/users', ensureLoggedIn('/login'), AdminController.users);
app.get('/admin/create-project-fix-errors', ensureLoggedIn('/login'), AdminController.createProjectFixErrors);
app.get('/admin/update-project-fix-errors', ensureLoggedIn('/login'), AdminController.updateProjectFixErrors);
app.get('/admin/create-user', ensureLoggedIn('/login'), AdminController.createUser);
app.get('/admin/create-user-fix-errors', ensureLoggedIn('/login'), AdminController.createUserFixErrors);
app.get('/admin/update-user-fix-errors', ensureLoggedIn('/login'), AdminController.updateUserFixErrors);
app.get('/admin/update-project', ensureLoggedIn('/login'), AdminController.updateProject);

app.post('/admin/projects', ensureLoggedIn('/login'), AdminController.addProject);
app.post('/admin/update-project', ensureLoggedIn('/login'), AdminController.updateProject);
app.post('/admin/delete-project', ensureLoggedIn('/login'), AdminController.deleteProject);
app.post('/admin/users', ensureLoggedIn('/login'), AdminController.addUser);
app.post('/admin/update-user', ensureLoggedIn('/login'), AdminController.updateUser);
app.post('/admin/delete-user', ensureLoggedIn('/login'), AdminController.deleteUser);

//app.get('/admin/upload-page', UploadManager.uploadPage);
app.post("/admin/upload-project-photo", ensureLoggedIn('/login'), UploadController.uploadProjectPhoto);
app.post("/admin/delete-project-photo", ensureLoggedIn('/login'), UploadController.deleteProjectPhoto)

port = 3000;
models.sequelize.sync().then(function(){
    app.listen(port, function() {
        console.log('Listening on localhost:3000');
    });
});





