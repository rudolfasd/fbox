import * as t from '../actionTypes/pointList';


export function plistAddPoint(payload){
	return{
		type: t.PLIST_ADD_POINT,
		payload
	};
};

export function plistDelPoint(payload){
	return{
		type: t.PLIST_DEL_POINT,
		payload
	};
};

export function plistDelAllPoints(){
	return{
		type: t.PLIST_DEL_ALL_POINTS
	};
};
