import { refreshCustomers } from './refresh.js';

async function postAndHandle(endpoint, successMessage, failureMessage) {
    const messageElement = document.getElementById('resetResultMsg');
    if (!messageElement) {
        return;
    }

    try {
        const response = await fetch(endpoint, { method: 'POST' });
        const responseData = await response.json();

        if (responseData.success) {
            messageElement.textContent = successMessage;
            await refreshCustomers();
        } else {
            messageElement.textContent = responseData.message || failureMessage;
        }
    } catch (error) {
        messageElement.textContent = failureMessage;
    }
}

export function resetSchema() {
    return postAndHandle('/reset', 'Database schema reset successfully.', 'Failed to reset database.');
}

export function dropAndCreateSchema() {
    return postAndHandle('/drop-and-create', 'Tables dropped and recreated successfully.', 'Failed to drop/create tables.');
}

export function populateSeedData() {
    return postAndHandle('/populate', 'Seed data inserted successfully.', 'Failed to insert seed data.');
}
