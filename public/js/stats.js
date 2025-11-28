export async function refreshCounts() {
    const customerEl = document.getElementById('customerCountValue');
    const guestEl = document.getElementById('guestCountValue');
    const loyaltyEl = document.getElementById('loyaltyCountValue');
    const statusEl = document.getElementById('countResultMsg');

    if (!customerEl || !guestEl || !loyaltyEl) {
        return;
    }

    if (statusEl) {
        statusEl.textContent = 'Refreshing counts...';
    }

    try {
        const response = await fetch('/customers/stats');
        const data = await response.json();

        if (response.ok && data.success && data.counts) {
            customerEl.textContent = data.counts.customers ?? '--';
            guestEl.textContent = data.counts.guests ?? '--';
            loyaltyEl.textContent = data.counts.loyaltyMembers ?? '--';
            if (statusEl) {
                statusEl.textContent = 'Counts updated';
            }
        } else if (statusEl) {
            statusEl.textContent = data.message || 'Unable to load counts.';
        }
    } catch (error) {
        if (statusEl) {
            statusEl.textContent = 'Error loading counts.';
        }
    }
}
