const smtp = require("./smtp");
const config = require("../config");
const replace = require("../template/replace");
const loadTemplate = require("../template/loader");


const template = loadTemplate();


async function send(email) {


    let html = replace(
        template,
        email
    );


    await smtp.sendMail({

        from: `"${config.from.name}" <${config.from.email}>`,

        to: email,

        subject: "Test Email",

        html

        /**headers:{
            "List-Unsubscribe": "<mailto:unsubscribe@boga.askinvestments.ae>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        }**/

    });


}


module.exports = send;
