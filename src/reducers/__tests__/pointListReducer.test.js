
import pointListReducer, { initState } from '../pointListReducer';
import * as t from '../../actionTypes/pointList';


describe('pointListReducer', () => {

    const SOME_TEXT = 'Some text ...';

    const someState = {
        nextId: 4,
        order: [1,2,3],
        points: {1:'q', 2:'w', 3:'e'}
    };
    
    it('should return the initial state', () => {
        expect(pointListReducer(undefined, {})).toEqual(initState)
    });

    it('PLIST_ADD_POINT - add first point',() => {
        const action = {
            type: t.PLIST_ADD_POINT,
            payload: {
                text: SOME_TEXT
            }
        };
        expect(pointListReducer(initState, action)).toEqual({
            order: [1],
            points:{1: action.payload.text},
            nextId: 2
        });
    });
    it('PLIST_ADD_POINT - one of next points',() => {
        const action = {
            type: t.PLIST_ADD_POINT,
            payload: {
                text: SOME_TEXT
            }
        };
        expect(pointListReducer(someState, action)).toEqual({
            order: [1,2,3,4],
            points:{...someState.points, 4: action.payload.text},
            nextId: 5
        });
    });
    it('PLIST_ADD_POINT - empty text',() => {
        const action = {type: t.PLIST_ADD_POINT};
        expect(pointListReducer(someState, action)).toEqual(someState);
    });

    it('PLIST_DEL_POINT', () => {
        const action = {
            type: t.PLIST_DEL_POINT,
            payload: {
                id: 2
            }
        };
        expect(pointListReducer(someState, action)).toEqual({
            order: [1,3],
            points: {1:'q', 3:'e'},
            nextId: 4
        });
    });
    it('PLIST_DEL_POINT (exception) - nonexistent id', () => {
        const action = {
            type: t.PLIST_DEL_POINT,
            payload: {
                id: 2
            }
        };
        expect(pointListReducer(initState, action)).toEqual({
            order: [],
            points: {},
            nextId: 1
        });
    });
    it('PLIST_DEL_POINT - (exception) - payload is undefined',() => {
        const action = {type: t.PLIST_DEL_POINT}
        expect(pointListReducer(someState, action)).toEqual(someState);
    });

    it('PLIST_DEL_ALL_POINTS', () => {
        const action = {
            type: t.PLIST_DEL_ALL_POINTS
        }
        expect(pointListReducer(someState, action)).toEqual({
            order: [],
            points: {},
            nextId: 4
        });
    });

    it('PLIST_REORDER_LIST', () => {
        const action = {
            type: t.PLIST_REORDER_LIST,
            payload: {
                order: [2,1,3,4]
            }
        };
        expect(pointListReducer(someState, action)).toEqual({
            ...someState,
            order: [2,1,3,4]
        });
    });
});