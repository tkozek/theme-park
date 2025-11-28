import { refreshCustomers } from './refresh.js';
import { getCachedProfile } from './customerProfiles.js';

export async function insertCustomer(event) {
    event.preventDefault();

    const customerIDValue = document.getElementById('insertCustomerId').value;
    const customerNameValue = document.getElementById('insertCustomerName').value;
    const dateOfBirthValue = document.getElementById('insertDOB').value;
    const sexValue = document.getElementById('insertSex').value;
    const dateOfVisitValue = document.getElementById('insertVisitDate').value;
    const loyaltyIdValue = document.getElementById('insertLoyaltyId').value;
    const loyaltyPointsValue = document.getElementById('insertPoints').value;
    const messageElement = document.getElementById('insertResultMsg');

    const payload = {
        customerID: Number(customerIDValue),
        customerName: customerNameValue.trim(),
        dateOfBirth: dateOfBirthValue,
        sex: sexValue.trim()
    };

    if (!payload.customerID || Number.isNaN(payload.customerID) || !payload.customerName || !payload.dateOfBirth || !payload.sex) {
        messageElement.textContent = 'Customer ID, name, date of birth, and sex are required.';
        return;
    }

    if (dateOfVisitValue) {
        payload.dateOfVisit = dateOfVisitValue;
    }

    if (loyaltyIdValue) {
        payload.loyaltyID = loyaltyIdValue.trim();
    }

    if (loyaltyPointsValue) {
        payload.loyaltyPoints = Number(loyaltyPointsValue);
    }

    try {
        const response = await fetch('/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            messageElement.textContent = 'Customer inserted successfully!';
            event.target.reset();
            await refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || 'Error inserting customer!';
        }
    } catch (error) {
        messageElement.textContent = 'Error inserting customer!';
    }
}

export async function updateCustomerName(event) {
    event.preventDefault();

    const customerIDValue = document.getElementById('updateCustomerId').value;
    const messageElement = document.getElementById('updateNameResultMsg');

    if (!customerIDValue) {
        messageElement.textContent = 'Please select a loyalty member tuple before updating.';
        return;
    }

    const payload = {};
    const newName = document.getElementById('updateCustomerNewName').value.trim();
    const newDob = document.getElementById('updateCustomerDob').value;
    const newSex = document.getElementById('updateCustomerSex').value.trim();
    const loyaltyIdValue = document.getElementById('updateCustomerLoyaltyId').value.trim();
    const loyaltyPointsValue = document.getElementById('updateCustomerLoyaltyPoints').value;
    const cachedProfile = getCachedProfile(customerIDValue);

    if (newName) {
        payload.customerName = newName;
    }
    if (newDob) {
        payload.dateOfBirth = newDob;
    }
    if (newSex) {
        payload.sex = newSex;
    }

    if (!loyaltyIdValue) {
        messageElement.textContent = 'Provide a Loyalty ID for the selected member.';
        return;
    }
    if (!cachedProfile || cachedProfile.loyaltyID !== loyaltyIdValue) {
        payload.loyaltyID = loyaltyIdValue;
    }

    if (loyaltyPointsValue !== '') {
        const parsedPoints = Number(loyaltyPointsValue);
        if (Number.isNaN(parsedPoints) || parsedPoints < 0) {
            messageElement.textContent = 'Points must be a non-negative number.';
            return;
        }
        if (!cachedProfile || Number(cachedProfile.loyaltyPoints) !== parsedPoints) {
            payload.loyaltyPoints = parsedPoints;
        }
    }

    if (!Object.keys(payload).length) {
        messageElement.textContent = 'Enter at least one field to update.';
        return;
    }

    try {
        const response = await fetch(`/customers/${customerIDValue}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            messageElement.textContent = 'Customer updated successfully!';
            await refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || 'Error updating customer!';
        }
    } catch (error) {
        messageElement.textContent = 'Error updating customer!';
    }
}

export async function deleteLoyaltyMembership(event) {
    event.preventDefault();

    const customerIdInput = document.getElementById('deleteCustomerId') || document.getElementById('insertId');
    const customerIDValue = customerIdInput ? customerIdInput.value : '';
    const messageElement = document.getElementById('deleteResultMsg');
    const setMessage = (text) => {
        if (messageElement) {
            messageElement.textContent = text;
        }
    };

    if (!customerIDValue) {
        setMessage('Enter a CustomerID to delete the loyalty member record.');
        return;
    }

    try {
        const response = await fetch(`/customers/${customerIDValue}/loyalty`, {
            method: 'DELETE'
        });

        const responseData = await response.json();
        if (response.ok && responseData.success) {
            setMessage('Loyalty membership deleted successfully!');
            await refreshCustomers();
        } else {
            setMessage(responseData.message || 'Error deleting loyalty membership!');
        }
    } catch (error) {
        setMessage('Error deleting loyalty membership!');
    }
}
