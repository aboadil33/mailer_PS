const express = require("express");
const session = require("express-session");

const router = express.Router();


router.use(session({

    secret:"boga-dashboard-secret",

    resave:false,

    saveUninitialized:false,

    cookie:{
        maxAge:1000*60*60*8
    }

}));


router.post("/login",(req,res)=>{


    const {username,password}=req.body;


    if(
        username==="admin" &&
        password==="admin123"
    ){

        req.session.user = username;

        return res.json({
            success:true
        });

    }


    res.json({
        success:false
    });


});



router.get("/check",(req,res)=>{

    res.json({

        logged:!!req.session.user

    });

});



router.get("/logout",(req,res)=>{


    req.session.destroy(()=>{

        res.redirect("/login.html");

    });


});


module.exports = router;