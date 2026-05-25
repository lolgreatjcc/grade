const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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