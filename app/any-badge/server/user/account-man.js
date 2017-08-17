(function() {
    var checkOwner = require('$svr/utils.js').checkOwner;
    var genPrivateKey = require('$svr/utils.js').genPrivateKey;

    return {
        post: function(req, s, headers) {
            req.password = req.password ? req.password.trim() : '';
            req.newPassword = req.newPassword ? req.newPassword.trim() : '';
            req.description = req.description ? req.description.trim() : '';

            if (!req.password && (req.newPassword || req.changePrivateKey)) {
                return {error:450, detail: 'bad user parameters'};
            }

            var privateKey = genPrivateKey();

            var sql = 'update user set ';
            if (req.newPassword) {
                sql += 'password="' + req.newPassword + '",';
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

            Data.useDataSource('mysql_any_badge');
            if (req.password) {
                var checkUserSql = 'select password from user where id=' + owner +
                                    ' and password="' + req.password + '"';
                var r = Data.fetch(checkUserSql);
                if (r.hasOwnProperty('error') || r.data.length == 0) {
                    return {error: 456, detail: 'authentication failed, password mismatch'};
                }
            }

            var r = Data.update(sql);
            return r.hasOwnProperty('error') ?
                {error: 455, detail: 'unable to change account, detail: ' + r.error} :
                {error: 0, detail: req.changePrivateKey ? privateKey : 'ok'};
        },
        delete: function (req) {
            debug(req);
        }
    }
})();

