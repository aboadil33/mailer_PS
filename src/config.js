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

   template: process.env.TEMPLATE || false,
   workers: Number(process.env.WORKERS),
   delay: Number(process.env.DELAY),
   linkRotateAfter: Number(process.env.LINK_ROTATE_AFTER || 100),

   // ============================================
   // ✅ البارامترات الجديدة (ضيفهم فقط)
   // ============================================
   useSpintax: process.env.USE_SPINTAX === 'true',
   addReference: process.env.ADD_REFERENCE === 'true',
   addSession: process.env.ADD_SESSION === 'true',
   addDate: process.env.ADD_DATE === 'true',
   trackingEnabled: process.env.TRACKING_ENABLED === 'true',
   subjectRotation: process.env.SUBJECT_ROTATION === 'true',
   templateRotation: process.env.TEMPLATE_ROTATION === 'true'

};