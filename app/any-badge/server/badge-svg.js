(function() {
    var checkOwner = require('$svr/badge.js').checkOwner;

    function genSvg(subject, status, level) {
        var countColor;
        switch(level) {
            case 'bad':
                countColor = '#D8604B'; break;
            case 'normal':
                countColor = '#D2AB1F'; break;
            case 'good':
                countColor = '#4C1'; break;
            default:
                countColor = level;
        }

        var subjectWidth = 100;
        var statusWidth = 60;
        return '' +
            '<svg contentScriptType="text/ecmascript" width="' + (subjectWidth+statusWidth) + '"' + 
            '     xmlns:xlink="http://www.w3.org/1999/xlink" zoomAndPan="magnify"' + 
            '     contentStyleType="text/css" height="20" preserveAspectRatio="xMidYMid meet"' + 
            '     xmlns="http://www.w3.org/2000/svg" version="1.0">' + 
            '    <linearGradient xmlns:xlink="http://www.w3.org/1999/xlink" x2="0" y2="100%"' + 
            '                    xlink:type="simple" xlink:actuate="onLoad" id="a" xlink:show="other">' + 
            '        <stop stop-opacity=".1" stop-color="#bbb" offset="0"/>' + 
            '        <stop stop-opacity=".1" offset="1"/>' + 
            '    </linearGradient>' + 
            '' + 
            '    <rect rx="3" fill="url(#a)" width="' + (subjectWidth+statusWidth) + '" height="20" class="sWidth"/>' + 
            '    <rect rx="3" fill="#555" width="' + (subjectWidth+statusWidth) + '" height="20" class="sWidth"/>' + 
            '    <rect rx="3" fill="' + countColor + '" width="' + statusWidth + '" x="' + subjectWidth + '" height="20" class="vWidth tMove"/>' + 
            '    <rect fill="' + countColor + '" x="' + subjectWidth + '" width="13" height="20" class="tMove"/>' + 
            '' + 
            '    <g font-size="11" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" fill="#fff">' + 
            '        <text x="6" fill="#010101" fill-opacity=".3" y="15">' + subject + '</text>' + 
            '        <text x="6" id="tText" y="14">' + subject + '</text>' + 
            '        <text fill="#010101" x="' + (subjectWidth+5) + '" fill-opacity=".3" y="15" class="tMove">' + status + '</text>' + 
            '        <text x="' + (subjectWidth+5) + '" id="vText" y="14" class="tMove">' + status + '</text>' + 
            '    </g>' +
            '</svg>'
    }

    function _get(req, s, headers) {
        var owner = checkOwner();
        if (owner.hasOwnProperty('error')) return owner;

        req.subject = req.subject ? req.subject.trim() : '';
        if (!req.subject) {
            return {error:469, detail: 'need "subject" parameter.'};
        }

        Data.useDataSource('mysql_any_badge');
        var sql = 'select subject, status, color from badge where owner=' +
            owner + ' and subject="' + req.subject + '";';
        var data = Data.fetch(sql);
        if (data.hasOwnProperty('error') || data.data.length == 0) {
            Logger.error('subject not found! subject=' + subject);
            data.data = [['unknown subject', 'unknown status', 'red']];
        }
        data = data.data[0];

        headers.put('Pragma', 'no-cache');
        headers.put('Expiheaders', new Date().toString());
        headers.put('Last-Modified', new Date().toString());
        headers.put('Content-Type', 'image/svg+xml');

        return genSvg(data[0], data[1], data[2]);
    }

    return {
        get: _get
    }
})();