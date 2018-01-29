const assert = require("assert");
const parseToday = require("../parseToday");
const parseGame = require("../parseGame");

describe("Scraper is working", () => {
  const testURL = "http://www.goal.com/en-gb/results/2018-01-20";
  const testGame =
    "http://www.goal.com/en-gb/match/brighton-hove-albion-v-chelsea/commentary-result/9unb353du33x16bcqa4kdt9ii";

  it("function parseToday can get information from link known to have data", done => {
    parseToday(testURL).then(results => {
      // console.log(results);
      assert(results.length === 8);
      done();
    });
  });

  it("function parseToday can get team name", done => {
    parseToday(testURL).then(results => {
      assert(results[0].awayTeam === "Chelsea");
      done();
    });
  });

  it("function parseToday can get score", done => {
    parseToday(testURL).then(results => {
      assert(results[0].score === "0 : 4");
      done();
    });
  });

  it("function parseToday can get detailed game link", done => {
    parseToday(testURL).then(results => {
      assert(
        results[0].matchLink ===
          "http://www.goal.com/en-gb/match/brighton-hove-albion-v-chelsea/commentary-result/9unb353du33x16bcqa4kdt9ii"
      );
      done();
    });
  });

  it("function parseGame can get game information from game link", done => {
    parseGame(testGame).then(game => {
      assert(game.events[0].player === "C. Musonda");

      done();
    });
  });

  it("both functions work together to get individual game info", done => {
    parseToday(testURL).then(day => {
      parseGame(day[0].matchLink).then(game => {
        assert(game.events[0].player === "C. Musonda");

        done();
      });
    });
  });
});
