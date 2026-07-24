const fs = require('fs');
const path = require('path');
const config = require('../config');

const TEMPLATES_DIR = path.join(__dirname, '../data/templates');

function getAvailableTemplates() {
    try {
        const files = fs.readdirSync(TEMPLATES_DIR);
        return files.filter(file => file.endsWith('.html'));
    } catch (error) {
        console.error('❌ Error loading templates:', error.message);
        return [];
    }
}

module.exports = function () {
    try {
        let templatePath;
        
        // ✅ استخدم TEMPLATE_ROTATION الجديد
        if (config.templateRotation) {
            const templates = getAvailableTemplates();
            if (templates.length > 0) {
                const random = templates[Math.floor(Math.random() * templates.length)];
                templatePath = path.join(TEMPLATES_DIR, random);
                console.log(`📄 Loading random template: ${random}`);
            } else {
                templatePath = path.join(TEMPLATES_DIR, 'template1.html');
            }
        } else {
            // استخدم TEMPLATE القديم (true/false)
            if (config.template === true || config.template === 'true') {
                const templates = getAvailableTemplates();
                if (templates.length > 0) {
                    const random = templates[Math.floor(Math.random() * templates.length)];
                    templatePath = path.join(TEMPLATES_DIR, random);
                    console.log(`📄 Loading random template: ${random}`);
                } else {
                    templatePath = path.join(TEMPLATES_DIR, 'template1.html');
                }
            } else {
                templatePath = path.join(TEMPLATES_DIR, 'template1.html');
            }
        }
        
        return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        console.error('❌ Error loading template:', error.message);
        return `
            <h2>Bonjour {{##Email##}}</h2>
            <p>Nous avons détecté une activité suspecte.</p>
            <a href="{{##LINK##}}">Vérifier maintenant</a>
            <p>Référence: {{##Rand##}}</p>
        `;
    }
};