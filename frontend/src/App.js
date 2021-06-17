import React, { useEffect, useState } from 'react';
import {Switch, Route, Link, useHistory, useParams} from 'react-router-dom';
import { Container } from './styleComponents/styleComponents';
import NewUserForm from './newUserForm'
import LoginForm from './loginForm';
import './app.css';
import Application from './application';
import userService from './services/userService';
import Notification from './components/notification';
import queryString from 'query-string';


const Home = ({setUser})=>{
	const history = useHistory();

	useEffect(()=>{
		const sessionUser = sessionStorage.getItem('user');
		if (sessionUser)
		{
			setUser(JSON.parse(sessionUser));
			history.push('/application');
		}
	}, [history, setUser])

	return (
		<>
		<h1>Hello</h1>
		<div>
			<Link to="login">login</Link>
		</div>
		<div>
			<Link to="newUser">newuser</Link>
		</div>
		</>
	);
}

const Header = (props)=>{
	const style = {
		width: '100%',
		height: '50px',
		textAlign: 'left',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		border: 'solid 1px black'
	}
	const linkStyle={
		color: 'black',
		padding: '5px'
	}
	return <header style={style}>
		<Link to='/' style={linkStyle}>home</Link>
		<Link to='/' style={linkStyle}>home</Link>
		{
		props.user ? 
		<Link to='/' onClick={()=>{props.logout()}} style={{...linkStyle}}>logout</Link>
		: ''
		}
	</header>;
}


const UserActivation = (props)=>{
	const history = useHistory();
	const [activated, setActivated] = useState(false);
	const params = queryString.parse(window.location.search);

	useEffect(()=>{
		const user = {id: params.id, randomId: params.randomId}
		userService.activateUser(user)
		.then((res)=>{
			console.log(res);
			setActivated(true);
		})
		.catch((e)=>{
			console.log(e);
		})
	},[history, params])
	return (<div>
		{
		!activated 
		? 	'activating user...'
		:		<div><Notification text='User Activated' color='green'></Notification>
				<Link to='/login'>login</Link></div>
		}
	</div>)
}


const App = () => {
	const [user, setUser] = useState(null);
	const history = useHistory();

	useEffect(()=>{
		const sessionUser = sessionStorage.getItem('user');
		if (sessionUser)
		{
			setUser(JSON.parse(sessionUser));
			history.push('/application');
		}
	}, [history])

	const logout = ()=>{
		setUser(null);
		sessionStorage.removeItem('user');
	}

	return (
	<Container>
			<Header user={user} logout={logout}></Header>
			<div className="main-content">
				<Switch>
					<Route path="/newUser">
						<NewUserForm/>
					</Route>
					<Route path="/login">
						<LoginForm setUser={setUser}/>
					</Route>
					<Route path="/application">
						<Application user={user} setUser={setUser}/>
					</Route>
					<Route path="/userActivation">
						<UserActivation/>
					</Route>
					<Route path="/">
						<Home setUser={setUser}></Home>
					</Route>
				</Switch>
			</div>
	</Container>
  );
}

export default App;
