const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_User,
    password: process.env.DB_Password,
    host: process.env.DB_Host,
    port: process.env.DB_Port,
    database: process.env.DB_Database,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL!');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no pool do PostgreSQL:', err);
});

module.exports = pool;