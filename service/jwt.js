const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = {
  async verify(ctx, next) {
    try {
      const token = ctx.request.header.authorization
        ? ctx.request.header.authorization.split(" ").pop()
        : "";
      const { username, password } = jwt.verify(
        token,
        process.env.SECRET || ""
      ).data;
      console.log(username, password);
      const isValid = await User.findOne({ username, password });
      if (isValid) {
        return next();
      } else {
        ctx.body = {
          message: "Invalid/Expired Token"
        };
        ctx.status = 401;
      }
    } catch (e) {
      //   console.log(e);
      ctx.body = {
        message: "Unauthorized Access"
      };
      ctx.status = 401;
    }
  },
  createToken(data) {
    return jwt.sign(
      {
        data,
        ...(process.env.TOKEN_EXPIRY
          ? { exp: Math.floor(Date.now() / 1000) + ~~process.env.TOKEN_EXPIRY }
          : {})
      },
      process.env.SECRET || ""
    );
  }
};
