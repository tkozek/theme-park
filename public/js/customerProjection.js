import { CUSTOMER_COLUMN_DEFINITIONS, DEFAULT_CUSTOMER_COLUMNS } from './constants.js';
import { renderTableResult } from './tableRenderer.js';

function getSelectedProjectionColumns() {
    return CUSTOMER_COLUMN_DEFINITIONS
        .filter((column) => {
            const checkbox = document.getElementById(column.checkboxId);
            return checkbox ? checkbox.checked : false;
        })
        .map((column) => column.key);
}

export function initializeProjectionForm() {
    CUSTOMER_COLUMN_DEFINITIONS.forEach((column) => {
        const checkbox = document.getElementById(column.checkboxId);
        if (checkbox) {
            checkbox.checked = DEFAULT_CUSTOMER_COLUMNS.includes(column.key);
        }
    });
}

export async function handleCustomerProjectionSubmit(event) {
    event.preventDefault();

    const resultElement = document.getElementById('customerProjectionResult');
    if (!resultElement) {
        return;
    }

    const selectedColumns = getSelectedProjectionColumns();
    if (!selectedColumns.length) {
        resultElement.textContent = 'Select at least one attribute to run Query 5.';
        return;
    }

    resultElement.textContent = 'Running query...';

    try {
        const response = await fetch('/customers/projection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attributes: selectedColumns })
        });

        const responseData = await response.json();
        if (response.ok && responseData.success) {
            const columns = CUSTOMER_COLUMN_DEFINITIONS.filter((column) => selectedColumns.includes(column.key));
            renderTableResult(
                resultElement,
                columns,
                responseData.data || [],
                'No customer records were returned for the selected attributes.'
            );
        } else {
            resultElement.textContent = responseData.message || 'Unable to run Query 5.';
        }
    } catch (error) {
        resultElement.textContent = 'Error running Query 5.';
    }
}
