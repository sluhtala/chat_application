const mysql = require('mysql2/promise');
require('dotenv').config();

const sql_opts = {
    host: process.env.DB_HOST,
    user: process.env.DB_CLIENT_NAME,
    password: process.env.DB_CLIENT_PW,
    database: "game_db",
};

async function create_connection_pool(){
	const pool = await mysql.createPool({...sql_opts,
	waitForConnections: true, connectionLimit: 10});
	return pool;
}

async function find_user_by_id(id)
{
	const pool = await create_connection_pool();
	const sql = 'SELECT * FROM users WHERE id=?';
	const [rows, fields] = await pool.execute(sql, [id]);
	if (rows.length === 0)
		return null;
	return {...rows[0]};
}

async function find_all_users()
{
	const pool = await create_connection_pool();
	const sql = 'SELECT * FROM users;';
	const [rows, fields] = await pool.query(sql);
	return rows;
}

async function find_user_by_name(name)
{
	const pool = await create_connection_pool();
	const sql = 'SELECT * FROM users WHERE username=?';
	const [rows, fields] = await pool.execute(sql, [name]);
	if (rows.length === 0)
		return null;
	return {...rows[0]};
}


async function update_user(id, type)
{
	let sql;
	if (type === 'activate')
		sql = `UPDATE users SET status='offline' WHERE id=?`;
	else
	{
		return false;
	}
	const pool = await create_connection_pool();
	const result = await pool.execute(sql, [id]);
	return true;
}

async function delete_user(id)
{
    const sql = `DELETE FROM users where id=?`;
    //const delete_connections = `DELETE FROM connections WHERE user=(SELECT id FROM users WHERE username=?)`;
	const pool = await create_connection_pool();
	try {
		const result = await pool.execute(sql, [id]);
		console.log(`deleted user: ${result}`)
	}
	catch(e){
		console.error(e)
	}
}

async function add_user(user){
	const pool = await create_connection_pool();
    const sql = `INSERT INTO users (username, email, password, status, randomId) VALUES(?,?,?,?,?);`;
	const result = await pool.execute(sql, [user.username, user.email, user.password, 'disabled', user.randomId]);
	if (!result || !result[0])
		return null;
	return {id: result[0].insertId};
}

const queries = {
	create_connection_pool,
	find_user_by_id,
	find_all_users,
	find_user_by_name,
	update_user,
	delete_user,
	add_user
}

module.exports = queries;

