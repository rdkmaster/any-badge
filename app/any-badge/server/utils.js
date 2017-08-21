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

    function _getOwner(privateKey) {
        var owner = _checkOwner();
        if (!owner.hasOwnProperty('error')) {
            return owner;
        }
        if (!privateKey) {
            // error
            return owner;
        }

        owner = Cache.get(privateKey);
        if (owner) {
            return owner;
        }
        
        var r = Data.fetch('select id from user where private_key="' + privateKey + '"');
        if (r.hasOwnProperty('error') || r.data.length == 0) {
            Log.error('unable to get id from privateKey[' + privateKey + '], detail: ' + r);
            return {error: 469, detail: 'invalid private key'};
        }
        owner = r.data[0][0];
        Cache.put(privateKey, owner);
        return owner;
    }
    
    return {
        checkOwner: _checkOwner,
        randomString: _randomString,
        randomNumber: _random,
        genPrivateKey: _genPrivateKey,
        getOwner: _getOwner
    }
})();