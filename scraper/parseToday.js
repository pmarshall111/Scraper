const JSDom = require("jsdom");

var URL = "http://www.goal.com/en-gb/live-scores";
var url = "http://www.goal.com/en-gb/results/2018-01-21";

var championshipId = "7ntvbsyq31jnzoqoa8850b9b8";
var PLId = "2kwbbcootiqqgmrzs6o5inle5";

async function parseToday(url) {
  const { JSDOM } = JSDom;
  var dom = await JSDOM.fromURL(url);
  const $ = require("jquery")(dom.window);

  var competitions = $(".competition-matches");
  var PL;
  for (var i = 0; i < competitions.length; i++) {
    if ($(competitions[i]).attr("data-competition-id") === PLId) {
      PL = competitions[i];
      break;
    }
  }

  var results = [];
  var matches = $($(PL).children(".match-row-list")).children(".match-row");
  matches = Array.from(matches);
  matches.forEach(match => {
    //not sure what happens if matchStatus is still a fixture
    var matchStatus = JSON.parse($(match).attr("data-settings")).matchStatus;
    //"pla", "pld", "fix"

    var matchLink = $(match)
      .find(".match-main-data-link")
      .attr("href");
    matchLink =
      matchLink.slice(0, matchLink.lastIndexOf("/")) +
      "/commentary-result" +
      matchLink.slice(matchLink.lastIndexOf("/"));

    var homeTeam = $(match)
      .find(".team-home .team-name")
      .html();
    var homeGoals = $(match)
      .find(".team-home .goals")
      .html();
    var awayTeam = $(match)
      .find(".team-away .team-name")
      .html();
    var awayGoals = $(match)
      .find(".team-away .goals")
      .html();

    var score = `${homeGoals} : ${awayGoals}`;
    var entry = {
      homeTeam: { name: homeTeam },
      awayTeam: { name: awayTeam },
      score,
      matchStatus,
      matchLink
    };
    // console.log(entry);
    // console.log(`${homeTeam} ${homeGoals} : ${awayGoals} ${awayTeam}`);
    results.push(entry);
  });
  return results;
}

module.exports = parseToday;
