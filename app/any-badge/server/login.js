(function() {

    var randomString = require('$svr/utils.js').randomString;
    var checkOwner = require('$svr/utils.js').checkOwner;

    return {
        get: function(req, s, headers) {
            var owner = checkOwner();
            if (owner.hasOwnProperty('error')) {
                return {error: 454, detail: 'not login'};
            }

            Data.useDataSource('mysql_any_badge');
            var r = Data.fetch('select nick_name,private_key,description from user where id=' + owner);
            if (r.hasOwnProperty('error') || r.data.length == 0) {
                Log.error('internal error, unknown owner = ' + owner);
                return {error: 454, detail: 'not login'};
            }

            return  {
                        error: 0, detail: {
                            nickName: r.data[0][0],
                            privateKey: r.data[0][1],
                            description: r.data[0][2]
                        }
                    };
        },
        post: function(req, s, headers) {
            req.name = req.name ? req.name.trim() : '';
            req.password = req.password ? req.password.trim() : '';
            if (!req.name || !req.password) {
                return {error:450, detail: 'bad parameters'};
            }

            log('user:', req.name, ',', 'pwd:', req.password);
            Data.useDataSource('mysql_any_badge');
            var r = Data.fetch('select nick_name,private_key,description,id from user where name="' +
                req.name + '" and password="' + req.password + '"');
            if (r.data.length == 0) {
                return {error:453, detail: 'user not exist or bad password'};
            }

            var session = 'any-badge-session-' + randomString(16) + '-' + (+new Date);
            Cache.aging.put(session, r.data[0][3], req.remember ? 99999999999999 : 30000);

            return  {
                        error: 0,
                        detail: {
                            session: session,
                            nickName: r.data[0][0],
                            privateKey: r.data[0][1],
                            description: r.data[0][2]
                        }
                    };
        }
    }
})();