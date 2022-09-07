/**
 * router.use(path, fn1, [fn2, fn3]) 推入两条route，layer
 * router.stack.push({ path, methods: [], stack: [fn1], opts: {} })
 * router.stack.push({ path, methods: [], stack: [fn2, fn3] })
 *
 * router.use(path, router1.routes()) router1.routes().router.stack 有几个就推入几条layer
 * router.stack.push(...)
 *
 * router.get(path, fn1, fn2) 推入一条route，也叫layer
 * router.stack.push({ path, methods: [get], stack: [fn1, fn2] })
 *
 * router.routes() 返回 fn，并且 fn.router = router
 *
 *
 * 最终只有一层routes
 *
 * 每个请求来的时候，遍历routes数组，去匹配，拿到多个routes，
 *
 * 组合routes中每个route的stack数组，用koa-compose组成一个fn，
 */
