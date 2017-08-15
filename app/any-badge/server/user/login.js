(function() {

    var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var CHARS_LEN = CHARS.length - 1;

    var checkOwner = require('$svr/utils.js').checkOwner;

    function random(min, max, isFloat) {
        var r = Math.random() * 1000000;
        if (isFloat) {
            r = r % (max - min);
        } else {
            r = Math.round(r);
            r = r % (max - min + 1);
        }
        r += min;
        return r;
    }

    function randomString() {
        var s = '';
        for (var i = 0; i < 16; i++) {
            s += CHARS[random(0, CHARS_LEN)];
        }
        return s;
    }

    return {
        get: function(req, s, headers) {
            var owner = checkOwner();
            if (owner.hasOwnProperty('error')) {
                return {error: 454, detail: 'not login'};
            }

            Data.useDataSource('mysql_any_badge');
            var r = Data.fetch('select nick_name from user where id=' + owner);
            if (r.hasOwnProperty('error') || r.data.length == 0) {
                Log.error('internal error, unknown owner = ' + owner);
                return {error: 454, detail: 'not login'};
            }

            return {error: 0, detail: r.data[0][0]};
        },
        post: function(req, s, headers) {
            req.name = req.name ? req.name.trim() : '';
            req.password = req.password ? req.password.trim() : '';
            if (!req.name || !req.password) {
                return {error:450, detail: 'bad parameters'};
            }

            log('user:', req.name, ',', 'pwd:', req.password);
            Data.useDataSource('mysql_any_badge');
            var r = Data.fetch('select id,name from user where name="' + req.name + '" and password="' + req.password + '"');
            if (r.data.length == 0) {
                return {error:453, detail: 'user not exist or bad password'};
            }

            var key = 'any-badge-session-' + randomString() + '-' + (+new Date);
            Cache.aging.put(key, r.data[0][0], req.remember ? 99999999999999 : 30000);

            return {error: 0, detail: key};
        }
    }
})();