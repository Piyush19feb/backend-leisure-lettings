const nodemailer = require("nodemailer");

async function sendEmail(to, subject, body, callback) {
  // create transport
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "piyushshinde1902@gmail.com",
      pass: "kuqqzmovhbnpewan",
    },
  });

  // send email
  const result = await transport.sendMail({
    from: "piyushshinde1902@gmail.com",
    to,
    subject,
    html: body,
  });

  console.log(`result: `, result);

  // call the callback function
  callback();
}

module.exports = {
  sendEmail,
};
