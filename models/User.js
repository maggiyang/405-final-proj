var Sequelize = require('sequelize');
var sequelize = require('./../config/sequelize');

var User = sequelize.define('user', {
    username: {
        field: 'username',
        type: Sequelize.STRING
    },

    password: {
        field: 'password',
        type: Sequelize.STRING
    },

    access: {
        field: 'access',
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});

module.exports = User;