var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var querystring = require("querystring");
var util = require("util");
var ejs = require("ejs");

var settings = {
  baseDir: process.cwd(),
  viewDir: path.resolve(process.cwd(), "views"),
  engine: {
    extname: ".ejs",
  },
};

var middlewares = [];

function express() {
  function app(req, res) {
    var i = 0;

    function next() {
      var item = middlewares[i++];

      if (!item) res.end("no match");

      if (
        item.route === null ||
        item.route == url.parse(req.url, true).pathname
      ) {
        typeof item.handler === "function" &&
          item.handler.apply(null, [req, res, next]);
      } else {
        next();
      }
    }

    next();
  }

  app.use = function (name, handler) {
    if (typeof name == "function") {
      middlewares.push({
        route: null,
        handler: name,
      });
    } else {
      middlewares.push({
        route: name,
        handler: handler,
      });
    }
  };

  app.set = function (type, val) {
    settings[type] = val;

    if (type == "views") {
      settings.viewDir = path.isAbsolute(val)
        ? val
        : path.resolve(process.cwd(), val);
    } else if (type == "view engine") {
      typeof val === "string" &&
        (settings.engine.extname = val.charAt(0) === "." ? val : "." + val);
    }
  };

  app.engine = function (type, handler) {
    if (typeof type === "string" && typeof handler === "function") {
      settings.engine[type] = handler;
    }
  };

  // 渲染引擎
  app.use(function (req, res, next) {
    res.render = function (pagename, data) {
      var filepath = path.resolve(settings.viewDir, pagename);
      var extname = path.extname(pagename).slice(1);
      if (!extname) {
        extname = settings.engine.extname;
        filepath += extname;
      }

      engine = settings.engine[extname.slice(1)];
      engine(filepath, function (data) {
        res.writeHead(200, "ok", {
          "Content-Type": "text/html",
        });
        res.write(data);
        res.end();
      });
    };

    next();
  });

  var server = null;

  app.listen = function (port, cb) {
    server = http.createServer(app);
    port = port || 5566;
    server.listen(port, function () {
      cb.call();
    });
  };

  return app;
}

var extMap = {
  "*": "text/plain",
  html: "text/html",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
};

express.static = function (staticPath) {
  staticPath = path.isAbsolute(staticPath)
    ? staticPath
    : path.resolve(settings.baseDir, staticPath);

  return function (req, res, next) {
    var pathObj = url.parse(req.url, true);
    var pathname = pathObj.pathname;

    // {encoding: 'utf8'}
    fs.readFile(path.join(staticPath, pathname), function (err, data) {
      if (err) {
        next();
      } else {
        var extname = path.extname(pathname) || "*";
        var fileType = extMap[extname.slice(1)];
        res.writeHead(200, "ok", {
          "Content-Type": fileType,
          // 'Content-Length': Buffer.byteLength(data)
        });
        // res.statusCode = 200;
        // res.statusMessage = 'ok';
        // res.setHeader('Content-Type', fileType);
        res.write(data, "binary"); // 默认是'utf8'
        res.end();
      }
    });
  };
};

module.exports = express;
