const fs = require("fs");

const repo = require("./repository");


const LOG =
    "/var/log/mail.log";


let position =
    fs.statSync(LOG).size;


console.log(
    "📡 Mail tracker started"
);



fs.watchFile(
    LOG,
    { interval: 1000 },
    () => {


        let size =
            fs.statSync(LOG).size;



        if (size <= position)
            return;



        let stream =
            fs.createReadStream(
                LOG,
                {
                    start: position,
                    end: size,
                    encoding: "utf8"
                }
            );



        let data = "";



        stream.on(
            "data",
            chunk => {
                data += chunk;
            }
        );



        stream.on(
            "end",
            () => {


                data.split("\n").forEach(line => {


                    if (!line.includes("postfix/smtp"))
                        return;



                    let id =
                        line.match(
                            /postfix\/smtp\[\d+\]: ([A-Z0-9]+):/
                        );



                    if (!id)
                        return;



                    let queueId = id[1];


                    let mail =
                        repo.getMail(queueId);



                    if (!mail)
                        return;



                    let relay =
                        (line.match(/relay=([^,]+)/) || [])[1];


                    let dsn =
                        (line.match(/dsn=([^, ]+)/) || [])[1];



                    if (line.includes("status=sent")) {


                        repo.updateStatus(
                            queueId,
                            "DELIVERED",
                            {
                                relay,
                                dsn,
                                response: line
                            }
                        );



                        repo.addEvent(
                            queueId,
                            "DELIVERED",
                            line
                        );



                        console.log(
                            "✅ DELIVERED",
                            mail.email
                        );



                    }




                    if (line.includes("status=deferred")) {


                        repo.updateStatus(
                            queueId,
                            "DEFERRED",
                            {
                                relay,
                                dsn,
                                response: line
                            }
                        );



                        repo.addEvent(
                            queueId,
                            "DEFERRED",
                            line
                        );



                        console.log(
                            "⏳ DEFERRED",
                            mail.email
                        );



                    }




                    if (line.includes("status=bounced")) {


                        repo.updateStatus(
                            queueId,
                            "BOUNCE",
                            {
                                relay,
                                dsn,
                                response: line
                            }
                        );



                        repo.addEvent(
                            queueId,
                            "BOUNCE",
                            line
                        );



                        console.log(
                            "❌ BOUNCE",
                            mail.email
                        );



                    }



                });


                position = size;


            });


    });