const config = require("../config");
const send = require("../mail/sender");

const logger = require("../utils/logger");


async function worker(queue, stats) {


    while (queue.length) {


        let email = queue.shift();


        try {

            await send(email);

            logger.sent(email);


            stats.sent++;


            console.log(
                `SENT ${email} | ${stats.sent}/${stats.total}`
            );


        } catch (e) {


            logger.error(email + " " + e.message);


            stats.failed++;


            console.log(
                `FAILED ${email} | Failed: ${stats.failed}`
            );

        }


        await new Promise(r => 
            setTimeout(r, config.delay)
        );


    }


}

module.exports = worker;