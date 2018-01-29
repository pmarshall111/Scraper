const mongoose = require("mongoose");
const cron = require("node-cron");
const scraper = require("./scraper");

mongoose.connect("mongodb://localhost/wc2018");

mongoose.connection.on("connected", () => {
  var url = "http://www.goal.com/en-gb/results/2018-01-14";
  //below would be the cronjob.
  scraper(url);
});

const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("app is go: " + PORT);
});
