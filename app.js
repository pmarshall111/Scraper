const JSDom = require("jsdom");
const axios = require("axios")


var URL = "http://www.goal.com/en-gb/live-scores"
var url = "http://www.goal.com/en-gb/results/2017-12-28"

var championshipId = "7ntvbsyq31jnzoqoa8850b9b8";
var PLId = "2kwbbcootiqqgmrzs6o5inle5"


axios.get(url)
	.then(res => parseData(res.data))
	.catch(e => console.log("ERROR"))


function parseData(data) {
	const { JSDOM } = JSDom;
	const dom = new JSDOM(data)
	const $ = (require("jquery"))(dom.window);


	var competitions = $(".competition-matches");
	var PL;
	for (var i = 0; i<competitions.length; i++) {
		if ($(competitions[i]).attr("data-competition-id") === PLId) {
			PL = competitions[i];
			break;
		}
	}
	
	var matches = $($(PL).children(".match-row-list")).children(".match-row");
	console.log(matches)
	matches = Array.from(matches)
	matches.forEach(match => {
		var homeTeam = $(match).find(".team-home .team-name").html()
		var homeGoals = $(match).find(".team-home .goals").html()
		var awayTeam = $(match).find(".team-away .team-name").html()
		var awayGoals = $(match).find(".team-away .goals").html()

		console.log(`${homeTeam} ${homeGoals} : ${awayGoals} ${awayTeam}`)
	})

}