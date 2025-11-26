export function clearUpdateFormFields() {
    ['updateCustomerNewName', 'updateCustomerDob', 'updateCustomerSex', 'updateCustomerVisitDate', 'updateCustomerLoyaltyId', 'updateCustomerLoyaltyPoints'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
        }
    });

    const radios = document.querySelectorAll('input[name="updateMembershipType"]');
    radios.forEach((radio) => {
        radio.checked = false;
    });
}

export function setFieldValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value === undefined || value === null ? '' : value;
    }
}

export function updateMembershipFieldVisibility(type) {
    const guestFields = document.getElementById('guestUpdateFields');
    const loyaltyFields = document.getElementById('loyaltyUpdateFields');

    if (guestFields) {
        guestFields.style.display = type === 'guest' ? 'block' : 'none';
    }
    if (loyaltyFields) {
        loyaltyFields.style.display = type === 'loyalty' ? 'block' : 'none';
    }
}

export function setMembershipRadio(type) {
    const radios = document.querySelectorAll('input[name="updateMembershipType"]');
    let matched = false;
    radios.forEach((radio) => {
        if (radio.value === type) {
            radio.checked = true;
            matched = true;
        } else {
            radio.checked = false;
        }
    });
    updateMembershipFieldVisibility(matched ? type : null);
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
    updateMembershipFieldVisibility(null);
}
