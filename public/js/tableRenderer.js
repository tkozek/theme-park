import { CUSTOMER_COLUMN_DEFINITIONS } from './constants.js';
import { getCustomerProfilesCache } from './state.js';

export function renderCustomerTable(customers = getCustomerProfilesCache()) {
    const tableElement = document.getElementById('customersTable');
    if (!tableElement) {
        return;
    }

    const headerRow = tableElement.querySelector('thead tr');
    const tableBody = tableElement.querySelector('tbody');
    if (!headerRow || !tableBody) {
        return;
    }

    headerRow.innerHTML = '';
    tableBody.innerHTML = '';

    const activeColumns = CUSTOMER_COLUMN_DEFINITIONS;

    activeColumns.forEach((column) => {
        const th = document.createElement('th');
        th.textContent = column.label;
        headerRow.appendChild(th);
    });

    if (!Array.isArray(customers) || !customers.length) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = activeColumns.length;
        cell.textContent = 'No customers found.';
        return;
    }

    customers.forEach((customer) => {
        const row = tableBody.insertRow();
        activeColumns.forEach((column, index) => {
            const cell = row.insertCell(index);
            const rawValue = customer ? customer[column.key] : undefined;
            const displayValue = rawValue === undefined || rawValue === null || rawValue === '' ? '--' : rawValue;
            cell.textContent = displayValue;
        });
    });
}

export function renderTableResult(elementId, columns, rows, emptyMessage) {
    const container = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (!Array.isArray(rows) || !rows.length) {
        container.textContent = emptyMessage;
        return;
    }

    const table = document.createElement('table');
    table.border = '1';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    columns.forEach((column) => {
        const th = document.createElement('th');
        th.textContent = column.label;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    rows.forEach((row) => {
        const tr = document.createElement('tr');
        columns.forEach((column) => {
            const td = document.createElement('td');
            const rawValue = row ? row[column.key] : undefined;
            const formattedValue = typeof column.format === 'function' ? column.format(rawValue, row) : rawValue;
            const displayValue = formattedValue === undefined || formattedValue === null || formattedValue === '' ? '--' : formattedValue;
            td.textContent = displayValue;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}
