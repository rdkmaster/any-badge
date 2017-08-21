/*
create table badge(
id int(4) not null primary key auto_increment,
owner int(4) not null,
subject char(64) not null,
subject_color char(32) not null,
status char(64) not null,
status_color char(32) not null,
description text(256));
*/

(function() {

    var _getOwner = require('$svr/utils.js').getOwner;

    function _get(req, s, headers) {
        var owner = _getOwner(req.privateKey);
        if (owner.hasOwnProperty('error')) return owner;

        var sql = 'select subject,subject_color,status,status_color,description from badge where owner=' + owner;
        req.subject = req.subject ? req.subject.trim() : '';
        if (req.subject) {
            sql += ' and subject="' + req.subject + '";';
        }

        log(sql);
        return Data.fetch(sql);
    }

    function _post(req, s, headers) {
        req.subject = req.subject ? req.subject.trim() : '';
        if (!req.subject) {
            return {error:462, detail: 'need a subject property'};
        }

        var owner = _getOwner(req.privateKey);
        if (owner.hasOwnProperty('error')) return owner;

        var r = Data.fetch('select id, subject from badge where owner=' + owner + ' and subject="' + req.subject + '"');
        if (r.data.length > 0) {
            return {error:463, detail: 'subject has already exist'};
        }

        req.subjectColor = req.subjectColor ? req.subjectColor.trim() : 'good';
        req.status = req.status ? req.status.trim() : '--';
        req.statusColor = req.statusColor ? req.statusColor.trim() : '#555';
        req.description = req.description ? req.description.trim() : '';

        var r = Data.update('insert into badge(owner,subject,subject_color,status,status_color,description) values(' +
            owner + ', "' + req.subject + '", "' + req.subjectColor + '", "' + req.status + '", "' + req.statusColor +
            '", "' + req.description + '")');
        if (r.hasOwnProperty('error')) {
            return {error:464, detail: 'create badge error, detail: ' + r.error};
        }
        return {error: 0, detail: 'ok'};
    }

    function _put(req, s, headers) {
        req.subject = req.subject ? req.subject.trim() : '';
        if (!req.subject) return {error:462, detail: 'need a subject property'};

        var owner = _getOwner(req.privateKey);
        if (owner.hasOwnProperty('error')) return owner;

        var r = _get(req, s, headers);
        if (r.hasOwnProperty('error')) return r;
        if (r.data.length == 0) return {error: 465, detail: 'subject[' + req.subject + '] not found'};

        var row = r.data[0];
        req.subjectColor = req.subjectColor ? req.subjectColor.trim() : row[1];
        req.status = req.status ? req.status.trim() : row[2];
        req.statusColor = req.statusColor ? req.statusColor.trim() : row[3];
        req.description = req.description ? req.description.trim() : row[4];
        if (!req.subjectColor && !req.status && !req.statusColor && !req.description) {
            return {error: 466, detail: 'invalid param, unknown what to update'};
        }


        r = Data.update('update badge set status="' + req.status +
            '", status_color="' + req.statusColor +
            '", subject_color="' + req.subjectColor +
            '", description="' + req.description +
            '" where subject="' + req.subject + '" and owner=' + owner + ';');
        return r.hasOwnProperty('error') ?
            {error:467, detail: 'update badge error, detail: ' + r.error} :
            {error: 0, detail: 'ok'};
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