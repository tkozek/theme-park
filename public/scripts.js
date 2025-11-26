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


const updateCustomerCache = new Map();

const CUSTOMER_COLUMN_DEFINITIONS = [
    { key: 'customerID', label: 'Customer ID', checkboxId: 'customerIdCheckbox' },
    { key: 'customerName', label: 'Customer Name', checkboxId: 'customerNameCheckbox' },
    { key: 'sex', label: 'Sex', checkboxId: 'sexCheckbox' },
    { key: 'dateOfBirth', label: 'Date of Birth', checkboxId: 'dobCheckbox' },
    { key: 'dateOfVisit', label: 'Date of Visit', checkboxId: 'dateofvisitcheckbox' },
    { key: 'loyaltyID', label: 'Loyalty ID', checkboxId: 'loyaltyIDCheckbox' },
    { key: 'loyaltyPoints', label: 'Points', checkboxId: 'pointsCheckbox' }
];

const DEFAULT_CUSTOMER_COLUMNS = ['customerID', 'customerName', 'sex', 'dateOfBirth'];

let selectedCustomerColumns = new Set(DEFAULT_CUSTOMER_COLUMNS);
let customerProfilesCache = [];

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

function syncProjectionCheckboxes() {
    CUSTOMER_COLUMN_DEFINITIONS.forEach((column) => {
        const checkbox = document.getElementById(column.checkboxId);
        if (checkbox) {
            checkbox.checked = selectedCustomerColumns.has(column.key);
        }
    });
}

function renderCustomerTable(customers = customerProfilesCache) {
    const tableElement = document.getElementById('customersTable');
    if (!tableElement) {
        return;
    }

    const headerRow = tableElement.querySelector('thead tr');
    const tableBody = tableElement.querySelector('tbody');
    if (!headerRow || !tableBody) {
        return;
    }

    headerRow.innerHTML = '';
    tableBody.innerHTML = '';

    const activeColumns = CUSTOMER_COLUMN_DEFINITIONS.filter((column) => selectedCustomerColumns.has(column.key));

    if (!activeColumns.length) {
        const th = document.createElement('th');
        th.textContent = 'No columns selected';
        headerRow.appendChild(th);

        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.textContent = 'Use the projection form to choose at least one column.';
        return;
    }

    activeColumns.forEach((column) => {
        const th = document.createElement('th');
        th.textContent = column.label;
        headerRow.appendChild(th);
    });

    if (!Array.isArray(customers) || customers.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = activeColumns.length;
        cell.textContent = 'No customers found.';
        return;
    }

    customers.forEach((customer) => {
        const row = tableBody.insertRow();
        activeColumns.forEach((column, index) => {
            const cell = row.insertCell(index);
            const rawValue = customer ? customer[column.key] : undefined;
            const displayValue = rawValue === undefined || rawValue === null || rawValue === '' ? '--' : rawValue;
            cell.textContent = displayValue;
        });
    });
}

function handleCustomerProjectionSubmit(event) {
    event.preventDefault();

    const updatedColumns = CUSTOMER_COLUMN_DEFINITIONS.filter((column) => {
        const checkbox = document.getElementById(column.checkboxId);
        return checkbox ? checkbox.checked : false;
    }).map((column) => column.key);

    if (!updatedColumns.length) {
        alert('Select at least one column to display.');
        return;
    }

    selectedCustomerColumns = new Set(updatedColumns);
    renderCustomerTable(customerProfilesCache);
}

