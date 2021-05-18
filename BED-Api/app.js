'use strict';

const express = require('express');
const app = express();
const port = 3000;

const agenda = require('./routes/agenda');

app.use('/agenda',agenda);

app.listen(port, () => {
    console.log(`Express server listening on port :${port}`)
})