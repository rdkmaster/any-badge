/*
create table user(
id int(4) not null primary key auto_increment,
name char(64) not null unique,
nick_name char(32) not null,
password char(20) not null,
private_key char(35) not null,
description text(256));
*/
(function() {
    var checkOwner = require('$svr/utils.js').checkOwner;
    var genPrivateKey = require('$svr/utils.js').genPrivateKey;

    return {
        post: function(req, s, headers) {
            req.name = req.name ? req.name.trim() : '';
            req.nickName = req.nickName ? req.nickName.trim() : '';
            req.password = req.password ? req.password.trim() : '';
            if (!req.name || !req.nickName || !req.password) {
                return {error:450, detail: 'bad user parameters'};
            }

            var r = Data.fetch('select name from user where name="' + req.name + '" or nick_name="' + req.nickName + '"');
            if (r.data.length > 0) {
                return {error:451, detail: 'user has already exist'};
            }

            req.description = req.description ? req.description.trim() : 'This guy is lazy...';
            var privateKey = genPrivateKey();

            //Todo: sql injection protect.
            r = Data.update('insert into user (name, nick_name, password, private_key, description) values(' +
                '"' + req.name + '", "' + req.nickName + '", "' + req.password + '", "' + privateKey +
                '", "' + req.description + '")');
            if (r.hasOwnProperty('error')) {
                return {error:452, detail: 'create user error, detail: ' + r.error};
            }
            return {error: 0, detail: 'ok'};
        },
        put: function(req, s, headers) {
            req.password = req.password ? req.password.trim() : '';
            req.newPassword = req.newPassword ? req.newPassword.trim() : '';
            req.nickName = req.nickName ? req.nickName.trim() : '';
            req.description = req.description ? req.description.trim() : '';

            if (!req.password && (req.newPassword || req.changePrivateKey)) {
                return {error:450, detail: 'bad user parameters'};
            }

            var privateKey = genPrivateKey();

            var sql = 'update user set ';
            if (req.newPassword) {
                sql += 'password="' + req.newPassword + '",';
            }
            if (req.nickName) {
                sql += 'nick_name="' + req.nickName + '",';
            }
            if (req.description) {
                sql += 'description="' + req.description + '",';
            }
            if (req.changePrivateKey) {
                sql += 'private_key="' + privateKey + '",';
            }
            sql = sql.substring(0, sql.length - 1);
            if (sql.indexOf('=') == -1) {
                return {error: 457, detail: 'bad user parameters, no field to change.'};
            }

            var owner = checkOwner();
            if (owner.hasOwnProperty('error')) {
                return {error: 454, detail: 'not login'};
            }
            sql += ' where id=' + owner;

            if (req.password) {
                var checkUserSql = 'select password from user where id=' + owner +
                                    ' and password="' + req.password + '"';
                var r = Data.fetch(checkUserSql);
                if (r.hasOwnProperty('error') || r.data.length == 0) {
                    return {error: 456, detail: 'authentication failed, password mismatch'};
                }
            }

            var r = Data.update(sql);
            if (!r.hasOwnProperty('error') && req.changePrivateKey) {
                Cache.del(req.changePrivateKey);
                Cache.put(privateKey, owner);
            }
            return r.hasOwnProperty('error') ?
                {error: 455, detail: 'unable to change account, detail: ' + r.error} :
                {error: 0, detail: req.changePrivateKey ? privateKey : 'ok'};
        },
        delete: function (req) {
            req.password = req.password ? req.password.trim() : '';
            if (!req.password) {
                return {error:450, detail: 'bad user parameters'};
            }
            var owner = checkOwner();
            if (owner.hasOwnProperty('error')) {
                return {error: 454, detail: 'not login'};
            }

            var r = Data.update('delete from user where id=' + owner + ' and password="' + req.password + '";');
            if (r.hasOwnProperty('error')) {
                return {error: 457, detail: r.detail};
            }
            if (r == 0) {
                return {error: 456, detail: 'authentication failed, password mismatch'};
            }

            var r = Data.update('delete from badge where owner=' + owner);
            if (r.hasOwnProperty('error')) {
                Log.error('unable to delete badges for owner=' + owner);
                return {error: 458, detail: r.detail};
            } else {
                return {error: 0, detail: 'ok'};
            }
        }
    }
})();

