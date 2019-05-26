const express = require('express')
const router = express.Router()
//const mail = require('../api/mail')
//const util = require('util')

/* POST contact call. */
router.post('/', (req, res) => {
    console.log(JSON.stringify(req))
    return res.status(200).send('{"status": "ok"}')
    //res.setHeader('Content-Type', 'application/json')
    /*
     * mail.addContact(req)
     *     .then(()=>{
     *         return res.status(200).send('{"status": "ok"}')
     *     })
     *     .catch((e) => {
     *         return res.status(500).send(util.format('{"status": "%s"}', e.message))
     *     })
     */
})

module.exports = router
