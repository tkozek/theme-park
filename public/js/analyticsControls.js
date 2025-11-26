import { renderTableResult } from './tableRenderer.js';

export async function runMinAvgPointsQuery(event) {
    event.preventDefault();
    const resultElement = document.getElementById('minAvgPointsByBirthYearResult');
    if (!resultElement) {
        return;
    }

    resultElement.textContent = 'Running query...';

    try {
        const response = await fetch('/analytics/min-avg-points-by-birth-year');
        const responseData = await response.json();

        if (response.ok && responseData.success) {
            renderTableResult(
                resultElement,
                [
                    { key: 'birthYear', label: 'Birth Year' },
                    {
                        key: 'averagePoints',
                        label: 'Average Points',
                        format: (value) => (value === undefined || value === null ? '--' : Number(value).toFixed(2))
                    }
                ],
                responseData.data || [],
                'No loyalty member data available.'
            );
        } else {
            resultElement.textContent = responseData.message || 'Unable to run Query 9.';
        }
    } catch (error) {
        resultElement.textContent = 'Error running Query 9.';
    }
}

export async function runCustomersAllRidesQuery(event) {
    event.preventDefault();
    const resultElement = document.getElementById('customersAllRidesResult');
    if (!resultElement) {
        return;
    }

    resultElement.textContent = 'Running query...';

    try {
        const response = await fetch('/analytics/customers-rode-all-rides');
        const responseData = await response.json();

        if (response.ok && responseData.success) {
            renderTableResult(
                resultElement,
                [
                    { key: 'customerID', label: 'Customer ID' },
                    { key: 'customerName', label: 'Customer Name' }
                ],
                responseData.data || [],
                'No customers have tickets for every ride yet.'
            );
        } else {
            resultElement.textContent = responseData.message || 'Unable to run Query 10.';
        }
    } catch (error) {
        resultElement.textContent = 'Error running Query 10.';
    }
}
