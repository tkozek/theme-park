const express = require('express');
const router = express.Router();
const { HTTP_STATUS, asyncHandler } = require('./routeUtils');
const customerService = require('../services/customerService');

router.get('/', asyncHandler(async (req, res) => {
    const customers = await customerService.fetchCustomers();
    res.json({ success: true, data: customers });
}, 'Failed to fetch customers.'));

router.get('/profiles', asyncHandler(async (req, res) => {
    const profiles = await customerService.fetchCustomerProfiles();
    res.json({ success: true, data: profiles });
}, 'Failed to fetch customer profiles.'));

router.post('/', asyncHandler(async (req, res) => {
    try {
        const inserted = await customerService.insertCustomer(req.body || {});
        if (inserted) {
            return res.status(HTTP_STATUS.CREATED).json({ success: true, message: 'Customer created.' });
        }
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Unable to create customer.' });
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message });
    }
}, 'Failed to create customer.'));

router.patch('/:customerID', asyncHandler(async (req, res) => {
    const { customerID } = req.params;
    const updates = req.body || {};

    if (!Object.keys(updates).length) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'At least one field is required.' });
    }

    try {
        const updated = await customerService.updateCustomerDetails(customerID, updates);
        if (updated) {
            return res.json({ success: true, message: 'Customer updated.' });
        }
        return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Customer not found.' });
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message || 'Failed to update customer.' });
    }
}, 'Failed to update customer.'));

router.get('/count', asyncHandler(async (req, res) => {
    const count = await customerService.countCustomers();
    if (count >= 0) {
        return res.json({ success: true, count });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Unable to count customers.' });
}, 'Unable to count customers.'));

module.exports = router;
