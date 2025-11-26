import { getUpdateCustomerCache, setCustomerProfilesCache, getCustomerProfilesCache } from './state.js';
import { clearUpdateFormFields, setFieldValue, setMembershipRadio, updateMembershipFieldVisibility, setUpdateSelectMessage } from './domHelpers.js';
import { renderCustomerTable } from './tableRenderer.js';

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

    normalized.membershipType = selectValue(['membershipType', 'MembershipType', 'MEMBERSHIPTYPE']) ||
        (normalized.loyaltyID !== undefined && normalized.loyaltyID !== null ? 'loyalty' : 'guest');

    return normalized;
}

export function updateCustomerSelectOptions(customers) {
    const select = document.getElementById('updateCustomerSelect');
    const detailsElement = document.getElementById('selectedCustomerDetails');
    const hiddenInput = document.getElementById('updateCustomerId');
    const cache = getUpdateCustomerCache();

    if (!select) {
        return;
    }

    cache.clear();
    select.innerHTML = '';

    if (!Array.isArray(customers) || !customers.length) {
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
        cache.set(idString, normalized);

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

export async function loadCustomerProfilesForUpdate() {
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
            const profiles = data.data || [];
            setCustomerProfilesCache(profiles);
            renderCustomerTable(profiles);
            updateCustomerSelectOptions(profiles);
        } else {
            setCustomerProfilesCache([]);
            renderCustomerTable([]);
            if (select) {
                setUpdateSelectMessage(data.message || 'Unable to load customer tuples.');
            }
        }
    } catch (error) {
        setCustomerProfilesCache([]);
        renderCustomerTable([]);
        if (select) {
            setUpdateSelectMessage('Error loading customer tuples.');
        }
    }
}

export function handleCustomerSelectionChange() {
    const select = document.getElementById('updateCustomerSelect');
    const hiddenInput = document.getElementById('updateCustomerId');
    const detailsElement = document.getElementById('selectedCustomerDetails');
    const cache = getUpdateCustomerCache();

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

    const customer = cache.get(selectedId);
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
        setFieldValue('updateCustomerLoyaltyPoints', customer.loyaltyPoints ?? '');
    }

    if (detailsElement) {
        const nameLabel = customer.customerName || 'Unnamed';
        const sexLabel = customer.sex || 'Unknown sex';
        const dobLabel = customer.dateOfBirth || 'Unknown DOB';
        const typeLabel = membershipType === 'loyalty' ? 'Loyalty Member' : 'Guest';
        detailsElement.textContent = `Selected tuple: #${selectedId} - ${nameLabel} (${typeLabel}, ${sexLabel}, DOB: ${dobLabel})`;
    }
}

export function handleMembershipTypeChange(event) {
    if (!event || !event.target) {
        return;
    }
    updateMembershipFieldVisibility(event.target.value);
}

export function getCachedProfile(customerId) {
    return getUpdateCustomerCache().get(customerId);
}

export function getCustomerProfiles() {
    return getCustomerProfilesCache();
}
