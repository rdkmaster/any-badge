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

    function _genPrivateKey() {
        return _randomString(8) + '-' + _randomString(8) + '-' + _randomString(8) + '-' + _randomString(8);
    }

    var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var CHARS_LEN = CHARS.length - 1;

    function _random(min, max, isFloat) {
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

    function _randomString(length) {
        var s = '';
        for (var i = 0; i < length; i++) {
            s += CHARS[_random(0, CHARS_LEN)];
        }
        return s;
    }
    
    return {
        checkOwner: _checkOwner,
        randomString: _randomString,
        genPrivateKey: _genPrivateKey
    }
})();