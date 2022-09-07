const sass = require("node-sass");
const fs = require("fs");
const path = require("path");

const rawStr = fs.readFileSync("./sass/index.scss", { encoding: "utf-8" });
console.log(rawStr);

// 和less比较，没有返回依赖
const { css, map, stat } = sass.renderSync({
  data: rawStr,
  includePaths: [path.resolve("sass")],
});
console.log(css.toString());
