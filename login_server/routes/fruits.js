var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var moment = require('moment');

router.post('/', function (req, res) {
    var key = req.body.key;
    var db = req.db;
    var username = req.body.username;
    console.log(key);
    console.log(username);
    // Check key
    Users.getExpireTime(db, username, key)
        .then(function (time) {
            console.log(time);
            var validTime = moment(time).isValid();

            if (validTime) {
                var currentTime = moment().format('x');
                var sessionTime = moment(time).format('x');

                console.log(currentTime);
                console.log(sessionTime);

                if (sessionTime >= currentTime) {
                    // Get result
                    var fruits = [
                        {id: 1, name: 'Apple'},
                        {id: 2, name: 'Banana'},
                        {id: 3, name: 'Orange'}
                    ];

                    res.send({ok: true, rows: fruits});
                } else {
                    res.send({ok: false, msg: 'Session expired'});
                }
            } else {
                res.send({ok: false, msg: 'Key expired'});
            }

        }, function (err) {

        });

});


module.exports = router;
