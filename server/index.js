const express = require("express");
const app = express();
const cors = require("cors")
const port = process.env.PORT || 5000;
const recommend = require('../server/routes/recommend')
const city='Mumbai'

// const {Client} = require('pg');
// const client = new Client({
//     user: "postgres",
//     password: "1234",
//     host: "localhost",
//     port: 5433,
//     database: "zomato2",
// });

const distanceRoute = require("./routes/distanceRoute");
const { load } = require("./models/recommender");
app.use(express.json())
app.use(cors())
app.use("/api/distance", distanceRoute);
app.use("/",recommend)
load(city)
app.listen(port, () =>
    console.log(`Server running on port no. ${port} using Nodemon`)
);
