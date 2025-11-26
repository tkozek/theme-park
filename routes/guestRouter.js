const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./routeUtils');
const { fetchGuestVisits } = require('../services/customerService');

router.get('/', asyncHandler(async (req, res) => {
    const guests = await fetchGuestVisits();
    res.json({ success: true, data: guests });
}, 'Failed to fetch guest visits.'));

module.exports = router;
