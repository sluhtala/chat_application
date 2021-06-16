const userQueries = require('./queries/users');
const bcrypt = require('bcrypt');
// functions that deal with users 
const saltRounds = parseInt(process.env.HASH_SALTROUNDS);
const _ = require('lodash');

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
		const hashedPw = await bcrypt.hash(user.password, saltRounds)
		user.password = hashedPw;
		const result = await userQueries.add_user(user);
		return result;
	}
	else
	{
		const e = new Error('Username already exists')
		e.name = 'invalid credentials';
		throw e;
	}
}

function send_activation_link()
{
	console.log('sending link')
}

async function delete_user(id) {
	console.log(`userhandler delete user ${id}`)
	const result = await userQueries.delete_user(id)
	console.log(result)
	return null;
}

function update_user() {
	
}

function activate_user(){

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

const handler = {
	add_user,
	delete_user,
	update_user,
	find_user,
	activate_user
}

module.exports = handler;


