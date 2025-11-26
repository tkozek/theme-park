const express = require('express');
const healthRouter = require('./routes/healthRouter');
const customerRouter = require('./routes/customerRouter');
const guestRouter = require('./routes/guestRouter');
const schemaRouter = require('./routes/schemaRouter');
const analyticsRouter = require('./routes/analyticsRouter');

const router = express.Router();

router.use('/', healthRouter);
router.use('/customers', customerRouter);
router.use('/guests', guestRouter);
router.use('/', schemaRouter);
router.use('/analytics', analyticsRouter);
router.use('/', healthRouter);
router.use('/customers', customerRouter);
router.use('/guests', guestRouter);
router.use('/', schemaRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;