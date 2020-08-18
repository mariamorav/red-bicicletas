const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'arvid82@ethereal.email',
        pass: 'mSbe1BZHGu2TG8wS86'
    }
};

module.exports = nodemailer.createTransport(mailConfig);