const http = require('http');
const open = require("open").default;
const requestHandler = require('../components/Scripts/requestHandler');
const logger = require('../components/Scripts/logger');

let browserOpened = false;
const PORT = 3000;
const server = http.createServer((req, res) => {
    try {
        requestHandler(req, res);
    } catch (err) {
        logger.log(err.message, "ERROR");
        if (!res.headersSent) {
            res.writeHead(500);
            res.end("Internal Server Error");
        }
    }
});

server.on("error", (err) => {
    logger.log(err.message, "ERROR");
});

server.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    logger.log(`Server started on port ${PORT}`, "INFO");

    if (!browserOpened) {
        browserOpened = true;
        await open(`http://localhost:${PORT}`);
    }
});
