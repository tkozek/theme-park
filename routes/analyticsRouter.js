const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./routeUtils');
const {
    getMinAvgPointsByBirthYear,
    getCustomersWhoRodeAllRides,
    listRideNames,
    getCustomersByRide,
    getAveragePointsByGender,
    getGuestCountsByMonth
} = require('../services/analyticsService');

router.get('/min-avg-points-by-birth-year', asyncHandler(async (req, res) => {
    const result = await getMinAvgPointsByBirthYear();
    res.json({ success: true, data: result });
}, 'Failed to run Query 9.'));

router.get('/customers-rode-all-rides', asyncHandler(async (req, res) => {
    const result = await getCustomersWhoRodeAllRides();
    res.json({ success: true, data: result });
}, 'Failed to run Query 10.'));

router.get('/rides', asyncHandler(async (req, res) => {
    const rides = await listRideNames();
    res.json({ success: true, data: rides });
}, 'Failed to list rides.'));

router.get('/rides/:rideName/customers', asyncHandler(async (req, res) => {
    const { rideName } = req.params;
    const customers = await getCustomersByRide(rideName);
    res.json({ success: true, data: customers });
}, 'Failed to fetch customers for ride.'));

router.get('/avg-points-by-gender', asyncHandler(async (req, res) => {
    const stats = await getAveragePointsByGender();
    res.json({ success: true, data: stats });
}, 'Failed to run Query 7.'));

router.get('/guest-counts-by-month', asyncHandler(async (req, res) => {
    const stats = await getGuestCountsByMonth();
    res.json({ success: true, data: stats });
}, 'Failed to run Query 8.'));

module.exports = router;
