const mongoose = require("../app/db");
const platforms = require("../config/platforms") || [];
const tournamentTypes = require("../config/tournamentTypes") || [];
const Schema = mongoose.Schema;

const type = {
  type: Number
};
const required = {
  required: true
};
const def = {
  default: 0
};
const numReqDef = { ...type, ...required, ...def };
const batting = {
  innings      : numReqDef,
  notOut       : numReqDef,
  aggregate    : numReqDef,
  highestScore : numReqDef,
  average      : numReqDef,
  "50"         : numReqDef,
  "100"        : numReqDef,
  "200"        : numReqDef,
  "300"        : numReqDef,
  "400"        : numReqDef,
  Ducks        : numReqDef,
  Pairs        : numReqDef,
  "4"          : numReqDef,
  "6"          : numReqDef,
  ballsFaced   : numReqDef,
  scoringRate  : numReqDef,
  openedBatting: numReqDef
};
const best = {
  wickets: numReqDef,
  runs   : numReqDef
};
const bowling = {
  overs       : numReqDef,
  balls       : numReqDef,
  aggregate   : numReqDef,
  maidens     : numReqDef,
  runsConceded: numReqDef,
  wickets     : numReqDef,
  average     : numReqDef,
  "5w"        : numReqDef,
  "10w"       : numReqDef,
  best        : {
    match  : best,
    innings: best
  },
  economyRate: numReqDef,
  strikeRate : numReqDef
};
const fielding = {
  catches    : numReqDef,
  mostCatches: {
    innings: numReqDef,
    match  : numReqDef
  }
};
const statsType = {
  batting,
  bowling,
  fielding
};
const ids = {};
const urls = {};
const matches = {};
const stats = {};
platforms.map(({ name, url }) => {
  ids[name] = { type: String };
  tournamentTypes.map(tournament => {
    urls[tournament] = { type: String, required: true, default: "" };
    matches[tournament] = numReqDef;
    stats[tournament] = statsType;
  });
});
console.log(
  {
    name   : { type: String, required: true },
    dob    : { type: Date },
    bats   : { type: String },
    bowls  : { type: String },
    matches: matches,
    ids,
    urls,
    stats
  },
  {
    timestamps: true
  }
);
const PlayerSchema = new Schema(
  {
    name   : { type: String, required: true },
    dob    : { type: Date },
    bats   : { type: String },
    bowls  : { type: String },
    matches: matches,
    ids,
    urls,
    stats
  },
  {
    timestamps: true
  }
);

const Player = mongoose.model("players", PlayerSchema);
module.exports = Player;
