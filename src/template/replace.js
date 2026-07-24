const { randomCode, generateSession, processSpintax, processRandTag } = require('../utils/random');
const getLink = require('../utils/link');
const config = require('../config');

module.exports = function (html, email) {
    let result = html;

    // 1. المتغيرات الأساسية (دائماً موجودة)
    result = result.replaceAll('{{##Email##}}', email);
    result = result.replaceAll('!!EMAIL!!', email);
    result = result.replaceAll('{{##NAME##}}', email.split('@')[0] || email);
    result = result.replaceAll('!!NAME!!', email.split('@')[0] || email);
    result = result.replaceAll('{{##LINK##}}', getLink());
    result = result.replaceAll('!!LINK!!', getLink());

    // ============================================
    // 2. ✅ REFERENCE (رقم مرجعي)
    // ============================================
    const ref = randomCode(10);
    result = result.replaceAll('{{##REF##}}', ref);
    result = result.replaceAll('!!REF!!', ref);
    result = result.replaceAll('{{##Rand##}}', ref);
    result = result.replaceAll('!!RAND!!', ref);

    // 2. ✅ إضافة المرجع (حسب ADD_REFERENCE)
    if (config.addReference) {
        result = result.replaceAll('{{##Rand##}}', randomCode(8));
    } else {
        result = result.replaceAll('{{##Rand##}}', '');
    }

    // 3. ✅ إضافة Session (حسب ADD_SESSION)
    if (config.addSession) {
        result = result.replaceAll('{{##SESSION##}}', generateSession());
    } else {
        result = result.replaceAll('{{##SESSION##}}', '');
    }

    // 4. ✅ إضافة التاريخ (حسب ADD_DATE)
    if (config.addDate) {
        result = result.replaceAll('{{##Date##}}', new Date().toISOString());
    } else {
        result = result.replaceAll('{{##Date##}}', '');
    }

    // 5. ✅ معالجة Spintax (حسب USE_SPINTAX)
    if (config.useSpintax) {
        result = processSpintax(result);
    }

    // 6. ✅ معالجة !!RAND[n]!! (دائماً)
    result = processRandTag(result);

    return result;
};