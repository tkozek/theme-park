const fs = require('fs');
const path = require('path');

const SQL_BASE_PATH = path.resolve(__dirname, '..', 'sql_commands');
const sqlCache = new Map();

function loadSqlCommand(relativePath) {
    if (!relativePath || typeof relativePath !== 'string') {
        throw new Error('A relative SQL file path is required.');
    }

    if (sqlCache.has(relativePath)) {
        return sqlCache.get(relativePath);
    }

    const fullPath = path.join(SQL_BASE_PATH, relativePath);
    const sql = fs.readFileSync(fullPath, 'utf8');
    sqlCache.set(relativePath, sql);
    return sql;
}

module.exports = {
    loadSqlCommand
};
