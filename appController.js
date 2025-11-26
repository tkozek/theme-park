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

router.get('/customers/profiles', async (req, res) => {
    try {
        const profiles = await appService.fetchCustomerProfiles();
        res.json({ success: true, data: profiles });
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to fetch customer profiles.', error: err.message });
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
    const updates = req.body || {};

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'At least one field is required.' });
    }

    try {
        const updated = await appService.updateCustomerDetails(customerID, updates);
        if (updated) {
            res.json({ success: true, message: 'Customer updated.' });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Customer not found.' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message || 'Failed to update customer.' });
    }
});

router.delete('/customers/:customerID', async (req, res) => {
    const { customerID } = req.params;

    try {
        const deleted = await appService.deleteCustomer(customerID);
        if (deleted) {
            res.json({ success: true, message: 'Customer deleted sucessfully !' });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Customer not found!' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message || 'Failed to delete the customer' });
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

router.post('/drop-and-create', async (req, res) => {
    try {
        const success = await appService.dropAndCreateTables();
        if (success) {
            res.json({ success: true, message: 'Tables dropped and recreated.' });
        } else {
            res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to drop/create tables.' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to drop/create tables.', error: err.message });
    }
});

router.post('/populate', async (req, res) => {
    try {
        const success = await appService.populateSeedData();
        if (success) {
            res.json({ success: true, message: 'Seed data inserted.' });
        } else {
            res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to insert seed data.' });
        }
    } catch (err) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to insert seed data.', error: err.message });
    }
});


module.exports = router;