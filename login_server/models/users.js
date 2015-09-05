
var Q = require('q');

exports.auth = function (db, username, password) {

    var q = Q.defer();

    db('users')
        .select('*')
        .where('username', username)
        .where('password', password)
        .then(function (rows) {
            q.resolve(rows);
        })
        .catch(function (err) {
            q.reject(err);
        });

    return q.promise;
};

exports.updateKey = function (db, username, key, expire_time) {

    var q = Q.defer();

    db('users')
        .update({
            session_key: key,
            expire_time: expire_time
        })
        .where('username', username)
        .then(function () {
            q.resolve();
        })
        .catch(function (err) {
            q.reject(err);
        });

    return q.promise;
};

exports.setExpireKey = function (db, username, expire_time) {

    var q = Q.defer();

    db('users')
        .update({
            expire_time: expire_time
        })
        .where('username', username)
        .then(function () {
            q.resolve();
        })
        .catch(function (err) {
            q.reject(err);
        });

    return q.promise;
};

exports.getExpireTime = function (db, username) {

    var q = Q.defer();

    db('users')
        .select('*')
        .where('username', username)
        .then(function (rows) {
            q.resolve(rows[0].expire_time);
        })
        .catch(function (err) {
            q.reject(err);
        });

    return q.promise;
};