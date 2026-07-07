const config = require("../config");
const send = require("../mail/sender");

const logger = require("../utils/logger");


async function worker(queue) {


    while (queue.length) {


        let email = queue.shift();


        try {

            await send(email);

            logger.sent(email);

            console.log("SENT", email);


        } catch (e) {

            logger.error(email + " " + e.message);

            console.log("ERROR", email);

        }


        await new Promise(r => setTimeout(r, config.delay));


    }


}



module.exports = worker;
