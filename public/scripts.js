/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');
    if (!statusElem) {
        return;
    }

    try {
        const response = await fetch('/check-db-connection');
        const data = await response.json();
        statusElem.textContent = data.success ? 'connected' : 'unable to connect';
    } catch (error) {
        statusElem.textContent = 'connection error';
    } finally {
        if (loadingGifElem) {
            loadingGifElem.style.display = 'none';
        }
        statusElem.style.display = 'inline';
    }
}

// Fetches data from the Customer table and displays it.
async function fetchAndDisplayCustomers() {
    const tableElement = document.getElementById('customersTable');
    if (!tableElement) {
        return;
    }

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = '';

    try {
        const response = await fetch('/customers');
        const responseData = await response.json();
        const customers = responseData.data || [];

        if (!customers.length) {
            const row = tableBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 4;
            cell.textContent = 'No customers found.';
            return;
        }

        customers.forEach((customerRow) => {
            const row = tableBody.insertRow();
            const values = Array.isArray(customerRow) ? customerRow : Object.values(customerRow);
            values.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } catch (error) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.textContent = 'Unable to load customers.';
    }
}

// Fetches data from the Guest table and displays visit history.
async function fetchAndDisplayGuestVisits() {
    const tableElement = document.getElementById('guestVisitsTable');
    if (!tableElement) {
        return;
    }

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = '';

    try {
        const response = await fetch('/guests');
        const responseData = await response.json();
        const visits = responseData.data || [];

        if (!visits.length) {
            const row = tableBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 3;
            cell.textContent = 'No guest visits recorded.';
            return;
        }

        visits.forEach((visit) => {
            const values = Array.isArray(visit) ? visit : Object.values(visit);
            const row = tableBody.insertRow();
            values.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } catch (error) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 3;
        cell.textContent = 'Unable to load guest visits.';
    }
}

// This function drops all tables via dropall.sql
async function resetSchema() {
    const messageElement = document.getElementById('resetResultMsg');
    if (!messageElement) {
        return;
    }

    try {
        const response = await fetch('/reset', {
            method: 'POST'
        });
        const responseData = await response.json();

        if (responseData.success) {
            messageElement.textContent = 'Database schema reset successfully.';
            refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || 'Failed to reset database.';
        }
    } catch (error) {
        messageElement.textContent = 'Error resetting database.';
    }
}

// Inserts new records into the Customer table.
async function insertCustomer(event) {
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            messageElement.textContent = 'Customer inserted successfully!';
            event.target.reset();
            refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || 'Error inserting customer!';
        }
    } catch (error) {
        messageElement.textContent = 'Error inserting customer!';
    }
}

// Updates Customer names based on CustomerID.
async function updateCustomerName(event) {
    event.preventDefault();

    const customerIDValue = document.getElementById('updateCustomerId').value;
    const customerNameValue = document.getElementById('updateCustomerNewName').value;
    const messageElement = document.getElementById('updateNameResultMsg');

    const customerID = Number(customerIDValue);
    const customerName = customerNameValue.trim();

    if (!customerID || Number.isNaN(customerID) || !customerName) {
        messageElement.textContent = 'Customer ID and new name are required.';
        return;
    }

    try {
        const response = await fetch(`/customers/${customerID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerName })
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            messageElement.textContent = 'Customer updated successfully!';
            event.target.reset();
            refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || 'Error updating customer!';
        }
    } catch (error) {
        messageElement.textContent = 'Error updating customer!';
    }
}

// Counts rows in the Customer table.
async function countCustomers() {
    const messageElement = document.getElementById('countResultMsg');
    if (!messageElement) {
        return;
    }

    try {
        const response = await fetch('/customers/count');
        const responseData = await response.json();

        if (response.ok && responseData.success) {
            const tupleCount = responseData.count;
            messageElement.textContent = `Number of customers: ${tupleCount}`;
        } else {
            messageElement.textContent = responseData.message || 'Error counting customers!';
        }
    } catch (error) {
        messageElement.textContent = 'Error counting customers!';
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    refreshCustomers();

    const resetButton = document.getElementById('resetSchemaButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetSchema);
    }

    const insertForm = document.getElementById('insertCustomerForm');
    if (insertForm) {
        insertForm.addEventListener('submit', insertCustomer);
    }

    const updateForm = document.getElementById('updateCustomerNameForm');
    if (updateForm) {
        updateForm.addEventListener('submit', updateCustomerName);
    }

    const countButton = document.getElementById('countCustomersButton');
    if (countButton) {
        countButton.addEventListener('click', countCustomers);
    }
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function refreshCustomers() {
    fetchAndDisplayCustomers();
    fetchAndDisplayGuestVisits();
}
