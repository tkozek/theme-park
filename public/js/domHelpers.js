export function clearUpdateFormFields() {
    ['updateCustomerNewName', 'updateCustomerDob', 'updateCustomerSex', 'updateCustomerLoyaltyId', 'updateCustomerLoyaltyPoints'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
        }
    });
}

export function setFieldValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value === undefined || value === null ? '' : value;
    }
}

export function setUpdateSelectMessage(message) {
    const select = document.getElementById('updateCustomerSelect');
    const detailsElement = document.getElementById('selectedCustomerDetails');
    const hiddenInput = document.getElementById('updateCustomerId');

    if (!select) {
        return;
    }

    select.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = message;
    select.appendChild(option);
    select.disabled = true;

    if (hiddenInput) {
        hiddenInput.value = '';
    }
    if (detailsElement) {
        detailsElement.textContent = message;
    }
    clearUpdateFormFields();
}
