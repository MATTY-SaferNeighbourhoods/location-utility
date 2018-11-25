const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require ('axios');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text());
app.use(cors());

let PORT = process.env.PORT || 7069; 

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}!`);
  });