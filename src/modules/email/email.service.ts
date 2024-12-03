import nodemailer from 'nodemailer';
import config from '../../config/config';
import logger from '../logger/logger';
import { Message } from './email.interfaces';

export const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  const msg: Message = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `https://${config.clientUrl}/reset-password?token=${token}`;
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at:<a href="${verificationEmailUrl}"> ${verificationEmailUrl} </a></p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (to: string, name: string): Promise<void> => {
  const subject = 'Account Created Successfully';
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `http://${config.clientUrl}/auth/login`;
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: <a href=${loginUrl}></a></p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};



/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} first_name
 * @param {string} last_name 
 * @returns {Promise<void>}
 */

export const sendUserContactSuccessEmail = async (to: string, first_name: string, last_name: string): Promise<void> => {
  const subject = 'Your Message Has Been Successfully Submitted!';

  const text = `<h1>Dear ${first_name} ${last_name},
  Thank you for reaching out to us! We are pleased to inform 
  you that your message has been successfully submitted.
  
  Our team will review your message, and if necessary,
  we will get back to you as soon as possible.</h1>`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <p>Dear <strong>${first_name} ${last_name}</strong>,</p>
  <p>
    Thank you for reaching out to us! We are pleased to inform you that your message has been successfully submitted.
  </p>
  <p>
    Our team will review your message, and if necessary, we will get back to you as soon as possible.
  </p>
  <p>
    If you have any further questions or need assistance, feel free to contact us.
  </p>
  <p>Thank you for using <strong>[IOTLAB]</strong>.</p>
  <p>Best regards,</p>
  <p>
    The <strong>IOTLAB Team</strong><br>
    <a href="https://iotlab.tech/" style="color: #1a73e8;">https://iotlab.tech/</a><br>
  </p>
</div>
    
    `
  await sendEmail(to, subject, text, html);
}


/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} first_name
 * @param {string} last_name 
 * @param {string} email 
 * @param {string} phoneNumber
 * @param {string} text
 * @param {string} send_message_time
 * @returns {Promise<void>}
 */

export const  sendUserContactReceivedEmail =  async (to: string, first_name: string, last_name: string , email : string , phoneNumber : string , texts : string , send_message_time : string): Promise<void>=>{

  const subject = `New Message Received from ${first_name} ${last_name}`;
  const text =``;
  const html =`
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 600px; margin: 20px auto;">
    <h2 style="color: #555;">Hello sir,</h2>
    <p>You have received a new message from a user. Below are the details:</p>

    <div style="margin-top: 20px;">
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Message Submitted At:</strong> ${send_message_time}</p>
        <p><strong>Message:</strong></p>
        <p>${texts }</p>
    </div>

    <p>Please follow up with the user as soon as possible.</p>

    <div style="margin-top: 30px; font-size: 0.9em; color: #777;">
        <p>Best regards,</p>
        <p><strong>IOTLAB</strong></p>
    </div>
</div> 
  `
  await sendEmail(to, subject, text, html);

}


