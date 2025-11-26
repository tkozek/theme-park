const fs = require('fs');
const path = require('path');
const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

function readSqlFile(fileName) {
    const fullPath = path.join(__dirname, fileName);
    return fs.readFileSync(fullPath, 'utf8');
}

const DROP_ALL_SQL = readSqlFile('dropall.sql');
const CREATE_TABLES_SQL = readSqlFile('createtables.sql');
const INSERT_VALUES_SQL = readSqlFile('insertvalues.sql');

function splitSqlStatements(script) {
    const cleaned = script
        .split('\n')
        .map((line) => (line.trim().startsWith('--') ? '' : line))
        .join('\n');

    return cleaned
        .split(/;\s*(?:\r?\n|$)/)
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0);
}

async function executeSqlStatements(connection, script, label = 'SQL script') {
    const statements = splitSqlStatements(script);
    for (const statement of statements) {
        try {
            await connection.execute(statement);
        } catch (err) {
            console.error(`Error executing statement from ${label}:`, statement);
            throw err;
        }
    }
}

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};



// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchCustomers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Customer');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchGuestVisits() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT g.CustomerID, c.CustomerName, g.DateOfVisit
            FROM Guest g
            LEFT JOIN Customer c ON c.CustomerID = g.CustomerID
            ORDER BY g.DateOfVisit DESC, g.CustomerID
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertCustomer({ customerID, customerName, dateOfBirth, sex, dateOfVisit, loyaltyID, loyaltyPoints }) {
    return await withOracleDB(async (connection) => {
        if (!customerID || !customerName || !dateOfBirth || !sex) {
            throw new Error('customerID, customerName, dateOfBirth, and sex are required.');
        }

        try {
            await connection.execute(
                `INSERT INTO Customer (CustomerID, CustomerName, DOB, Sex)
                 VALUES (:customerID, :customerName, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :sex)`,
                { customerID, customerName, dateOfBirth, sex },
                { autoCommit: false }
            );

            if (dateOfVisit) {
                await connection.execute(
                    `INSERT INTO Guest (CustomerID, DateOfVisit)
                     VALUES (:customerID, TO_DATE(:dateOfVisit, 'YYYY-MM-DD'))`,
                    { customerID, dateOfVisit },
                    { autoCommit: false }
                );
            }

            if (loyaltyID !== undefined && loyaltyPoints !== undefined) {
                const uuid = 10000 + Math.floor(Date.now() % 100000);
                await connection.execute(
                    `INSERT INTO LoyaltyMember (CustomerID, LoyaltyID, Points, UUID)
                     VALUES (:customerID, :loyaltyID, :loyaltyPoints, :uuid)`,
                    { customerID, loyaltyID, loyaltyPoints, uuid },
                    { autoCommit: false }
                );
            }

            await connection.commit();
            return true;
        } catch (err) {
            await connection.rollback();
            console.error('Error: Cannot insert that customer!!', err);
            throw err;
        }
    }).catch(() => {
        return false;
    });
}


async function updateCustomerName(customerID, customerName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Customer SET CustomerName = :customerName WHERE CustomerID = :customerID`,
            { customerName, customerID },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countCustomers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT COUNT(*) FROM Customer');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

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
        const customerCount = await connection.execute('SELECT COUNT(*) FROM Customer');
        console.info('Seeded customers:', customerCount.rows?.[0]?.[0] ?? 0);
        const guestCount = await connection.execute('SELECT COUNT(*) FROM Guest');
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
    testOracleConnection,
    fetchCustomers,
    fetchGuestVisits,
    insertCustomer,
    updateCustomerName,
    countCustomers,
    dropAndCreateTables,
    populateSeedData,
    resetDatabase
};