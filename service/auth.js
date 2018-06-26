const User = require("../models/User");
const jwtService = require("./jwt");
module.exports = {
  verify: async function({ username, password, iat }) {
    return new Promise(async (resolve, reject) => {
      let user = await User.findOne({ username, password });
      if (!user) {
        reject("invalid token");
      } else {
        resolve(user);
      }
    });
  },
  create: async function(ctx) {
    const { username, password } = ctx.request.body;
    console.log(username, password);
    try {
      const user = await User.create({
        username,
        password
      });
      ctx.body = {
        ...{ username, password },
        ...{ token: jwtService.createToken({ username, password }) }
      };
    } catch (e) {
      console.log(e);
      ctx.status = 400;
      ctx.body = {
        message: "username/password missing or already exists"
      };
    }
  },
  login: async function(ctx) {
    const { username, password } = ctx.request.body;
    let user = await User.findOne({
      username
    });
    let passwordCheck;
    if (user) {
      passwordCheck = await user.comparePassword(password);
      if (passwordCheck) {
        user = user.toObject();
        console.log(user);
        const token = jwtService.createToken(user);
        ctx.body = {
          ...user,
          ...{ token }
        };
      }
    }
    if (!user || !passwordCheck) {
      ctx.body = { message: "Invalid Auth" };
      ctx.status = 401;
    }
  }
};
