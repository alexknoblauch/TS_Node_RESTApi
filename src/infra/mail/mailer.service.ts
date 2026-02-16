import logger from '@/lib/winston';
import transporter from './transporter';
import MailerError from './MailerError';

const sendEmail = async (options: Record<string, string>) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Cineflix Support <support@cineflix.com>',
      email: options.email,
      subject: options.subject,
      message: options.message,
      html: options.html 
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {

    logger.error('Email error:', error);
    throw new MailerError();
  }
};

export default sendEmail