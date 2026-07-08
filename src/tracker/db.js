const Database = require("better-sqlite3");
const path = require("path");


const db = new Database(
    path.join(__dirname, "tracker.db")
);


db.exec(`

CREATE TABLE IF NOT EXISTS mails (

id INTEGER PRIMARY KEY AUTOINCREMENT,

queue_id TEXT UNIQUE,

message_id TEXT,

email TEXT,

subject TEXT,

status TEXT DEFAULT 'QUEUED',

relay TEXT,

dsn TEXT,

response TEXT,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS events (

id INTEGER PRIMARY KEY AUTOINCREMENT,

queue_id TEXT,

event TEXT,

message TEXT,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

`);


module.exports = db;