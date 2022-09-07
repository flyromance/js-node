/**
 * @babel/register  用这个pirates做hook
 * 
 */

const fs = require("fs");
const Module = require("module");

function parse(str) {}

Module._extensions[".json5"] = function (module, filename) {
  const content = fs.readFileSync(filename, "utf8");

  try {
    module.exports = parse(content);
  } catch (err) {
    err.message = filename + ": " + err.message;
    throw err;
  }
};
