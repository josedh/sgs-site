$(function() {
    var submitForm = function(name, email, phone, message, token) {
        $.ajax({
            url: '/contact',
            type: 'POST',
            data: {
                name: name,
                email: email,
                phone: phone,
                message: message,
                token: token
            },
            cache: false,
            success: function() {
                // Success message
                $('#success').html('<div class=\'alert alert-success\'>')
                $('#success > .alert-success').html('<button type=\'button\' class=\'close\' data-dismiss=\'alert\' aria-hidden=\'true\'>&times')
                    .append('</button>')
                $('#success > .alert-success')
                    .append('<strong>Your message has been sent. </strong>')
                $('#success > .alert-success')
                    .append('</div>')

                //clear all fields
                $('#contactForm').trigger('reset')
            },
            error: function() {
                // Fail message
                $('#success').html('<div class=\'alert alert-danger\'>')
                $('#success > .alert-danger').html('<button type=\'button\' class=\'close\' data-dismiss=\'alert\' aria-hidden=\'true\'>&times')
                    .append('</button>')
                $('#success > .alert-danger').append('<strong>Sorry ' + name + ', it seems that my mail server is not responding. Please try again later!')
                $('#success > .alert-danger').append('</div>')
                //clear all fields
                $('#contactForm').trigger('reset')
            },
        })

    }
    $('input,textarea').jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault() // prevent default submit behaviour
            // get values from FORM
            var name = $('input#name').val()
            var email = $('input#email').val()
            var message = $('textarea#message').val()
            var phone = $('input#phone').val()
            var firstName = name // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ')
            }
            if (grecaptcha !== undefined) {
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LeyyqMUAAAAACOFYwjHOMSB4Bv8QnRUl04EDXRe', {action: 'contact'})
                        .then(function(token){
                            submitForm(name, email, phone, message, token)
                        })
                })
            } else {
                submitForm(name, email, phone, message, '')
            }
            // REMOVED FROM HERE
        },
        filter: function() {
            return $(this).is(':visible')
        },
    })

    $('a[data-toggle="tab"]').click(function(e) {
        e.preventDefault()
        $(this).tab('show')
    })
})


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('')
})
