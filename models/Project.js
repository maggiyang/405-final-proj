var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var User = require('./User');

var Project = sequelize.define('project', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true
    },

    title: {
        field: 'title',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyTitle'}
        }
    },

    description: {
        field: 'description',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyDescription'}
        }
    },
    client: {
        field: 'client',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyClient'}
        }
    },
    date: {
        field: 'date',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyDate'}
        }
    },
    category: {
        field: 'category',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyCategory'}
        }
    },
    bgcolor: {
        field: 'bgcolor',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyBgcolor'},
            contains: {args:'#', msg: '#MissingBgcolor'},
            len: {args:[7,7], msg: 'lengthNot7Bgcolor'}
        }
    }
}, {
    timestamps: false
});

//Project.hasMany(User, {as: 'Users'});

module.exports = Project;