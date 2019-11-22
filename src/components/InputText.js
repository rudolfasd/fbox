import React from 'react';


class InputText extends React.Component {

	state = {text:''};

	hookEnter = e => {
		if (e.key !== 'Enter') return ;
 		this.setState({text:''});
		if (e.target.value){
			this.props.sagaAddPoint({text: e.target.value});
		};
	};

	handleInput = e => {
		this.setState({
			text: e.target.value
		});
	};
	
	render(){
		return(
			<div className='input-text'>
				<input className='input-text-field'
					type='text' maxLength='60'
					onKeyPress={this.hookEnter.bind(this)}
					onChange={this.handleInput}
					value={this.state.text}
				/>
			</div>
		);
	};
};

export default InputText;

