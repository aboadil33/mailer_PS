const fs = require("fs");
const config = require("../config");


const urls = fs.readFileSync(
    __dirname + "/../data/urls.txt",
    "utf8"
)
    .split(/\r?\n/)
    .filter(Boolean);


let counter = 0;
let index = 0;


function getLink() {

    const link = urls[index];


    counter++;


    if (counter >= config.linkRotateAfter) {

        counter = 0;

        index++;

        if (index >= urls.length) {
            index = 0;
        }

    }


    return link;

}


module.exports = getLink;