const fs = require("fs");

// const { isDirectory, isFile } = fs.statSync("./a.js");
// console.log(isDirectory(), isFile());
console.log(require.resolve('./a.js/index'))
