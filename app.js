const express = require('express');
const cors = require('cors');
const {join} = require('path')
const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, './Upload')))
app.use(cors())

module.exports = app;