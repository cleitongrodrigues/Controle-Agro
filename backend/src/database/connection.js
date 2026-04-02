const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
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