/**
 * http 1.1
 * 
 * 响应头
 * cache-control: 是最重要的规则。常见的取值有 private、public、s-maxage、max-age、no-cache、no-store，默认为private。
    (1) max-age：用来设置资源（representations）可以被缓存多长时间，单位为秒；
    (2）s-maxage：和max-age是一样的，不过它只针对代理服务器缓存而言；
    (3）public：指示响应可被任何缓存区缓存；
    (4）private：只能针对个人用户，而不能被代理服务器缓存；
    (5）no-cache：
        强制客户端直接向服务器发送请求,也就是说每次请求都必须向服务器发送。
        服务器接收到请求，然后判断资源是否变更，是则返回新内容，否则返回304，未变更。
        这个很容易让人产生误解，使人误以为是响应不被缓存。
        实际上no-cache是会被缓存的，只不过每次在向客户端（浏览器）提供响应数据时，都要向服务器评估缓存响应的有效性。
    (6）no-store：禁止一切缓存，这个才是响应不被缓存的意思。
  * etag
  * last-modified
  * 
  * 请求头
  * if-none-match
  * if-modified-since
 */

// 本地客户端
const client = {
  getData(id) {
    const ret = clientCache.getData(id);
    if (ret) {
      const { needSecondConfirm, headers = {}, payload } = ret;
      if (needSecondConfirm) {
        const etag = headers.etag;
        const lastModified = headers["last-modified"];

        const reqHeaders = {
          "if-none-match": etag,
          "if-modified-since": lastModified,
        };
        const { code, ...res } = server.getData(id, reqHeaders);

        if (code === 304) {
          // 命中协商缓存
          return payload;
        } else if (code === 200) {
          clientCache.setData(id, {
            ...res,
          });
        }
      } else {
        // 命中强缓存
        return payload;
      }
    } else {
      // 请求服务
      const { code, ...res } = server.getData(id);
      clientCache.setData(id, res);
      return res.payload;
    }
  },
};

// 本地客户端的缓存管理器
const clientCache = {
  cache: {},
  getData(id) {
    if (!this.cache[id]) return null;

    const { expires, headers = {}, payload } = this.cache[id];

    if (new Date() > expires) {
      return {
        needSecondConfirm: true,
        headers,
        payload,
      };
    } else {
      return { headers, payload };
    }
  },
  setData(id, data) {
    const { headers, payload } = data;
    const cc = headers["cache-control"]; // private max-age=12312 public s-maxage=12313 no-cache no-store

    if (cc === "no-store") {
      return;
    } else if (cc === "no-cache" || cc === "private") {
      this.cache[id] = {
        expires: new Date(new Date() - 1), // 立马失效
        headers,
        payload,
      };
    } else if (/max-age=\d+/.test(cc)) {
      const match = /max-age=(\d+)/.exec(cc);
      const t = match[1] * 1000;
      this.cache[id] = {
        expires: new Date(new Date() + Number(t)),
        headers,
        payload,
      };
    }

    return null;
  },
};

// 服务端管理
const server = {
  map: {
    id: {
      etag: "123",
      lastModified: 1233,
      content: {},
    },
  },
  getData(id, headers = {}) {
    const preEtag = headers["if-none-match"];
    const preLastModified = headers["if-modified-since"];

    // 文件的etag和lastModified可能随时会变
    const { etag, lastModified, content } = this.map[id];

    if (etag === preEtag || lastModified <= preLastModified) {
      return {
        code: 304,
        // payload: {}, // 区别在于不发送payload，节省带宽
        headers: {
          "cache-control": "max-age=1000",
          etag,
          "last-modified": lastModified,
        },
      };
    } else {
      return {
        code: 200,
        payload: content,
        headers: {
          "cache-control": "max-age=1000",
          etag: etag,
          "last-modified": lastModified,
        },
      };
    }
  },
};
