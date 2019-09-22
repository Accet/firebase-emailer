const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().emailer.email;
const gmailPassword = functions.config().emailer.password;

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

exports.sendContactMessage = functions.firestore.document('messages/{uid}').onCreate(async snap => {
    const val = snap.data();
    const mailOptions = {
        to: 'egvission@gmail.com',
        subject: val.subject ? `Portfolio. ${val.subject}` : `Portfolio. Message from ${val.name}`,
        html: val.html
    };
    try {
        await mailTransport.sendMail(mailOptions);
        console.log('email sent from ', val.email);
    } catch (error) {
        console.error('Function: sending email failed from, : ', val.email, error);
    }
    return null;
});
