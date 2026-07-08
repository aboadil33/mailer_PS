const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const session = require("express-session");

const routes = require("./routes");
const auth = require("../dashboard/auth");

const app = express();


// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ======================
// SESSION
// ======================

app.use(session({

    secret: "boga-dashboard-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {

        maxAge: 1000 * 60 * 60 * 8,

        httpOnly: true

    }

}));


// ======================
// AUTH
// ======================

app.use("/auth", auth);


// ======================
// API
// ======================

app.use("/api", routes);


// ======================
// LOGIN PAGE
// ======================

app.get("/", (req, res) => {

    if (req.session.user) {

        return res.redirect("/dashboard.html");

    }

    res.redirect("/login.html");

});


// ======================
// PROTECT DASHBOARD
// ======================

app.get("/dashboard.html", (req, res) => {

    if (!req.session.user) {

        return res.redirect("/login.html");

    }

    res.sendFile(

        path.join(
            __dirname,
            "../dashboard/public/dashboard.html"
        )

    );

});


// ======================
// STATIC FILES
// ======================

app.use(

    express.static(

        path.join(
            __dirname,
            "../dashboard/public"
        )

    )

);


// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {

    console.log(
        `🚀 Dashboard running http://localhost:${PORT}`
    );

});