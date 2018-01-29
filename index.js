const mongoose = require("mongoose");
const cron = require("node-cron");
const scraper = require("./scraper");

mongoose.connect("mongodb://localhost/wc2018");

mongoose.connection.on("connected", () => {
  var url = "http://www.goal.com/en-gb/results/2018-01-20";
  //below would be the cronjob.
  scraper(url);
});
