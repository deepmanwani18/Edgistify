const nodemailer = require('nodemailer');

var creatingTransport = () => {

    var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'apikey',
            // Paste the sengrid key here for use as
            // pass: 'SG.......'
        }
    });

    return transporter;
}


module.exports = {
    sendEmail: async function(from, to, subject, text, html) {

        let transporter = creatingTransport();

        let info = await transporter.sendMail({
                from,
                to,
                subject,
                text,
                html,
            })
            .then()
            .catch(console.error());
    },
}

