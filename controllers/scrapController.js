const crawlerService = require("../service/crawlerService");
async function index(ctx) {
  const resp = await crawlerService.initCrawler();
  ctx.body = {
    message: resp
  };
}
module.exports = {
  index
};
