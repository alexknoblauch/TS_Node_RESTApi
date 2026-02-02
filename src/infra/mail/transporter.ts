import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD  // 'pass' nicht 'password'!
  }
});



export default transporter