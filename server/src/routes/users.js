const express = require('express');
const router = express.Router();
const user_handler = require('../user_handler');
const { requireToken } = require('../utils/middlewares');
const mailHandler = require('../mail_handler');

router.get('/', requireToken ,async (req, res)=>{
	try {
		const users = await user_handler.find_user({});
		console.log(users);
		res.send(users);
	}
	catch(e){
	
		res.status(500).send({error: 'server error'})
	}
});

router.post('/test',(req, res)=>{
	console.log(req.body)
	res.status(200).send('ok')
})

router.get('/finduser/:username', async (req, res) =>{
	try{
		const user = await user_handler.find_user({username: req.params.username});
		if (user)
			res.send({user: user.username});
		else 
			res.send({});
	}
	catch(e){
		res.status(400).send({error: e.message});
	}
})

router.get('/:id', async (req, res)=>{
	try{
		const user = await user_handler.find_user({id: req.params.id});
		res.send(`id: ${req.params.id}`);
	}
	catch(e){
		res.status(400).send({error: e.message});
	}
});

router.post('/', async (req, res) => {
	try {
		const body = req.body;
		if (!user_handler.validate(body))
			throw new Error('User not validated');
		const user = await user_handler.add_user(body)
		// send email 
		mailHandler.sendConfirmEmail(user);
		res.send(body);
	}
	catch(e){
		res.status(400).send({error: e.message});
	}
});

router.put('/:id', (req, res)=>{
	console.log(`activating user... ${req.body.id} ${req.body.randomId}`)
	if (!req.body.id || !req.body.randomId)
		res.status(400).send({error: 'invalid user parameters'});
	console.log(req.body)
	user_handler.activate_user(req.body);
	res.send(`id: ${req.params.id}`);
});

router.delete('/:id', async (req, res)=>{
	console.log(req.params.id)
	const id = req.params.id;
	const result = await user_handler.delete_user(id);
	console.log(result);
	res.send(`delete ${req.params.id}`);
});

module.exports = router;