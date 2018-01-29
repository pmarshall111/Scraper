const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: String,
  matches: [
    {
      type: Schema.Types.ObjectId,
      ref: "matches"
    }
  ],
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: "events"
    }
  ],
  eventsAgainst: [
    {
      type: Schema.Types.ObjectId,
      ref: "events"
    }
  ],
  group: String
});

const Teams = mongoose.model("teams", teamSchema);

module.exports = Teams;
