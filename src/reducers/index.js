import { combineReducers } from 'redux';

import pointListReducer from './pointListReducer';


const reducers = combineReducers({

	pointListState: pointListReducer

});

export default reducers;
