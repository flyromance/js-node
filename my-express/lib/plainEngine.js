var path = require('path');
var fs = require('fs');

exports.__express = function (filepath, cb) {
    fs.readFile(filepath, {encoding: 'utf8'}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            cb.call(null, data);
        }
    });
};