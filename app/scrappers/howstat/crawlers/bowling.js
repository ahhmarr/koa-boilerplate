const request = require("request-promise");
const cheerio = require("cheerio");
const selectors = [
  { selector: "Overs", name: "overs" },
  { selector: "Balls", name: "balls" },
  { selector: "Maidens", name: "maidens" },
  { selector: "Runs Conceded", name: "runsConceded" },
  { selector: "Wickets", name: "wickets" },
  { selector: "Average", name: "average" },
  { selector: "4 Wickets in Innings", name: "4w" },
  { selector: "5 Wickets in Innings", name: "5w" },
  //   { selector: "10 Wickets in Match", name: "10w" },
  { selector: "Best - Innings", name: "best.innings.wickets", regexp: /^.*\// },
  { selector: "Best - Innings", name: "best.innings.runs", regexp: /\/.*$/ },
  { selector: "Best - Match", name: "best.match.wickets", regexp: /^.*\// },
  { selector: "Best - Match", name: "best.match.runs", regexp: /\/.*$/ },
  { selector: "best", name: "best.match.wickets", regexp: /^.*\// },
  { selector: "best", name: "best.match.runs", regexp: /\/.*$/ },
  { selector: "Economy Rate", name: "economyRate" },
  { selector: "Strike Rate", name: "strikeRate" }
];
async function getData($) {
  const data = {};
  selectors.map(({ selector, name, regexp }) => {
    const elm = $(`span:contains("${selector}")`);
    if (elm && elm.length) {
      let value = elm
        .parent()
        .next()
        .text()
        .replace(/(\n|\t| )/gim, "");
      if (value) {
        if (regexp) {
          let tempValue = value.match(regexp);
          if (tempValue) {
            value = tempValue.pop().replace("/", "");
          }
        }
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
  return { tournament: "t20", data, type: "bowling", player };
}
async function odi(player) {
  const $ = await _getDom(player, "odi");
  if (!$) {
    return;
  }
  const data = await getData($);
  return { tournament: "odi", data, type: "bowling", player };
}
async function test(player) {
  const $ = await _getDom(player, "test");
  if (!$) {
    return;
  }
  const data = await getData($);
  return { tournament: "test", data, type: "bowling", player };
}
async function ipl(player) {
  const $ = await _getDom(player, "ipl");
  if (!$) {
    return;
  }
  const data = await getData($);
  return { tournament: "ipl", data, type: "bowling", player };
}
module.exports = { t20, odi, test, ipl };
