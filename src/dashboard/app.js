async function loadStats(){

    const res = await fetch(
        "/api/stats"
    );

    const data = await res.json();


    data.forEach(item=>{

        let id = item.status.toLowerCase();


        let el = document.getElementById(id);


        if(el){

            el.innerText = item.total;

        }

    });

}



async function loadMails(){

    const res = await fetch(
        "/api/mails"
    );


    const mails = await res.json();


    const tbody =
        document.getElementById("mails");


    tbody.innerHTML="";


    mails.forEach(mail=>{


        tbody.innerHTML += `

        <tr>

        <td>
        ${mail.email}
        </td>


        <td>
        ${mail.status}
        </td>


        <td>
        ${mail.created_at}
        </td>


        </tr>

        `;


    });


}



function refresh(){

    loadStats();

    loadMails();

}


refresh();


setInterval(
    refresh,
    5000
);