const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

console.log('Testing database connection...');
console.log(`Connecting to ${process.env.DB_NAME} at ${process.env.DB_HOST}:${process.env.DB_PORT} as ${process.env.DB_USER}`);

client.connect()
    .then(() => {
        console.log('Successfully connected to the database!');
        return client.query('SELECT NOW()');
    })
    .then((res) => {
        console.log('Query result:', res.rows[0]);
        return client.end();
    })
    .catch((err) => {
        console.error('Connection failed:', err);
        process.exit(1);
    });
