var util = require('util');

module.exports = function (req, res, next) {
    res.send = function (val) {
        if (util.isString(val)) {
            res.end(val);
        }

        if (util.isNumber(val)) {
            res.writeHead(val, arguments[1]);
            res.end();
        }

        if (util.isObject(val)) {
            res.end(JSON.stringify(val));
        }
    };

    res.json = function (obj) {
        if (util.isObject(val)) {
            res.end(JSON.stringify(val));
        }
    };

    next();
}