require("dotenv").config();

module.exports = {

   smtp: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT)
   },

   from: {
      name: process.env.FROM_NAME,
      email: process.env.FROM_EMAIL,
      subject: process.env.SUBJECT
   },

   workers: Number(process.env.WORKERS),
   delay: Number(process.env.DELAY),
   linkRotateAfter:Number(process.env.LINK_ROTATE_AFTER || 100)

};