function normalizeCustomerProfile(customerRow = {}) {
    const selectValue = (keys, defaultValue = undefined) => {
        for (const key of keys) {
            if (customerRow[key] !== undefined && customerRow[key] !== null) {
                return customerRow[key];
            }
        }
        return defaultValue;
    };

    if (Array.isArray(customerRow)) {
        return {
            customerID: customerRow[0],
            customerName: customerRow[1],
            sex: customerRow[2],
            dateOfBirth: customerRow[3],
            dateOfVisit: customerRow[4],
            loyaltyID: customerRow[5],
            loyaltyPoints: customerRow[6],
            membershipType: customerRow[5] || customerRow[6] ? 'loyalty' : 'guest'
        };
    }

    const normalized = {
        customerID: selectValue(['customerID', 'CustomerID', 'CUSTOMERID', 'customerid']),
        customerName: selectValue(['customerName', 'CustomerName', 'CUSTOMERNAME', 'customername']),
        sex: selectValue(['sex', 'Sex', 'SEX', 'gender', 'Gender']),
        dateOfBirth: selectValue(['dateOfBirth', 'DateOfBirth', 'DATEOFBIRTH', 'DOB', 'dob']),
        dateOfVisit: selectValue(['dateOfVisit', 'DateOfVisit', 'DATEOFVISIT']),
        loyaltyID: selectValue(['loyaltyID', 'LoyaltyID', 'LOYALTYID']),
        loyaltyPoints: selectValue(['loyaltyPoints', 'LoyaltyPoints', 'LOYALTYPOINTS', 'Points', 'POINTS'])
    };

    normalized.membershipType = (selectValue(['membershipType', 'MembershipType', 'MEMBERSHIPTYPE']) || (normalized.loyaltyID !== undefined && normalized.loyaltyID !== null ? 'loyalty' : 'guest'));

    return normalized;
}

function clearUpdateFormFields() {
    ['updateCustomerNewName', 'updateCustomerDob', 'updateCustomerSex', 'updateCustomerVisitDate', 'updateCustomerLoyaltyId', 'updateCustomerLoyaltyPoints'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
        }
    });

    const radios = document.querySelectorAll('input[name="updateMembershipType"]');
    radios.forEach((radio) => {
        radio.checked = false;
    });
}

function setFieldValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value === undefined || value === null ? '' : value;
    }
}

function updateMembershipFieldVisibility(type) {
    const guestFields = document.getElementById('guestUpdateFields');
    const loyaltyFields = document.getElementById('loyaltyUpdateFields');

    if (guestFields) {
        guestFields.style.display = type === 'guest' ? 'block' : 'none';
    }
    if (loyaltyFields) {
        loyaltyFields.style.display = type === 'loyalty' ? 'block' : 'none';
    }
}

function setMembershipRadio(type) {
    const radios = document.querySelectorAll('input[name="updateMembershipType"]');
    let matched = false;
    radios.forEach((radio) => {
        if (radio.value === type) {
            radio.checked = true;
            matched = true;
        } else {
            radio.checked = false;
        }
    });
    updateMembershipFieldVisibility(matched ? type : null);
}

function setUpdateSelectMessage(message) {
    const select = document.getElementById('updateCustomerSelect');
    const detailsElement = document.getElementById('selectedCustomerDetails');
    const hiddenInput = document.getElementById('updateCustomerId');

    if (!select) {
        return;
    }

    select.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = message;
    select.appendChild(option);
    select.disabled = true;

    if (hiddenInput) {
        hiddenInput.value = '';
    }
    if (detailsElement) {
        detailsElement.textContent = message;
    }
    clearUpdateFormFields();
    updateMembershipFieldVisibility(null);
}

function updateCustomerSelectOptions(customers) {
    const select = document.getElementById('updateCustomerSelect');
    const detailsElement = document.getElementById('selectedCustomerDetails');
    const hiddenInput = document.getElementById('updateCustomerId');

    if (!select) {
        return;
    }

    updateCustomerCache.clear();
    select.innerHTML = '';

    if (!Array.isArray(customers) || customers.length === 0) {
        setUpdateSelectMessage('No customer tuples available. Insert data first.');
        return;
    }

    select.disabled = false;
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select a customer...';
    select.appendChild(placeholderOption);

    customers.forEach((customerRow) => {
        const normalized = normalizeCustomerProfile(customerRow);
        if (normalized.customerID === undefined || normalized.customerID === null) {
            return;
        }

        const idString = String(normalized.customerID);
        updateCustomerCache.set(idString, normalized);

        const option = document.createElement('option');
        option.value = idString;
        const displayName = normalized.customerName || 'Unnamed';
        const badge = normalized.membershipType === 'loyalty' ? 'Loyalty' : 'Guest';
        option.textContent = `#${idString} - ${displayName} (${badge})`;
        select.appendChild(option);
    });

    if (hiddenInput) {
        hiddenInput.value = '';
    }
    if (detailsElement) {
        detailsElement.textContent = 'Select a customer to view their current details.';
    }
    clearUpdateFormFields();
    updateMembershipFieldVisibility(null);
}

