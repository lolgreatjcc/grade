const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'staging') {
  require('dotenv').config({ path: path.resolve(__direname, '.env_staging') });
} else {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
}

const port = process.env.PORT || 3001;

const jsonParser = bodyParser.json({ limit: '10mb' });

//app.options('*', cors());
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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;