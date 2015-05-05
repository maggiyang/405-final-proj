//var express = require('express');
var util = require("util");
var fs = require("fs");
var Photo = require('../models').Photo;

module.exports = {

    uploadProjectPhoto: function (req, res, next) {
        if (req.files) {
            console.log(util.inspect(req.files));
            if (typeof req.files.myFile === 'undefined' || req.files.myFile.size === 0) {
                return next(/*new Error(*/"Hey, first would you select a file?"/*)*/);
            }
            fs.exists(req.files.myFile.path, function (exists) {
                if (exists) {
                    //res.end("Got your file!");
                    addPhotoToDatabase(req, res);
                } else {
                    res.end("Well, there is no magic for those who don’t believe in it!");
                }
            });
        }
    },

    deleteProjectPhoto: function(req, res, next) {
        Photo.destroy({
            where: {
                url: req.body.photoUrl
            }
        }).then(function (results) {
            var localUrl = 'uploads/' + req.body.photoUrl.split('uploads/')[1];
            fs.unlink(localUrl, function (err) {
                if (err) throw err;
                console.log('successfully deleted %s', localUrl);
                req.session.pID = req.body.pID;
                res.redirect('/admin/update-project');

            });
        });
    }
}

/**
 * This function adds the uploaded photo data to the database.
 * This method is called after the photo is correctly uploaded
 * @param req
 */
function addPhotoToDatabase(req, res)
{
    var photoUrl = req.protocol + '://' + req.host + ( port == 80 || port == 443 ? '' : ':'+ port ) + '/' + req.files.myFile.path;
    Photo.create({
                url: photoUrl,
                project_id: req.body.pID
            }).then(function(results){
                console.log(results);
                req.session.pID = req.body.pID;
                res.redirect('/admin/update-project');
            });
}