const nodemailer = require('nodemailer');   

const sendEmail = async options => {

// 1. create a transporter
    const transporter = nodemailer.createTransporter({
        service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // tip from forum
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        }
        // Activate in gmail "less secure app" option
    });
// 2. define the email options

    const mailOptions = {
        from: 'Coco <coco@wooflake.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    }
// 3. Actually send the email
await transporter.sendMail(mailOptions);

};

module.exports = sendEmail;