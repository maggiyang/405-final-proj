var Sequelize = require('sequelize');
var sequelize = require('./../config/sequelize');

var Photo = sequelize.define('photo', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true
    },

    url: {
        field: 'url',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyURL'}
        }
    },

    project_id: {
        field: 'project_id',
        type: Sequelize.STRING,
        validate:{
            notEmpty: {args:true, msg: 'emptyProjectID'}
        }
    }
}, {
    timestamps: false
});

module.exports = Photo;