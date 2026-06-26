const request = require('supertest');
const app = require('../app.js');

console.log("Starting endpoint unit tests");

const baseErrorFn = (err, res, endMessage) => {
  if (err) {
    throw err;
  };

  console.log(endMessage);
}

// Hello Unit Testing World
request(app)
  .get('/')
  .expect(200)
  .end((err, res) => {
    if (err) throw err;

    if (res.text !== 'elp, im in orbit') {
      throw new Error('ahhhhh');
    }
  })



// Controller - Grade
const files = ["./test-files/Booklet A Qn Paper & Answer.pdf", "./test-files/Booklet A Answer Key.pdf"];
request(app)
  .post('/grade')
  .attach('files', files[0])
  .attach('files', files[1])
  .expect(200)
  .end((err, res) => baseErrorFn(err, res, "Passed: '/grade'"));


const gradeMarkingData = require('./test-files/grade-marking-data.js');
request(app)
  .post('/grade/marking')
  .send(gradeMarkingData)
  .set('Accept', 'application/json')
  .expect(200)
  .end((err, res) => baseErrorFn(err, res, "Passed: '/grade/marking'"));


request(app)
  .post('/sheetGen')
  .attach('file', files[0])
  .expect(200)
  .end((err, res) => baseErrorFn(err,res, "Passed: '/sheetGen"));

