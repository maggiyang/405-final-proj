var Sequelize = require('sequelize');

var sequelize = new Sequelize('405_finalproject', 'root', 'root', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: '8889'
});

//sequelize.query('SELECT * FROM users').then(function(result) {
//    console.log('asdfsd');
//    console.log(result);
//});

module.exports = sequelize;
