const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../../logs");
const logFilePath = path.join(logDir, "log.txt");

const logger = (error, info) => {
    const time = new Date().toISOString();
    const logType = info;
    const logMessage = `[${time}] ${logType}: ${error}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error("Logging failed:", err);
    });
};

module.exports = {"log" : logger};
