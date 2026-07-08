const smtp = require("./smtp");
const config = require("../config");
const replace = require("../template/replace");
const loadTemplate = require("../template/loader");
const fs = require("fs");
const path = require("path");

const queueFile = path.join(
    __dirname,
    // "tracker",
    "../tracker/queue.json"
);

const db = require("../tracker/db");

const template = loadTemplate();


async function send(email) {


    let html = replace(
        template,
        email
    );


    const info = await smtp.sendMail({

        from: `"${config.from.name}" <${config.from.email}>`,

        to: email,

        subject: "Important information about ",

        html,

        headers: {
            "List-Unsubscribe": "<mailto:unsubscribe@boga.duud.ae>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        }

    });

    // console.log(info.response);
    // const match = info.response.match(/queued as ([A-Z0-9]+)/i);
    // console.log('match', match)

    try {

        const match = info.response.match(/queued as ([A-Z0-9]+)/i);

        console.log("MATCH:", match);

        if (match) {

            const queueId = match[1];

            let queue = {};

            console.log("QUEUE FILE:", queueFile);

            if (fs.existsSync(queueFile)) {
                queue = JSON.parse(
                    fs.readFileSync(queueFile, "utf8")
                );
            }

            queue[queueId] = {
                email: email,
                status: "QUEUED",
                created: new Date().toISOString()
            };


            fs.writeFileSync(
                queueFile,
                JSON.stringify(queue, null, 2)
            );


            console.log("SAVED:", queueId);

        }

    } catch (err) {

        console.log("TRACKER ERROR:", err.message);

    }

    // if (match) {

    //     const queueId = match[1];

    //     let queue = {};

    //     if (fs.existsSync(queueFile)) {
    //         queue = JSON.parse(
    //             fs.readFileSync(queueFile, "utf8")
    //         );
    //     }


    //     queue[queueId] = {
    //         email: email,
    //         status: "QUEUED",
    //         created: new Date().toISOString()
    //     };


    //     fs.writeFileSync(
    //         queueFile,
    //         JSON.stringify(queue, null, 2)
    //     );


    //     console.log(
    //         "TRACKED:",
    //         queueId,
    //         email
    //     );

    // }


}


module.exports = send;
