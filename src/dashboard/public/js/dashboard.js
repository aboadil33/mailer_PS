async function loadStats() {

    try {

        const res = await fetch("/api/stats");

        const data = await res.json();


        let total = 0;
        let delivered = 0;
        let deferred = 0;
        let failed = 0;


        data.forEach(row => {

            total += row.total;


            if (row.status === "DELIVERED")
                delivered = row.total;


            if (row.status === "DEFERRED")
                deferred = row.total;


            if (
                row.status === "FAILED" ||
                row.status === "BOUNCE"
            )
                failed += row.total;


        });



        document.querySelectorAll(".number")[0].innerText = total;

        document.querySelectorAll(".number")[1].innerText = delivered;

        document.querySelectorAll(".number")[2].innerText = deferred;

        document.querySelectorAll(".number")[3].innerText = failed;



    } catch (e) {

        console.log(e);

    }

}


let chart;


async function loadChart() {

    const res = await fetch("/api/stats");

    const data = await res.json();


    let labels = [];
    let values = [];


    data.forEach(row => {

        labels.push(row.status);

        values.push(row.total);

    });



    const ctx =
        document.getElementById("statusChart");


    if (chart)
        chart.destroy();



    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: values,

                backgroundColor: labels.map(status => {

                    if (status === "DELIVERED")
                        return "#00d084";


                    if (status === "DEFERRED")
                        return "#ffb020";


                    if (
                        status === "FAILED" ||
                        status === "BOUNCE"
                    )
                        return "#ff4d6d";


                    return "#4da3ff";

                }),

                borderWidth: 0

            }]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }


    });


}

async function loadMails() {

    try {


        const res = await fetch("/api/mails");

        const mails = await res.json();


        const tbody =
            document.querySelector("tbody");


        tbody.innerHTML = "";


        mails.forEach(mail => {


            let color = "success";


            if (mail.status === "DEFERRED")
                color = "warning";


            if (
                mail.status === "FAILED" ||
                mail.status === "BOUNCE"
            )
                color = "danger";

            if(
                mail.status === "QUEUED"
            )
                color = "queue"



            tbody.innerHTML += `

            <tr>

            <td>${mail.queue_id}</td>

            <td>${mail.email}</td>

            <td>

            <span class="badge ${color}">
            ${mail.status}
            </span>

            </td>


            <td>
            ${mail.updated_at || ""}
            </td>


            </tr>

            `;


        });



    } catch (e) {

        console.log(e);

    }

}

function showPage(page) {


    if (page === "emails") {

        document.querySelector(".panel:last-child")
            .scrollIntoView({
                behavior: "smooth"
            });

    }



    if (page === "analytics") {

        document.querySelector(".panel")
            .scrollIntoView({
                behavior: "smooth"
            });

    }


}

function refresh() {

    loadStats();

    loadMails();

    loadChart();

}



refresh();


setInterval(refresh, 5000);
