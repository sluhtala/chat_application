const fs = require('fs');
const errorLogFile = '../../error_log.txt';
const login_handler = require('../login_handler');

module.exports = logger = (msg) => {
	console.log(msg);
};

module.exports = error_logger = (error) =>{
	fs.appendFile(errorLogFile, error.message)
};

module.exports = error_handle = (error, req, res, next) =>{

};

const requireToken = (req, res, next)=>{
	const token = login_handler.parse_token(req.get('authorization'));
	try {
		const user = login_handler.validate_token(token);
		console.log(user)
		if (!user || user === 'JsonWebTokenError')
			throw new Error('invalid token')
		req.user = user;
		console.log(user)
	}
	catch(e){
		res.status(401).send({error: "unauthorized"});
	}
	next();
};

const middlewares = {requireToken}
module.exports = middlewares;

