const express = require("express");
const app = express();
const cors = require("cors");

const routes = require("./routes/routes");

//use middleware
app.use(cors());

//add routing
routes(app);

module.exports = app;
