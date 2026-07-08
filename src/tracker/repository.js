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


    getAll(limit = 100) {

        return db.prepare(`
            SELECT *

            FROM mails

            ORDER BY id DESC

            LIMIT ?

        `).all(limit);

    }


};