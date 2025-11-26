const { executeSqlStatements, withOracleDB } = require('./database');
const { loadSqlCommand } = require('../utils/sqlLoader');

const DROP_ALL_SQL = loadSqlCommand('dropall.sql');
const CREATE_TABLES_SQL = loadSqlCommand('createtables.sql');
const INSERT_VALUES_SQL = loadSqlCommand('insertvalues.sql');
const COUNT_CUSTOMERS_SQL = loadSqlCommand('common/count_customers.sql');
const COUNT_GUESTS_SQL = loadSqlCommand('common/count_guests.sql');

async function dropAndCreateTables() {
    return await withOracleDB(async (connection) => {
        await connection.execute(DROP_ALL_SQL);
        console.info('Dropped all tables');
        await executeSqlStatements(connection, CREATE_TABLES_SQL, 'createtables.sql');
        console.info('Created all tables');
        await connection.commit();
        return true;
    }).catch((err) => {
        console.error('Error dropping/creating tables:', err);
        return false;
    });
}

async function populateSeedData() {
    if (!INSERT_VALUES_SQL.trim().length) {
        return true;
    }

    return await withOracleDB(async (connection) => {
        await executeSqlStatements(connection, INSERT_VALUES_SQL, 'insertvalues.sql');
        const customerCount = await connection.execute(COUNT_CUSTOMERS_SQL);
        console.info('Seeded customers:', customerCount.rows?.[0]?.[0] ?? 0);
        const guestCount = await connection.execute(COUNT_GUESTS_SQL);
        console.info('Seeded guest visits:', guestCount.rows?.[0]?.[0] ?? 0);
        await connection.commit();
        return true;
    }).catch((err) => {
        console.error('Error populating seed data:', err);
        return false;
    });
}

async function resetDatabase() {
    const dropped = await dropAndCreateTables();
    if (!dropped) {
        return false;
    }
    return populateSeedData();
}

module.exports = {
    dropAndCreateTables,
    populateSeedData,
    resetDatabase
};
