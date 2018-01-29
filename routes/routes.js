const mongoose = require("mongoose");
const Events = mongoose.model("events");
const Matches = mongoose.model("matches");
const Teams = mongoose.model("teams");

module.exports = app => {
  //get all teams
  app.get("/api/teams", async (req, res) => {
    var teams = await Teams.find({})
      .populate("events")
      .populate("eventsAgainst")
      .populate("matches");
    res.status(200).send(teams);
  });

  //get single team
  app.get("/api/teams/:teamName", async (req, res) => {
    var { teamName: name } = req.params;
    try {
      var team = await Teams.find({ name })
        .populate("events")
        .populate("eventsAgainst")
        .populate("matches");
      res.status(200).send(team);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  });

  //get all matches
  app.get("/api/matches", async (req, res) => {
    var matches = await Matches.find({}).populate("events");
    res.status(200).send(matches);
  });

  //get all scorers
  app.get("/api/goals", async (req, res) => {
    var goals = await Events.find({
      action: { $in: ["Goal", "Penalty Goal", "Own Goal"] }
    });
    res.send(goals);
  });

  //get all assisters
  app.get("/api/assists", async (req, res) => {
    var assists = await Events.find({ action: "Assist" });
    res.send(assists);
  });
};
