var User = require('../models/User');

module.exports = {
    user: function(req, res) {
        User.find({
            where: {
                username: 'david',
                password: 'laravel'
            }
        });

        res.render('admin',{
            title: 'Admin'
        });
    }
};