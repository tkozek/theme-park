const { oracledb, withOracleDB, generateUuid } = require('./database');
const { loadSqlCommand } = require('../utils/sqlLoader');

const SELECT_CUSTOMER_PROFILES_SQL = loadSqlCommand('q5/q5_select_customer_profiles.sql');
const SELECT_GUEST_VISITS_SQL = loadSqlCommand('customers/select_guest_visits.sql');
const SELECT_LOYALTY_MEMBERS_SQL = loadSqlCommand('customers/select_loyalty_members.sql');
const INSERT_GUEST_SQL = loadSqlCommand('q1/q1_insert_guest.sql');
const INSERT_LOYALTY_MEMBER_SQL = loadSqlCommand('q1/q1_insert_loyalty_member.sql');
const INSERT_CUSTOMER_SQL = loadSqlCommand('q1/q1_insert_customer.sql');
const SELECT_CUSTOMER_EXISTS_SQL = loadSqlCommand('customers/select_customer_exists.sql');
const DELETE_LOYALTY_MEMBER_SQL = loadSqlCommand('q3/q3_delete_customer.sql');
const MERGE_LOYALTY_MEMBER_PARTIAL_SQL = loadSqlCommand('q2/q2_merge_loyalty_member_partial.sql');
const UPDATE_CUSTOMER_BASE_SQL = loadSqlCommand('q2/q2_update_customer_base.sql');
const COUNT_CUSTOMERS_SQL = loadSqlCommand('common/count_customers.sql');
const COUNT_GUESTS_SQL = loadSqlCommand('common/count_guests.sql');
const COUNT_LOYALTY_MEMBERS_SQL = loadSqlCommand('common/count_loyalty_members.sql');
const SELECT_LOYALTY_MEMBER_ID_SQL = loadSqlCommand('q2/q2_select_loyalty_member_id.sql');
const UPDATE_SEASONPASS_LOYALTY_SQL = loadSqlCommand('q2/q2_update_seasonpass_loyalty.sql');
const CUSTOMER_PROJECTION_COLUMNS = ['customerID', 'customerName', 'sex', 'dateOfBirth', 'dateOfVisit', 'loyaltyID', 'loyaltyPoints'];

const CUSTOMER_SELECTION_BASE_SQL = loadSqlCommand('q4/q4_customer_selection_base.sql');

const SELECTION_ATTRIBUTE_CONFIG = {
    CustomerID: { column: 'c.CustomerID', type: 'number' },
    CustomerName: { column: 'c.CustomerName', type: 'string' },
    DOB: { column: 'c.DOB', type: 'date' },
    gender: { column: 'c.Sex', type: 'string' },
    DateOfVisit: { column: 'g.DateOfVisit', type: 'date' },
    loyaltyID: { column: 'lm.LoyaltyID', type: 'number' },
    points: { column: 'lm.Points', type: 'number' }
};

const SELECTION_OPERATOR_MAP = {
    eq: '=',
    ne: '<>',
    lt: '<',
    gt: '>',
    leq: '<=',
    geq: '>='
};

function formatDate(value) {
    if (!value) {
        return null;
    }
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }
    return value;
}

function normalizeCustomerProfileRow(row = {}) {
    const normalized = {
        customerID: row.CUSTOMERID,
        customerName: row.CUSTOMERNAME,
        sex: row.SEX,
        dateOfBirth: row.DOB,
        dateOfVisit: row.DATEOFVISIT,
        loyaltyID: row.LOYALTYID,
        loyaltyPoints: row.POINTS
    };

    normalized.membershipType = normalized.loyaltyID === null || normalized.loyaltyID === undefined ? 'guest' : 'loyalty';
    return normalized;
}

function buildSelectionCondition(rule, index, bindParams) {
    const config = SELECTION_ATTRIBUTE_CONFIG[rule.attribute];
    if (!config) {
        throw new Error(`Attribute "${rule.attribute}" is not supported.`);
    }

    const sqlOperator = SELECTION_OPERATOR_MAP[rule.operator];
    if (!sqlOperator) {
        throw new Error(`Operator "${rule.operator}" is not supported.`);
    }

    if (config.type === 'string' && !(rule.operator === 'eq' || rule.operator === 'ne')) {
        throw new Error(`Operator "${rule.operator}" is not allowed for attribute ${rule.attribute}.`);
    }

    const bindKey = `selectionValue${index}`;
    let bindValue = rule.value;
    let condition;

    if (config.type === 'number') {
        const numericValue = Number(rule.value);
        if (Number.isNaN(numericValue)) {
            throw new Error(`Value for ${rule.attribute} must be a number.`);
        }
        bindValue = numericValue;
        condition = `${config.column} ${sqlOperator} :${bindKey}`;
    } else if (config.type === 'date') {
        if (!rule.value || typeof rule.value !== 'string') {
            throw new Error(`Value for ${rule.attribute} must be a date string (YYYY-MM-DD).`);
        }
        condition = `${config.column} ${sqlOperator} TO_DATE(:${bindKey}, 'YYYY-MM-DD')`;
    } else {
        condition = `${config.column} ${sqlOperator} :${bindKey}`;
    }

    bindParams[bindKey] = bindValue;
    return condition;
}

async function updateSeasonPassLoyalty(connection, oldLoyaltyID, newLoyaltyID) {
    if (!oldLoyaltyID || !newLoyaltyID || oldLoyaltyID === newLoyaltyID) {
        return;
    }

    await connection.execute(
        UPDATE_SEASONPASS_LOYALTY_SQL,
        { oldLoyaltyID, newLoyaltyID },
        { autoCommit: false }
    );
}

