const smtp = require('./smtp');
const config = require('../config');
const replace = require('../template/replace');
const repo = require("../tracker/repository");
const loadTemplate = require('../template/loader');
const { processRandTag, processSpintax, randomChoice } = require('../utils/random');
const fs = require('fs');
const path = require('path');

// ============================================
// تحميل المواضيع من ملف (لـ SUBJECT_ROTATION)
// ============================================
function loadSubjects() {
    try {
        const subjectsPath = path.join(__dirname, '../data/subjects.txt');
        if (fs.existsSync(subjectsPath)) {
            const content = fs.readFileSync(subjectsPath, 'utf8');
            return content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        }
    } catch (error) {
        console.error('❌ Error loading subjects:', error.message);
    }
    return [];
}




function processSubject(subject, email) {
    let result = subject || 'Message';

    // 1. استبدال !!EMAIL!! و !!NAME!!
    result = result.replaceAll('!!EMAIL!!', email);
    result = result.replaceAll('!!NAME!!', email.split('@')[0] || email);

    // 2. استبدال {{##Email##}} و {{##NAME##}}
    result = result.replaceAll('{{##Email##}}', email);
    result = result.replaceAll('{{##NAME##}}', email.split('@')[0] || email);

    // 3. معالجة Spintax (إذا كان مفعّل)
    if (config.useSpintax) {
        result = processSpintax(result);
    }

    // 4. معالجة !!RAND[n]!! (مثل !!RAND[5]!!)
    result = processRandTag(result);

    return result;
}
// ============================================
// جلب الموضوع (مع SUBJECT_ROTATION)
// ============================================
function getSubject(email) {
    let subject;

    // إذا كان SUBJECT_ROTATION مفعّل، اختر موضوع عشوائي من الملف
    if (config.subjectRotation) {
        const subjects = loadSubjects();
        if (subjects.length > 0) {
            subject = randomChoice(subjects);
        } else {
            subject = config.from.subject || 'Message';
        }
    } else {
        subject = config.from.subject || 'Message';
    }

    // معالجة المتغيرات
    return subject;
}
// ============================================
// ✅ إرسال إيميل واحد
// ============================================
async function send(email) {
    const template = loadTemplate();
    let html = replace(template, email);
    let subject = getSubject();
    let processsubjct = processSubject(subject, email)

    let fromEmail = processRandTag(config.from.email);

    const info = await smtp.sendMail({
        from: `"${config.from.name}" <${fromEmail}>`,
        to: email,
        subject: processsubjct,
        html: html
    });

    // ✅ التتبع (حسب TRACKING_ENABLED)
    if (config.trackingEnabled) {
        const match = info.response.match(/queued as ([A-Z0-9]+)/i);
        if (match) {
            const queueId = match[1];


            repo.insertMail({

                queue_id: queueId,

                email: email,

                subject: processsubjct,

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
            console.log(`📥 TRACKED: ${match[1]} → ${email}`);
        }
    }

    console.log(`✅ Sent to: ${email}`);
    return info;
}

// ============================================
// ✅ إرسال عدة إيميلات (مع Workers و Delay)
// ============================================
async function sendBulk(emails) {
    const workers = config.workers || 2;
    const delay = config.delay || 100;

    console.log(`📧 Sending ${emails.length} emails with ${workers} workers`);
    console.log(`⏱️ Delay: ${delay}ms between emails`);

    const results = [];

    async function sendWithDelay(email, index) {
        await new Promise(resolve => setTimeout(resolve, index * delay));
        try {
            console.log(`📤 [${index + 1}/${emails.length}] Sending to ${email}`);
            const result = await send(email);
            results.push({ email, success: true, response: result.response });
            console.log(`✅ [${index + 1}/${emails.length}] Sent to ${email}`);
        } catch (error) {
            console.error(`❌ [${index + 1}/${emails.length}] Failed: ${email} - ${error.message}`);
            results.push({ email, success: false, error: error.message });
        }
    }

    const chunks = [];
    for (let i = 0; i < emails.length; i += workers) {
        chunks.push(emails.slice(i, i + workers));
    }

    for (const chunk of chunks) {
        await Promise.all(chunk.map((email, index) => {
            const globalIndex = emails.indexOf(email);
            return sendWithDelay(email, globalIndex);
        }));
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`\n📊 Summary: ${successCount}/${results.length} sent successfully`);
    return results;
}

module.exports = send;
module.exports.sendBulk = sendBulk;