import React from 'react';

import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import PointList from '../PointList';
import { SortableItem } from '../PointList';
import arrayMove from 'array-move';


jest.mock('array-move');


describe('REACT COMPONENT <PointList /> - Snapshots',() => {

    const mockSagaDelPoint = jest.fn();
    const mockSagaReorderList = jest.fn();
    const mockProps = { 
        pointList: {
            nextId: 9,
            order: [2,5,6,8],
            points: {
                2: 'qwe',
                5: 'asd',
                6: 'zxc',
                8: 'rty'
            }
        },
        sagaDelPoint: mockSagaDelPoint,
        sagaReorderList: mockSagaReorderList
    };
    let renderedValue, component;

    it('SortableItem snapshot', () => {
        renderedValue = renderer.create(
            <SortableItem 
                id={2} num={1} text={'Some text...'}
                delItemFunction={mockSagaDelPoint} 
            />).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
    it('SortableItem - onclick delete', () => {
        component = shallow(
            <SortableItem 
                id={2} num={1} text={'Some text...'}
                delItemFunction={mockSagaDelPoint} 
            />);
        component.find('.item-remove').first().simulate('click');
        expect(mockSagaDelPoint).toHaveBeenCalledTimes(1);
        expect(mockSagaDelPoint).toHaveBeenCalledWith({id: 2});
    });

    it('PointList snapshot', () => {
        renderedValue = renderer.create(
            <PointList {...mockProps}/>
        ).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
    it('PointList - SortableList onSortEnd', () => {
        arrayMove.mockImplementation(() => { return 'Reordered Array'});
        component = shallow(<PointList {...mockProps} />);
        component.instance().onSortEnd({oldIndex: 0, newIndex: 1});
        expect(arrayMove).toHaveBeenCalledTimes(1);
        expect(arrayMove).toHaveBeenCalledWith( [2,5,6,8],0,1 );
        expect(mockSagaReorderList).toHaveBeenCalledTimes(1);
        expect(mockSagaReorderList).toHaveBeenCalledWith({order: 'Reordered Array'});
    });
    it('PointList - SortableList shouldCancelStart', () => {
        const mockEventFromElementWithSomeClass = {
            target: {classList: {contains: (someClass) => true } }};
        const mockEventFromElementWithoutSomeClass = {
            target: {classList: {contains: (someClass) => false} }};
            component = shallow(<PointList {...mockProps} />);
        expect(component.instance().shouldCancelStart(mockEventFromElementWithSomeClass))
            .toEqual(true);
        expect(component.instance().shouldCancelStart(mockEventFromElementWithoutSomeClass))
            .toEqual(false); 
    });
});