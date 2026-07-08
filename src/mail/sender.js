const smtp = require("./smtp");
const config = require("../config");

const replace = require("../template/replace");
const loadTemplate = require("../template/loader");

const repo = require("../tracker/repository");


const template = loadTemplate();


async function send(email){


    let html = replace(
        template,
        email
    );


    const info = await smtp.sendMail({

        from:
        `"${config.from.name}" <${config.from.email}>`,

        to: email,

        subject:
        "Important information about",

        html,

        headers:{
            "List-Unsubscribe":
            "<mailto:unsubscribe@boga.duud.ae>",

            "List-Unsubscribe-Post":
            "List-Unsubscribe=One-Click"
        }

    });



    const match =
    info.response.match(
        /queued as ([A-Z0-9]+)/i
    );



    if(match){


        const queueId = match[1];


        repo.insertMail({

            queue_id: queueId,

            email: email,

            subject:
            "Important information about",

            response:
            info.response

        });


        repo.addEvent(

            queueId,

            "QUEUED",

            info.response

        );


        console.log(
            "📥 TRACKED",
            queueId,
            email
        );


    }


}



module.exports = send;