const { remove } = require("..");

require("./1/index");
require("./2/index");

// console.log("pre children", module.children);

// delete require.cache[require.resolve("./a")]; // 这样删除会造成内存泄漏
remove(require.resolve("./1/1-1/b.js"));

console.log("after children", module.children);
