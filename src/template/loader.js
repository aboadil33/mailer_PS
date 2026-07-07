const fs = require("fs");


module.exports = function () {

    return fs.readFileSync(
        __dirname + "/../data/letter.html",
        "utf8"
    );

}