async function loadCustomerProfilesForUpdate() {
    const select = document.getElementById('updateCustomerSelect');

    if (select) {
        select.disabled = true;
        select.innerHTML = '';
        const loadingOption = document.createElement('option');
        loadingOption.value = '';
        loadingOption.textContent = 'Loading customers...';
        select.appendChild(loadingOption);
    }

    try {
        const response = await fetch('/customers/profiles');
        const data = await response.json();
        if (response.ok && data.success) {
            customerProfilesCache = data.data || [];
            renderCustomerTable(customerProfilesCache);
            updateCustomerSelectOptions(customerProfilesCache);
        } else {
            customerProfilesCache = [];
            renderCustomerTable([]);
            if (select) {
                setUpdateSelectMessage(data.message || 'Unable to load customer tuples.');
            }
        }
    } catch (error) {
        customerProfilesCache = [];
        renderCustomerTable([]);
        if (select) {
            setUpdateSelectMessage('Error loading customer tuples.');
        }
    }
}

function handleCustomerSelectionChange() {
    const select = document.getElementById('updateCustomerSelect');
    const hiddenInput = document.getElementById('updateCustomerId');
    const detailsElement = document.getElementById('selectedCustomerDetails');

    if (!select) {
        return;
    }

    const selectedId = select.value;
    if (hiddenInput) {
        hiddenInput.value = selectedId || '';
    }

    if (!selectedId) {
        if (detailsElement) {
            detailsElement.textContent = 'Select a customer to view their current details.';
        }
        clearUpdateFormFields();
        updateMembershipFieldVisibility(null);
        return;
    }

    const customer = updateCustomerCache.get(selectedId);
    if (!customer) {
        if (detailsElement) {
            detailsElement.textContent = `Selected CustomerID: ${selectedId}`;
        }
        clearUpdateFormFields();
        updateMembershipFieldVisibility(null);
        return;
    }

    setFieldValue('updateCustomerNewName', customer.customerName || '');
    setFieldValue('updateCustomerDob', customer.dateOfBirth || '');
    setFieldValue('updateCustomerSex', customer.sex || '');

    const membershipType = customer.membershipType === 'loyalty' ? 'loyalty' : 'guest';
    setMembershipRadio(membershipType);

    if (membershipType === 'guest') {
        setFieldValue('updateCustomerVisitDate', customer.dateOfVisit || '');
        setFieldValue('updateCustomerLoyaltyId', '');
        setFieldValue('updateCustomerLoyaltyPoints', '');
    } else {
        setFieldValue('updateCustomerVisitDate', '');
        setFieldValue('updateCustomerLoyaltyId', customer.loyaltyID);
        setFieldValue('updateCustomerLoyaltyPoints', customer.loyaltyPoints !== undefined && customer.loyaltyPoints !== null ? customer.loyaltyPoints : '');
    }

    if (detailsElement) {
        const nameLabel = customer.customerName || 'Unnamed';
        const sexLabel = customer.sex || 'Unknown sex';
        const dobLabel = customer.dateOfBirth || 'Unknown DOB';
        const typeLabel = membershipType === 'loyalty' ? 'Loyalty Member' : 'Guest';
        detailsElement.textContent = `Selected tuple: #${selectedId} - ${nameLabel} (${typeLabel}, ${sexLabel}, DOB: ${dobLabel})`;
    }
}

