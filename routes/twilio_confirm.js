const express = require('express')
const router = express.Router()
const mail = require('../api/mail')
const util = require('util')

/* POST contact call. */
router.post('/', (req, res) => {
    // lets try to get the contact number from the reply
    let contactID = parseInt(req.body.Body)
    if (isNaN(contactID)) {
        console.error('Unable to find contactID from sms reply to twilio')
        return
    }

    res.setHeader('Content-Type', 'application/json')
    mail.acknowledgeContact(contactID)
        .then(()=>{
            console.log('success')
            return res.status(200).send('{"status": "ok"}')
        })
        .catch((e) => {
            console.log('failure', e)
            return res.status(500).send(util.format('{"status": "%s"}', e.message))
        })
})

module.exports = router
