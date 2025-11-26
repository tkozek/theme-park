import { loadCustomerProfilesForUpdate } from './customerProfiles.js';
import { fetchAndDisplayGuestVisits } from './guestVisits.js';

export async function refreshCustomers() {
    await Promise.all([loadCustomerProfilesForUpdate(), fetchAndDisplayGuestVisits()]);
}
