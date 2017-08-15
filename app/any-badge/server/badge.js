/*
create table badge(
id int(4) not null primary key auto_increment,
owner int(4) not null,
subject char(64) not null,
status char(64) not null,
color char(32) not null,
description text(256));
*/

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

    function _escapeString(str) {
        return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    }

    function _deescapeString(str) {
        return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
                  .replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
    }

    function _get(req, s, headers) {
        var owner = _checkOwner();
        if (owner.hasOwnProperty('error')) return owner;

        Data.useDataSource('mysql_any_badge');
        var sql = 'select subject, status, color, description from badge where owner=' + owner;
        req.subject = req.subject ? req.subject.trim() : '';
        if (req.subject) {
            sql += ' and subject="' + req.subject + '";';
        }

        var r = Data.fetch(sql);
        for (var i = 0; i < r.data.length; i++) {
            r.data[i][1] = _deescapeString(r.data[i][1]);
            r.data[i][2] = _deescapeString(r.data[i][2]);
        }
        return r;
    }

    function _post(req, s, headers) {
        req.subject = req.subject ? req.subject.trim() : '';
        if (!req.subject) {
            return {error:462, detail: 'need a subject property'};
        }

        var owner = _checkOwner();
        if (owner.hasOwnProperty('error')) return owner;

        Data.useDataSource('mysql_any_badge');
        var r = Data.fetch('select id, subject from badge where owner=' + owner + ' and subject="' + req.subject + '"');
        if (r.data.length > 0) {
            return {error:463, detail: 'subject has already exist'};
        }

        req.status = _escapeString(req.status ? req.status.trim() : '--');
        req.color = _escapeString(req.color ? req.color.trim() : 'good');
        req.description = req.description ? req.description.trim() : '';

        var r = Data.update('insert into badge (owner, subject, status, color, description) values(' +
            owner + ', "' + req.subject + '", "' + req.status + '", "' + req.color + '", "' + req.description + '")');
        if (r.hasOwnProperty('error')) {
            return {error:464, detail: 'create badge error, detail: ' + r.error};
        }
        return {error: 0, detail: 'ok'};
    }

    function _put(req, s, headers) {
        var owner = _checkOwner();
        if (owner.hasOwnProperty('error')) return owner;

        var r = _get(req, s, headers);
        if (r.hasOwnProperty('error')) return r;

        if (r.data.length == 0) {
            return {error: 465, detail: 'subject[' + req.subject + '] not found'};
        }

        var row = r.data[0];
        req.status = _escapeString(req.status ? req.status.trim() : row[1]);
        req.color = _escapeString(req.color ? req.color.trim() : row[2]);
        req.description = req.description ? req.description.trim() : row[3];
        if (!req.status && !req.color && !req.description) {
            return {error: 466, detail: 'invalid param, unknown what to update'};
        }

        Data.useDataSource('mysql_any_badge');

        r = Data.update('update badge set status="' + req.status + '", color="' + req.color +'", description="' +
            req.description + '" where subject="' + req.subject + '" and owner=' + owner + ';');
        if (r.hasOwnProperty('error')) {
            return {error:467, detail: 'update badge error, detail: ' + r.error};
        }
        return {error: 0, detail: 'ok'};
    }

    function _delete(req, s, headers) {
        log(req);
        req.subject = req.subject ? req.subject.trim() : '';
        if (!req.subject) {
            return {error:462, detail: 'need a subject property'};
        }

        var r = _get(req, s, headers);
        if (r.hasOwnProperty('error')) return r;
        if (r.data.length == 0) {
            return {error: 465, detail: 'subject[' + req.subject + '] not found'}
        }

        Data.useDataSource('mysql_any_badge');
        var r = Data.update('delete from badge where subject="' + req.subject.trim() + '"');
        if (r.hasOwnProperty('error')) {
            return {error:468, detail: 'delete badge error, detail: ' + r.error};
        }
        return {error: 0, detail: 'ok'};
    }

    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete,
        checkOwner: _checkOwner
    }
})();