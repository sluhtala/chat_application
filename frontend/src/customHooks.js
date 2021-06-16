import {useState} from 'react';

export const useInputField = (type, callback = null)=>{
	const [value, setValue] = useState('');

	const onChange = (event)=>{
		setValue(event.target.value);
		if (callback)
			callback();
	}

	const clear = ()=>{
		setValue('');
	}

	return ({
		type, value, onChange, setValue, clear
	});
}
