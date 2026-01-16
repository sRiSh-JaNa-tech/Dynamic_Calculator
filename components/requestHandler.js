const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    console.log(url);
};

module.exports = requestHandler;