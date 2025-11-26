import { DEFAULT_CUSTOMER_COLUMNS } from './constants.js';

const updateCustomerCache = new Map();
let selectedCustomerColumns = new Set(DEFAULT_CUSTOMER_COLUMNS);
let customerProfilesCache = [];

export function getUpdateCustomerCache() {
    return updateCustomerCache;
}

export function getSelectedCustomerColumns() {
    return selectedCustomerColumns;
}

export function setSelectedCustomerColumns(columns) {
    selectedCustomerColumns = new Set(columns);
}

export function getCustomerProfilesCache() {
    return customerProfilesCache;
}

export function setCustomerProfilesCache(profiles) {
    customerProfilesCache = Array.isArray(profiles) ? profiles : [];
}
