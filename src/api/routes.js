const express = require("express");
const repo = require("../tracker/repository");

const fs = require("fs");
const router = express.Router();



router.get("/mails/export",(req,res)=>{

    try {

        const status =
            req.query.status || null;


        const mails = repo.getAll(
            100000,
            status
        );


        const content = mails
            .map(mail => mail.email)
            .join("\n");


        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${status || "ALL"}_emails.txt`
        );


        res.setHeader(
            "Content-Type",
            "text/plain"
        );


        res.send(content);


    } catch(err){

        res.status(500).json({
            error: err.message
        });

    }

});


router.get("/stats", (req, res) => {

    try {

        const stats = repo.getStats();

        res.json(stats);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


// router.get("/mails", (req,res)=>{

//     try {

//         const mails = repo.getAll(
//             Number(req.query.limit) || 100
//         );

//         res.json(mails);

//     } catch(err){

//         res.status(500).json({
//             error: err.message
//         });

//     }

// });

router.get("/mails", (req, res) => {

    try {

        const limit =
            Number(req.query.limit) || 100;

        const status =
            req.query.status || null;


        const mails = repo.getAll(
            limit,
            status
        );


        res.json(mails);


    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
router.get("/providers",(req,res)=>{

    try{

        res.json(
            repo.getProviders()
        );

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

router.get("/mail/:queueId", (req, res) => {

    try {

        const mail = repo.getMail(
            req.params.queueId
        );


        if (!mail) {

            return res.status(404).json({
                error: "Not found"
            });

        }


        res.json(mail);


    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


module.exports = router;