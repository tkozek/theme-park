const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./routeUtils');
const { getMinAvgPointsByBirthYear, getCustomersWhoRodeAllRides } = require('../services/analyticsService');

router.get('/min-avg-points-by-birth-year', asyncHandler(async (req, res) => {
    const result = await getMinAvgPointsByBirthYear();
    res.json({ success: true, data: result });
}, 'Failed to run Query 9.'));

router.get('/customers-rode-all-rides', asyncHandler(async (req, res) => {
    const result = await getCustomersWhoRodeAllRides();
    res.json({ success: true, data: result });
}, 'Failed to run Query 10.'));

module.exports = router;