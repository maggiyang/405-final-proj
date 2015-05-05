module.exports = function(sequelize, DataTypes){
    var User = sequelize.define('User', {
        username: {
            field: 'username',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyUsername'}
            }
        },

        password: {
            field: 'password',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyPassword'}
            }
        },

        access: {
            field: 'access',
            type: DataTypes.STRING,
            validate:{
                notEmpty: {args:true, msg: 'emptyAccess'}
            }
        }
    }, {
        timestamps: false
    });

    return User;
}

