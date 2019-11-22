import { 
    sagaAddPoint, sagaDelPoint, 
    sagaDelAllPoints, sagaReorderList 
} from'../saga';
import * as t from '../../actionTypes/saga';


describe('Action creators for sagas', () => {
    it('sagaAddPoint', () => {
        const expectedAction = {
            type: t.SAGA_ADD_POINT,
            payload: {text: 'Some text ...'}
        };
        expect(sagaAddPoint({text: 'Some text ...'})).toEqual(expectedAction);
    });

    it('sagaDelPoint', () => {
        const expectedAction = {
            type: t.SAGA_DEL_POINT,
            payload: {id: 210}
        };
        expect(sagaDelPoint({id: 210})).toEqual(expectedAction);
    });

    it('sagaDelAllPoints', () => {
        const expectedAction = {
            type: t.SAGA_DEL_ALL_POINTS
        };
        expect(sagaDelAllPoints()).toEqual(expectedAction);
    });

    it('sagaReorderList', () => {
        const expectedAction = {
            type: t.SAGA_REORDER_LIST,
            payload: {
                order: [5,4,3,2,1]
            }
        };
        expect(sagaReorderList({order: [5,4,3,2,1]})).toEqual(expectedAction);
    });
});