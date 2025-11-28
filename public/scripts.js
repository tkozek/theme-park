import { checkDbConnection } from './js/dbStatus.js';
import { syncProjectionCheckboxes, handleCustomerProjectionSubmit } from './js/tableRenderer.js';
import { handleCustomerSelectionChange } from './js/customerProfiles.js';
import { insertCustomer, updateCustomerName, deleteLoyaltyMembership } from './js/customerForms.js';
import { resetSchema, dropAndCreateSchema, populateSeedData } from './js/schemaControls.js';
import {
    initializeRideDropdown,
    handleCustomerRideJoinSubmit,
    runMinAvgPointsQuery,
    runCustomersAllRidesQuery,
    runAvgPointsByGenderQuery,
    runGuestVisitsByMonthQuery
} from './js/analyticsControls.js';
import { handleCustomerSelectionSubmit } from './js/customerSelection.js';
import { refreshCustomers, refreshCustomerTable, refreshGuestVisitsTable, refreshLoyaltyMembersTable } from './js/refresh.js';

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
    initializeRideDropdown();

    attachClickListener('resetSchemaButton', resetSchema);
    attachClickListener('dropCreateButton', dropAndCreateSchema);
    attachClickListener('populateButton', populateSeedData);
    attachClickListener('refreshCustomersTableButton', refreshCustomerTable);
    attachClickListener('refreshLoyaltyMembersTableButton', refreshLoyaltyMembersTable);
    attachClickListener('refreshGuestVisitsTableButton', refreshGuestVisitsTable);

    attachSubmitListener('insertCustomerForm', insertCustomer);
    attachSubmitListener('updateCustomerNameForm', updateCustomerName);
    attachSubmitListener('deleteLoyaltyMemberForm', deleteLoyaltyMembership);
    attachSubmitListener('customerSelectionForm', handleCustomerSelectionSubmit);
    attachSubmitListener('customerProjectionForm', handleCustomerProjectionSubmit);
    attachSubmitListener('customerRideJoinForm', handleCustomerRideJoinSubmit);
    attachSubmitListener('minAvgPointsByBirthYearForm', runMinAvgPointsQuery);
    attachSubmitListener('avgPointsByGenderForm', runAvgPointsByGenderQuery);
    attachSubmitListener('guestVisitsByMonthForm', runGuestVisitsByMonthQuery);
    attachSubmitListener('customersAllRidesForm', runCustomersAllRidesQuery);

    const updateCustomerSelect = document.getElementById('updateCustomerSelect');
    if (updateCustomerSelect) {
        updateCustomerSelect.addEventListener('change', handleCustomerSelectionChange);
    }

});
