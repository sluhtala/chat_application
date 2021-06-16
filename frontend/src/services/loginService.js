import axios from 'axios';
//const baseUrl = 'http://localhost:3001/api/login';
const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/login`;


const login = async (username, password)=>{
	const result = await axios.post(baseUrl, {username, password});
	return result.data;
}

const loginService = {
	login
}

export default loginService;