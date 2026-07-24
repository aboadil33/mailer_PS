// ============================================
// دوال عشوائية
// ============================================

function randomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateSession() {
    return randomCode(16);
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ============================================
// ✅ معالج Spintax {خيار1|خيار2|خيار3}
// ============================================
function processSpintax(text) {
    if (!text) return text;
    let result = text;
    result = result.replace(/\{([^}]+)\}/g, (match, options) => {
        const choices = options.split('|');
        return randomChoice(choices);
    });
    return result;
}

// ============================================
// معالجة !!RAND[n]!! في الإيميل
// ============================================
function processRandTag(text) {
    if (!text) return text;
    return text.replace(/!!RAND\[(\d+)\]!!/g, (_, len) => {
        return randomCode(Number(len));
    });
}

// ============================================
// ✅ التصدير الصحيح
// ============================================
module.exports = {
    randomCode,
    generateSession,
    randomChoice,
    processSpintax,      // ✅ لازم تكون مصدرة
    processRandTag
};