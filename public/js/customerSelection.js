import { renderTableResult } from './tableRenderer.js';

const RESULT_COLUMNS = [
    { key: 'customerID', label: 'Customer ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'sex', label: 'Sex' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'dateOfVisit', label: 'Date of Visit' },
    { key: 'loyaltyID', label: 'Loyalty ID' },
    { key: 'loyaltyPoints', label: 'Points' }
];

function collectRules() {
    const ruleRows = document.querySelectorAll('#ruleContainer .rule');
    const rules = [];

    ruleRows.forEach((row, index) => {
        const attribute = row.querySelector('.customerAttr')?.value;
        const operator = row.querySelector('.operator')?.value;
        const rawValue = row.querySelector('.valueInput')?.value ?? '';
        const connectorElement = row.querySelector('.andOr');
        const connector = connectorElement ? connectorElement.value : 'none';

        if (!attribute || attribute === 'none' || !operator || operator === 'none') {
            return;
        }

        const value = rawValue.trim();
        if (!value.length) {
            return;
        }

        const normalizedConnector = connector === 'or' ? 'or' : 'and';
        rules.push({
            attribute,
            operator,
            value,
            connector: index === ruleRows.length - 1 ? 'none' : normalizedConnector
        });
    });

    return rules;
}

export async function handleCustomerSelectionSubmit(event) {
    event.preventDefault();

    const resultElement = document.getElementById('customerSelectionResult');
    if (!resultElement) {
        return;
    }

    const rules = collectRules();
    if (!rules.length) {
        resultElement.textContent = 'Add at least one valid condition before running Query 4.';
        return;
    }

    resultElement.textContent = 'Running query...';

    try {
        const response = await fetch('/customers/selection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rules })
        });
        const responseData = await response.json();

        if (response.ok && responseData.success) {
            renderTableResult(resultElement, RESULT_COLUMNS, responseData.data || [], 'No customers matched these conditions.');
        } else {
            resultElement.textContent = responseData.message || 'Unable to run Query 4.';
        }
    } catch (error) {
        resultElement.textContent = 'Error running Query 4.';
    }
}
