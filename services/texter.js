const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

let textPOC = function(msg) {
    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body: msg,
                from: process.env.TWILIO_FROM_NUMBER,
                to: process.env.TWILIO_TO_NUMBER
            })
            .then(() => {
                return resolve()
            })
            .catch(err => {
                return reject(err)
            })
    })
}

module.exports = {
    textPOC
}
