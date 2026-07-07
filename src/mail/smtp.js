const nodemailer = require("nodemailer");
const config = require("../config");


module.exports = nodemailer.createTransport({

   host: config.smtp.host,
   port: config.smtp.port,
   secure: false,

   tls: {
      rejectUnauthorized: false
   }

});
