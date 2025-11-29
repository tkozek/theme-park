import { loadCustomerProfilesForUpdate } from './customerProfiles.js';
import { fetchAndDisplayGuestVisits } from './guestVisits.js';
import { fetchAndDisplayLoyaltyMembers } from './loyaltyMembers.js';

export async function refreshCustomerTable() {
    await loadCustomerProfilesForUpdate();
}

export async function refreshGuestVisitsTable() {
    await fetchAndDisplayGuestVisits();
}

export async function refreshLoyaltyMembersTable() {
    await fetchAndDisplayLoyaltyMembers();
}

export async function refreshCustomers() {
    await Promise.all([
        refreshCustomerTable(),
        refreshGuestVisitsTable(),
        refreshLoyaltyMembersTable()
    ]);
}
