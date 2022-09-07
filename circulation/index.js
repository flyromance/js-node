console.log("root", module);

// 模块加载前，在cache上已经存在了
// 所以子模块中加载父级模块，不会重新走一遍new Module的逻辑，因有是否存在于cache的判断，如果存在就返回cache中的模块，
console.log(require.cache[module.filename] === module); // true

exports.isSame = (m) => {
  console.log(m === module);
};

// 这个a模块可以访问到当前模块， 但是只能访问到isSame，不能访问到isRight
require("./a");

exports.isRight = () => {};
