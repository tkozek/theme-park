const { oracledb, withOracleDB, generateUuid } = require('./database');
const { loadSqlCommand } = require('../utils/sqlLoader');

const SELECT_ALL_CUSTOMERS_SQL = loadSqlCommand('customers/select_all_customers.sql');
const SELECT_CUSTOMER_PROFILES_SQL = loadSqlCommand('customers/select_customer_profiles.sql');
const SELECT_GUEST_VISITS_SQL = loadSqlCommand('customers/select_guest_visits.sql');
const INSERT_GUEST_SQL = loadSqlCommand('customers/insert_guest.sql');
const INSERT_LOYALTY_MEMBER_SQL = loadSqlCommand('customers/insert_loyalty_member.sql');
const INSERT_CUSTOMER_SQL = loadSqlCommand('customers/insert_customer.sql');
const SELECT_CUSTOMER_EXISTS_SQL = loadSqlCommand('customers/select_customer_exists.sql');
const DELETE_CUSTOMER_SQL = loadSqlCommand('customers/delete_customer.sql');
const DELETE_LOYALTY_MEMBER_SQL = loadSqlCommand('customers/delete_loyalty_member.sql');
const DELETE_GUEST_SQL = loadSqlCommand('customers/delete_guest.sql');
const MERGE_GUEST_VISIT_SQL = loadSqlCommand('customers/merge_guest_visit.sql');
const MERGE_LOYALTY_MEMBER_SQL = loadSqlCommand('customers/merge_loyalty_member.sql');
const MERGE_LOYALTY_MEMBER_PARTIAL_SQL = loadSqlCommand('customers/merge_loyalty_member_partial.sql');
const UPDATE_GUEST_VISIT_SQL = loadSqlCommand('customers/update_guest_visit.sql');
const UPDATE_CUSTOMER_BASE_SQL = loadSqlCommand('customers/update_customer_base.sql');
const COUNT_CUSTOMERS_SQL = loadSqlCommand('common/count_customers.sql');
const COUNT_GUESTS_SQL = loadSqlCommand('common/count_guests.sql');
const COUNT_LOYALTY_MEMBERS_SQL = loadSqlCommand('common/count_loyalty_members.sql');

async function fetchCustomers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(SELECT_ALL_CUSTOMERS_SQL);
        return result.rows;
    }).catch(() => []);
}

async function fetchCustomerProfiles() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(SELECT_CUSTOMER_PROFILES_SQL, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return result.rows.map((row) => ({
            customerID: row.CUSTOMERID,
            customerName: row.CUSTOMERNAME,
            sex: row.SEX,
            dateOfBirth: row.DOB,
            dateOfVisit: row.DATEOFVISIT,
            loyaltyID: row.LOYALTYID,
            loyaltyPoints: row.POINTS,
            membershipType: row.LOYALTYID === null || row.LOYALTYID === undefined ? 'guest' : 'loyalty'
        }));
    }).catch(() => []);
}

async function fetchGuestVisits() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(SELECT_GUEST_VISITS_SQL);
        return result.rows;
    }).catch(() => []);
}

function validateCustomerRole({ dateOfVisit, loyaltyID }) {
    const isGuest = dateOfVisit !== undefined && dateOfVisit !== null && dateOfVisit !== '';
    const isLoyaltyMember = loyaltyID !== undefined && loyaltyID !== null && loyaltyID !== '';

    if (isGuest && isLoyaltyMember) {
        throw new Error('Customer cannot be both Guest & Loyalty Member.');
    }

    if (!isGuest && !isLoyaltyMember) {
        throw new Error('Customer must be either a Guest or a Loyalty Member.');
    }

    return { isGuest, isLoyaltyMember };
}

async function insertGuest(connection, customerID, dateOfVisit) {
    await connection.execute(INSERT_GUEST_SQL, { customerID, dateOfVisit }, { autoCommit: false });
}

