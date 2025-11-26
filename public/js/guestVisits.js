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
        const response = await fetch('/guests');
        const responseData = await response.json();
        const visits = responseData.data || [];

        if (!visits.length) {
            const row = tableBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 3;
            cell.textContent = 'No guest visits recorded.';
            return;
        }

        visits.forEach((visit) => {
            const values = Array.isArray(visit) ? visit : Object.values(visit);
            const row = tableBody.insertRow();
            values.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } catch (error) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 3;
        cell.textContent = 'Unable to load guest visits.';
    }
}
