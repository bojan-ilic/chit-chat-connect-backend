const express = require('express');
const server = express();
const port = process.env.PORT || 4000;

server.get('/', (req, res) => {
    res.send('ChitChatConnect welcomes you to the server!');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
