const loyaltyColumns = ['customerID', 'customerName', 'sex', 'dateOfBirth', 'loyaltyID', 'points'];

function insertMessageRow(body, message) {
    const row = body.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = loyaltyColumns.length;
    cell.textContent = message;
}

export async function fetchAndDisplayLoyaltyMembers() {
    const tableElement = document.getElementById('loyaltyMembersTable');
    if (!tableElement) {
        return;
    }

    const tableBody = tableElement.querySelector('tbody');
    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = '';

    try {
        const response = await fetch('/customers/loyalty-members');
        if (!response.ok) {
            throw new Error('Request failed');
        }

        const responseData = await response.json();
        const members = Array.isArray(responseData.data) ? responseData.data : [];

        if (!members.length) {
            insertMessageRow(tableBody, 'No loyalty members found.');
            return;
        }

        members.forEach((member) => {
            const row = tableBody.insertRow();
            loyaltyColumns.forEach((key, index) => {
                const cell = row.insertCell(index);
                const value = member?.[key];
                cell.textContent = value ?? '--';
            });
        });
    } catch (error) {
        insertMessageRow(tableBody, 'Unable to load loyalty members.');
    }
}
