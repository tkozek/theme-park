const express = require('express');
const appService = require('./appService');

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

const router = express.Router();

// ----------------------------------------------------------
// API endpoints for Customers
router.get('/check-db-connection', async (req, res) => {
    try {
        const isConnect = await appService.testOracleConnection();
        res.status(isConnect ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE).json({ success: isConnect });
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Unable to verify database connection.', error: err.message });
    }
});

router.get('/customers', async (req, res) => {
    try {
        const customers = await appService.fetchCustomers();
        res.json({ success: true, data: customers });
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to fetch customers.', error: err.message });
    }
});

router.get('/guests', async (req, res) => {
    try {
        const guests = await appService.fetchGuestVisits();
        res.json({ success: true, data: guests });
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to fetch guest visits.', error: err.message });
    }
});

router.post('/customers', async (req, res) => {
    const { customerID, customerName, dateOfBirth, sex, dateOfVisit, loyaltyID, loyaltyPoints } = req.body;

    try {
        const inserted = await appService.insertCustomer({ customerID, customerName, dateOfBirth, sex, dateOfVisit, loyaltyID, loyaltyPoints });
        if (inserted) {
            res.status(HTTP_STATUS.CREATED).json({ success: true, message: 'Customer created.' });
        } else {
            res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Unable to create customer.' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message });
    }
});

router.patch('/customers/:customerID', async (req, res) => {
    const { customerID } = req.params;
    const { customerName } = req.body;

    if (!customerName) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'customerName is required.' });
    }

    try {
        const updated = await appService.updateCustomerName(customerID, customerName);
        if (updated) {
            res.json({ success: true, message: 'Customer updated.' });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Customer not found.' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to update customer.', error: err.message });
    }
});

router.get('/customers/count', async (req, res) => {
    try {
        const count = await appService.countCustomers();
        if (count >= 0) {
            res.json({ success: true, count });
        } else {
            res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Unable to count customers.' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Unable to count customers.', error: err.message });
    }
});

router.post('/reset', async (req, res) => {
    try {
        const success = await appService.resetDatabase();
        if (success) {
            res.json({ success: true, message: 'Database objects dropped.' });
        } else {
            res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to drop database objects.' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to drop database objects.', error: err.message });
    }
});


module.exports = router;