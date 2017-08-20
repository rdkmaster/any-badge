(function() {
    var utils = require('$svr/utils.js');
    var getOwner = utils.getOwner;
    var randomNumber = utils.randomNumber;
    var lengthInfo = {
        "a": 7, "b": 7, "c": 6, "d": 6, "e": 7, "f": 5, "g": 7, "h": 7, "i": 2, "j": 4, "k": 7, "l": 3,
        "m": 11, "n": 7, "o": 6, "p": 7, "q": 7, "r": 5, "s": 5, "t": 5, "u": 7, "v": 6, "w": 9, "x": 7,
        "y": 6, "z": 6, "A": 8, "B": 7, "C": 8, "D": 8, "E": 7, "F": 7, "G": 8, "H": 8, "I": 5, "J": 5,
        "K": 8, "L": 6, "M": 9, "N": 8, "O": 9, "P": 7, "Q": 8, "R": 8, "S": 7, "T": 7, "U": 8, "V": 8,
        "W": 10, "X": 8, "Y": 7, "Z": 7, "0": 8, "1": 7, "2": 7, "3": 7, "4": 7, "5": 7, "6": 7, "7": 7,
        "8": 7, "9": 7, "-": 5, "_": 8, "`": 5, "~": 10, "!": 3, "@": 12, "#": 9, "$": 7, "%": 12, "^": 8,
        "&": 9, "*": 6, "(": 5, ")": 5, "-": 6, "+": 9, "=": 9, "<": 9, ">": 9, ",": 4, ".": 3, "/": 5,
        "?": 7, ";": 5, ":": 4, "'": 4, '"': 5, "[": 5, "{": 6, "]": 5, "}": 7, "|": 5, ' ': 4
    }

    function getPixelLength(str) {
        var arr = str.split('');
        var len = 12;
        for (var i = 0; i < arr.length; i++) {
            var charLen = lengthInfo[arr[i]];
            len += (charLen ? charLen : 8);
        }
        return len;
    }

    function randomColor() {
        var r = Number(randomNumber(0, 255)).toString(16);
        var g = Number(randomNumber(0, 255)).toString(16);
        var b = Number(randomNumber(0, 255)).toString(16);
        return '#' + r + g + b;
    }

    function escapeString(str) {
        return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    }

    function genSvg(subject, subjectColor, status, statusColor) {
        var color;
        switch(statusColor) {
            case 'bad':
                color = '#D8604B'; break;
            case 'normal':
                color = '#D2AB1F'; break;
            case 'good':
                color = '#4C1'; break;
            default:
                color = statusColor;
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
            '    <rect rx="3" fill="' + subjectColor + '" width="' + (subjectWidth+statusWidth) + '" height="20" class="sWidth"/>' + 
            '    <rect rx="3" fill="' + color + '" width="' + statusWidth + '" x="' + subjectWidth + '" height="20" class="vWidth tMove"/>' + 
            '    <rect fill="' + color + '" x="' + subjectWidth + '" width="13" height="20" class="tMove"/>' + 
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
        headers.put('Pragma', 'no-cache');
        headers.put('Expiheaders', new Date().toString());
        headers.put('Last-Modified', new Date().toString());
        headers.put('Content-Type', 'image/svg+xml');

        req.subject = req.subject ? (req.subject+'').trim() : '';
        if (!req.subject) {
            return genSvg('Error', '#555', 'need a subject', 'bad');
        }

        if (req.privateKey == 'jigsaw-any-badge') {
            switch(req.subject) {
                case 'logo': return genSvg('Jigsaw', randomColor(), 'Any Badge', randomColor());
                case 'new': return genSvg('unknown', '#555', 'unknown', 'bad');
                default: return genSvg('error', '#555', 'unknown subject', 'bad');
            }
        }

        var owner = getOwner(req.privateKey);
        if (owner.hasOwnProperty('error')) {
            return genSvg('Error', '#555', req.privateKey ? 'invalid private key' : 'need a private key', 'bad');
        }

        Data.useDataSource('mysql_any_badge');
        var sql = 'select subject,subject_color,status,status_color from badge where owner=' +
                  owner + ' and subject="' + req.subject + '";';
        var data = Data.fetch(sql);
        if (data.hasOwnProperty('error') || data.data.length == 0) {
            Log.error('subject not found! subject=' + req.subject);
            data.data = [['subject', '#555', 'not found', 'bad']];
        }
        data = data.data[0];

        return genSvg(data[0], data[1], data[2], data[3]);
    }

    return {
        get: _get
    }
})();
