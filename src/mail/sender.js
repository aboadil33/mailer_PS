const smtp = require("./smtp");
const config = require("../config");

const replace = require("../template/replace");
const loadTemplate = require("../template/loader");

const repo = require("../tracker/repository");
const { randomCode } = require("../utils/random");

const template = loadTemplate();


async function send(email){


    let html = replace(
        template,
        email
    );


    // console.log(config.from.email.replace("!!RAND!!", randomCode(24)))


    const info = await smtp.sendMail({

        from:
        `"${config.from.name}" <${config.from.email}>`,
        from: `"${config.from.name}" <${config.from.email.replace("!!RAND!!", randomCode(49))}>`,

        to: email,

        subject:
        config.from.subject,

        html

//#        headers:{
//#            "List-Unsubscribe":
//#            "<mailto:unsubscribe@boga.duud.ae>",
//#
//#            "List-Unsubscribe-Post":
//#            "List-Unsubscribe=One-Click"
//#        }

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

            subject: config.from.subject,

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
