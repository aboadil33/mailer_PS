const db = require("src/tracker/db");

console.log(
    db.prepare("SELECT * FROM mails").all()
);