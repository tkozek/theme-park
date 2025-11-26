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

function generateUuid() {
    const timeComponent = Date.now() % 1000000000;
    const randomComponent = Math.floor(Math.random() * 1000);
    return Number(`${timeComponent}${randomComponent.toString().padStart(3, '0')}`);
}

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

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Guest');
        return result.rows;
    }).catch(() => {
        return [];
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

async function fetchCustomerProfiles() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT
                c.CustomerID,
                c.CustomerName,
                c.Sex,
                TO_CHAR(c.DOB, 'YYYY-MM-DD') AS DOB,
                TO_CHAR(g.DateOfVisit, 'YYYY-MM-DD') AS DateOfVisit,
                lm.LoyaltyID,
                lm.Points
            FROM Customer c
            LEFT JOIN Guest g ON g.CustomerID = c.CustomerID
            LEFT JOIN LoyaltyMember lm ON lm.CustomerID = c.CustomerID
            ORDER BY c.CustomerID
            `,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

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


async function insertCustomer({ customerID, customerName, dateOfBirth, sex, dateOfVisit, loyaltyID, loyaltyPoints }) {
    return await withOracleDB(async (connection) => {

        try{

            // Check required fields in customer!!
            if (!customerID || !customerName || !dateOfBirth || !sex) {
                throw new Error('customerID, customerName, dateOfBirth, and sex are required.');
            }

            //checking to make sure that the customer is not both Guest & LoyaltyMember, but also not neither
            const isGuest = (dateOfVisit !== undefined && dateOfVisit !== null);
            const isLoyaltyMember = (loyaltyID !== undefined && loyaltyID !== null);

            //checking if both fields have been entered...
            if (isGuest && isLoyaltyMember) {
                throw new Error('Customer cannot be both Guest & Loyalty Member, please only fill in fields for one of them');
            }

            //checking if neither fields have been entered...
            if (!isGuest && !isLoyaltyMember) {
                throw new Error('Customer must be either a Guest or Loyalty Member, please fill in fields for one of them');
            }


            // insert the data into the customer table!! (customer must be either GUEST or LOYALTYMEMBER)
            await connection.execute(
                `INSERT INTO Customer (CustomerID, CustomerName, DOB, Sex) VALUES (:customerID, :customerName, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :sex)`,
                { customerID, customerName, dateOfBirth, sex },
                {autoCommit: false}
            );

            // if they are a guest, insert into guest table
            if (isGuest) {
                await connection.execute(
                    `INSERT INTO Guest (CustomerID, DateOfVisit) VALUES (:customerID, TO_DATE(:dateOfVisit, 'YYYY-MM-DD'))`,
                    { customerID, dateOfVisit },
                    {autoCommit: false}
                );
            }


            //if they are a loyalty member (dont need check bc final case), insert into loyaltymember table
            else {
                const uuid = 10000 + Math.floor(Date.now() % 100000); // generating a UUID from the seasonpass table
                // defaulting loyaltyPoints to 0 if not provided
                const pointsValue = loyaltyPoints !== undefined ? loyaltyPoints : 0;

                await connection.execute(
                    `INSERT INTO LoyaltyMember (CustomerID, LoyaltyID, Points, UUID) VALUES (:customerID, :loyaltyID, :loyaltyPoints, :uuid)`,
                    { customerID, loyaltyID, loyaltyPoints: pointsValue, uuid },
                    {autoCommit: false }

                );
            }

            // sucess - commit both inserts!!
            await connection.commit();
            return true;

        } catch (err) {
            await connection.rollback();
            console.error('Customer could not be inserted!!', err);
            throw err;
        }
        
        
    }).catch(() => {
        return false;
    });
}

async function deleteCustomer(customerID) {
    return await withOracleDB(async (connection) => {

        // make sure that the customerID is actually numbers
        const customerIDNumebr = Number(customerID);
        if (!customerIDNumber || Number.isNaN(customerIDNumber)) {
            throw new Error('Customer ID which you have provided is not valid! Please use numbers only')
        }

        // does customerID provided exist?
        const existingCustomer = await connection.execute(
            'SELECT 1FROM Customer WHERE CustomerID = :customerID',
            { customerID: customerIDNumber }
        );
        if (!existingCustomer.rows.length) {
            return false; // customer was not found in database!
        }

        try {
            const result = await connection.execute(
                'DELETE FROM Customer WHERE CustomerID = :customerID',
                { customerID: customerIDNumber },
                { autoCommit: true }
            );
            return result.rowAffected && result.rowsAffected > 0; // this will reutrn 1 for 1 row deleted if sucessful, otherwise 0
        } catch (err) {
            console.error('There was an error deleting the customer!', err);
            throw err;
        }

        
        
    }).catch((err) => {
        if (err && err.message){
            throw err;  
        }
    });

}



async function updateCustomerDetails(customerID, updates = {}) {
    return await withOracleDB(async (connection) => {
        const numericCustomerID = Number(customerID);
        if (!numericCustomerID || Number.isNaN(numericCustomerID)) {
            throw new Error('A valid CustomerID is required.');
        }

        const exists = await connection.execute(
            'SELECT 1 FROM Customer WHERE CustomerID = :customerID',
            { customerID: numericCustomerID }
        );

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
                const result = await connection.execute(
                    `UPDATE Customer SET ${setClauses.join(', ')} WHERE CustomerID = :customerID`,
                    bindParams,
                    { autoCommit: false }
                );
                didUpdate = didUpdate || (result.rowsAffected && result.rowsAffected > 0);
            }

            const targetMembership = updates.membershipType ||
                (updates.loyaltyID !== undefined || updates.loyaltyPoints !== undefined ? 'loyalty' : undefined) ||
                (updates.dateOfVisit !== undefined ? 'guest' : undefined);

            if (targetMembership === 'guest') {
                await connection.execute('DELETE FROM LoyaltyMember WHERE CustomerID = :customerID', { customerID: numericCustomerID }, { autoCommit: false });
                didUpdate = true;
                if (updates.dateOfVisit) {
                    await connection.execute(
                        `MERGE INTO Guest g
                         USING dual
                         ON (g.CustomerID = :customerID)
                         WHEN MATCHED THEN UPDATE SET DateOfVisit = TO_DATE(:dateOfVisit, 'YYYY-MM-DD')
                         WHEN NOT MATCHED THEN INSERT (CustomerID, DateOfVisit)
                             VALUES (:customerID, TO_DATE(:dateOfVisit, 'YYYY-MM-DD'))`,
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

                await connection.execute('DELETE FROM Guest WHERE CustomerID = :customerID', { customerID: numericCustomerID }, { autoCommit: false });

                await connection.execute(
                    `MERGE INTO LoyaltyMember lm
                     USING dual
                     ON (lm.CustomerID = :customerID)
                     WHEN MATCHED THEN UPDATE SET
                         LoyaltyID = :loyaltyID,
                         Points = :loyaltyPoints
                     WHEN NOT MATCHED THEN INSERT (CustomerID, LoyaltyID, Points, UUID)
                         VALUES (:customerID, :loyaltyID, :loyaltyPoints, :uuid)`,
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
                        `UPDATE Guest SET DateOfVisit = TO_DATE(:dateOfVisit, 'YYYY-MM-DD') WHERE CustomerID = :customerID`,
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
                        `MERGE INTO LoyaltyMember lm
                         USING dual
                         ON (lm.CustomerID = :customerID)
                         WHEN MATCHED THEN UPDATE SET
                             LoyaltyID = NVL(:loyaltyID, lm.LoyaltyID),
                             Points = NVL(:loyaltyPoints, lm.Points)
                         WHEN NOT MATCHED THEN INSERT (CustomerID, LoyaltyID, Points, UUID)
                             VALUES (:customerID, :loyaltyID, NVL(:loyaltyPoints, 0), :uuid)`,
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
    fetchDemotableFromDb,
    fetchCustomers,
    fetchCustomerProfiles,
    fetchGuestVisits,
    initiateDemotable, 
    insertCustomer,
    updateCustomerDetails,
    updateNameDemotable, 
    countDemotable,
    countCustomers,
    dropAndCreateTables,
    populateSeedData,
    resetDatabase
};

const createalltables = `

`;
