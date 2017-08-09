/*
create table user(
id int(4) not null primary key auto_increment,
name char(64) not null unique,
nick_name char(32) not null,
password char(20) not null,
description text(256));
*/

(function() {
    return {
        post: function(req, s, headers) {
            req.name = req.name ? req.name.trim() : '';
            req.nickName = req.nickName ? req.nickName.trim() : '';
            req.password = req.password ? req.password.trim() : '';
            if (!req.name || !req.nickName || !req.password) {
                return {error:450, detail: 'bad user parameters'};
            }

            Data.useDataSource('mysql_any_badge');
            var r = Data.fetch('select name from user where name="' + req.name + '" or nick_name="' + req.nickName + '"');
            if (r.data.length > 0) {
                return {error:451, detail: 'user has already exist'};
            }

            req.description = req.description ? req.description.trim() : 'This guy is lazy...';
            //Todo: sql injection protect.
            r = Data.update('insert into user (name, nick_name, password, description) values(' +
                '"' + req.name + '", "' + req.nickName + '", "' + req.password + '", "' + req.description + '")');
            if (r.hasOwnProperty('error')) {
                return {error:452, detail: 'create user error, detail: ' + r.error};
            }
            return {error: 0, detail: 'ok'};
        }
    }
})();