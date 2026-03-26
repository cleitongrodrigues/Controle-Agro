const db = require('pg');
const user = process.env.DB_User;
const password = process.env.DB_Password;
const host = process.env.DB_Host;
const port = process.env.DB_Port;
const database = process.env.DB_Database;

const pool = new db.Pool({
    user: user,
    password: password,
    host: host,
    port: port,
    database: database
});

module.exports = pool;