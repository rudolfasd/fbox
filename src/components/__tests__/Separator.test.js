import React from 'react';

import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Separator from '../Separator';


describe('REACT COMPONENT <Separator />',()=>{
    const mockSagaDelAllPoints = jest.fn();
    const mockInitProps = {
        pointList: { order: []},
        sagaDelAllPoints: mockSagaDelAllPoints
    };
    const mockProps = { 
        pointList: {order: [2,5,6,8]},
        sagaDelAllPoints: mockSagaDelAllPoints
    };
    let renderedValue, component;

    it('Separator - snapshot if no points',() => {
        renderedValue = renderer.create(
            <Separator {...mockInitProps}/>
        ).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
    it('Separator - snapshot if points exist',() => {
        renderedValue = renderer.create(
            <Separator {...mockProps}/>
        ).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });

    it('Separator - sepBtnClasses if no points',()=>{
        component = shallow(<Separator {...mockInitProps} />);
        expect(component.instance().sepBtnClasses())
            .toEqual('sep-btn-del-all inactive');
    });
    it('Separator - sepBtnClasses if points exist',()=>{
        component = shallow(<Separator {...mockProps} />);
        expect(component.instance().sepBtnClasses())
            .toEqual('sep-btn-del-all');
    });

    it('Separator - sagaDelAllPoints if no points',()=>{
        component = shallow(<Separator {...mockInitProps} />);
        component.instance().delAllPoints();
        expect(mockSagaDelAllPoints).toHaveBeenCalledTimes(0);
    });
    it('Separator - sagaDelAllPoints if points exist',()=>{
        component = shallow(<Separator {...mockProps} />);
        component.instance().delAllPoints();
        expect(mockSagaDelAllPoints).toHaveBeenCalledTimes(1);
    });
});