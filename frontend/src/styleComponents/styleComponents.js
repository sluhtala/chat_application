import React, {useEffect, useRef} from 'react';
import './styleSheet.css';

export const Button = (props)=>{
	const style = {
		//some style
		boxShadow: props.lift ? 'rgba(0, 0, 0, 0.3) 1px 2px' : 'none',
		};
	if (!props.color)
		props.color = 'default';
	return (<button className={`${props.color} sbutton`} {...props} style={style}>{props.children}</button>)
}

export const Container = (props)=>{
	const style ={
		alignItems: 'center',
		textAlign: 'center'
	};
	return(<div className={`scontainer`} style={style}>{props.children}</div>)
}

export const TextField = (props)=>{
	const smallRef = useRef(null);
	const inputRef = useRef(null);
	const style = {

	};
	const smallStyle={
		display:'none'
	};
	const enableTitle = ()=>{
		if (smallRef.current)
		{
			smallRef.current.style.display='block';
			smallRef.current.style.marginTop='-0.2rem';
		}
	}
	const disableTitle = ()=>{
		if (smallRef.current)
		{
			smallRef.current.style.display='none'
			smallRef.current.style.marginTop='0.1rem';
		}
	}
	const divStyle={
		position: props.position
	}


	useEffect(()=>{
		if (inputRef.current && props.default)
			inputRef.current.value = props.default;
	}, [props.default])

	const inputProps = {...props};
	inputProps.children = undefined;
	inputProps.default = undefined;



	return(
		<div className='stextfield' style={divStyle}>
			<small ref={smallRef} style={smallStyle}>{props.label}</small>
			<input autoComplete='off'
				ref={inputRef}
				onFocus={enableTitle}
				onBlur={disableTitle}
				style={style}
				value={inputProps.value}
				type={inputProps.type}
				placeholder={inputProps.placeholder}
				name={inputProps.name}
				onChange={inputProps.onChange}
			/>
			{props.children}
		</div>
		);
}

export const OkLogo = (props)=>{
	return (
	<svg height='25' width='25'>
			<circle cx='12' cy='12' r='11' color='red'  fill='none' strokeWidth='2' stroke='green'/>
			<line x1='8' y1='12' x2='12' y2='20' style={{strokeWidth:'2', stroke: 'green'}}/>
			<line x1='18' y1='8' x2='12' y2='20' style={{strokeWidth:'2', stroke: 'green'}}/>
		</svg>
	)
}
export const LoadingLogo = (props)=>{
	return (
		<svg height='25' width='25' className='loadingSymbol'>
			<circle cx='15' cy='5' r='4' color='red'  fill='blue'/>
			<circle cx='8' cy='8' r='3' color='red'  fill='blue'/>
			<circle cx='5' cy='13' r='2' color='red'  fill='blue'/>
		</svg>
	)
}

export const ErrorLogo = () => {
	return (
		<svg height='25' width='25'>
			<circle cx='5' cy='14' r='4' color='red'  fill='red'/>
		</svg>
	);
}
