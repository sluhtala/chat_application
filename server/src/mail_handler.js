const mailer = require('nodemailer');
require('dotenv').config();

const transporter = mailer.createTransport({
	service: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL_ADDR,
		pass: process.env.EMAIL_PW
	},
	secure: false
});

// 
const activationBaseUrl = 'http://localhost:3000/userActivation';

const sendConfirmEmail = (user)=>{
	console.log(user);
	const link = `${activationBaseUrl}?id=${user.id}&randomId=${user.randomId}`;
	const mailOptions = {
		from: process.env.EMAIL_ADDR,
		to: user.email,
		subject: `Confirmation Email for user: ${user.username}`,
		html: `<p>activate user ${user.username} by clicking the link:</p><a href='${link}'>${link}</a>`
	};
	transporter.sendMail(mailOptions, function (error, info){
		if (error)
		{
			console.log(error);
		}
		else
		{
			console.log(`Email sent succesfully`);
		}
	})
}

module.exports = {sendConfirmEmail}