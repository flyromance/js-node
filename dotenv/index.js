const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

const result = dotenv.config({ path: "./.env" });
dotenvExpand(result);

console.log(process.env.F_1);
console.log(process.env.F_2);