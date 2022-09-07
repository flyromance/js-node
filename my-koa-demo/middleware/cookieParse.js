function parseStr(str = '') {
    var cookies = {};
    var arr = str.split('; ') ;
    arr.forEach(function (item, i) {
        cookies[item.split('=')[0]] = item.split('=')[1]
    });
    return cookies;
}

module.exports = function (req, res, next) {
    // 如果没有cookie，返回的是undefined...，必须判断一下
    var cookie = req.headers.cookie;
    req.cookies = parseStr(cookie);
    next()
}