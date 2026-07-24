const config = require("../config");
const send = require("../mail/sender");
const logger = require("../utils/logger");

// ============================================
// ✅ Worker مع Delay و Logging
// ============================================
async function worker(queue, stats) {

    while (queue.length) {

        // 1. جلب إيميل من الطابور
        let email = queue.shift();

        // 2. تسجيل الوقت الحالي
        const startTime = Date.now();

        try {

            // 3. إرسال الإيميل
            await send(email);

            // 4. تسجيل النجاح
            logger.sent(email);
            stats.sent++;
            
            // 5. حساب وقت الإرسال
            const elapsed = Date.now() - startTime;
            
            console.log(
                `✅ SENT ${email} | ${stats.sent}/${stats.total} | ⏱️ ${elapsed}ms`
            );

        } catch (e) {

            // 6. تسجيل الفشل
            logger.error(email + " " + e.message);
            stats.failed++;
            
            console.log(
                `❌ FAILED ${email} | Failed: ${stats.failed} | ${e.message}`
            );

        }

        // 7. ✅ التأخير بين الإيميلات (من الـ CONFIG)
        await new Promise(r => setTimeout(r, config.delay));

    }

}

module.exports = worker;