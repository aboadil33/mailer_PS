async function login() {


    let username =
        document.getElementById("user").value;


    let password =
        document.getElementById("pass").value;



    let res = await fetch("/auth/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            username,
            password

        })

    });


    let data = await res.json();



    if (data.success) {

        window.location = "/dashboard.html";

    }
    else {

        document.getElementById("error").innerText =
            "Wrong login";

    }


}