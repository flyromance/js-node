const { createServer } = require("./static-server");

// 应该是个状态机
const args = process.argv.slice(2);

// --port -p 9090
// --cwd  -c .
// --extensions xxx,xxx  -e xxx
// --prefix

const cwd = args[0] || process.cwd();

createServer({ cwd });
