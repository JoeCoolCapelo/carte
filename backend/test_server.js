const express = require('express');
const app = express();
const PORT = 5001;

app.get('/', (req, res) => res.send('Hello'));

const server = app.listen(PORT, () => {
    console.log(`Test server running on ${PORT}`);
});

process.on('exit', (code) => {
    console.log(`Test server exiting with code ${code}`);
});
