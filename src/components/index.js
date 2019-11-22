import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AppActions from '../actions';

import '../App.scss';
import InputText from './InputText';
import PointList from './PointList';
import MapView from './MapView';
import Separator from './Separator';


export class App extends React.Component {
	render(){
		return (
			<div className='App'>
				<main>
					<sidebar is='div'>
						<InputText {...this.props}/>
						<Separator {...this.props}/>
						<PointList {...this.props}/>
					</sidebar>
					<MapView {...this.props}/>
				</main>
			</div>
		);
	};
};

function mapStateToProps(store) {
	return {
		pointList: store.pointListState
  	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(AppActions, dispatch);
};

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(App);