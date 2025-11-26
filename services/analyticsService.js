const { oracledb, withOracleDB } = require('./database');
const { loadSqlCommand } = require('../utils/sqlLoader');

const MIN_AVG_POINTS_BY_BIRTH_YEAR_SQL = loadSqlCommand('analytics/min_avg_points_by_birth_year.sql');
const CUSTOMERS_WHO_RODE_ALL_RIDES_SQL = loadSqlCommand('analytics/customers_who_rode_all_rides.sql');

async function getMinAvgPointsByBirthYear() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            MIN_AVG_POINTS_BY_BIRTH_YEAR_SQL,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map((row) => ({
            birthYear: row.BIRTH_YEAR,
            averagePoints: row.AVG_POINTS === null || row.AVG_POINTS === undefined ? null : Number(row.AVG_POINTS)
        }));
    }).catch(() => []);
}

async function getCustomersWhoRodeAllRides() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            CUSTOMERS_WHO_RODE_ALL_RIDES_SQL,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map((row) => ({
            customerID: row.CUSTOMERID,
            customerName: row.CUSTOMERNAME
        }));
    }).catch(() => []);
}

module.exports = {
    getMinAvgPointsByBirthYear,
    getCustomersWhoRodeAllRides
};
