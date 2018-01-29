const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  player: String,
  team: String,
  type: String,
  minute: String,
  opposition: String,
  homeEvent: Boolean
});

const Events = mongoose.model("events", eventSchema);

module.exports = Events;
