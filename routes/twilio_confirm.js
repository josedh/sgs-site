const express = require('express')
const router = express.Router()
const util = require('util')
const mail = require('../api/mail')
const texter = require('../services/texter')

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
        .then(() => {
            texter
                .textPOC(
                    'Thank you for acknowledging. You will no longer be notified about this contact.'
                )
                .then(() => {
                    return
                })
                .catch(e => {
                    console.error(e)
                    return res
                        .status(500)
                        .send(util.format('{"status": "%s"}', e.message))
                })
        })
        .catch(e => {
            console.error(e)
            return res
                .status(500)
                .send(util.format('{"status": "%s"}', e.message))
        })
})

module.exports = router
