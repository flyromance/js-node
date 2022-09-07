require('./a'); // a.js
require('./a/'); // a/index.js

require('./b'); // b

console.log(require('./c')); // json

// require('./d'); // 会报错，node文件应不是写js语法

require('./react');