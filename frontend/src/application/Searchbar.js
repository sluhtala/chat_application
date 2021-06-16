import { Button, TextField } from '../styleComponents/styleComponents';
import styled, {css} from 'styled-components';
import { useInputField } from '../customHooks';
import userService from '../services/userService';
import { useEffect } from 'react';
import React, { useState } from 'react';


const SearchResultDiv = styled.div`
	width: 100%;
	height: auto;
	margin: 0;
	border: 1px solid black;
	position: absolute;
	left:0;
	display: ${props => props.display};
`;

const Box = styled.div`
	margin:0;
	padding:0;
	position: relative;
`;

const Ul = styled.ul`
	list-style: none;
	margin:0;
	padding:0;
	text-align: left;
`;

const ListButton = styled.button`
	border: black 1px solid;
	margin: 1px;
	border-radius: 4px;
	display: block;
	background: none;
	width: 100%;
	&:hover{
		background: lightgray;
	}
`;


const UserCard = ({user, displayUserInfo})=>{
	return (
			<ListButton onClick={()=>displayUserInfo(user)}>
				{user.username}
			</ListButton>
	);
}

const FullUserCardDiv = styled.div`
	border: 1px solid black;
`;

const FullUserCard = ({user, setUserInfo, currentUser})=>{
	const [ isFriend ]= useState(currentUser.friends.includes(user.id));

	return (
			<FullUserCardDiv onBlur={()=>{console.log('blurred')}}>
				<a onClick={()=>setUserInfo(null)}>
					close
				</a>
				<div>
				username: 
				{user.username}
				</div>
				<div>
					id: 
					{user.id}
				</div>
				{
					isFriend ? '' :
					<Button color='default'>
						Send friend request
					</Button>
				}
			</FullUserCardDiv>
	);
};

const Searchbar = (props)=>{
	const search = useInputField('text');
	const [userInfo, setUserInfo] = useState(null);
	const [filtered, setFiltered] = useState([]);

	search.onChange = (e)=>{
		e.preventDefault();
		setUserInfo(null);
		search.setValue(e.target.value);
		props.fetchUsers(e.target.value);
		const searched = props.content.filter((s)=>{
			const expr = RegExp(`^${e.target.value}`);
			return (expr.test(s.username) && s.id !== props.currentUser.id);
		})
		setFiltered(searched);
	}


	const displayUserInfo = (user)=>{
		if (!user && userInfo)
			setUserInfo(null);
		if (!user)
			return;
		search.clear();
		setUserInfo(
			<FullUserCard user={user} setUserInfo={setUserInfo} currentUser={props.currentUser}/>
		);
	}

	return (
			<>
				<Box>
					<TextField {...search} position='relative' placeholder='Search users'>
						<SearchResultDiv display={search.value.length > 0 ? 'block' : 'none'}>
							{filtered.length === 0 ? 'no users found' :
								<Ul>
									{filtered.map((c)=><li key={c.id}><UserCard displayUserInfo={displayUserInfo} user={c}></UserCard></li>)}
								</Ul>
							}
						</SearchResultDiv>
					</TextField>
				</Box>
				{userInfo}
			</>
		)
}

export default Searchbar;