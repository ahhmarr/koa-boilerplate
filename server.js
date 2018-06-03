const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const jwt = require("jsonwebtoken");
const app = new Koa();
require("dotenv").config();
app.use(BodyParser());
app.use(logger());
require("./app/routes")(app);

app.listen(process.env.PORT || 3000);
