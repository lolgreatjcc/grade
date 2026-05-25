const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'staging') {
  require('dotenv').config({ path: `./.env_staging` });
} else {
  require('dotenv').config({ path: `./.env` });
}
const port = 3000

var jsonParser = bodyParser.json();

app.use(jsonParser);

//import controllers
const grade = require('./controller/grade.js');

//use controllers
app.use(grade);

app.get('/', (req,res) => {
  res.send("elp, im in orbit");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});