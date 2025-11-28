import { renderTableResult } from './tableRenderer.js';

async function fetchRideNames() {
    const response = await fetch('/analytics/rides');
    if (!response.ok) {
        throw new Error('Failed to fetch rides');
    }

    const responseData = await response.json();
    return Array.isArray(responseData.data) ? responseData.data : [];
}

function setRideSelectMessage(selectElement, message) {
    selectElement.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = message;
    selectElement.appendChild(option);
}

export async function initializeRideDropdown() {
    const selectElement = document.getElementById('rideSelect');
    if (!selectElement) {
        return;
    }

    setRideSelectMessage(selectElement, 'Loading rides...');

    try {
        const rides = await fetchRideNames();
        if (!rides.length) {
            setRideSelectMessage(selectElement, 'No rides available');
            selectElement.disabled = true;
            return;
        }

        selectElement.disabled = false;
        selectElement.innerHTML = '';

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select a ride';
        selectElement.appendChild(placeholder);

        rides.forEach((ride) => {
            const name = typeof ride === 'string' ? ride : ride?.rideName;
            if (!name) {
                return;
            }
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        setRideSelectMessage(selectElement, 'Unable to load rides');
        selectElement.disabled = true;
    }
}

export async function handleCustomerRideJoinSubmit(event) {
    event.preventDefault();

    const selectElement = document.getElementById('rideSelect');
    const resultElement = document.getElementById('customerRideJoinResult');
    if (!selectElement || !resultElement) {
        return;
    }

    const rideName = selectElement.value;
    if (!rideName) {
        resultElement.textContent = 'Please select a ride first.';
        return;
    }

    resultElement.textContent = 'Running query...';

    try {
        const response = await fetch(`/analytics/rides/${encodeURIComponent(rideName)}/customers`);
        const responseData = await response.json();

        if (response.ok && responseData.success) {
            renderTableResult(
                resultElement,
                [
                    { key: 'customerID', label: 'Customer ID' },
                    { key: 'customerName', label: 'Customer Name' },
                    { key: 'membershipStatus', label: 'Status' }
                ],
                responseData.data || [],
                'No customers found for this ride yet.'
            );
        } else {
            resultElement.textContent = responseData.message || 'Unable to run Query 6.';
        }
    } catch (error) {
        resultElement.textContent = 'Error running Query 6.';
    }
}

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

export async function runAvgPointsByGenderQuery(event) {
    event.preventDefault();
    const resultElement = document.getElementById('avgPointsByGenderResult');
    if (!resultElement) {
        return;
    }

    resultElement.textContent = 'Running query...';

    try {
        const response = await fetch('/analytics/avg-points-by-gender');
        const responseData = await response.json();

        if (response.ok && responseData.success) {
            renderTableResult(
                resultElement,
                [
                    { key: 'gender', label: 'Gender/Sex' },
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
            resultElement.textContent = responseData.message || 'Unable to run Query 7.';
        }
    } catch (error) {
        resultElement.textContent = 'Error running Query 7.';
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

export async function runGuestVisitsByMonthQuery(event) {
    event.preventDefault();
    const resultElement = document.getElementById('guestVisitsByMonthResult');
    if (!resultElement) {
        return;
    }

    resultElement.textContent = 'Running query...';

    try {
        const response = await fetch('/analytics/guest-counts-by-month');
        const responseData = await response.json();

        if (response.ok && responseData.success) {
            renderTableResult(
                resultElement,
                [
                    { key: 'month', label: 'Month' },
                    { key: 'guestCount', label: 'Guest Count' }
                ],
                responseData.data || [],
                'No guest visits meet the criteria.'
            );
        } else {
            resultElement.textContent = responseData.message || 'Unable to run Query 8.';
        }
    } catch (error) {
        resultElement.textContent = 'Error running Query 8.';
    }
}
