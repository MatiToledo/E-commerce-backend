import sgMail, { MailDataRequired } from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendgridEmail(msg: MailDataRequired) {
  try {
    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
      })
      .catch((error) => {
        console.error(error);
      });
    return true;
  } catch (error) {
    return error;
  }
}
