const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

before(done => {
  mongoose.connect("mongodb://localhost/wc2018-test");
  mongoose.connection
    .once("open", () => done())
    .on("error", error => console.warn("Error", error));
});

//currently causing error in tests... possibly because we dont have these
//collections yet???
// beforeEach(done => {
//   mongoose.connection.db.dropcollection("todaysgames").then(() => done());
// });
