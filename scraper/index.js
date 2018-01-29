const scraper = require("./parseToday");
const gameScraper = require("./parseGame");
const Matches = require("../models/Matches");
const Events = require("../models/Events");
const Teams = require("../models/Teams");

async function getInfo(url) {
  try {
    var gameData = await scraper(url);
    var eventData = await Promise.all(
      gameData.map(x => {
        return gameScraper(x.matchLink);
      })
    );
    //properties from the detail page that will be added to overall match data
    var { location, date } = eventData;

    //first step is adding events to db.
    var allEvents = [];
    eventData.forEach(game => {
      allEvents.push(...game.events);
    });

    var sendToEventsDB = allEvents.map(event => {
      return {
        updateOne: {
          filter: event,
          update: event,
          upsert: true
        }
      };
    });

    var confirmed = await Events.bulkWrite(sendToEventsDB);
    var createdEvents = await Events.find({
      _id: { $in: Object.values(confirmed.upsertedIds) }
    });

    //now we have a list of the newly created events, can add them to matches and teams.
    var teamData = [];
    var matchData = gameData.map((game, idx) => {
      delete eventData[idx].events;
      var match = Object.assign(game, eventData[idx]);
      match.$push = {
        events: {
          $each: createdEvents.filter(x => {
            if (match.homeTeam.name === x.team && x.homeEvent) return true;
            else if (match.awayTeam.name === x.team && !x.homeEvent)
              return true;
            return false;
          })
        }
      };

      teamData.push({
        name: game.homeTeam.name,
        $push: {
          events: {
            $each: match.$push.events.$each.filter(x => x.homeEvent)
          },
          eventsAgainst: {
            $each: match.$push.events.$each.filter(x => !x.homeEvent)
          }
        }
      });

      teamData.push({
        name: game.awayTeam.name,
        $push: {
          events: {
            $each: match.$push.events.$each.filter(x => !x.homeEvent)
          },
          eventsAgainst: {
            $each: match.$push.events.$each.filter(x => x.homeEvent)
          }
        }
      });

      return match;
    });
    console.log(teamData);
    //make/update the teams

    var sendToTeamsDB = teamData.map(team => {
      return {
        updateOne: {
          filter: { name: team.name },
          update: team,
          upsert: true
        }
      };
    });

    console.log(matchData);

    var sendToMatchesDB = matchData.map((match, idx) => {
      var { matchLink } = match;
      return {
        updateOne: {
          filter: { matchLink },
          update: match,
          upsert: true
        }
      };
    });

    var confirmation = await Promise.all([
      Matches.bulkWrite(sendToMatchesDB),
      Teams.bulkWrite(sendToTeamsDB)
    ]);
    var newGames = confirmation[0].upsertedIds;

    if (Object.values(newGames).length) {
      var created = await Promise.all([
        Matches.find({
          _id: { $in: Object.values(newGames) }
        }),
        Teams.find({})
      ]);

      created[0].forEach(match => {
        var { homeTeam, awayTeam } = match;
        var homeTeamInst = created[1].filter(x => x.name === homeTeam.name)[0],
          awayTeamInst = created[1].filter(x => x.name === awayTeam.name)[0];
        homeTeam.teamDetails = homeTeamInst._id;
        awayTeam.teamDetails = awayTeamInst._id;
        homeTeamInst.matches.push(match._id);
        awayTeamInst.matches.push(match._id);

        Promise.all([match.save(), homeTeamInst.save(), awayTeamInst.save()]);
      });
    }
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = getInfo;
