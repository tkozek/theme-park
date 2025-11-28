const express = require('express');
const healthRouter = require('./routes/healthRouter');
const customerRouter = require('./routes/customerRouter');
const schemaRouter = require('./routes/schemaRouter');
const analyticsRouter = require('./routes/analyticsRouter');

const router = express.Router();

router.use('/', healthRouter);
router.use('/customers', customerRouter);
router.use('/', schemaRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;