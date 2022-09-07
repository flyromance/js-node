var url = require('url');

module.exports = function (req, res, next) {
    if (!req.query) {
        req.query = url.parse(req.url, true)
    }
    
    next()
}