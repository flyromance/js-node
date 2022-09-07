/**
 * http 1.0
 * 
 * Expires:
  Expires是HTTP1.0的产物了，现在默认浏览器均默认使用HTTP 1.1，所以它的作用基本忽略。
  但是很多网站还是对它做了兼容。它的值为服务端返回的到期时间，即下一次请求时，请求时间小于服务端返回的到期时间，直接使用缓存数据。
  但有一个问题是到期时间是由服务端生成的，如果客户端时间跟服务器时间不一致，这就会导致缓存命中的误差。
  在HTTP 1.1 的版本，Expires被Cache-Control替代。
 */

// 本地客户端
const client = {
  getData(id) {
    const ret = clientCache.getData(id);
    if (ret) {
      return ret.payload;
    } else {
      const res = server.getData(id);
      clientCache.setData(id, res);
    }
  },
};

// 本地客户端的缓存管理器
const clientCache = {
  cache: {},
  getData(id) {
    if (!this.cache[id]) return null;
    const { expires } = this.cache[id];
    if (new Date() > expires) {
      this.cache[id] = null;
      return null;
    } else {
      return this.cache[id];
    }
  },
  setData(id, data) {
    const { expires } = data;
    if (new Date() >= expires) {
      // 已过期没有必要存了
      return;
    }
    this.cache[id] = data;
  },
};

// 服务端管理
const server = {
  map: {},
  getData(id) {
    return {
      payload: this.map[id],
      expires: 12313,
    };
  },
};
