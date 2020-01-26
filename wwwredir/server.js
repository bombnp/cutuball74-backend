//Copied from https://cloud.google.com/appengine/docs/standard/nodejs/building-app/writing-web-service


const express = require('express');
const force = require('express-force-domain');

const app = express();

const siteurl = 'https://www.pinkroadcutuball74.com';

app.use(force(siteurl));


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
  });
