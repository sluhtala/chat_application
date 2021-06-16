const mailer = require('nodemailer');
require('dotenv').config();

const transporter = mailer.createTransport({
	service: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL_ADDR,
		pass: process.env.PW
	},
});

const sendConfirmEmail = (user)=>{
	const mailOptions = {
		from: process.env.EMAIL_ADDR,
		to: user.email,
		subject: `Confirmation Email for user: ${user.username}`,
		html: `http://localhost:3000/userActivation/${user.id}`
	};
	transporter.sendMail(mailOptions, function (error, info){
		if (error)
		{
			console.log(error);
		}
		else
		{
			console.log(`Email sent: ${info.response}`);
		}
	})
}

module.exports = {sendConfirmEmail}