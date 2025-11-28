const { oracledb, withOracleDB } = require('./database');
const { loadSqlCommand } = require('../utils/sqlLoader');

const MIN_AVG_POINTS_BY_BIRTH_YEAR_SQL = loadSqlCommand('q9/q9_min_avg_points_by_birth_year.sql');
const CUSTOMERS_WHO_RODE_ALL_RIDES_SQL = loadSqlCommand('q10/q10_customers_who_rode_all_rides.sql');
const LIST_RIDES_SQL = loadSqlCommand('q6/q6_list_rides.sql');
const CUSTOMERS_BY_RIDE_SQL = loadSqlCommand('q6/q6_customers_by_ride.sql');
const AVG_POINTS_BY_GENDER_SQL = loadSqlCommand('q7/q7_avg_points_group_genders_.sql');
const GUEST_COUNTS_BY_MONTH_SQL = loadSqlCommand('q8/q8_guest_counts_by_month.sql');

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

async function listRideNames() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            LIST_RIDES_SQL,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map((row) => row.RIDENAME);
    }).catch(() => []);
}

async function getCustomersByRide(rideName) {
    if (!rideName) {
        return [];
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            CUSTOMERS_BY_RIDE_SQL,
            { rideName },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map((row) => ({
            customerID: row.CUSTOMERID,
            customerName: row.CUSTOMERNAME,
            membershipStatus: row.MEMBERSHIPSTATUS
        }));
    }).catch(() => []);
}

async function getAveragePointsByGender() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            AVG_POINTS_BY_GENDER_SQL,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map((row) => ({
            gender: row.GENDER,
            averagePoints: row.AVERAGE_POINTS === null || row.AVERAGE_POINTS === undefined ? null : Number(row.AVERAGE_POINTS)
        }));
    }).catch(() => []);
}

async function getGuestCountsByMonth() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            GUEST_COUNTS_BY_MONTH_SQL,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map((row) => ({
            month: row.VISIT_MONTH,
            guestCount: row.GUEST_COUNT
        }));
    }).catch(() => []);
}

module.exports = {
    getMinAvgPointsByBirthYear,
    getCustomersWhoRodeAllRides,
    listRideNames,
    getCustomersByRide,
    getAveragePointsByGender,
    getGuestCountsByMonth
};