async function insertLoyaltyMember(connection, customerID, loyaltyID, loyaltyPoints = 0) {
    await connection.execute(
        INSERT_LOYALTY_MEMBER_SQL,
        { customerID, loyaltyID, loyaltyPoints, uuid: generateUuid() },
        { autoCommit: false }
    );
}

async function insertCustomer({ customerID, customerName, dateOfBirth, sex, dateOfVisit, loyaltyID, loyaltyPoints }) {
    return await withOracleDB(async (connection) => {
        if (!customerID || !customerName || !dateOfBirth || !sex) {
            throw new Error('customerID, customerName, dateOfBirth, and sex are required.');
        }

        const { isGuest, isLoyaltyMember } = validateCustomerRole({ dateOfVisit, loyaltyID });

        try {
            await connection.execute(
                INSERT_CUSTOMER_SQL,
                { customerID, customerName, dateOfBirth, sex },
                { autoCommit: false }
            );

            if (isGuest) {
                await insertGuest(connection, customerID, dateOfVisit);
            } else if (isLoyaltyMember) {
                await insertLoyaltyMember(connection, customerID, loyaltyID, loyaltyPoints ?? 0);
            }

            await connection.commit();
            return true;
        } catch (err) {
            await connection.rollback();
            console.error('Customer could not be inserted!!', err);
            throw err;
        }
    }).catch(() => false);
}

function ensureNumericCustomerId(customerID) {
    const numericId = Number(customerID);
    if (!numericId || Number.isNaN(numericId)) {
        throw new Error('A valid CustomerID is required.');
    }
    return numericId;
}

async function deleteCustomer(customerID) {
    return await withOracleDB(async (connection) => {
        const numericCustomerID = ensureNumericCustomerId(customerID);

        const existingCustomer = await connection.execute(SELECT_CUSTOMER_EXISTS_SQL, {
            customerID: numericCustomerID
        });
        if (!existingCustomer.rows.length) {
            return false;
        }

        try {
            const result = await connection.execute(
                DELETE_CUSTOMER_SQL,
                { customerID: numericCustomerID },
                { autoCommit: true }
            );
            return result.rowsAffected && result.rowsAffected > 0;
        } catch (err) {
            console.error('There was an error deleting the customer!', err);
            throw err;
        }
    }).catch((err) => {
        if (err && err.message) {
            throw err;
        }
        return false;
    });
}