function handleMembershipTypeChange(event) {
    if (!event || !event.target) {
        return;
    }
    updateMembershipFieldVisibility(event.target.value);
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

// Reset schema: drop, create, and populate
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

// Drop and recreate tables only
async function dropAndCreateSchema() {
    const messageElement = document.getElementById('resetResultMsg');
    if (!messageElement) {
        return;
    }

    try {
        const response = await fetch('/drop-and-create', {
            method: 'POST'
        });
        const responseData = await response.json();

        if (responseData.success) {
            messageElement.textContent = 'Tables dropped and recreated successfully.';
            refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || 'Failed to drop/create tables.';
        }
    } catch (error) {
        messageElement.textContent = 'Error dropping/creating tables.';
    }
}

// Populate tables with seed data only
async function populateSeedData() {
    const messageElement = document.getElementById('resetResultMsg');
    if (!messageElement) {
        return;
    }

    try {
        const response = await fetch('/populate', {
            method: 'POST'
        });
        const responseData = await response.json();

        if (responseData.success) {
            messageElement.textContent = 'Seed data inserted successfully.';
            refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || 'Failed to insert seed data.';
        }
    } catch (error) {
        messageElement.textContent = 'Error inserting seed data.';
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

// Updates Customer details (all non-key attributes).
async function updateCustomerName(event) {
    event.preventDefault();

    const customerIDValue = document.getElementById('updateCustomerId').value;
    const messageElement = document.getElementById('updateNameResultMsg');

    if (!customerIDValue) {
        messageElement.textContent = 'Please select a customer tuple before updating.';
        return;
    }

    const payload = {};
    const newName = document.getElementById('updateCustomerNewName').value.trim();
    const newDob = document.getElementById('updateCustomerDob').value;
    const newSex = document.getElementById('updateCustomerSex').value.trim();
    const visitDate = document.getElementById('updateCustomerVisitDate').value;
    const loyaltyIdValue = document.getElementById('updateCustomerLoyaltyId').value.trim();
    const loyaltyPointsValue = document.getElementById('updateCustomerLoyaltyPoints').value;
    const membershipRadio = document.querySelector('input[name="updateMembershipType"]:checked');
    const cachedProfile = updateCustomerCache.get(customerIDValue);

    if (newName) {
        payload.customerName = newName;
    }
    if (newDob) {
        payload.dateOfBirth = newDob;
    }
    if (newSex) {
        payload.sex = newSex;
    }

    if (membershipRadio) {
        payload.membershipType = membershipRadio.value;
        if (membershipRadio.value === 'guest') {
            if (visitDate) {
                payload.dateOfVisit = visitDate;
            } else if (cachedProfile && cachedProfile.membershipType !== 'guest') {
                messageElement.textContent = 'Provide a visit date when converting a loyalty member to a guest.';
                return;
            }
        } else if (membershipRadio.value === 'loyalty') {
            if (!loyaltyIdValue) {
                messageElement.textContent = 'Provide a Loyalty ID for loyalty members.';
                return;
            }
            payload.loyaltyID = loyaltyIdValue;
            if (loyaltyPointsValue !== '') {
                const parsedPoints = Number(loyaltyPointsValue);
                if (Number.isNaN(parsedPoints) || parsedPoints < 0) {
                    messageElement.textContent = 'Points must be a non-negative number.';
                    return;
                }
                payload.loyaltyPoints = parsedPoints;
            }
        }
    } else if (visitDate || loyaltyIdValue || loyaltyPointsValue) {
        messageElement.textContent = 'Select a membership type to apply these changes.';
        return;
    }

    if (!Object.keys(payload).length) {
        messageElement.textContent = 'Enter at least one field to update.';
        return;
    }

    try {
        const response = await fetch(`/customers/${customerIDValue}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            messageElement.textContent = 'Customer updated successfully!';
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
    syncProjectionCheckboxes();

    const resetButton = document.getElementById('resetSchemaButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetSchema);
    }

    const dropCreateButton = document.getElementById('dropCreateButton');
    if (dropCreateButton) {
        dropCreateButton.addEventListener('click', dropAndCreateSchema);
    }

    const populateButton = document.getElementById('populateButton');
    if (populateButton) {
        populateButton.addEventListener('click', populateSeedData);
    }

    const insertForm = document.getElementById('insertCustomerForm');
    if (insertForm) {
        insertForm.addEventListener('submit', insertCustomer);
    }

    const updateForm = document.getElementById('updateCustomerNameForm');
    if (updateForm) {
        updateForm.addEventListener('submit', updateCustomerName);
    }

    const updateCustomerSelect = document.getElementById('updateCustomerSelect');
    if (updateCustomerSelect) {
        updateCustomerSelect.addEventListener('change', handleCustomerSelectionChange);
    }

    const membershipRadios = document.querySelectorAll('input[name="updateMembershipType"]');
    membershipRadios.forEach((radio) => {
        radio.addEventListener('change', handleMembershipTypeChange);
    });

    const projectionForm = document.getElementById('customerProjectionForm');
    if (projectionForm) {
        projectionForm.addEventListener('submit', handleCustomerProjectionSubmit);
    }

    const countButton = document.getElementById('countCustomersButton');
    if (countButton) {
        countButton.addEventListener('click', countCustomers);
    }
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
async function refreshCustomers() {
    await Promise.all([loadCustomerProfilesForUpdate(), fetchAndDisplayGuestVisits()]);
}
