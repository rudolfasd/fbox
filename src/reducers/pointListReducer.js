import * as t from '../actionTypes/pointList';


export const initState = {
	nextId: 1,
	order: [],
	points: {}
};
  
export default function pointListReducer(state = initState, action) {
	let newstate;
	let id;

	let payload = action.payload || {};

	switch(action.type){

		case t.PLIST_ADD_POINT:
			if (!payload.text) return state;
			id = state.nextId
			newstate = {
				order: [...state.order, id],
				points: {...state.points, [id]: action.payload.text},
				nextId: id + 1
			};
			return newstate;

		case t.PLIST_DEL_POINT:
			if (!payload.id) return state;
			id = payload.id;
			newstate = {
				...state,
				order: state.order.filter(i => i !== id),
			};
			delete newstate.points[id];
			return newstate;
		
		case t.PLIST_DEL_ALL_POINTS:
			newstate = {
				...state,
				order:[],
				points:{}
			};
			return newstate;
			
		case t.PLIST_REORDER_LIST:
			newstate = {...state, ...payload};
			return newstate;

		default:
			return state;
	};
};