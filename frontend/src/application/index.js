import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import userService from '../services/userService';
import { Button } from '../styleComponents/styleComponents';
import Searchbar from './Searchbar';
import { useInputField } from '../customHooks';


const Application = ({user, setUser})=>{
	const history = useHistory();
	const [users, setUsers] = useState([]);
	const search = useInputField('text');

	useEffect(()=>{
		if (!user)
			history.push('/login');
	},[history, user]);

	useEffect(()=>{
		if (!user || user.friends)
			return ;
		userService.getFriends(user)
		.then((res)=>{
			if (res.friends)
			{
				setUser({...user, friends: res.friends});
			}
			console.log(user)
		})
	}, [setUser, user])

	const fetchUsers = async (char)=>{
		if (!char || char.length !== 1)
			return ;
		console.log('fetching')
		const res = await userService.getAllUsers(user);
		const newUsers = res;
		setUsers(newUsers);
	}

	if (!user)
		return (<></>)

	//<Button color='primary' onClick={fetchUsers}>all users</Button>

	return (
		<div>
			<h3>hello {user.username}</h3>
			<Searchbar search={search} content={users} fetchUsers={fetchUsers} currentUser = {user}/>
		</div>
	);
}

export default Application;

