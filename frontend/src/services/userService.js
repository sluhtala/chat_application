import axios from 'axios';
const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/users`;
const friendsUrl = `${process.env.REACT_APP_BASE_URL}/api/friends`;

const getConfig = (user)=>{
	console.log(user);
	const config = {headers: {Authorization: `Bearer ${user.token}`}} 
	return config;
}

const newUser = async (user)=>{
	const result = await axios.post(`${baseUrl}/test`, user);
	console.log(result)
	return result.data;
}

const activateUser = async (user) => {
	const result = await axios.put(`${baseUrl}/${user.id}`,{id: user.id}, getConfig(user));
	return result.data;
}

const getUserByName = async (username) => {
	const result = await axios.get(`${baseUrl}/finduser/${username}`);
	return result.data;
}

const getAllUsers = async (user)=>{
	const result = await axios.get(`${baseUrl}`, getConfig(user));
	return result.data;
}

const getFriends = async (user)=>{
	const result = await axios.get(`${friendsUrl}/${user.id}`, getConfig(user))
	return result.data;
}

const userService = {
	newUser,
	activateUser,
	getUserByName,
	getAllUsers,
	getFriends
}

export default userService;