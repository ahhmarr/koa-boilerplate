const combos = require("combos");
let platforms = require("../config/platforms");
const crawlerSrc = `../app/scrappers`;
platforms = platforms.filter(platform => platform.enable);
async function initCrawler() {
  if (!platforms) {
    throw new Error("no platform for crawlers defined");
  }
  platforms.map(async ({ name }) => {
    let crawler, crawlerPath;
    try {
      crawlerPath = `${crawlerSrc}/${name}`;
      crawler = require(crawlerPath);
    } catch (e) {
      console.log(e);
      throw new Error(`crawler implmentation not present ${crawlerPath}`);
    }
    const crawlerType = combos({
      tournament: ["bowling"],
      type      : ["t20", "odi", "ipl", "test"]
    });
    const data = await crawler.init({
      crawlerType,
      playerID: "3840"
    });
    console.log(data);
  });
  return "initialized crawlers";
}
module.exports = { initCrawler };
