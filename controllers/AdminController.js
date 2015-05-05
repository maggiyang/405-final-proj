var Project = require('../models').Project;
var User = require('../models').User;
var Photo = require('../models').Photo;
//var fs = require('fs');

module.exports = {
    admin: function(req, res) {
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
        res.render('create-project', {
            title: 'Create Project',
            pTitle: '',
            pDescription: '',
            pClient: '',
            pDate: '',
            pCategory: '',
            pColor: '',
            errTitle: 0,
            errDescription: false,
            errClient: false,
            errDate: false,
            errCategory: false,
            errColor: 0
        });
    },

    addProject: function(req, res) {

        // Add Project info to database
        if (req.body.submissionType === 'create') {
            console.log("creating");
            createProject(req, res);
        } else {
            console.log("updating");
            updateProject(req, res);
        }
    },

    createProjectFixErrors: function(req, res) {
        res.render('create-project', {
            title: 'Create Project',
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

    updateProject: function(req, res) {
        console.log('----------------> pID in updateProject: %s', req.body.edit);
        var pID = req.body.edit;
        //if it is undefined it means we come from upload picture
        if (typeof pID === 'undefined' || !pID) pID = req.session.pID;
        Project.findAll({
                where:  {id: { like: '%' + pID + '%'}},
                limit: 1
        }).then(function (results) {
            var result = results[0];
            if (result) {
                Photo.findAll({
                    where: {project_id: { like: '%' + pID + '%'}}
                }).then(function(photos) {
                    console.log('--------Photos: %s', photos);
                    res.render('create-project', {
                        title: 'Update Project',
                        pID: result.id,
                        pTitle: result.title,
                        pDescription: result.description,
                        pClient: result.client,
                        pDate: result.date,
                        pCategory: result.category,
                        pColor: result.bgcolor,
                        errTitle: 0,
                        errDescription: false,
                        errClient: false,
                        errDate: false,
                        errCategory: false,
                        errColor: 0,
                        photos: photos
                    });
                });
            } else {
                // TODO: Handle project not found in db error
            }
        });
    },

    updateProjectFixErrors: function(req, res) {
        Photo.findAll({
            where: {project_id: { like: '%' + req.session.pID + '%'}}
        }).then(function(photos) {
            res.render('create-project', {
                title: 'Update Project',
                pID: req.session.pID,
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
                errColor: req.session.errColor,
                photos: photos

            });
        });
    },

    deleteProject:function(req, res) {
        Project.destroy({
            where: {
                id: req.body.delete
            }
        }).then(function (results) {
            res.redirect('/admin/projects');
        });
    },

    users: function(req, res) {
            User.findAll().then(function(results){
                res.render('users', {
                    title: 'Edit Users',
                    users: results
                });
            });
    },

    createUser: function(req, res) {
        res.render('create-user', {
            title: 'Create User',
            pUsername: '',
            pPassword: '',
            pAccess: '',
            errUsername: 0,
            errPassword: false,
            errAccess: false
        });
    },

    addUser: function(req, res) {

        if (req.body.submit === 'create') {
            console.log("creating");
            User.create({
                username: req.body.username,
                password: req.body.password,
                access: req.body.access
            }).then(function (results) {
                User.findAll().then(function (results) {
                    res.render('users', {
                        title: 'Edit Users',
                        users: results
                    });
                });
            }).catch(function (err) {
                console.log(err);
                saveUserSessionData(req);
                handleUserErrorMessages(req, err);

                res.redirect('/admin/create-user-fix-errors');
            });
        } else {
            console.log("updating");

            User.findAll({
                where:  {
                    id: req.body.submit
                },
                limit: 1
            }).then(function (results) {
                console.log(results);
                var result = results[0];
                if (results && result) { // if the record exists in the db
                    result.updateAttributes({
                        username: req.body.username,
                        password: req.body.password,
                        access: req.body.access
                    }).then(function() {
                        User.findAll().then(function (results) {
                            res.render('users', {
                                title: 'Edit Users',
                                users: results
                            });
                        });
                    }).catch(function (err) {
                        req.session.pID = req.body.submit;
                        saveUserSessionData(req);
                        handleUserErrorMessages(req, err);

                        res.redirect('/admin/update-user-fix-errors');
                    });
                } else {
                    // TODO: Handle project not found in db error
                }

            });

        }
    },

    createUserFixErrors: function(req, res) {
        console.log('createUserFixErrors');
        res.render('create-user', {
            title: 'Create User',
            pUsername: req.session.username,
            pPassword: req.session.password,
            pAccess: req.session.access,
            errUsername: req.session.errUsername,
            errPassword: req.session.errPassword,
            errAccess: req.session.errAccess
        });
    },

    updateUser: function(req, res) {
        User.findAll({
            where:  {id: { like: '%' + req.body.edit + '%'}},
            limit: 1
        }).then(function (results) {
            var result = results[0];
            if (result) {
                res.render('create-user', {
                    title: 'Update User',
                    pID: result.id,
                    pUsername: result.username,
                    pPassword: result.password,
                    pAccess: result.access,
                    errUsername: 0,
                    errPassword: false,
                    errAccess: false
                });
            } else {
                // TODO: Handle user not found in db error
            }
        });
    },

    updateUserFixErrors: function(req, res) {
        res.render('create-user', {
            title: 'Update User',
            pID: req.session.pID,
            pUsername: req.session.username,
            pPassword: req.session.password,
            pAccess: req.session.access,
            errUsername: req.session.errUsername,
            errPassword: req.session.errPassword,
            errAccess: req.session.errAccess
        });
    },

    deleteUser:function(req, res) {
        User.destroy({
            where: {
                id: req.body.delete
            }
        }).then(function (results) {
            res.redirect('/admin/users');
        });
    }
};

/**
 * This Function saves the create-project form variables to the session so we can access them again when repopulating.
 * The function also sets all the error messages to false
 * @param req
 */
function saveProjectSessionData(req)
{
    // Save form data to session
    req.session.title = req.body.title;
    req.session.description = req.body.description;
    req.session.client = req.body.client;
    req.session.date = req.body.date;
    req.session.category = req.body.category;
    req.session.color = req.body.color;
    // Hide all error messages
    req.session.errTitle = 0;
    req.session.errDescription = false;
    req.session.errClient = false;
    req.session.errDate = false;
    req.session.errCategory = false;
    req.session.errColor = 0;
}

/**
 * This function loops through all the Create Project error messages and sets form error messages to show in the form
 * when repopulating
 * @param req
 * @param err
 */
function handleProjectErrorMessages(req, err)
{
    for (var i = 0; i < err.errors.length; i++) {
        switch(err.errors[i].message) {
            case 'emptyTitle':
                req.session.errTitle = 1;
                break;
            case 'title must be unique':
                req.session.errTitle = 2;
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

/**
 * This Function saves the create-user form variables to the session so we can access them again when repopulating.
 * The function also sets all the error messages to false
 * @param req
 */
function saveUserSessionData(req)
{
    // Save form data to session
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    req.session.access = req.body.access;
    // Hide all error messages
    req.session.errUsername = 0;
    req.session.errPassword = false;
    req.session.errAccess = false;
}

/**
 * This function loops through all the Create User error messages and sets form error messages to show in the form when
 * repopulating
 * @param req
 * @param err
 */
function handleUserErrorMessages(req, err)
{
    for (var i = 0; i < err.errors.length; i++) {
        switch(err.errors[i].message) {
            case 'emptyUsername':
                req.session.errUsername = 1;
                break;
            case 'username must be unique':
                req.session.errUsername = 2;
                break;
            case 'emptyPassword':
                req.session.errPassword = true;
                break;
            case 'emptyAccess':
                req.session.errAccess = true;
                break;
            default:
                break;
        }
    }
}

/**
 * This function handles the creation of a new project
 * @param req
 * @param res
 */
function createProject(req, res)
{
    Project.create({
        title: req.body.title,
        description: req.body.description,
        client: req.body.client,
        date: req.body.date,
        category: req.body.category,
        bgcolor: req.body.color
    }).then(function (results) {
        if (req.body.submit === 'createAndDone') {
            Project.findAll().then(function (results) {
                res.render('projects', {
                    title: 'Edit Projects',
                    projects: results
                });
            });
        } else {
            Project.findAll({
                where: {
                    title: req.body.title,
                    description: req.body.description,
                    client: req.body.client,
                    date: req.body.date,
                    category: req.body.category,
                    bgcolor: req.body.color
                },
                limit: 1
            }).then(function(results) {
                req.session.pID = results[0].id;
                res.redirect('/admin/update-project');
            });
        }
    }).catch(function (err) {
        console.log(err);
        saveProjectSessionData(req);
        handleProjectErrorMessages(req, err);

        res.redirect('/admin/create-project-fix-errors');
    });
}

/**
 * This method updates an existing project in the database
 * @param req
 * @param res
 */
function updateProject(req, res)
{
    Project.findAll({
        where:  {
            id: req.body.submissionType
        },
        limit: 1
    }).then(function (results) {
        console.log(results);
        var result = results[0];
        if (results && result) { // if the record exists in the db
            result.updateAttributes({
                title: req.body.title,
                description: req.body.description,
                client: req.body.client,
                date: req.body.date,
                category: req.body.category,
                bgcolor: req.body.color
            }).then(function() {
                if (req.body.submit === 'createAndDone') {
                    Project.findAll().then(function (results) {
                        res.render('projects', {
                            title: 'Edit Projects',
                            projects: results
                        });
                    });
                } else {
                    req.session.pID = req.body.submissionType;
                    res.redirect('/admin/update-project');
                }
            }).catch(function (err) {
                req.session.pID = req.body.submissionType;
                saveProjectSessionData(req);
                handleProjectErrorMessages(req, err);

                res.redirect('/admin/update-project-fix-errors');
            });
        } else {
            // TODO: Handle project not found in db error
        }
    });
}