async function fetchCustomerProfiles() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(SELECT_CUSTOMER_PROFILES_SQL, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return result.rows.map((row) => normalizeCustomerProfileRow(row));
    }).catch(() => []);
}

async function fetchGuestVisits() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(SELECT_GUEST_VISITS_SQL, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return result.rows.map((row) => ({
            customerID: row.CUSTOMERID,
            customerName: row.CUSTOMERNAME,
            dateOfVisit: formatDate(row.DATEOFVISIT)
        }));
    }).catch(() => []);
}

async function fetchLoyaltyMembers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(SELECT_LOYALTY_MEMBERS_SQL, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return result.rows.map((row) => ({
            customerID: row.CUSTOMERID,
            customerName: row.CUSTOMERNAME,
            sex: row.SEX,
            dateOfBirth: formatDate(row.DATEOFBIRTH),
            loyaltyID: row.LOYALTYID,
            points: row.POINTS
        }));
    }).catch(() => []);
}

async function projectCustomerAttributes(attributes = []) {
    if (!Array.isArray(attributes) || !attributes.length) {
        throw new Error('Select at least one attribute to run the projection.');
    }

    const normalizedAttributes = attributes
        .map((attribute) => (typeof attribute === 'string' ? attribute.trim() : ''))
        .filter((attribute, index, self) => attribute && self.indexOf(attribute) === index && CUSTOMER_PROJECTION_COLUMNS.includes(attribute));

    if (!normalizedAttributes.length) {
        throw new Error('No valid projection attributes were provided.');
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(SELECT_CUSTOMER_PROFILES_SQL, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        const normalizedRows = result.rows.map((row) => normalizeCustomerProfileRow(row));
        return normalizedRows.map((row) => {
            const projected = {};
            normalizedAttributes.forEach((attribute) => {
                projected[attribute] = row[attribute];
            });
            return projected;
        });
    });
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

        let currentLoyaltyID = null;
        const loyaltyLookup = await connection.execute(SELECT_LOYALTY_MEMBER_ID_SQL, {
            customerID: numericCustomerID
        });
        if (loyaltyLookup.rows.length) {
            currentLoyaltyID = loyaltyLookup.rows[0][0];
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

            if (updates.dateOfVisit !== undefined) {
                throw new Error('Customer updates do not support visit dates.');
            }

            const wantsLoyaltyUpdate = updates.loyaltyID !== undefined || updates.loyaltyPoints !== undefined;

            if (wantsLoyaltyUpdate) {
                const nextLoyaltyID = updates.loyaltyID ?? currentLoyaltyID;
                if (nextLoyaltyID === undefined || nextLoyaltyID === null || nextLoyaltyID === '') {
                    throw new Error('loyaltyID is required for loyalty members.');
                }

                const loyaltyPointsValue = updates.loyaltyPoints !== undefined ? Number(updates.loyaltyPoints) : undefined;
                if (loyaltyPointsValue !== undefined && (Number.isNaN(loyaltyPointsValue) || loyaltyPointsValue < 0)) {
                    throw new Error('loyaltyPoints must be a non-negative number.');
                }

                if (currentLoyaltyID && nextLoyaltyID !== currentLoyaltyID) {
                    await updateSeasonPassLoyalty(connection, currentLoyaltyID, nextLoyaltyID);
                }

                await connection.execute(
                    MERGE_LOYALTY_MEMBER_PARTIAL_SQL,
                    {
                        customerID: numericCustomerID,
                        loyaltyID: nextLoyaltyID,
                        loyaltyPoints: loyaltyPointsValue,
                        uuid: generateUuid()
                    },
                    { autoCommit: false }
                );
                didUpdate = true;
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

async function runCustomerSelection(rules = []) {
    if (!Array.isArray(rules) || !rules.length) {
        throw new Error('At least one selection condition is required.');
    }

    const bindParams = {};
    const normalizedConditions = [];

    rules.forEach((rule, index) => {
        const attribute = rule?.attribute;
        const operator = rule?.operator;
        const value = typeof rule?.value === 'string' ? rule.value.trim() : rule?.value;

        if (!attribute || !operator || value === undefined || value === null || value === '') {
            throw new Error('Each rule must include an attribute, operator, and value.');
        }

        const condition = buildSelectionCondition({ attribute, operator, value }, index, bindParams);
        const connector = (rule.connector || 'and').toLowerCase() === 'or' ? 'OR' : 'AND';

        normalizedConditions.push({ condition, connector });
    });

    if (!normalizedConditions.length) {
        throw new Error('No valid rules were provided.');
    }

    const whereClause = normalizedConditions
        .map((entry, index) => {
            const clause = `(${entry.condition})`;
            if (index === normalizedConditions.length - 1) {
                return clause;
            }
            return `${clause} ${entry.connector}`;
        })
        .join(' ');

    const selectionSql = `${CUSTOMER_SELECTION_BASE_SQL} WHERE ${whereClause} ORDER BY c.CustomerID`;

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(selectionSql, bindParams, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return result.rows.map((row) => ({
            customerID: row.CUSTOMERID,
            customerName: row.CUSTOMERNAME,
            sex: row.SEX,
            dateOfBirth: row.DOB,
            dateOfVisit: row.DATEOFVISIT,
            loyaltyID: row.LOYALTYID,
            loyaltyPoints: row.POINTS
        }));
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
    fetchCustomerProfiles,
    fetchGuestVisits,
    fetchLoyaltyMembers,
    insertCustomer,
    deleteLoyaltyMembership,
    projectCustomerAttributes,
    updateCustomerDetails,
    runCustomerSelection,
    countCustomers,
    countGuests,
    countLoyaltyMembers,
    getCustomerStats
};
