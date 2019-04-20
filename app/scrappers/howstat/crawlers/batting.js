const request = require("request-promise");
const cheerio = require("cheerio");
const selectors = [
  { selector: "Innings", name: "innings" },
  { selector: "Not Outs", name: "notOut" },
  { selector: "Aggregate", name: "aggregate" },
  { selector: "Highest Score", name: "highestScore" },
  { selector: "Average", name: "average" },
  { selector: "50s", name: "50" },
  { selector: "100s", name: "100" },
  { selector: "Ducks", name: "Ducks" },
  { selector: "4s", name: "4s" },
  { selector: "6s", name: "6s" },
  { selector: "Balls Faced", name: "ballsFaced" },
  { selector: "Scoring Rate", name: "scoringRate" },
  { selector: "Opened Batting", name: "openedBatting" }
];
async function getData($) {
  const data = {};
  selectors.map(({ selector, name }) => {
    const elm = $(`span:contains("${selector}")`);
    if (elm && elm.length) {
      const value = elm
        .parent()
        .next()
        .text()
        .replace(/(\n|\t| )/gim, "");
      if (value) {
        data[name] = value;
      }
    }
  });
  return data;
}
function _validate(player, type) {
  const flag = true;
  if (!player) {
    console.log(`player not specified`);
    flag = false;
  }
  if (!player.urls || !player.urls[type]) {
    console.log(
      `no ${type} url specified for player ${player.id}:${player.name}`
    );
    flag = false;
  }
  return flag;
}
async function _getDom(player, type) {
  const validated = _validate(player, type);
  if (!validated) {
    return;
  }
  const resp = await request(player.urls[type]);
  const $ = await cheerio.load(resp);
  return $;
}
async function t20(player) {
  const $ = await _getDom(player, "t20");
  if (!$) {
    return;
  }
  const data = await getData($);
  return { tournament: "t20", data, type: "batting", player };
}
async function odi(player) {
  const $ = await _getDom(player, "odi");
  if (!$) {
    return;
  }
  const data = await getData($);
  return { tournament: "odi", data, type: "batting", player };
}
async function test(player) {
  const $ = await _getDom(player, "test");
  if (!$) {
    return;
  }
  const data = await getData($);
  return { tournament: "test", data, type: "batting", player };
}
async function ipl(player) {
  const $ = await _getDom(player, "ipl");
  if (!$) {
    return;
  }
  const data = await getData($);
  return { tournament: "ipl", data, type: "batting", player };
}
module.exports = { t20, odi, test, ipl };
