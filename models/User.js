var Sequelize = require('sequelize');
var sequelize = require('./../config/sequelize');

var User = sequelize.define('user', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true
    },

    username: {
        field: 'username',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyUsername'}
        }
    },

    password: {
        field: 'password',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyPassword'}
        }
    },

    access: {
        field: 'access',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyAccess'}
        }
    }
}, {
    timestamps: false
});

module.exports = User;