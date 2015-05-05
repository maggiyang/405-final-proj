var models = require('../models');
var Forecast = require('forecast');

module.exports = {
    showFeed: function (req, res) {
        var forecast = new Forecast({
            service: 'forecast.io',
            key: '751e263b2f3c14451fcacca219903ae6',
            units: 'fahrenheit', // Only the first letter is parsed
            cache: true,      // Cache API requests?
            ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
                minutes: 27,
                seconds: 45
            }
        });

        // Showing Weather in Los Angeles
        forecast.get([34.0500, -118.2500], function(err, weather) {
            if(err) return console.dir(err);
            console.dir(weather);

            models.Project.findAll({
                    include:[ models.Photo ]
                }).then(function(projects) {
                    console.dir(projects[0].Photos[0].url);
                    res.render("project-feed", {
                        title: "Project Feed",
                        projects: projects,
                        temp: weather
                    });
                });

        });

    }
}


