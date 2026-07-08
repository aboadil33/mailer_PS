const db = require("./db");


module.exports = {


    insertMail(data) {

        return db.prepare(`
            INSERT INTO mails
            (
                queue_id,
                message_id,
                email,
                subject,
                status,
                response
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )

        `).run(

            data.queue_id,
            data.message_id || null,
            data.email,
            data.subject,
            "QUEUED",
            data.response

        );

    },


    getMail(queueId) {

        return db.prepare(`
            SELECT *
            FROM mails
            WHERE queue_id = ?
        `).get(queueId);

    },


    updateStatus(queueId, status, extra = {}) {


        return db.prepare(`
            UPDATE mails

            SET

                status = ?,

                relay = COALESCE(?, relay),

                dsn = COALESCE(?, dsn),

                response = COALESCE(?, response),

                updated_at = CURRENT_TIMESTAMP

            WHERE queue_id = ?

        `).run(

            status,

            extra.relay || null,

            extra.dsn || null,

            extra.response || null,

            queueId

        );

    },


    addEvent(queueId, event, message) {


        return db.prepare(`
            INSERT INTO events
            (
                queue_id,
                event,
                message
            )

            VALUES
            (
                ?,
                ?,
                ?
            )

        `).run(

            queueId,
            event,
            message

        );

    },


    getStats() {

        return db.prepare(`
            SELECT
                status,
                COUNT(*) as total

            FROM mails

            GROUP BY status

        `).all();

    },

    getProviders() {

        const rows = db.prepare(`

        SELECT email
        FROM mails

    `).all();


        const providers = {
            Outlook: 0,
            Gmail: 0,
            Yahoo: 0,
            Telenet: 0,
            Sfr: 0,
            Orange: 0,
            Enterprise: 0,
            Other: 0
        };


        rows.forEach(row => {

            const domain =
                row.email
                    .split("@")[1]
                    ?.toLowerCase();


            if (!domain)
                return;


            if (
                domain.includes("hotmail") ||
                domain.includes("outlook") ||
                domain.includes("live") ||
                domain.includes("msn")
            ) {
                providers.Outlook++;
            }

            else if (domain.includes("gmail")) {
                providers.Gmail++;
            }

            else if (domain.includes("yahoo")) {
                providers.Yahoo++;
            }
            else if (domain.includes("telenet")) {
                providers.Telenet++;
            }
            else if (domain.includes("sfr")) {
                providers.Sfr++;
            }
            else if (domain.includes("orange")) {
                providers.Orange++;
            }


            else if (
                ![
                    "gmail.com",
                    "telenet.be",
                    "hotmail.com",
                    "outlook.com",
                    "sfr.fr",
                    "orange.fr",
                    "live.com",
                    "yahoo.com"
                ].includes(domain)
            ) {
                providers.Enterprise++;
            }

            else {
                providers.Other++;
            }

        });


        const total = rows.length || 1;


        return Object.keys(providers).map(key => ({

            provider: key,

            total: providers[key],

            percent:
                ((providers[key] / total) * 100)
                    .toFixed(2)

        }));

    },


    // getAll(limit = 100) {

    //     return db.prepare(`
    //         SELECT *

    //         FROM mails

    //         ORDER BY id DESC

    //         LIMIT ?

    //     `).all(limit);

    // }
    getAll(limit = 100, status = null) {

        if (status && status !== "ALL") {

            return db.prepare(`

            SELECT *

            FROM mails

            WHERE status = ?

            ORDER BY id DESC

            LIMIT ?

        `).all(
                status,
                limit
            );

        }


        return db.prepare(`

        SELECT *

        FROM mails

        ORDER BY id DESC

        LIMIT ?

    `).all(limit);

    },

    exportEmails(status = null) {

        if (status && status !== "ALL") {

            return db.prepare(`
            SELECT email
            FROM mails
            WHERE status = ?
            ORDER BY id DESC
        `).all(status);

        }


        return db.prepare(`
        SELECT email
        FROM mails
        ORDER BY id DESC
    `).all();

    }


};