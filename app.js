const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'staging') {
  require('dotenv').config({ path: `./.env_staging` });
} else {
  require('dotenv').config({ path: `./.env` });
}

const port = 3001

const jsonParser = bodyParser.json();

//app.options('*', cors());
app.use(cors());
app.use(jsonParser);

//import controllers
const grade = require('./controller/grade.js');
const auth = require('./controller/auth.js');

//use controllers
app.use(grade);
app.use(auth);

app.get('/', (req,res) => {
  res.send("elp, im in orbit");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});