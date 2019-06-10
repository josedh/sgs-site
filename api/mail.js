const pg = require('pg')
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
const util = require('util')
const request = require('request')

const acknowledgeContact = contactID => {
    return new Promise((resolve, reject) => {
        // some sanitation, we only accept digits, so this is sufficient
        if (isNaN(contactID)) {
            return reject('Not a number')
        }
        let q = 'UPDATE contacts SET acknowledged = true WHERE id = $1'
        pool.query(q, [contactID], err => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}

const addContact = contact => {
    return new Promise((resolve, reject) => {
        let t = new Date()
        let safe = {}
        // first and foremost, sanitize
        safe.name = contact.bodyString('name')
        safe.email = contact.bodyEmail('email')
        /*eslint no-useless-escape:0*/
        safe.phone = contact.bodyPattern(
            'phone',
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        )
        safe.message = contact.bodyString('message')
        let front_end_token = contact.bodyPattern('token', /^[0-9a-zA-Z_-]{40}/)

        let captcha_secret = process.env.CAPTCHA_SECRET_KEY
        let verificationUrl =
            'https://www.google.com/recaptcha/api/siteverify?secret=' +
            captcha_secret +
            '&response=' +
            front_end_token +
            '&remoteip=' +
            contact.connection.remoteAddress
        let response = {}
        request.post(verificationUrl, (error, res, body) => {
            // ignoring error cuz we cant assume its a bot
            response = JSON.parse(body)
            if (response.sucess === false || response.score < 0.5) {
                // captcha failed or submissions is most likely a bot return silently
                return resolve()
            }
            safe.score = response.score || 2.0 // add the google score or 2.0 which is invalid score (must be less than 1)
            saveToPostgres(safe, t, t)
                .then(() => {
                    return resolve()
                })
                .catch(err => {
                    return reject(err)
                })
        })
    })
}

function saveToPostgres(safe, createdts, updatedts) {
    return new Promise((resolve, reject) => {
        let q = util.format(
            'INSERT INTO %s (name, email, phone, message, captcha_score, acknowledged, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            process.env.PG_CONTACTS_TABLE
        )
        let params = [
            safe.name,
            safe.email,
            safe.phone,
            safe.message,
            safe.score,
            false,
            createdts,
            updatedts
        ]
        pool.query(q, params, err => {
            if (err) {
                console.log('err', err)
                return reject(err)
            }
            return resolve()
        })
    })
}

module.exports = {
    addContact,
    acknowledgeContact
}
