var express = require('express');
var router = express.Router();
var Users = require('../models/users');

var crypt = require('crypto');
var moment = require('moment');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Please login'});
});

router.post('/login', function (req, res) {
    var db = req.db;
    var username = req.body.username;
    var password = crypt.createHash('md5')
        .update(req.body.password)
        .digest('hex');
    var expireTime = moment().add(1, 'h').format('YYYY-MM-DD HH:mm:ss'); // 1 hour
    var sessionKey = req.sessionID;

    Users.auth(db, username, password)
        .then(function (rows) {
            if (rows.length > 0) {

                Users.updateKey(db, username, sessionKey, expireTime)
                    .then(function () {
                        req.session.logged = true;
                        req.session.username = rows[0].username;
                        res.send({ok: true, username: username, session_key: sessionKey});
                    }, function (err) {
                        res.send({ok: false, msg: err});
                    });

            } else {
                res.send({ok: false, msg: 'Login failed'});
            }
        })
        .catch(function (err) {
            console.log(err);
            res.send({ok: false, msg: err});
        })
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/users/login');
});

router.post('/logout', function (req, res) {
    var db = req.db;
    var username = req.body.username;
    var currentTime = moment().format('x');
    console.log('Log out');
    console.log(username);
    console.log(currentTime);

    Users.setExpireKey(db, username, currentTime)
        .then(function () {
            req.session.destroy();
            res.send({ok: true});
        }, function (err) {
            res.send({ok: false, msg: err});
        });
});

module.exports = router;
