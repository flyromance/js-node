var myconnect = require('./app/connect.js');
var plainEngine = require('./app/lib/plainEngine.js');

var app = myconnect();

// 中间件
app.use(function (req, res, next) {
    console.log('logger');
    next();
});

app.set('views', './view'); // 视图引擎：内部也是中间件，给res添加方法
app.set('view engine', 'html'); // render(index) 给index添加的默认后缀
app.engine('html', plainEngine.__express); // 指定后缀的渲染引擎

// 静态资源：其实就是设置中间件
app.static('./public');

// 路由：添加路由中间件
app.get('/', function (req, res) {
    res.render('index');
});

app.listen(6000, function () {
    console.log('listenning on port ' + 6000);
});