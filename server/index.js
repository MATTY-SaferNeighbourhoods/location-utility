require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const geolib = require("geolib");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(cors());

let collisionData, assaultData, theftData;

let PORT = process.env.PORT || 7069;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  console.log(req.query);
  let reqOptions = {
    streetNumber: 1101,
    streetName: "Bay",
    streetType: "Street"
  };
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=1101+Bay+Street&key=${
        process.env.GOOGLE_API_KEY
      }`
    )
    .then(data => {
      console.log("lat: ", data.data.results[0].geometry.location.lat);
      console.log("lng: ", data.data.results[0].geometry.location.lng);
      let home = {
        latitude: data.data.results[0].geometry.location.lat,
        longitude: data.data.results[0].geometry.location.lng
      };

      let collisionResults = [];
      let assaultResults = [];
      let theftResults = [];

      // collisionData.forEach((incident)=>{
      //     if( geolib.getDistance(home, {latitude: incident.lat, longitude: incident.lng})<5000){
      //         collisionResults.push(incident);
      //     }

      // });

      assaultData.forEach(incident => {
        console.log(
          "get dist",
          geolib.getDistance(home, {
            latitude: 43.733387,
            longitude: -79.452866
          })
        );
        if (
          geolib.getDistance(home, {
            latitude: incident.lat.toString(),
            longitude: incident.long.toString()
          }) < 1000
        ) {
          assaultResults.push(incident);
        }
      });
      theftData.forEach(incident => {
        if (
          geolib.getDistance(home, {
            latitude: incident.lat.toString(),
            longitude: incident.long.toString()
          }) < 1000
        ) {
          theftResults.push(incident);
        }
      });
      collisionData.forEach(incident => {
        if (
          geolib.getDistance(home, {
            latitude: incident.latitude,
            longitude: incident.longitude
          }) < 5000
        ) {
          collisionResults.push(incident);
        }
      });
      let filteredResult = {
        assaults: assaultResults,
        thefts: theftResults,
        collisions: collisionResults
      };

      console.log("data", collisionData.length);
      console.log("results", collisionResults.length);
      //   console.log("assault data", assaultData.length);
      //   console.log("theft Data", theftResults.length);
      //   console.log("assaults in range", assaultResults.length);

      //   console.log("theft data", theftData);
      res.send(filteredResult);
    });
});

let dist = geolib.getDistance(
  { latitude: 43.802116, longitude: -79.17601 },
  { latitude: 43.733387, longitude: -79.452866 }
);

let streetNumber = 36;
let streetName = "Winter";
let streetType = "Ave";

axios
  .get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${streetNumber.toString()}+${streetName}+${streetType}&key=${
      process.env.GOOGLE_API_KEY
    }`
  )
  .then(data => {
    console.log("lat: ", data.data.results[0].geometry.location.lat);
    console.log("lng: ", data.data.results[0].geometry.location.lng);
  });
// theft call;
axios
  .get(
    `https://api.namara.io/v0/data_sets/38ec612b-f522-418f-95f8-10c0fdc8bd52/data/en-0?geometry_format=wkt&api_key=e7fec4e08b35a6956788ad970636d495e7478065d3ec5663cf4776688956d7ed&organization_id=5bdc5265c0b35c45d030159b&project_id=5bdc5ca1b0006245734c433c/export&order=occurrencedate DESC`
  )
  .then(data => {
    theftData = data.data;
    // console.log(theftData);
  });

//assault call
axios
  .get(
    `https://api.namara.io/v0/data_sets/e544c601-4ea3-4a56-8130-1d062d4f29ab/data/en-0?geometry_format=wkt&api_key=e7fec4e08b35a6956788ad970636d495e7478065d3ec5663cf4776688956d7ed&organization_id=5bdc5265c0b35c45d030159b&project_id=5bdc5ca1b0006245734c433c&order=occurrencedate DESC`
  )
  .then(data => {
    assaultData = data.data;
    // console.log(assaultData);
  });

// collision Call

axios
  .get(
    `https://api.namara.io/v0/data_sets/74287125-2cc6-4da1-8079-d59a09acd187/data/en-0?geometry_format=wkt&api_key=e7fec4e08b35a6956788ad970636d495e7478065d3ec5663cf4776688956d7ed&organization_id=5bdc5265c0b35c45d030159b&project_id=5bdc5ca1b0006245734c433c&order=date DESC`
  )
  .then(data => {
    // console.log("received data");
    collisionData = data.data;
  });

console.log(dist);
