const express = require('express');
const server = express();
const environment = process.env.NODE_ENV;
const { PROD_APP_NAME, DEV_APP_NAME, PORT } = require('./config/config');

server.get('/', (req, res) => {
    const appName = environment === 'production' ? PROD_APP_NAME : DEV_APP_NAME;
    const environmentMessage =
        environment === 'production' ? 'production' : 'development';
    res.send(`Welcome to the ${environmentMessage} environment of ${appName}`);
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
