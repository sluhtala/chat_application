
const Notification = ({text, color, onClick}) => {
	const style = {
		color: 'white',
		display: 'block',
		backgroundColor: color ? color : 'green',
		padding: '1.3rem',
		fontFamily: 'verdana',
		fontSize: '1.5rem',
		marginTop: '1rem',
		marginBottom: '1rem',
	};
	if (!text || text === '')
		return <div></div>
	return (<div style={style} onClick={onClick}>{text}</div>);
}

export default Notification;