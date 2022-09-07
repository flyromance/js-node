function parseBody(chunk) {
    var ret = {};

    chunk.split('&').forEach(function (item, index) {
        var arr = item.split('=');
        arr[0] && (ret[arr[0]] = arr[1]);
    });
    
    return ret;
}

function bodyParser(req, res, next) {
    var chunk = '';

    req.on('data', function (data) {
        chunk += data;
    }).on('end', function () {
        req.body = parseBody(chunk);
        next();
    });
}

module.exports = bodyParser;