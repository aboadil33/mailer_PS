function randomCode(size = 10) {

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let out = "";

    for (let i = 0; i < size; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }

    return out;

}


// module.exports = randomCode;
function generateSession(){

    const time = Date.now();

    const random = randomCode(16);

    return `${time}_${random}`;

}


module.exports = {
    randomCode,
    generateSession
};
