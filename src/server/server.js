var path = require('path')
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// Initialize app and parser
const app = express();
app.use(express.json())

// Cors 
const cors = require('cors');
app.use(cors());

// Initialize API

/* : process.env.API_ID,
: process.env.API_KEY*/


// set variables
const port = 8081;

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

// starting the server
app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
    console.log(textapi);
})


module.exports = app
