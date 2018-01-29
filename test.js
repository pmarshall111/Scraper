const axios = require("axios");
const parseGame = require("./parseGame");
const JSDom = require("jsdom");
const { JSDOM } = JSDom;

var testURL =
  "http://www.goal.com/en-gb/match/leicester-city-v-watford/commentary-result/9uzgphzu7r37mudkld5i2ldnu";

var test = parseGame(testURL).then(d => console.log(d));

var t = JSDOM.fromURL(testURL).then(dom => {
  const $ = require("jquery")(dom.window);
  console.log($(".event").length);
});

//this JSDOM method is working, but the parseGame is not... why?????
