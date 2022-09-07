/**
 * 洋葱模型
 * const fn = createFn(fn1, fn2, fn3)
 * fn(ctx).then();
 * 
 * 每个next返回的都是promise
 */
function compose() {
  const fns = Array.from(arguments).filter((v) => typeof v === "function");

  return function (ctx, next) {
    let preIdx = -1;

    function next(i) {
      if (i <= preIdx) {
        console.log("不能重复调用");
        return Promise.reject();
      }

      preIdx = i;
      const fn = fns[i] || next;
      if (!fn) return Promise.resolve();

      try {
        return new Promise(fn(ctx, next.bind(null, i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return next(0);
  };
}

exports.compose = compose;
