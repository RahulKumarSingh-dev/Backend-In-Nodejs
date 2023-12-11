const nodemailer = require('nodemailer');
const mailHelper = async (option) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '21b3d0d9974ef2',
      pass: 'ca0897311b86d8',
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  const message = {
    from: '"rahul@test.com', // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
  };

  // send mail with defined transport object
  await transporter.sendMail(message);
};

module.exports = mailHelper;
