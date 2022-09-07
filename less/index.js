const less = require("less");
const fs = require("fs");
const path = require("path");

const rawStr = fs.readFileSync("./less/index.less", { encoding: "utf-8" });

less.render(
  rawStr,
  {
    paths: [path.resolve("less")],
  },
  (err, ret) => {
    if (err) {
      console.log(err);
    }
    const { css, map, imports } = ret || {};
    console.log(css);
    console.log("imports", imports);
  }
);
