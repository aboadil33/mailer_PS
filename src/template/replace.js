const { randomCode, generateSession } = require("../utils/random");
const getLink = require("../utils/link");


module.exports = function (html, email) {


    return html

        .replaceAll(
            "{{##Email##}}",
            email
        )

        .replaceAll(
            "{{##Rand##}}",
            randomCode()
        )

        .replaceAll(
            "{{##SESSION##}}",
            generateSession()
        )
        .replaceAll(
            "{{##LINK##}}",
            getLink()
        )

        .replaceAll(
            "{{##Date##}}",
            new Date().toISOString()
        );


}


// module.exports = function (html, email) {


//     return html
//         .replaceAll("{{##Email##}}", email)
//         .replaceAll("{{##Rand##}}", random())
//         .replaceAll(
//             "{{##Date##}}",
//             new Date().toISOString()
//         );


// }
