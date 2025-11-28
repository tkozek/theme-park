import { loadCustomerProfilesForUpdate } from './customerProfiles.js';
import { fetchAndDisplayGuestVisits } from './guestVisits.js';
import { refreshCounts } from './stats.js';

export async function refreshCustomers() {
    await Promise.all([
        loadCustomerProfilesForUpdate(),
        fetchAndDisplayGuestVisits(),
        refreshCounts()
    ]);
}
