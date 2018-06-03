const jwtService = require("../service/jwt");
module.exports = {
  jwtAuthMiddleware: jwtService.verify
};
