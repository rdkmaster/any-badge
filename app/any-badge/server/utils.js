(function() {
    function _checkOwner() {
        var header = Request.getContextHeader();
        var cookie = header.Cookie ? header.Cookie : '';
        
        var match = cookie.match(/any-badge-session-\w{16}-\d{13}\b/);
        if (!match) {
            return {error:460, detail: 'not login or session timed out'};
        }

        var key = match[0];
        var owner = Cache.aging.get(key);
        if (!owner) {
            return {error:461, detail: 'session timed out'};
        }
        log('owner:', owner);
        return owner;
    }
    
    return {
        checkOwner: _checkOwner
    }
})();