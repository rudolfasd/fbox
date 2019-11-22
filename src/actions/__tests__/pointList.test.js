import { plistAddPoint, plistDelPoint, plistDelAllPoints} from'../pointList';
import * as t from '../../actionTypes/pointList';


describe('Action creators for pointListReducer', () => {
    it('plistAddPoint', () => {
        const expectedAction = {
            type: t.PLIST_ADD_POINT,
            payload: {text: 'Some text ...'}
        };
        expect(plistAddPoint({text: 'Some text ...'})).toEqual(expectedAction);
    });

    it('plistDelPoint', () => {
        const expectedAction = {
            type: t.PLIST_DEL_POINT,
            payload: {id: 321}
        };
        expect(plistDelPoint({id: 321})).toEqual(expectedAction);
    });

    it('plistDelAllPoints', () => {
        const expectedAction = {
            type: t.PLIST_DEL_ALL_POINTS
        };
        expect(plistDelAllPoints()).toEqual(expectedAction);
    });
});