(function() {
    return {
        post: function() {
            var header = Request.getContextHeader();
            var cookie = header.cookie ? header.cookie : '';
            var match = cookie.match(/any-badge-session-\w{16}-\d{13}\b/);
            if (!match) {
                return 'not login';
            }
            var sid = match[0];
            var owner = Cache.aging.get(sid);
            log('logging out, session:', sid, ',', 'owner:', owner);
            Cache.aging.del(sid);
            return 'logged out';
        }
    }
})();