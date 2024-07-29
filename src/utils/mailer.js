// src/utils/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // you can use other email services
    auth: {
        user: 'emailsample060@gmail.com', // your email
        pass: 'jjjbyvoxqrpyvnau', // your email password
    },
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'emailsample060@gmail.com',
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

export default sendMail;
