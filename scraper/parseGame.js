const JSDom = require("jsdom");

async function parseGame(url) {
  const { JSDOM } = JSDom;
  var dom = await JSDOM.fromURL(url);
  const $ = require("jquery")(dom.window);

  var teams = $(".widget-match-header__name--full"),
    homeTeam = $(teams[0]).text(),
    awayTeam = $(teams[1]).text();

  var matchEvents = $(".event");

  // console.log(matchEvents.length);
  matchEvents = Array.from(matchEvents);
  var goalAssistRed = matchEvents.filter(e => {
    var type = $(e)
      .find(".event-text-additional")
      .html();
    // console.log(type);
    if (["Goal", "Assist", "Red Card", "Penalty Goal"].includes(type.trim()))
      return e;
  });

  var events = [];
  goalAssistRed.forEach(d => {
    var team = $(d)
      .find(".team-away")
      .children().length;
    var opposition, homeEvent;
    if (team === 1) {
      team = awayTeam;
      opposition = homeTeam;
      homeEvent = false;
    } else {
      team = homeTeam;
      opposition = awayTeam;
      homeEvent = true;
    }

    var time = $(d)
      .find(".event-time")
      .html()
      .trim();
    var player = $(d)
      .find(".event-text-main")
      .html()
      .trim();
    var action = $(d)
      .find(".event-text-additional")
      .html()
      .trim();

    events.push({ time, player, action, team, opposition, homeEvent });
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
