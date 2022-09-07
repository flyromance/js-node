/**
 * https://juejin.cn/editor/drafts/6865192457546989576
 */

// const Module = require("module");

const path = require("path");
const fs = require("fs");

const cache = {};

const extensions = {
  ".js"(module, filename) {
    const require = this.require.bind(this);
    require.resolve = this.resolve.bind(this);
    const fn = this._compile(file);

    fn(module, module.exports, require, module.path, module.filename);
  },
  ".node"() {},
  ".json"() {},
};
const extensionKeys = Object.keys(extensions);

const builtinModuleMap = {
  process: {},
};
const builtinModules = Object.keys(builtinModuleMap);

function existFile(name) {
  try {
    const { isFile } = fs.statSync(name);
    return isFile();
  } catch (e) {
    return false;
  }
}

function existDir(name) {
  try {
    const { isDirectory } = fs.statSync(name);
    return isDirectory();
  } catch (e) {
    return false;
  }
}

function getPaths(dir) {
  const ret = [];
  while (dir) {
    ret.push(path.join(dir, "node_modules"));
    if (dir === "/") {
      break;
    }
    dir = path.dirname(dir);
  }
  return ret;
}

/**
 * 获取完整的文件名，分两种情况
 *
 * 一、结尾不带 /
 * /x/a 先生成查找路径=> [/x/a, /x/a.js, /x/a.json, /x/a.node] ，找到就返回
 *
 * 如果没有找到，判断 /x/a 是否是文件夹，如果是继续，不是报错
 *
 * // 文件夹下缺省，没有index，必须带后缀
 * 生成=> [/x/a/index.js, /x/a/index.json, ...]，找到就返回，找不到return
 *
 * 二、结尾带 / 表示文件夹
 *
 * 最终返回的id，可能是没有 ext 的
 */
function resolveFilenameByExtension(id, exts = extensionKeys) {
  if (!id.endsWith("/")) {
    const files = ["", ...exts].map((e) => id + e);
    const f = files.find((f) => existFile(f));
    if (f) return f;
  }

  // id 可能带后缀'/'或者不带
  if (existDir(id)) {
    const filenames = exts.map((e) => path.join(id, `index${e}`));
    id = filenames.find((f) => existFile(f));
    if (id) return id;
  }
}

// 返回绝对路径
function resolveModule(mId, options) {
  let { cwd = process.cwd() } = options;

  let mName = mId,
    resDir;

  let reg = /^((?:@.+?\/)?[^\/]+)(?:\/(.+))?/;
  let match = reg.exec(mId);
  if (match) {
    mName = match[1];
    resDir = match[2];
  } else {
    throw new Error("module name is not right");
  }

  // 从cwd开始找，先找到 mName 对应的文件夹，也就是package.json所处的目录
  let fromDir = cwd;
  let pkgDir;
  while (fromDir) {
    let t = path.join(cwd, "node_modules", mName);

    try {
      const { isDirectory } = fs.statSync(t);
      if (isDirectory()) {
        pkgDir = t;
        break;
      }
    } catch (e) {
      //
    }

    if (fromDir === "/") {
      // 说明没有找到
      break;
    }

    formDir = path.dirname(fromDir);
  }

  if (!pkgDir) {
    throw new Error("ddd");
  }

  // ！！！
  if (resDir) {
    let n = path.join(pkgDir, resDir);
    n = resolveFilenameByExtension(n);
    if (n) return n;
  }

  if (existFile(path.join(pkgDir, "package.json"))) {
    const pkg = {}; // load
    const main = pkg.main || "";
    const name = resolveFilenameByExtension(path.join(pkgDir, main));
    if (name) return name;
  } else {
    const names = ["", ...extensionKeys].map((e) =>
      path.join(pkgDir, `index${e}`)
    );
    const name = names.find((n) => existFile(n));
    if (name) return name;
  }

  throw new Error("can find module");
}

class Module {
  static Module = Module;
  static _cache = cache;
  static _extensions = extensions;
  static builtinModules = builtinModules;

  static createRequire = () => {};
  static createRequireFromPath = () => {};

  constructor(id, parentModule) {
    this.id = "."; // 一般情况与filename相同，入口模块一般是.
    this.filename = id; // abs filename
    this.path = path.dirname(id); // abs filedir

    this.exports = {};
    this.loaded = false;

    this.parent = parentModule || null;
    this.children = [];

    this.paths = getPaths(this.path); // 表示此模块下从这里list里面查找 模块形式的模块

    this.load(); // 加载模块
  }

  load() {
    const file = fs.readFileSync(this.filename, "utf-8");

    const ext = path.extname(file) || ".js";

    const handler = extensions[ext];

    if (!handler) {
      throw new Error("没有合适的模块处理器");
    }

    // @1 加载前就设置，防止重复加载
    cache[this.filename] = this;

    // 规范约定，第一个参数是module，第二个是文件名
    handler(this, this.filename);

    // 所以根模块最后才被设置为true
    this.loaded = true;
  }

  _compile(str) {
    return new Function(
      "module",
      "exports",
      "require",
      "__dirname",
      "__filename",
      str
    );
  }

  // 返回绝对路径，并且是确定的文件
  resolve(mId) {
    if (typeof mId !== "string" || !mId) {
      throw new Error("id is not right");
    }

    let id;
    if (mId[0] === ".") {
      id = path.join(this.path, mId);
    }
    if (path.isAbsolute(mId)) {
      id = mId;
      id = resolveFilenameByExtension(id);
    } else {
      id = resolveModule(mId, { cwd: this.path });
    }

    if (!id) {
      throw new Error("not found");
    }

    return id;
  }

  require(mId) {
    if (typeof mId !== "string" || !mId) {
      throw new Error("id is not right");
    }

    // 内置模块
    if (builtinModuleMap[mId]) {
      return builtinModuleMap[mId];
    }

    const p = resolve(mId);

    // 与@1对应  防止循环引用（子模块require父级模块）
    if (cache[p]) {
      return cache[p];
    }

    if (!p) {
      throw new Error("can not find module");
    }

    // load module file
    const m = new Module(p, m);

    cache[p] = m;

    this.children.push(m);
  }
}

// console.log(Reflect.ownKeys(Module));
/**
 * Module.Module === Module
 * Module._cache => { id: Module }
 * Module._extensions => {'.js'() {}, '.json'() {}, '.node'() {}}
 */

// console.log(Reflect.ownKeys(require));
/**
 * require.cache => Module._cache => { id: Module }
 * require.extensions => Module._extensions => {'.js'() {}, '.json'() {}, '.node'() {}}
 *
 * main => 根模块
 */

// console.log(Reflect.ownKeys(module))
/**
 * cache => { id: Module }
 * require.extensions => { key: fn }
 *
 * module instanceof Module => true
 *
 * parent
 *
 * children
 *
 * loaded
 */
