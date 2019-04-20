const Router = require("koa-router");
const middleware = require("./middleware");
const scrapController = require("../controllers/scrapController");
const publicRouterV1 = new Router({
  prefix: "/api/v1"
});
const privateRouter = new Router({
  prefix: "/api/v1"
});
privateRouter.use(middleware.jwtAuthMiddleware);
const authService = require("../service/auth");
module.exports = function(app) {
  publicRouterV1.get("/cron/init", scrapController.index);
  publicRouterV1.get("/hello", async ctx => {
    ctx.body = {
      message: "hello world"
    };
  });
  publicRouterV1.all("*", async ctx => {
    ctx.status = 404;
    ctx.body = {
      message: "route not found"
    };
  });
  app.use(privateRouter.routes()).use(privateRouter.allowedMethods());
  app.use(publicRouterV1.routes()).use(publicRouterV1.allowedMethods());
};
