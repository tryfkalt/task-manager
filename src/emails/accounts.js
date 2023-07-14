const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kaltscrew@gmail.com',
        subject: 'Welcome to the future',
        text: `Welcome to the app, ${name}. This app is dope`

    })
}

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kaltscrew@gmail.com',
        subject: 'Bye Bye',
        text: `Thanks for stopping by ${name}`
    })
    
}

module.exports = {
    sendWelcomeEmail,
    sendByeEmail
}

