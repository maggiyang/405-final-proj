var Project = require('../models/Project');
module.exports = {
    showFeed: function (req, res) {
        Project.findAll().then(function(projects) {
            console.log('Users: %s', projects.Users);
            res.render("project-feed", {
                title: "Project Feed",
                projects: projects
            });
        });
    }
}
