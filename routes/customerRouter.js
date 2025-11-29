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

router.get('/guests', asyncHandler(async (req, res) => {
    const guests = await customerService.fetchGuestVisits();
    res.json({ success: true, data: guests });
}, 'Failed to fetch guest visits.'));

router.get('/loyalty-members', asyncHandler(async (req, res) => {
    const loyaltyMembers = await customerService.fetchLoyaltyMembers();
    res.json({ success: true, data: loyaltyMembers });
}, 'Failed to fetch loyalty members.'));

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

router.post('/selection', asyncHandler(async (req, res) => {
    const { rules } = req.body || {};

    if (!Array.isArray(rules) || !rules.length) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Provide at least one rule.' });
    }

    try {
        const result = await customerService.runCustomerSelection(rules);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message || 'Failed to run customer selection.' });
    }
}, 'Failed to run customer selection.'));

router.post('/projection', asyncHandler(async (req, res) => {
    const { attributes } = req.body || {};

    if (!Array.isArray(attributes) || !attributes.length) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Select at least one attribute.' });
    }

    try {
        const result = await customerService.projectCustomerAttributes(attributes);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message || 'Failed to run customer projection.' });
    }
}, 'Failed to run customer projection.'));

router.delete('/loyaltymembers/:customerID', asyncHandler(async (req, res) => {
    const { customerID } = req.params;
    const removed = await customerService.deleteLoyaltyMembership(customerID);
    if (removed) {
        return res.json({ success: true, message: 'Loyalty membership deleted.' });
    }
    res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Customer not found for that customer ID.' });
}, 'Failed to delete loyalty membership.'));

router.delete('/guests/:customerID', asyncHandler(async (req, res) => {
    const { customerID } = req.params;
    const removed = await customerService.deleteGuestVisit(customerID);
    if (removed) {
        return res.json({ success: true, message: 'Guest visit deleted.' });
    }
    res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Guest visit not found for that customer ID.' });
}, 'Failed to delete guest record.'));

router.delete('/:customerID', asyncHandler(async (req, res) => {
    const { customerID } = req.params;
    const deleted = await customerService.deleteCustomer(customerID);
    if (deleted) {
        return res.json({ success: true, message: 'Customer deleted successfully.' });
    }
    res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Customer not found.' });
}, 'Failed to delete customer.'));

router.get('/count', asyncHandler(async (req, res) => {
    const count = await customerService.countCustomers();
    if (count >= 0) {
        return res.json({ success: true, count });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Unable to count customers.' });
}, 'Unable to count customers.'));

router.get('/stats', asyncHandler(async (req, res) => {
    const counts = await customerService.getCustomerStats();
    res.json({ success: true, counts });
}, 'Unable to fetch customer statistics.'));

module.exports = router;
