/* eslint-disable no-unused-expressions */
const express = require('express'); /* Import express framework */
const path = require('path'); /* The path module provides utilities for working with file and directory paths. */
const bodyParser = require('body-parser'); /* The body-parser module give possibility parse body of request */

const cors = require('cors'); /* The cors module gives access to requests to our app from the chosen host. */
const mongoose = require('mongoose'); /* The mongoose module give possibility to work with MongoDB */
const contractService = require('./app/services/contract.service');
const s = require('./app/services/encryption.service');

const jsonParser = bodyParser.json(); /* Define type of parse json */

const app = express(); /* Init app */

const port = 5445; /* Port for local development */

require('dotenv').config(); /* Adjusting access to env */

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
}); /* Adjusting parser */

app.use(cors()); /* Connecting cors to app */
app.get(
  '/',
  express.static(path.join(__dirname, './app/reports'))
); /* Adjusting static folder for saving files */
require('./app/routers/routers')(
  app,
  jsonParser,
  urlencodedParser
); /* Adjusting routers for requests */

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(async () => {
    app.listen(port, () => {
      console.log('Server has started!');
    });
    console.log(s.bcryptCreatePass('12345678'));
    contractService.contractEventEmitter();
  }); /* Connecting db and launching app on 3000 port */
