import { CUSTOMER_COLUMN_DEFINITIONS } from './constants.js';
import { getSelectedCustomerColumns, setSelectedCustomerColumns, getCustomerProfilesCache } from './state.js';

export function syncProjectionCheckboxes() {
    const selectedColumns = getSelectedCustomerColumns();
    CUSTOMER_COLUMN_DEFINITIONS.forEach((column) => {
        const checkbox = document.getElementById(column.checkboxId);
        if (checkbox) {
            checkbox.checked = selectedColumns.has(column.key);
        }
    });
}

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

    const selectedColumns = getSelectedCustomerColumns();
    const activeColumns = CUSTOMER_COLUMN_DEFINITIONS.filter((column) => selectedColumns.has(column.key));

    if (!activeColumns.length) {
        const th = document.createElement('th');
        th.textContent = 'No columns selected';
        headerRow.appendChild(th);

        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.textContent = 'Use the projection form to choose at least one column.';
        return;
    }

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

export function handleCustomerProjectionSubmit(event) {
    event.preventDefault();

    const updatedColumns = CUSTOMER_COLUMN_DEFINITIONS.filter((column) => {
        const checkbox = document.getElementById(column.checkboxId);
        return checkbox ? checkbox.checked : false;
    }).map((column) => column.key);

    if (!updatedColumns.length) {
        alert('Select at least one column to display.');
        return;
    }

    setSelectedCustomerColumns(updatedColumns);
    renderCustomerTable();
}
