import { getUpdateCustomerCache, setCustomerProfilesCache, getCustomerProfilesCache } from './state.js';
import { clearUpdateFormFields, setFieldValue, setUpdateSelectMessage } from './domHelpers.js';
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

    const normalizedProfiles = Array.isArray(customers)
        ? customers
            .map((row) => normalizeCustomerProfile(row))
            .filter((profile) => profile.membershipType === 'loyalty')
        : [];

    if (!normalizedProfiles.length) {
        setUpdateSelectMessage('No loyalty members available. Insert data first.');
        return;
    }

    select.disabled = false;
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select a loyalty member...';
    select.appendChild(placeholderOption);

    normalizedProfiles.forEach((profile) => {
        if (profile.customerID === undefined || profile.customerID === null) {
            return;
        }

        const idString = String(profile.customerID);
        cache.set(idString, profile);

        const option = document.createElement('option');
        option.value = idString;
        const displayName = profile.customerName || 'Unnamed';
        option.textContent = `#${idString} - ${displayName}`;
        select.appendChild(option);
    });

    if (hiddenInput) {
        hiddenInput.value = '';
    }
    if (detailsElement) {
           detailsElement.textContent = 'Select a loyalty member to view their current details.';
    }
    clearUpdateFormFields();
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
                setUpdateSelectMessage(data.message || 'Unable to load loyalty member tuples.');
            }
        }
    } catch (error) {
        setCustomerProfilesCache([]);
        renderCustomerTable([]);
        if (select) {
            setUpdateSelectMessage('Error loading loyalty member tuples.');
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
               detailsElement.textContent = 'Select a loyalty member to view their current details.';
        }
        clearUpdateFormFields();
        return;
    }

    const customer = cache.get(selectedId);
    if (!customer) {
        if (detailsElement) {
            detailsElement.textContent = `Selected CustomerID: ${selectedId}`;
        }
        clearUpdateFormFields();
        return;
    }

    setFieldValue('updateCustomerNewName', customer.customerName || '');
    setFieldValue('updateCustomerDob', customer.dateOfBirth || '');
    setFieldValue('updateCustomerSex', customer.sex || '');
    setFieldValue('updateCustomerLoyaltyId', customer.loyaltyID || '');
    setFieldValue('updateCustomerLoyaltyPoints', customer.loyaltyPoints ?? '');

    if (detailsElement) {
        const nameLabel = customer.customerName || 'Unnamed';
        const sexLabel = customer.sex || 'Unknown sex';
        const dobLabel = customer.dateOfBirth || 'Unknown DOB';
        const loyaltyLabel = customer.loyaltyID ? `Loyalty ID: ${customer.loyaltyID}` : 'Missing Loyalty ID';
        detailsElement.textContent = `Selected loyalty member: #${selectedId} - ${nameLabel} (${sexLabel}, DOB: ${dobLabel}, ${loyaltyLabel})`;
    }
}

export function getCachedProfile(customerId) {
    return getUpdateCustomerCache().get(customerId);
}

export function getCustomerProfiles() {
    return getCustomerProfilesCache();
}
