const fs = require("fs");


function log(file, text) {

    fs.appendFileSync(
        `logs/${file}`,
        `${new Date().toISOString()} ${text}\n`
    );

}


module.exports = {
    sent: (x) => log("sent.log", x),
    error: (x) => log("error.log", x)
};
