const pg = require('pg')
const pool = new pg.Pool()
const util = require('util')

const addContact = (contact) => {
    return new Promise((resolve, reject) => {
        let t = new Date()
        let safe = {}
    
        // first and foremost, sanitize
        safe.name = contact.bodyString(contact.body.name)
        safe.email = contact.bodyEmail(contact.body.email)
        safe.phone = contact.bodyPattern(contact.body.phone, '/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im')
        safe.message = contact.bodyString(contact.body.message)
    
        let q = util.format('INSERT INTO %s(name, email, phone, message, acknowledged) VALUES($1, $2, $3, $4, $5)', process.env.PG_CONTACTS_TABLE)
        let params = [safe.name, safe.email, safe.phone, safe.message, false, t]
        pool.query(q,params, (err, res)=>{
            if (err) {
                console.log(err)
                return reject(err)
            }
            return resolve(res)
        })
    })
}

module.exports = {
    addContact,
}
