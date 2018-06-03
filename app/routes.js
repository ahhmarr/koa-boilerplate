const Router = require("koa-router");
const middleware = require("./middleware");
const publicRouter = new Router({
  prefix: "/api"
});
const privateRouter = new Router({
  prefix: "/api"
});
const authService = require("../service/auth");
module.exports = function(app) {
  privateRouter.post("/users", authService.create);
  publicRouter.post("/login", authService.login);
  publicRouter.get("/", async function(ctx) {
    ctx.body = { message: "Hello World!" };
  });
  privateRouter.get("/private/", async ctx => {
    ctx.body = {
      message: "private"
    };
  });
  publicRouter.all("*", async ctx => {
    ctx.status = 404;
    ctx.body = {
      message: "not found"
    };
  });
  privateRouter.use(middleware.jwtAuthMiddleware);
  app.use(privateRouter.routes()).use(privateRouter.allowedMethods());
  app.use(publicRouter.routes()).use(publicRouter.allowedMethods());
};
