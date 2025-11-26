const fs = require('fs');
const path = require('path');
const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');

const envPath = path.resolve(__dirname, '..', '.env');
const envVariables = loadEnvFile(envPath);

const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error:', err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10);
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();
process.once('SIGTERM', closePoolAndExit).once('SIGINT', closePoolAndExit);

function readSqlFile(fileName) {
    const fullPath = path.resolve(__dirname, '..', fileName);
    return fs.readFileSync(fullPath, 'utf8');
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

async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection();
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

function generateUuid() {
    const timeComponent = Date.now() % 1000000000;
    const randomComponent = Math.floor(Math.random() * 1000);
    return Number(`${timeComponent}${randomComponent.toString().padStart(3, '0')}`);
}

module.exports = {
    oracledb,
    readSqlFile,
    executeSqlStatements,
    withOracleDB,
    generateUuid
};
