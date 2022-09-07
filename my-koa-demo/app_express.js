var express = require('./app/express.js');
var bodyParser = require('./app/middleware/bodyParser.js');
var cookieParse = require('./app/middleware/cookieParse.js');
var queryParse = require('./app/middleware/query.js');
var resMiddleware = require('./app/middleware/res.js');
var plainEngine = require('./app/lib/plainEngine.js');
var path = require('path');

var app = express();

// bodyParser中间件
app.use(bodyParser);
app.use(queryParse);
app.use(cookieParse);
app.use(resMiddleware);

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 视图目录
app.set('views', './view');
app.set('view engine', 'html');
app.engine('html', plainEngine.__express);

// 路由处理
app.use('/', function (req, res) {
    console.log('middleware route:/');
    res.end('hello world...');
});

app.use('/history', function (req, res) {
    console.log('middleware route:/');
    res.render('history');
});

app.use('/async_module', function(req, res) {
    res.render('async_module')
})

app.use(function (req, res) {
    console.log('middleware route...');
    res.send(404, 'haha Not Found');
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log(`server start on port ${port}...`);
});
