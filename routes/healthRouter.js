const express = require('express');
const router = express.Router();
const { asyncHandler, HTTP_STATUS } = require('./routeUtils');
const { testOracleConnection } = require('../services/healthService');

router.get('/check-db-connection', asyncHandler(async (req, res) => {
	const isConnected = await testOracleConnection();
	res.status(isConnected ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE).json({ success: isConnected });
}, 'Unable to verify database connection.'));

module.exports = router;
