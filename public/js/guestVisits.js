const guestColumns = ['customerID', 'customerName', 'dateOfVisit'];

function insertMessageRow(body, message) {
    const row = body.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = guestColumns.length;
    cell.textContent = message;
}

export async function fetchAndDisplayGuestVisits() {
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
        const response = await fetch('/customers/guests');
        if (!response.ok) {
            throw new Error('Request failed');
        }

        const responseData = await response.json();
        const visits = Array.isArray(responseData.data) ? responseData.data : [];

        if (!visits.length) {
            insertMessageRow(tableBody, 'No guest visits recorded.');
            return;
        }

        visits.forEach((visit) => {
            const row = tableBody.insertRow();
            guestColumns.forEach((key, index) => {
                const cell = row.insertCell(index);
                const value = visit?.[key];
                cell.textContent = value ?? '--';
            });
        });
    } catch (error) {
        insertMessageRow(tableBody, 'Unable to load guest visits.');
    }
}