async function deleteLoyaltyMembership(customerID) {
    return await withOracleDB(async (connection) => {
        const numericCustomerID = ensureNumericCustomerId(customerID);
        const result = await connection.execute(
            DELETE_LOYALTY_MEMBER_SQL,
            { customerID: numericCustomerID },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        if (err && err.message) {
            throw err;
        }
        return false;
    });
}

async function updateCustomerDetails(customerID, updates = {}) {
    return await withOracleDB(async (connection) => {
        const numericCustomerID = ensureNumericCustomerId(customerID);

        const exists = await connection.execute(SELECT_CUSTOMER_EXISTS_SQL, {
            customerID: numericCustomerID
        });
        if (!exists.rows.length) {
            return false;
        }

        let didUpdate = false;

        try {
            const setClauses = [];
            const bindParams = { customerID: numericCustomerID };

            if (updates.customerName) {
                setClauses.push('CustomerName = :customerName');
                bindParams.customerName = updates.customerName;
            }

            if (updates.sex) {
                setClauses.push('Sex = :sex');
                bindParams.sex = updates.sex;
            }

            if (updates.dateOfBirth) {
                setClauses.push("DOB = TO_DATE(:dateOfBirth, 'YYYY-MM-DD')");
                bindParams.dateOfBirth = updates.dateOfBirth;
            }

            if (setClauses.length) {
                const updateSql = UPDATE_CUSTOMER_BASE_SQL.replace('{{set_clauses}}', setClauses.join(', '));
                const result = await connection.execute(updateSql, bindParams, { autoCommit: false });
                didUpdate = didUpdate || (result.rowsAffected && result.rowsAffected > 0);
            }

            const targetMembership = updates.membershipType ||
                (updates.loyaltyID !== undefined || updates.loyaltyPoints !== undefined ? 'loyalty' : undefined) ||
                (updates.dateOfVisit !== undefined ? 'guest' : undefined);

            if (targetMembership === 'guest') {
                await connection.execute(DELETE_LOYALTY_MEMBER_SQL, { customerID: numericCustomerID }, { autoCommit: false });
                didUpdate = true;
                if (updates.dateOfVisit) {
                    await connection.execute(
                        MERGE_GUEST_VISIT_SQL,
                        { customerID: numericCustomerID, dateOfVisit: updates.dateOfVisit },
                        { autoCommit: false }
                    );
                }
            } else if (targetMembership === 'loyalty') {
                if (updates.loyaltyID === undefined || updates.loyaltyID === null || updates.loyaltyID === '') {
                    throw new Error('loyaltyID is required for loyalty members.');
                }

                const loyaltyPointsValue = updates.loyaltyPoints !== undefined ? Number(updates.loyaltyPoints) : 0;
                if (Number.isNaN(loyaltyPointsValue) || loyaltyPointsValue < 0) {
                    throw new Error('loyaltyPoints must be a non-negative number.');
                }

                await connection.execute(DELETE_GUEST_SQL, { customerID: numericCustomerID }, { autoCommit: false });

                await connection.execute(
                    MERGE_LOYALTY_MEMBER_SQL,
                    {
                        customerID: numericCustomerID,
                        loyaltyID: updates.loyaltyID,
                        loyaltyPoints: loyaltyPointsValue,
                        uuid: generateUuid()
                    },
                    { autoCommit: false }
                );
                didUpdate = true;
            } else {
                if (updates.dateOfVisit) {
                    await connection.execute(
                        UPDATE_GUEST_VISIT_SQL,
                        { customerID: numericCustomerID, dateOfVisit: updates.dateOfVisit },
                        { autoCommit: false }
                    );
                    didUpdate = true;
                }

                if (updates.loyaltyID !== undefined || updates.loyaltyPoints !== undefined) {
                    const loyaltyPointsValue = updates.loyaltyPoints !== undefined ? Number(updates.loyaltyPoints) : undefined;
                    if (loyaltyPointsValue !== undefined && (Number.isNaN(loyaltyPointsValue) || loyaltyPointsValue < 0)) {
                        throw new Error('loyaltyPoints must be a non-negative number.');
                    }

                    await connection.execute(
                        MERGE_LOYALTY_MEMBER_PARTIAL_SQL,
                        {
                            customerID: numericCustomerID,
                            loyaltyID: updates.loyaltyID,
                            loyaltyPoints: loyaltyPointsValue,
                            uuid: generateUuid()
                        },
                        { autoCommit: false }
                    );
                    didUpdate = true;
                }
            }

            await connection.commit();
            return didUpdate;
        } catch (err) {
            await connection.rollback();
            console.error('Error updating customer details:', err);
            throw err;
        }
    }).catch((err) => {
        if (err && err.message) {
            throw err;
        }
        return false;
    });
}

async function runCountQuery(sql) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(sql);
        return result.rows?.[0]?.[0] ?? -1;
    }).catch(() => -1);
}

async function countCustomers() {
    return runCountQuery(COUNT_CUSTOMERS_SQL);
}

async function countGuests() {
    return runCountQuery(COUNT_GUESTS_SQL);
}

async function countLoyaltyMembers() {
    return runCountQuery(COUNT_LOYALTY_MEMBERS_SQL);
}

async function getCustomerStats() {
    const [customers, guests, loyaltyMembers] = await Promise.all([
        countCustomers(),
        countGuests(),
        countLoyaltyMembers()
    ]);

    return { customers, guests, loyaltyMembers };
}

module.exports = {
    fetchCustomers,
    fetchCustomerProfiles,
    fetchGuestVisits,
    insertCustomer,
    deleteCustomer,
    deleteLoyaltyMembership,
    updateCustomerDetails,
    countCustomers,
    countGuests,
    countLoyaltyMembers,
    getCustomerStats
};
