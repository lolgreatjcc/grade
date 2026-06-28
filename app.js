const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
const path = require('path');


// Dynamically changes server state and variables based on development and production.
if (process.env.NODE_ENV === 'staging') {
  require('dotenv').config({ path: path.resolve(__direname, '.env_staging') });
} else {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
}

const port = process.env.PORT || 3001;

// Parses json if present automatically
const jsonParser = bodyParser.json({ limit: '10mb' });

app.use(cors());
app.use(jsonParser);

//import controllers
const grade = require('./controller/grade.js');
const auth = require('./controller/auth.js');
const sheetGen = require('./controller/sheetGen.js')

//use controllers
app.use(grade);
app.use(auth);
app.use(sheetGen);
app.get('/', (req, res) => {
  res.send("elp, im in orbit");
});

// Only starts up a 'listening' server if the app.js is run directly.
// Relevant for unit tests (see /tests/endpoint-test.js) 
// as unit tests needs app.js but we don't want to run a 'listening' server when app.js is imported.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;