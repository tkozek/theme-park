const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

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

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Guest');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`
BEGIN
  FOR t IN (SELECT table_name FROM user_tables) LOOP
    EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
  END LOOP;
END;`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(createalltables);
        return true;
    }).catch(() => {
        return false;
    });
}

// async function insertDemotable(id, name) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO Guest (id, name) VALUES (:id, :name)`,
//             [id, name],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }


async function insertCustomer(customerID, customerName, dateOfBirth, gender, dateOfVisit, loyaltyID, loyaltyPoints) {
    return await withOracleDB(async (connection) => {

        try{

            // insert the data into the customer table!! (customer must be either GUEST or LOYALTYMEMBER)
            await connection.execute(
                `INSERT INTO Customer (customerID, customerName, dateOfBirth, gender) VALUES (:customerID, :customerName, :TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), gender)`,
                [customerID, dateOfVisit],
                {autocommit: false}
            );

            // if they are a guest, insert into guest table
            if (isGuest && dateOfVisit) {
                await connection.execute(
                    `INSERT INTO Guest (customerID, dateOfVisit) VALUES (:customerID, TO_DATE(:dateOfVisit, 'YYYY-MM-DD')),))`,
                    [customerID, dateofVisit],
                    {autoCommit: false}
                )
            }


            //if they are a loyalty member, insert into loyaltymember table
            else if (!isGuest && loyaltyID !== undefined && points !== undefined){
                const uuid = 10000 + Math.floor(Date.now() % 100000); // generating a UUID from the seasonpass table

                await connection.execute(
                    `INSERT INTO LoyaltyMember (customerID, loyaltyID, loyaltyPoints, UUID) VALUES (:customerID, :loyaltyID, :loyaltyPoints, :uuid)`,
                    [customerID, loyaltyID, loyaltyPoints, uuid],
                    {autoCommit: false }

                );
            }

            // sucess - commit both inserts!!
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


async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable
};

const createalltables = `

`