const Router = require("koa-router");
const d = require("../models/Player");
const middleware = require("./middleware");
const publicRouter = new Router({
  prefix: "/api/v1"
});
const privateRouter = new Router({
  prefix: "/api/v1"
});
privateRouter.use(middleware.jwtAuthMiddleware);
const authService = require("../service/auth");
module.exports = function(app) {
  publicRouter.get("/hello", async ctx => {
    ctx.body = {
      message: "hello world"
    };
  });
  publicRouter.all("*", async ctx => {
    ctx.status = 404;
    ctx.body = {
      message: "route not found"
    };
  });
  app.use(privateRouter.routes()).use(privateRouter.allowedMethods());
  app.use(publicRouter.routes()).use(publicRouter.allowedMethods());
};
