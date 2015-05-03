var Project = require('../models/Project');

module.exports = {
    admin: function(req, res) {
        console.log(req.query.title);
        //console.log(req.query.award);

        res.redirect('/admin/projects');
    },

    projects: function(req, res) {
        Project.findAll().then(function(results){
            res.render('projects', {
                title: 'Edit Projects',
                projects: results
            });
        });

    },

    createProject: function(req, res) {
        console.log('pTitle: %s', req.session.title);

        res.render('create-project', {
            title: 'Create Project',
            pTitle: '',
            pDescription: '',
            pClient: '',
            pDate: '',
            pCategory: '',
            pColor: '',
            errTitle: false,
            errDescription: false,
            errClient: false,
            errDate: false,
            errCategory: false,
            errColor: 0

        });
    },

    addProject: function(req, res){
            Project.create({
                title: req.body.title,
                description: req.body.description,
                client: req.body.client,
                date: req.body.date,
                category: req.body.category,
                bgcolor: req.body.color
            }).then(function(results){
                Project.findAll().then(function(results){
                    res.render('projects', {
                        title: 'Edit Projects',
                        projects: results
                    });
                });
            }).catch(function(err) {
                saveSessionData(req);
                handleErrorMessages(req, err);

                res.redirect('/admin/update-project');
            });


    },

    updateProject: function(req, res) {
        console.log('pTitle: %s', req.body.title);
        res.render('create-project', {
            title: 'Update Project',
            pTitle: req.session.title,
            pDescription: req.session.description,
            pClient: req.session.client,
            pDate: req.session.date,
            pCategory: req.session.category,
            pColor: req.session.color,
            errTitle: req.session.errTitle,
            errDescription: req.session.errDescription,
            errClient: req.session.errClient,
            errDate: req.session.errDate,
            errCategory: req.session.errCategory,
            errColor: req.session.errColor
        });
    },

        users: function(req, res) {
        res.render('users', {
            title: 'Edit Users'
        });
    }
};

/**
 * This Function saves the create-project form variables to the session so we can access them again when repopulating.
 * The function also sets all the error messages to false/0
 * @param req
 */
function saveSessionData(req)
{
    // Save form data to session
    req.session.title = req.body.title;
    console.log('body title: %s', req.body.title);
    console.log('session title: %s', req.session.title);
    req.session.description = req.body.description;
    req.session.client = req.body.client;
    req.session.date = req.body.date;
    req.session.category = req.body.category;
    req.session.color = req.body.color;
    // Hide all error messages
    req.session.errTitle = false;
    req.session.errDescription = false;
    req.session.errClient = false;
    req.session.errDate = false;
    req.session.errCategory = false;
    req.session.errColor = 0;
}

/**
 * This function loops through all the error messages and sets form "errors" to "show" in the form when repopulating
 * @param req
 * @param err
 */
function handleErrorMessages(req, err)
{
    for (var i = 0; i < err.errors.length; i++) {
        switch(err.errors[i].message) {
            case 'emptyTitle':
                req.session.errTitle = true;
                break;
            case 'emptyDescription':
                req.session.errDescription = true;
                break;
            case 'emptyClient':
                req.session.errClient = true;
                break;
            case 'emptyDate':
                req.session.errDate = true;
                break;
            case 'emptyCategory':
                req.session.errCategory = true;
                break;
            case 'emptyColor':
                req.session.errColor = 1;
                break;
            case '#MissingBgcolor':
                // Note: This doesn't usually to show (crunched by length not 7 unless length is 7)
                req.session.errColor = 2;
                break;
            case 'lengthNot7Bgcolor':
                req.session.errColor = 3;
                break;
            default:
                break;
        }
    }
}



