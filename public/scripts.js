import { checkDbConnection } from './js/dbStatus.js';
import { syncProjectionCheckboxes, handleCustomerProjectionSubmit } from './js/tableRenderer.js';
import { handleCustomerSelectionChange, handleMembershipTypeChange } from './js/customerProfiles.js';
import { insertCustomer, updateCustomerName, countCustomers } from './js/customerForms.js';
import { resetSchema, dropAndCreateSchema, populateSeedData } from './js/schemaControls.js';
import { runMinAvgPointsQuery, runCustomersAllRidesQuery } from './js/analyticsControls.js';
import { refreshCustomers } from './js/refresh.js';

function attachClickListener(id, handler) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', handler);
    }
}

function attachSubmitListener(id, handler) {
    const form = document.getElementById(id);
    if (form) {
        form.addEventListener('submit', handler);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkDbConnection();
    refreshCustomers().finally(syncProjectionCheckboxes);
    syncProjectionCheckboxes();

    attachClickListener('resetSchemaButton', resetSchema);
    attachClickListener('dropCreateButton', dropAndCreateSchema);
    attachClickListener('populateButton', populateSeedData);
    attachClickListener('countCustomersButton', countCustomers);

    attachSubmitListener('insertCustomerForm', insertCustomer);
    attachSubmitListener('updateCustomerNameForm', updateCustomerName);
    attachSubmitListener('customerProjectionForm', handleCustomerProjectionSubmit);
    attachSubmitListener('minAvgPointsByBirthYearForm', runMinAvgPointsQuery);
    attachSubmitListener('customersAllRidesForm', runCustomersAllRidesQuery);

    const updateCustomerSelect = document.getElementById('updateCustomerSelect');
    if (updateCustomerSelect) {
        updateCustomerSelect.addEventListener('change', handleCustomerSelectionChange);
    }

    const membershipRadios = document.querySelectorAll('input[name="updateMembershipType"]');
    membershipRadios.forEach((radio) => {
        radio.addEventListener('change', handleMembershipTypeChange);
    });
});
