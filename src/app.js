const fs = require("fs");

const config = require("./config");
const worker = require("./queue/worker");


let queue = fs.readFileSync(
    __dirname + "/data/emails.txt",
    "utf8"
)
.split(/\r?\n/)
.filter(Boolean);


const stats = {
    total: queue.length,
    sent: 0,
    failed: 0
};


console.log(`TOTAL EMAILS: ${stats.total}`);


let workers = [];


for (let i = 0; i < config.workers; i++) {

    workers.push(
        worker(queue, stats)
    );

}


Promise.all(workers)
.then(() => {

    console.log("========== DONE ==========");
    console.log(`TOTAL : ${stats.total}`);
    console.log(`SENT  : ${stats.sent}`);
    console.log(`FAILED: ${stats.failed}`);

});