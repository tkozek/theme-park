const express = require('express');
const router = express.Router();
const { HTTP_STATUS, asyncHandler } = require('./routeUtils');
const { dropAndCreateTables, populateSeedData, resetDatabase } = require('../services/schemaService');

router.post('/reset', asyncHandler(async (req, res) => {
    const success = await resetDatabase();
    if (success) {
        return res.json({ success: true, message: 'Database objects dropped.' });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to drop database objects.' });
}, 'Failed to drop database objects.'));

router.post('/drop-and-create', asyncHandler(async (req, res) => {
    const success = await dropAndCreateTables();
    if (success) {
        return res.json({ success: true, message: 'Tables dropped and recreated.' });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to drop/create tables.' });
}, 'Failed to drop/create tables.'));

router.post('/populate', asyncHandler(async (req, res) => {
    const success = await populateSeedData();
    if (success) {
        return res.json({ success: true, message: 'Seed data inserted.' });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to insert seed data.' });
}, 'Failed to insert seed data.'));

module.exports = router;
