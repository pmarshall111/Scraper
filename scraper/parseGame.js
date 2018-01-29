const JSDom = require("jsdom");

async function parseGame(url) {
  const { JSDOM } = JSDom;
  var dom = await JSDOM.fromURL(url);
  const $ = require("jquery")(dom.window);

  var teams = $(".widget-match-header__name--full"),
    homeTeam = $(teams[0]).text(),
    awayTeam = $(teams[1]).text();

  var matchEvents = $(".event");

  var events = [];
  matchEvents = Array.from(matchEvents);

  matchEvents.forEach(e => {
    var type = $(e)
      .find(".event-text-additional")
      .html()
      .trim();

    if (
      ["Goal", "Assist", "Red Card", "Penalty Goal", "Own Goal"].includes(
        type.trim()
      )
    ) {
      var team = $(e)
        .find(".team-away")
        .children().length;
      var opposition, homeEvent;
      if (
        (team === 1 && type !== "Own Goal") ||
        (team === 0 && type === "Own Goal")
      ) {
        team = awayTeam;
        opposition = homeTeam;
        homeEvent = false;
      } else {
        team = homeTeam;
        opposition = awayTeam;
        homeEvent = true;
      }

      var time = $(e)
        .find(".event-time")
        .html()
        .trim();
      var player = $(e)
        .find(".event-text-main")
        .html()
        .trim();

      events.push({ time, player, action: type, team, opposition, homeEvent });
    }
  });

  var location = $(".widget-match-header__venue-name")
    .html()
    .trim();

  var date = $("title")
    .html()
    .match(/\d{2}\/\d{2}\/\d{4}/)[0];
  var arr = date.split("/");
  var ripped = arr.splice(1, 1)[0];
  arr.unshift(ripped);
  date = new Date(arr.join("/"));

  return { events, location, date };
}

module.exports = parseGame;
