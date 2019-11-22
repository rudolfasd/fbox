import * as t from '../actionTypes/saga';


export function sagaAddPoint(payload){
	return{
		type: t.SAGA_ADD_POINT,
		payload
	};
};

export function sagaDelPoint(payload){
	return{
		type: t.SAGA_DEL_POINT,
		payload
	};
};

export function sagaDelAllPoints(){
	return{
		type: t.SAGA_DEL_ALL_POINTS
	};
};

export function sagaReorderList(payload){
	return{
		type: t.SAGA_REORDER_LIST,
		payload
	};
};