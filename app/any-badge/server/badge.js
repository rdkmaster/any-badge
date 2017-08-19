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

    var _getOwner = require('$svr/utils.js').getOwner;

    function _get(req, s, headers) {
        var owner = _getOwner(req.privateKey);
        if (owner.hasOwnProperty('error')) return owner;

        Data.useDataSource('mysql_any_badge');
        var sql = 'select subject, status, color, description from badge where owner=' + owner;
        req.subject = req.subject ? req.subject.trim() : '';
        if (req.subject) {
            sql += ' and subject="' + req.subject + '";';
        }

        log(sql);
        var r = Data.fetch(sql);
        for (var i = 0; i < r.data.length; i++) {
            r.data[i][1] = r.data[i][1];
            r.data[i][2] = r.data[i][2];
        }
        return r;
    }

    function _post(req, s, headers) {
        req.subject = req.subject ? req.subject.trim() : '';
        if (!req.subject) {
            return {error:462, detail: 'need a subject property'};
        }

        var owner = _getOwner(req.privateKey);
        if (owner.hasOwnProperty('error')) return owner;

        Data.useDataSource('mysql_any_badge');
        var r = Data.fetch('select id, subject from badge where owner=' + owner + ' and subject="' + req.subject + '"');
        if (r.data.length > 0) {
            return {error:463, detail: 'subject has already exist'};
        }

        req.status = req.status ? req.status.trim() : '--';
        req.color = req.color ? req.color.trim() : 'good';
        req.description = req.description ? req.description.trim() : '';

        var r = Data.update('insert into badge (owner, subject, status, color, description) values(' +
            owner + ', "' + req.subject + '", "' + req.status + '", "' + req.color + '", "' + req.description + '")');
        if (r.hasOwnProperty('error')) {
            return {error:464, detail: 'create badge error, detail: ' + r.error};
        }
        return {error: 0, detail: 'ok'};
    }

    function _put(req, s, headers) {
        var owner = _getOwner(req.privateKey);
        if (owner.hasOwnProperty('error')) return owner;

        var r = _get(req, s, headers);
        if (r.hasOwnProperty('error')) return r;

        if (r.data.length == 0) {
            return {error: 465, detail: 'subject[' + req.subject + '] not found'};
        }

        var row = r.data[0];
        req.status = req.status ? req.status.trim() : row[1];
        req.color = req.color ? req.color.trim() : row[2];
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
        delete: _delete
    }
})();