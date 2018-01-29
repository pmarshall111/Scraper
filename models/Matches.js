const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchesSchema = new Schema({
  homeTeam: {
    name: String,
    goals: Number,
    result: String,
    teamDetails: { type: Schema.Types.ObjectId, ref: "teams" }
  },
  awayTeam: {
    name: String,
    goals: Number,
    result: String,
    teamDetails: { type: Schema.Types.ObjectId, ref: "teams" }
  },
  events: [{ type: Schema.Types.ObjectId, ref: "events" }],
  score: String,
  matchLink: String,
  matchStatus: String,
  location: String,
  kickOff: Date,
  groupStage: Boolean
});

const Matches = mongoose.model("matches", matchesSchema);

module.exports = Matches;
