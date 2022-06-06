import sgMail, { MailDataRequired } from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendgridEmail(msg: MailDataRequired) {
  try {
    sgMail
      .send(msg)
      .then(() => {
        return true;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    return error;
  }
}
