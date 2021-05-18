'use strict';

const express = require('express');
const router = express.Router();

const googleAPI = require('./../api/google/_index');

router.post('/', (req, res) => {
    const gAPI = new googleAPI();
    gAPI.getEventList().then((events) => {
        res.json({
            title: "agenda",
            events: events
        });
    });
});

module.exports = router;
