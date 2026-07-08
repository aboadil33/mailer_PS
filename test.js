const fs = require("fs");

const log = "/var/log/mail.log";

let position = fs.statSync(log).size;

console.log("📡 Mail tracker started...");

fs.watchFile(log, { interval: 1000 }, () => {

    const size = fs.statSync(log).size;

    if (size <= position) {
        position = size;
        return;
    }

    const stream = fs.createReadStream(log, {
        start: position,
        end: size,
        encoding: "utf8"
    });

    let data = "";

    stream.on("data", chunk => {
        data += chunk;
    });

    stream.on("end", () => {

        data.split("\n").forEach(line => {

            if (line.includes("status=sent")) {
                console.log("✅ DELIVERED:", line);
            }

            else if (line.includes("status=bounced")) {
                console.log("❌ BOUNCE:", line);
            }

            else if (line.includes("status=deferred")) {
                console.log("⏳ DEFERRED:", line);
            }

        });

        position = size;
    });

});