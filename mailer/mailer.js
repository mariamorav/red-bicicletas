const { log } = console;
const nodemailer = require('nodemailer');
const sg_transport = require('nodemailer-sendgrid-transport');

let mailConfig;

if(process.env.NODE_ENV === 'production'){

    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET_KEY
        }
    }
    
    mailConfig = sg_transport(options);

} else {

    if(process.env.NODE_ENV === 'staging') {

        log('::::: STAGING ::::::');
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_SECRET_KEY
            }
        }

        mailConfig = sg_transport(options);

    } else {

        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PASS
            }
        };
        
    }
}


module.exports = nodemailer.createTransport(mailConfig);