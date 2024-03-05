import * as nodemailer from "nodemailer";
import _ from "lodash";

export const sendEmail = async (data) => {
  const { emails, subject, body } = data;
  try {
    if (!emails) {
      return {
        success: false,
        error: {
          message: "No emails found",
        },
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });

    const toEmails = emails.join(", ");
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: toEmails,
      subject: subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }

  return {
    success: true,
  };
};
