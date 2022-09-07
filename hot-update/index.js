/**
 * https://www.zhihu.com/people/yijun1991/posts 偏底层的 node 监控 模块热更新等
 * 
 * 参考
 * https://zhuanlan.zhihu.com/p/460359101  热更新
 * 
 * 相关模块
 * https://github.com/dwyl/decache/blob/main/decache.js#L35
 * https://github.com/sindresorhus/clear-module/blob/main/index.js#L25-L31
 *
 * 如果只是删除require.cache，模块里面占用大量内存，被其他模块引用，内存无法释放，而且每次加载都会重新生成，造成无限引用，造成oom
 *
 *
 * hot module 一般是在入口模块结尾部分做的，因为这个时候，整个应用的模块树已经形成，可以从根模块开始递归遍历
 *  - 比如入口模块加个监听文件的变化，触发删除逻辑
 *  - 每次文件修改，执行删除自身模块的逻辑
 */
const path = require("path");

function recursionDelete(pM, m) {
  if (!pM || !pM.children || !pM.children.length) return;
  if (pM === m) return;

  const { children } = pM;
  let lens = children.length;
  for (let i = 0; i < lens; i++) {
    const sM = children[i];
    recursionDelete(sM, m);
    if (sM === m) {
      children.splice(i, 1);
      i--;
    }
  }
}

exports.remove = function (p, options) {
  const { cwd = process.cwd() } = options || {};
  p = path.isAbsolute(p) ? p : path.join(cwd, p);
  const m = require.cache[p];

  delete require.cache[p];

  // 从入口模块开始递归
  recursionDelete(require.main, m);
};
