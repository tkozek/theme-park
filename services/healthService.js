const { withOracleDB } = require('./database');

async function testOracleConnection() {
    return await withOracleDB(async () => true).catch(() => false);
}

module.exports = {
    testOracleConnection
};
