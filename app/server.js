const http = require('http');
const open = require("open").default;
const requestHandler = require('../components/Scripts/requestHandler');
const logger = require('../components/Scripts/logger');

const PORT = 3000;
const server = http.createServer(requestHandler,(err)=>{
    console.log(err);
    logger.log(err, "ERROR");
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    logger.log(`Server started on port ${PORT}`, "INFO");
    open(`http://localhost:${PORT}`);
});
