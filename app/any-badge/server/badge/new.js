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
    return {
        post: function(req, s, headers) {
            var header = Request.getContextHeader();
            var cookie = header.cookie ? header.cookie : '';
            var match = cookie.match(/any-badge-session-\w{16}-\d{13}\b/);
            if (!match) {
                Request.completeWithError(460, '460: not login or session timed out');
            }

            var key = match[0];
            var owner = Cache.aging.get(key);
            if (!owner) {
                Request.completeWithError(461, '461: session timed out');
            }

            req.subject = req.subject ? req.subject.trim() : '';
            if (!req.subject) {
                Request.completeWithError(462, '462: need a subject property.');
            }

            Data.useDataSource('mysql_any_badge');
            log('owner:', owner, ',', 'subject:', req.subject);
            var r = Data.fetch('select id, subject from badge where owner=' + owner + ' and subject="' + req.subject + '"');
            if (r.data.length > 0) {
                Request.completeWithError(463, '463: subject has already exist!');
            }

            req.status = req.status ? req.status.trim() : '--';
            req.color = req.color ? req.color.trim() : 'good';
            req.description = req.description ? req.description.trim() : '';

            var r = Data.update('insert into badge (owner, subject, status, color, description) values(' +
                owner + ', "' + req.subject + '", "' + req.status + '", "' + req.color + '", "' + req.description + '")');
            if (r.hasOwnProperty('error')) {
                Request.completeWithError(464, '464: create badge error, detail: ' + r.error);
            }
            return 'ok';
        }
    }
})();