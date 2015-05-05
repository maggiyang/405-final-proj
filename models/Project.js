module.exports = function(sequelize, DataTypes){
    var Project = sequelize.define('Project', {
        title: {
            field: 'title',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyTitle'}
            }
        },

        description: {
            field: 'description',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyDescription'}
            }
        },
        client: {
            field: 'client',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyClient'}
            }
        },
        date: {
            field: 'date',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyDate'}
            }
        },
        category: {
            field: 'category',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyCategory'}
            }
        },
        bgcolor: {
            field: 'bgcolor',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyBgcolor'},
                contains: {args:'#', msg: '#MissingBgcolor'},
                len: {args:[7,7], msg: 'lengthNot7Bgcolor'}
            }
        }
    }, {
        timestamps: false
    }
    //    ,
    //    {
    //    classMethods:{
    //        associate: function(models){
    //            Project.hasMany(models.Photo, {foreignKey: 'project_id'});
    //        }
    //    }
    //}
    );

    return Project;

}


