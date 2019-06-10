const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

/*
 * const contactRouter = require('./routes/contact')
 * const twilioConfirm = require('./routes/twilio_confirm')
 */

const app = express()

app.use(require('sanitize').middleware)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// routes
/*
 * app.use('/contact', contactRouter)
 * app.use('/twilio_confirm', twilioConfirm)
 */
app.use('*', (req, res) => {
    res.status(404).send(
        '404 - This page was not found. Please check your url/link and try again.'
    )
})

module.exports = app
