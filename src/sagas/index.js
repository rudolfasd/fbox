import 'regenerator-runtime/runtime';
import {all, take, put, call, select } from 'redux-saga/effects';

import * as t from '../actionTypes';

import { ymapAddPlacemark } from '../services/ymap';
import { ymapDelPlacemarks } from '../services/ymap';
import { ymapDelPlacemarkById } from '../services/ymap';
import { ymapDrawPolyline } from '../services/ymap';
import { ymapPlacemarksReorder } from '../services/ymap';

import { getStore } from '../reducers/selectors';


export function* sagaAddPoint(){
    while(true){
        const { payload } = yield take(t.SAGA_ADD_POINT);
        const { pointListState } = yield select(getStore);
        let index = pointListState.order.length;
        yield put({type: t.PLIST_ADD_POINT, payload});
        yield call(ymapAddPlacemark,{
            balloonContentFooter: payload.text,
            iconContent: index + 1
        },
        {
            id: pointListState.nextId,
            index: index,
        });
        yield call(ymapDrawPolyline);
    };
};

export function* sagaDelPoint(){
    while(true){
        const { payload } = yield take(t.SAGA_DEL_POINT);
        yield put({type: t.PLIST_DEL_POINT, payload});
        const { pointListState } = yield select(getStore);
        yield call(ymapDelPlacemarkById, payload.id);
        yield call(ymapPlacemarksReorder ,pointListState.order);
        yield call(ymapDrawPolyline);
    };
};

export function* sagaDelAllPoints(){
    while(true){
        yield take(t.SAGA_DEL_ALL_POINTS);
        yield put({type: t.PLIST_DEL_ALL_POINTS});
        yield call(ymapDelPlacemarks);
    };
};

export function* sagaReorderList(){
    while(true){
        const { payload } = yield take(t.SAGA_REORDER_LIST);
        yield put({type: t.PLIST_REORDER_LIST, payload});
        yield call(ymapPlacemarksReorder, payload.order);
        yield call(ymapDrawPolyline);
    };
};


export default function* rootSaga() {
    yield all([
        sagaAddPoint(),
        sagaDelPoint(),
        sagaDelAllPoints(),
        sagaReorderList()
    ]);
};