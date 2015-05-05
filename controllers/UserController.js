var User = require('../models').User;

module.exports = {
    user: function(req, res) {
        res.render('huge',{
            title: 'Huge'
        });
    }
};