
import { select } from 'redux-saga/effects';

import {
    sagaAddPoint,
    sagaDelPoint,
    sagaDelAllPoints,
    sagaReorderList
} from '../index';

import * as t from '../../actionTypes';

import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import {
    ymapAddPlacemark,
    ymapDelPlacemarks,
    ymapDelPlacemarkById,
    ymapDrawPolyline,
    ymapPlacemarksReorder
} from '../../services/ymap';

import { getStore } from '../../reducers/selectors';


describe('REDUX SAGA sagaAddPoint',() => {
    const fakeStore = {
        pointListState: {
            nextId: 7,
            order: [3,4],
            points: {3: 'Point 3', 4: 'Point 4'}
        }
    };
    it('sagaAddPoint - mocking & integration', () => {
        return expectSaga(sagaAddPoint)
            .withState(fakeStore)
            .provide([
                [select(getStore),fakeStore],
                [matchers.call.fn(ymapAddPlacemark)],
                [matchers.call.fn(ymapDrawPolyline)]
            ])
            .put({type: t.PLIST_ADD_POINT, payload: {text: 'Some text ...'}})
            .dispatch({type: t.SAGA_ADD_POINT, payload: {text: 'Some text ...'}})
            .silentRun();
    });
    it('sagaAddPoint - step by step', () => {
        const action = {
            type: t.SAGA_ADD_POINT,
            payload: {text: 'Some text ...'}
        };
        const expectedArgs = [ 
            { balloonContentFooter: 'Some text ...', iconContent: 3 },
            { id: 7, index: 2 }
        ];
        testSaga(sagaAddPoint)
            .next()
                .take(t.SAGA_ADD_POINT)
            .next(action)
                .select(getStore)
            .next(fakeStore)
                .put({type:t.PLIST_ADD_POINT, payload: action.payload})
            .next()
                .call(ymapAddPlacemark, ...expectedArgs)
            .next()
                .call(ymapDrawPolyline);
    });
});

describe('REDUX SAGA sagaDelPoint',() => {
    const action = {
        type: t.SAGA_DEL_POINT,
        payload: {id: 6}
    };
    const fakeStoreAfter_PLIST_ADD_POINT = {
        pointListState: {
            nextId: 7,
            order: [1,3,4],
            points: {1: 'Point 1', 3: 'Point 3', 4: 'Point 4'}
        }
    };
    it('sagaDelPoint - mocking & integration', () => {
        return expectSaga(sagaDelPoint)
            .withState(fakeStoreAfter_PLIST_ADD_POINT)
            .provide([
                [select(getStore),fakeStoreAfter_PLIST_ADD_POINT],
                [matchers.call.fn(ymapDelPlacemarkById)],
                [matchers.call.fn(ymapPlacemarksReorder)],
                [matchers.call.fn(ymapDrawPolyline)]
            ])
            .put({type: t.PLIST_DEL_POINT, payload: action.payload})
            .dispatch(action)
            .silentRun();
    });
    it('sagaDelPoint - step by step', () => {
        testSaga(sagaDelPoint)
            .next()
                .take(t.SAGA_DEL_POINT)
            .next(action)
                .put({type:t.PLIST_DEL_POINT, payload: action.payload})
            .next()
                .select(getStore)
            .next(fakeStoreAfter_PLIST_ADD_POINT)
                .call(ymapDelPlacemarkById, action.payload.id)
            .next()
                .call(ymapPlacemarksReorder,
                    fakeStoreAfter_PLIST_ADD_POINT.pointListState.order)
            .next()
                .call(ymapDrawPolyline);
    });
});

describe('REDUX SAGA sagaDelAallPoints',() => {

    it('sagaDelAllPoints - mocking & integration', () => {
        return expectSaga(sagaDelAllPoints)
            .provide([
                [matchers.call.fn(ymapDelPlacemarks)]
            ])
            .put({type: t.PLIST_DEL_ALL_POINTS})
            .dispatch({type: t.SAGA_DEL_ALL_POINTS})
            .silentRun();
    });
    it('sagaDelAllPoints - step by step', () => {
        testSaga(sagaDelAllPoints)
            .next()
                .take(t.SAGA_DEL_ALL_POINTS)
            .next()
                .put({type:t.PLIST_DEL_ALL_POINTS})
            .next()
                .call(ymapDelPlacemarks);
    });
});

describe('REDUX SAGA sagaReorderList',() => {
    const action = {
        type: t.SAGA_REORDER_LIST,
        payload: {order: [3,1,4]}
    };
    it('sagaReorderList - mocking', () => {
        return expectSaga(sagaReorderList)
            .provide([
                [matchers.call.fn(ymapPlacemarksReorder)],
                [matchers.call.fn(ymapDrawPolyline)]
            ])
            .put({type: t.PLIST_REORDER_LIST, payload: action.payload})
            .dispatch(action)
            .silentRun();
    });
    it('sagaReorderList - step by step', () => {

        testSaga(sagaReorderList)
            .next()
                .take(t.SAGA_REORDER_LIST)
            .next(action)
                .put({type:t.PLIST_REORDER_LIST, payload: action.payload})
            .next()
                .call(ymapPlacemarksReorder, action.payload.order)
            .next()
                .call(ymapDrawPolyline);
    });
});