const { execSync } = require("child_process");
const fs = require("fs");

const domain = process.argv[2];
const port = process.argv[3] || 3000;
const email = process.argv[4] || `admin@${domain}`;

if (!domain) {
    console.log(`
Usage:
node setup-nginx-ssl.js domain.com port email

Example:
node setup-nginx-ssl.js boga.duud.ae 3000 admin@duud.ae
`);
    process.exit(1);
}

function run(cmd) {
    console.log("\n▶ " + cmd);
    execSync(cmd, { stdio: "inherit" });
}

function check(cmd) {
    try {
        execSync(cmd, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

try {

    console.log("🔍 Checking nginx...");

    if (!check("nginx -v")) {
        console.log("📦 Installing nginx...");
        run("apt update");
        run("apt install nginx -y");
    } else {
        console.log("✅ nginx already installed");
    }


    console.log("🔍 Checking certbot...");

    if (!check("certbot --version")) {
        console.log("📦 Installing certbot...");
        run("apt update");
        run("apt install certbot python3-certbot-nginx -y");
    } else {
        console.log("✅ certbot already installed");
    }


    console.log("📝 Creating nginx config...");

    const nginxConfig = `
server {

    listen 80;

    server_name ${domain};


    location / {

        proxy_pass http://127.0.0.1:${port};

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

    }

}
`;


    const available =
        `/etc/nginx/sites-available/${domain}`;


    fs.writeFileSync(
        available,
        nginxConfig
    );


    const enabled =
        `/etc/nginx/sites-enabled/${domain}`;


    if (!fs.existsSync(enabled)) {
        fs.symlinkSync(
            available,
            enabled
        );
    }


    console.log("🧪 Testing nginx...");

    run("nginx -t");


    run("systemctl reload nginx");


    console.log("🔐 Creating SSL certificate...");


    run(
        `certbot --nginx -d ${domain} --non-interactive --agree-tos -m ${email} --redirect`
    );


    console.log("♻️ Testing auto renewal...");

    run(
        "certbot renew --dry-run"
    );


    console.log(`
====================================
✅ DONE

Domain:
https://${domain}

Proxy:
http://127.0.0.1:${port}

SSL:
Enabled

====================================
`);

} catch (error) {

    console.error(`
❌ FAILED

${error.message}

`);

    process.exit(1);
}