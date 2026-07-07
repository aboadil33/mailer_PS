const fs = require("fs");

const config = require("./config");
const worker = require("./queue/worker");


let queue = fs.readFileSync(
    __dirname + "/data/emails.txt",
    "utf8"
)
    .split(/\r?\n/)
    .filter(Boolean);


let workers = [];


for (let i = 0; i < config.workers; i++) {

    workers.push(
        worker(queue)
    );

}


Promise.all(workers)
    .then(() => {

        console.log("DONE");

    });
