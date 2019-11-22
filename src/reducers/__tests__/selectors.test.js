import * as s from '../selectors';


describe('SELECTORS checks',()=>{
    const someState = { 
        pointListState: {
            nextId: 2,
            order: [2,5],
            points: {
                2:'qwe',
                5:'asd'
            } 
        }
    };
    
    it('getStore',()=>{
        expect(s.getStore(someState)).toEqual(someState);
    });
});