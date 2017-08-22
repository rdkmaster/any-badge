#!/usr/bin/env node

// var http = require('http');

// var coverage = 0;
// var url = 'http://rdk.zte.com.cn/rdk/service/app/any-badge/server/svg?subject=logo&privateKey=jigsaw-any-badge';
// http.get(url, res => res.on('data', onSuccess)).on('error', onError);

// function onSuccess(data) {
//     console.log(data.toString());
// }

// function onError(err) {
//     console.error(err);
// }


var http = require('http');
function doPost(){
    var opt = {
        host:'localhost', //注意:不用协议部分(http://)
        port:'80',
        path: '/testonly/doupload.php', //斜杠开头
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} //设置content-type 头部
    };

    var body = '';
    var req = http.request(opt, function(res){
        res.statusCode == 200 && console.log('REQUEST OK..' );
        res.setEncoding('utf8');//res为ClientResponse的实例，是readableStream, 设置字符编码

        res.on('data', function(chunk){
            body += chunk;
        }).on('end', function(){
            console.log('Got data: ', body);//end事件中 打印全部响应数据
        });
    }).on('error', function(err){
        console.log('error: ', err.message);
    });

    var data = {name:'sindy', age:22};
    var data1 = JSON.stringify(data);
    var data2 = queryString.stringify(data); //注意 querystring.stringify 和 JSON.stringify的区别
    console.log(data1);
    console.log(data2);

    req.write(data2); //req为ClientRequest的实例，是writableStream，写数据到流中
    req.end();//结束请求
}

function _create(args) {
    console.log(args);
}

function _update(args) {

}

function _delete(args) {

}

(function(args) {
    switch(args[0]) {
        case 'create':
            _create(args.slice(1));
            break;

        case 'update':
            _update(args.slice(1));

        case 'delete':
            _delete(args.slice(1));

        case '-v':
        case '--version':
        case 'version':
            console.log('version is 1.0.0');
            break;

        case '-h':
        case '--help':
        case 'help':
        default:
            console.log('Usage:');
            console.log('  create <subject> <provate-key> [subject-color = "#555"] [status = "unknown"] [status-color = "bad"] [description = "an awesome badge"]');
            console.log('  update <subject> <provate-key> [subject-color = "#555"] [status = "unknown"] [status-color = "bad"] [description = "an awesome badge"]');
            console.log('  delete <subject> <provate-key>');
            console.log('  version');
            console.log('  help');

    }
})(process.argv.slice(2));

