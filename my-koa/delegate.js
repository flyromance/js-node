/**
 * ctx 代理模型
 *
 * response => { app, ctx, request, res, req, }
 *
 * reponse.__proto__ => app.response
 *
 * app.response.__proto__ => { get xx() {},   set xx() {},   method() {} }
 */
class Deleg {
  constructor(obj, pKey) {
    this.obj = obj; // ctx
    this.pKey = pKey; // response || request
  }

  method(name) {
    const { pKey, obj } = this;
    Object.defineProperty(obj, name, {
      value: function (...args) {
        return obj[pKey][name](...args);
      },
      enumerable: false,
      writable: true,
      configurable: true,
    });
    return this;
  }

  getter(name) {
    const { pKey, obj } = this;
    Object.defineProperty(obj, name, {
      get() {
        return this[pKey][name];
      },
    });
    return this;
  }

  access(name) {
    const { pKey } = this;
    Object.defineProperty(this.obj, name, {
      get() {
        return this[pKey][name];
      },
      set(val) {
        this[pKey][name] = val;
      },
    });
    return this;
  }
}

function delegate(proto, name) {
  return new Deleg(proto, name);
}

exports.delegate = delegate;
