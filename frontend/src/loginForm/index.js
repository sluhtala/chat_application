import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, TextField, LoadingLogo } from '../styleComponents/styleComponents'; 
import loginService from '../services/loginService';
import { useInputField } from '../customHooks'
import Notification from '../components/notification';

function LoginForm(props){
	let username = useInputField('text');
	let password = useInputField('password');
	const [notification, setNotification] = useState('');
	const [notificationColor, setNotificationColor] = useState('green');
	const [isLoading, setIsLoading] = useState(false);
	const history = useHistory();

	const submit = (e)=>{
		e.preventDefault();
		setIsLoading(true);
		setTimeout(()=>{
			loginService.login(username.value, password.value)
			.then((res)=>{
				setNotification('logged in succesfully')
				setNotificationColor('green');
				sessionStorage.setItem('user', JSON.stringify(res));
				props.setUser(res);
				history.push('/application');
			})
			.catch((e)=>{
				console.log(e)
				setIsLoading(false);
				if (e.response)
				{
					console.error(e.response.data.error)
					setNotification(e.response.data.error)
					setNotificationColor('red');
				}
				else
				{
					setNotification("Connection error")
					setNotificationColor('red');
				}

			})
		}, 1500)
	}

	return (
		<div>
		<h2>Login</h2>
		<form onSubmit={submit}>
			<div onClick={()=>setNotification('')}>
				<TextField {...username} label='Username' placeholder="username"/>
			</div>
			<div onClick={()=>setNotification('')}>
				<TextField {...password} label='Password' placeholder="password"/>
			</div>
			<Notification onClick={()=>{setNotification('')}} text={notification} color={notificationColor}/>
			<Button type='submit' color='submit'>Login</Button>
			<Link to="/"><Button type='button' color='warning'>Cancel</Button></Link>
			{isLoading ? <LoadingLogo/> : ''}
		</form>
		<Link to="/newUser">Create new user</Link>
		</div>
	);
}

export default LoginForm;