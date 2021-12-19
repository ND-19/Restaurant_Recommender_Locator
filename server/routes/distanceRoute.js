const express = require("express");
const router = express.Router();
const query = require("../connection")
// const client = require("../connection")

// router.get("/getdistance/:city/:point", async (req, res) => {
//     try {
//         const { rows } = await query('SELECT *,ST_Distance(ST_Transform(p1.geometry,26986),ST_Transform(ST_GeomFromText($1,4326),26986))/1000 AS Distance FROM restaurants2.restaurant2 as p1 WHERE \"city\"=$2 ORDER BY distance LIMIT 100', [req.params.point,req.params.city])
//         res.send(rows)
//     } catch (err) {
//         console.log('Database ' + err)
//     }
// });

//Get all the restaurants by city
router.get("/getrestaurants/:city/:rating/:costl/:costu/:opentime/:closetime", async (req, res) => {
    try {
        const { rows } = await query('SELECT * FROM restaurants2.restaurant2 WHERE \"city\"=$1 AND \"aggregate_rating\">=$2 AND \"average_cost_for_two\">=$3 AND \"average_cost_for_two\"<=$4 AND \"open_time\">=$5 AND \"close_time\"<=$6 LIMIT 400', [req.params.city,req.params.rating,req.params.costl,req.params.costu,req.params.opentime,req.params.closetime])
        res.send(rows)
    } catch (err) {
        console.log('Database ' + err)
    }
});

//Get all the cities in the database
router.get("/getallcities", async (req, res) => {
    try {
        const { rows } = await query('SELECT DISTINCT city FROM restaurants2.restaurant2 ORDER BY city')
        res.send(rows)
    } catch (err) {
        console.log('Database ' + err)
    }
});

//Get nearest 100 restaurants from the specified point
router.get("/getdistance/:point", async (req, res) => {
    try {
        const { rows } = await query('SELECT *,ST_Distance(ST_Transform(p1.geometry,26986),ST_Transform(ST_GeomFromText($1,4326),26986))/1000 AS Distance FROM restaurants2.restaurant2 as p1 ORDER BY distance LIMIT 100', [req.params.point])
        res.send(rows)
    } catch (err) {
        console.log('Database ' + err)
    }
});


//Get all the restaurants within certain radius from the selected restaurant
router.get("/distancewithin/:id/:radius", async (req, res) => {
    try {
        const { rows } = await query('SELECT p1.* FROM restaurants2.restaurant2 as p1 LEFT JOIN restaurants2.restaurant2 as p2 ON ST_DWithin(ST_Transform(p1.geometry,26986),ST_Transform(p2.geometry,26986),$1) WHERE p2.res_id=$2',[parseFloat(req.params.radius)*1000,req.params.id])
        res.send(rows)
        
    } catch (err) {
        console.log('Database ' + err)
    }
});
router.get("/userdistancewithin/:point/:radius", async (req, res) => {
    try {
        const { rows } = await query('SELECT p2.*,ST_Distance(ST_Transform(p2.geometry,26986),ST_Transform(ST_GeomFromText($1,4326),26986))/1000 AS Distance FROM (SELECT * FROM restaurants2.restaurant2 as p1 WHERE ST_DWithin(ST_Transform(p1.geometry,26986),ST_Transform(ST_GeomFromText($1,4326),26986),$2)) p2',[req.params.point,parseFloat(req.params.radius)*1000])
        res.send(rows)
        
    } catch (err) {
        console.log('Database ' + err)
    }
});

module.exports = router;