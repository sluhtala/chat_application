const mysql = require("mysql2");
const fs = require("fs");
require('dotenv').config();
const bcrypt = require('bcrypt');
const init = process.argv[2] === 'init';

//NOTE! mysql server needs to be running and
//mysql_init_db_opts needs to be root

const opts = 
{
    host: process.env.DB_HOST,
    user: process.env.DB_ROOT_NAME,
    password: process.env.DB_ROOT_PW,
	multipleStatements: true
}

const connection = mysql.createConnection(opts);
connection.connect((error) => {
    if (error){
		console.error(error.stack);
	};
});

const remove_user = `DROP USER ${process.env.DB_CLIENT_NAME}@${process.env.DB_HOST};`;
const remove_db = "DROP DATABASE game_db;";

const create_db = "CREATE DATABASE game_db;USE game_db;";
const create_users_table =
    "CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, email VARCHAR(255), password VARCHAR(255) NOT NULL, status ENUM('online','offline','sleep', 'disabled') NOT NULL, randomId VARCHAR(128), last_login DATETIME, creation_date DATETIME);";
const create_connections_table =
    "CREATE TABLE connections(id INT AUTO_INCREMENT PRIMARY KEY, start_time DATETIME ON UPDATE CURRENT_TIMESTAMP, user INT, FOREIGN KEY(user) REFERENCES users(id));";
const create_friends_table =
    "CREATE TABLE friends(id INT AUTO_INCREMENT PRIMARY KEY, id_1 INT NOT NULL, id_2 INT NOT NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP);";
const create_mysql_user =
    `CREATE USER ${process.env.DB_CLIENT_NAME}@${opts.host} IDENTIFIED BY '${process.env.DB_CLIENT_PW}';`;
const user_privileges =
    "GRANT INSERT, DELETE, SELECT, UPDATE ON game_db.* to 'client'@'" +
    opts.host +
    "';FLUSH PRIVILEGES;";
const test_user = `INSERT INTO users (username, email, password, status) VALUES('test','test@test.com','${hash_password('password')}','offline');`

function hash_password(pw){
	const hashed = bcrypt.hashSync(pw, 10);
	return hashed;
}


connection.query(
	(init ? '' : 
	remove_user +
	remove_db) +
	create_db +
	create_users_table +
	create_connections_table +
	create_friends_table +
	create_mysql_user +
	user_privileges + 
	test_user,
		(error, result) => {
			if (error) console.log(error);
			else {
				console.log("Database game_db created");
				console.log("Table users created.");
				console.log("Table friends created.");
				console.log("Mysql user created.");
			}
    }
);

connection.end();