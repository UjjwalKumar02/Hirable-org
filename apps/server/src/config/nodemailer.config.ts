import nodemailer from "nodemailer";
import "dotenv/config";

let globalTransporter: nodemailer.Transporter | null = null;

if (!globalTransporter) {
  globalTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

// Verify
globalTransporter.verify((error) => {
  if (error) {
    console.log("Nodemailer transport failed!");
  } else {
    console.log("Nodemailer transport verified");
  }
});

// Send mail
export const sendEmail = async (props: {
  to: string;
  subject: string;
  body: string;
}) => {
  const info = await globalTransporter.sendMail({
    from: '"Hirable" <hirable@gmail.com>',
    to: props.to,
    subject: props.subject,
    html: `<p>${props.body}</p>`,
  });

  console.log(`Mail sent: ${info.messageId}`);
};
