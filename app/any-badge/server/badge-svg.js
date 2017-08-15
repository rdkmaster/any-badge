(function() {
    var checkOwner = require('$svr/badge.js').checkOwner;
    var lengthInfo = {
        "a": 7, "b": 7, "c": 6, "d": 6, "e": 7, "f": 5, "g": 7, "h": 7, "i": 2, "j": 4, "k": 7, "l": 3,
        "m": 11, "n": 7, "o": 6, "p": 7, "q": 7, "r": 4, "s": 5, "t": 5, "u": 7, "v": 6, "w": 9, "x": 7,
        "y": 6, "z": 6, "A": 8, "B": 7, "C": 8, "D": 8, "E": 7, "F": 7, "G": 8, "H": 8, "I": 5, "J": 5,
        "K": 8, "L": 6, "M": 9, "N": 8, "O": 9, "P": 7, "Q": 8, "R": 8, "S": 7, "T": 7, "U": 8, "V": 8,
        "W": 10, "X": 8, "Y": 7, "Z": 7, "0": 8, "1": 7, "2": 7, "3": 7, "4": 7, "5": 7, "6": 7, "7": 7,
        "8": 7, "9": 7, "-": 5, "_": 8, "`": 5, "~": 10, "!": 3, "@": 12, "#": 9, "$": 7, "%": 12, "^": 8,
        "&": 9, "*": 6, "(": 5, ")": 5, "-": 6, "+": 9, "=": 9, "<": 9, ">": 9, ",": 4, ".": 3, "/": 5,
        "?": 7, ";": 5, ":": 4, "'": 4, '"': 5, "[": 5, "{": 6, "]": 5, "}": 7, "|": 5, ' ': 4
    }

    function getPixelLength(str) {
        var arr = str.split('');
        var len = 10;
        for (var i = 0; i < arr.length; i++) {
            var charLen = lengthInfo[arr[i]];
            len += (charLen ? charLen : 8);
        }
        return len;
    }

    function escapeString(str) {
        return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    }

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

        var subjectWidth = getPixelLength(subject);
        var statusWidth = getPixelLength(status);
        subject = escapeString(subject);
        status = escapeString(status);
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

        req.subject = req.subject ? (req.subject+'').trim() : '';
        if (!req.subject) {
            return {error:469, detail: 'need "subject" parameter.'};
        }

        Data.useDataSource('mysql_any_badge');
        var sql = 'select subject, status, color from badge where owner=' +
            owner + ' and subject="' + req.subject + '";';
        var data = Data.fetch(sql);
        if (data.hasOwnProperty('error') || data.data.length == 0) {
            Log.error('subject not found! subject=' + subject);
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