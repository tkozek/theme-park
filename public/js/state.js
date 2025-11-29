const updateCustomerCache = new Map();
let customerProfilesCache = [];

export function getUpdateCustomerCache() {
    return updateCustomerCache;
}

export function getCustomerProfilesCache() {
    return customerProfilesCache;
}

export function setCustomerProfilesCache(profiles) {
    customerProfilesCache = Array.isArray(profiles) ? profiles : [];
}
