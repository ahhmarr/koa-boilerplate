/**
 * Cricket Scrapper lib for howstat.com
 * @author Ahmar Siddiqui <ahmar.siddiqui@gmail.com>
 *
 */

const request = require("request-promise");
const cheerio = require("cheerio");
const scrappers = require("./crawlers/");
/**
 * name of the platform
 * @type {string}
 */
const platform = "howstat";

/**
 * url of the platform
 * @type {string}
 */
const url = "http://localhost:3005/mock/howstat.html";

/**
 * this will ping the url and return cheerio implementation of the dom
 * @param {string} url - the url to be parsed
 */
async function getDom(url = "") {}

/**
 * this will return basic info of players
 * @return {Promise.<object>}
 * @return {string} return.name
 * @return {string} return.dob
 * @return {string} return.country
 *
 */
async function getPlayersObj($, playerID = "") {
  const players = $(".TableLined").find("tr:nth-child(n+3)");
  const data = [];
  players.map((index, obj) => {
    // console.log(obj);
    obj = $(obj);
    let name = obj
      .find(`td:nth-child(1)`)
      .text()
      .trim();
    let dob = obj
      .find(`td:nth-child(2)`)
      .text()
      .trim();
    let country = obj
      .find(`td:nth-child(3)`)
      .text()
      .trim();
    if (!country) {
      return;
    }
    let id = obj
      .html()
      .match(/PlayerID=(.*)+"/gm)
      .pop()
      .replace(/(PlayerID=|")/gi, "");
    if (playerID && playerID !== id) {
      return;
    }
    data.push({
      name,
      dob,
      country,
      id,
      urls: {
        t20 : `http://localhost:3005/mock/t20.html?PlayerID=${id}`,
        odi : `http://localhost:3005/mock/odi.html?PlayerID=${id}`,
        test: `http://localhost:3005/mock/test.html?PlayerID=${id}`,
        ipl : `http://localhost:3005/mock/ipl.html?PlayerID=${id}`
      }
    });
  });
  return data;
}

/**
 * this will return urls for all the players according to the platforms
 * @return {Promise.<object>}
 * @return {string} return.t20
 * @return {string} return.test
 * @return {string} return.odi
 * @return {string} return.ipl
 *
 */
async function getTournamentTypeUrls() {}

/**
 * this will ping the platform url and return cheerio object of the page
 * @return {Promise.<object>} cheerio object of the page
 */
async function init({ crawlerType = [], playerID = "" }) {
  //ping webisite and get cheerio
  const resp = await request(url);
  const $ = await cheerio.load(resp);

  const data = [];
  const players = await getPlayersObj($, playerID);
  const getStats = await scrap(players, crawlerType);
  return getStats;
  //return cumulative info
}

/**
 * this will scrap data from the page for a specific player
 * @param {object}
 * @return {Promise.<object>} cheerio object of the page
 */
async function scrap(players = [], crawlerType) {
  const data = [];
  players.map(player => {
    crawlerType.map(({ tournament, type }) => {
      const statsData = scrapHandler({ type, tournament, player });
      data.push(statsData);
    });
  });
  let stats = Promise.all(data);

  return stats;
}

/**
 * this will initiate respective scrappers for diffrent tournament and stats type
 * @param {object}
 * @return {Promise.<object>} cheerio object of the page
 */
async function scrapHandler({ type, tournament, player }) {
  if (!scrappers[tournament] || !scrappers[tournament][type]) {
    throw new Error(
      `no valid scrapper for ${type}:${tournament} in ${platform}`
    );
  }
  console.log({ type, tournament });
  return scrappers[tournament][type](player);
}
module.exports = { init };
