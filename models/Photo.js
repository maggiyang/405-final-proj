module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {
        url: {
            field: 'url',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyURL'}
            }
        },

        project_id: {
            field: 'project_id',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyProjectID'}
            }
        }
    }, {
        timestamps: false
    }, {
        classMethods:{
            associate: function(models){
                Photo.belongsTo(models.Project, {foreignKey: 'project_id'});
            }
        }
    });

    return Photo;
}



