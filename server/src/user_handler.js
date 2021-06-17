const userQueries = require('./queries/users');
const bcrypt = require('bcrypt');
// functions that deal with users 
const saltRounds = parseInt(process.env.HASH_SALTROUNDS);
const _ = require('lodash');
const rndString = require('randomstring');

const user_object = {
	username: 'username',
	password : 'password',
	name : 'name of the user',
	last_login : 'date',
	created : 'date',
	id : '',
	friends : [],

}

async function add_user(user){
	if (!user.username || !user.password)
		throw new Error('username or password missing')
	//const pool = userQueries.create_connection_pool();
	const existing = await userQueries.find_user_by_name(user.username);
	if (!existing)
	{
		const randomString = rndString.generate(10);
		const hashedPw = await bcrypt.hash(user.password, saltRounds)
		user.password = hashedPw;
		user.randomId = randomString;
		const result = await userQueries.add_user(user);
		result.randomId = randomString;
		result.email = user.email;
		console.log(result);
		return result;
	}
	else
	{
		const e = new Error('Username already exists')
		e.name = 'username exists';
		throw e;
	}
}

async function activate_user({id, randomId}){
	const user = await userQueries.find_user_by_id(id);
	if (user && user.randomId === randomId)
	{
		// activate user
		const result = await userQueries.update_user(id, 'activate');
		if (result === false)
			throw Error('something went wrong')
	}
	else
		throw new Error('Error activating user')
}

async function delete_user(id) {
	console.log(`userhandler delete user ${id}`)
	const result = await userQueries.delete_user(id)
	console.log(result)
	return null;
}

function update_user() {
	
}


async function find_user(options) {
	if (_.isEmpty(options))
	{
		const result = await userQueries.find_all_users();
		const users = result.map(u=>({...u, password: undefined}));
		return users;
	}
	if (options.username)
	{
		const result = await userQueries.find_user_by_name(options.username);
		if (result)
			result.password = undefined;
		return result;
	}
	if (options.id)
	{
		const result = await userQueries.find_user_by_id(options.id);
		if (result)
			result.password = undefined;
		return result;
	}
	return null;
}

const validate = (user)=>{
	if (!user.username || !user.password || !user.email)
		return false;
	if (user.username < 4 || user.password < 4)
		return false;
	const mailpattern = /[\w.-_]*@\w*\.\w*/;
	if (!mailpattern.test(user.email))
		return false;
	return true;
};

const handler = {
	add_user,
	delete_user,
	update_user,
	find_user,
	activate_user,
	validate
}

module.exports = handler;


