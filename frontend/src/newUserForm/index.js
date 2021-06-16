import { useState, useEffect } from 'react';
import { TextField, Button, OkLogo, LoadingLogo, ErrorLogo} from '../styleComponents/styleComponents'
import { Link } from 'react-router-dom';
import { useInputField } from '../customHooks';
import Notification from '../components/notification';
import userService from '../services/userService';

const NewUserForm = ()=>{
	let email = useInputField('text');
	let password = useInputField('password');
	let confirmPassword = useInputField('password');
	const [notificationColor, setNotificationColor] = useState('green');
	const [usernameSymbol, setUsernameSymbol] = useState('');
	const [notification, setNotification] = useState('');
	const [validUser, setValidUser] = useState(false);
	const [tValue, setTvalue] = useState(null);
	let username = useInputField('text', ()=>{clearTimeout(tValue)});

	const formValidation = ()=>{
		if (email.value === '' || username.value === '' || password.value === '' || confirmPassword.value === '')
			return 'Fill all fields'
		if (username.value.length < 4)
			return 'Username needs to be at least 4 characters long';
		if (password.value.length < 4)
			return 'Password needs to be at least 4 characters long';
		if (validUser === false)
			return 'Username already exists'
		return null;
	}

	const submit = (e)=>{
		e.preventDefault();
		if (confirmPassword.value !== password.value)
		{
			setNotificationColor('red');
			return (setNotification('password not matching'));
		}
		const validation = formValidation();
		if (validation)
		{
			setNotificationColor('red');
			return setNotification(validation);
		}
		const newUser = {username: username.value, email: email.value, password: password.value};
		userService.newUser(newUser)
		.then((res)=>{
			if (res === 'ok')
			{
				username.clear();
				email.clear();
				password.clear();
				confirmPassword.clear();
				setNotificationColor('green');
				setNotification('Confirmation email send');
			}
		})
		.catch((e)=>{
			console.log(e);
		})
	}

	useEffect(()=>{
		setNotification('');
		if (!username.value || username.value.length < 4) 
		{
			setUsernameSymbol('');
			return;
		}
		setUsernameSymbol(<LoadingLogo/>);
		let t = setTimeout(()=>{
			userService.getUserByName(username.value)
			.then((res)=>{
				if (res.user)
				{
					setNotificationColor('red');
					setNotification('Username already exists');
					setUsernameSymbol(<ErrorLogo/>);
					setValidUser(false);
				}
				else
				{
					setUsernameSymbol(<OkLogo/>);
					setValidUser(true);
				}
			});
		}, 1000);
		setTvalue(t);
	}, [username.value])
	

	useEffect(()=>{
		const defaultValues = {
			username: 'test_user',
			email: 'sluhtala@me.com',
			password: 'password',
			confirmPassword: 'password'
		}

		username.setValue(defaultValues.username);
		email.setValue(defaultValues.email);
		password.setValue(defaultValues.password);
		confirmPassword.setValue(defaultValues.confirmPassword);
	},[])

	return (
		<div>
		<h2>Create new account</h2>
		<form onSubmit={submit}>
			<div>
				<TextField {...username} label='Username' placeholder="Username" position="relative">
					<div style={{display: 'inline-block', position: 'absolute', right: '-28px'}}>
						{usernameSymbol}
					</div>
				</TextField>
			</div>
			<div>
				<TextField {...email} label='Email' placeholder="Email"/>
			</div>
			<div>
				<TextField {...password} label='Password' placeholder="Password"/>
			</div>
			<div>
				<TextField {...confirmPassword} label='Confirm Password' placeholder="Confirm password"/>
			</div>
			<Notification text={notification} color={notificationColor}/>
			<Button type='submit' color='submit' onClick={submit}>Create</Button>
			<Link to="/"><Button type='button' color='warning'>Cancel</Button></Link>
		</form>
		<Link to="/login">Login</Link>
		</div>
	);
}

export default NewUserForm;