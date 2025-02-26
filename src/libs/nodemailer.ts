import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendConfirmationEmail(to: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Signup Confirmation',
    text: 'We have successfully received your information. We will be in contact shortly with additional updates on your marketing campaign.',
  };

  return transporter.sendMail(mailOptions);
}

