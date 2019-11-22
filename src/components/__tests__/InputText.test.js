import React from 'react';

import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import InputText from '../InputText';


describe('REACT COMPONENT <InputText /> desc1',() => {
    it('InputText - snapshot',() => {
        const renderedValue = renderer.create(
            <InputText />
        ).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
});

describe('REACT COMPONENT <InputText /> desc2',() => {
    const mockSagaAddPoint = jest.fn();
    const mockProps = { sagaAddPoint: mockSagaAddPoint };
    let component;

    beforeEach(() => {
        mockSagaAddPoint.mockClear();
        component = shallow(<InputText {...mockProps}/>);
    });

    it('InputText - handleInput text entering',() => {
        const mockTextInputEvent = {target: {value: 'S'}, key:'S'};
        expect(component.instance().state).toEqual({text: ''});
        component.instance().handleInput(mockTextInputEvent);
        expect(component.instance().state).toEqual({text: 'S'});
    });
    it('InputText - hookEnter when enter pressed',() => {
        const mockEnterPressEvent = {
            target: {value: 'Some text ...'}, key: 'Enter'
        };
        component.instance().handleInput(mockEnterPressEvent);
        component.instance().hookEnter(mockEnterPressEvent);
        expect(component.instance().state).toEqual({text: ''});
        expect(mockSagaAddPoint).toHaveBeenCalledTimes(1);
        expect(mockSagaAddPoint).toHaveBeenCalledWith({ text: 'Some text ...' });
    });
    it('InputText - hookEnter when other key pressed',() => {
        const mockOtherKeyPressEvent = {
            target: {value: 'Some text ...OtherKey'}, key: 'OtherKey'
        };
        component.instance().handleInput(mockOtherKeyPressEvent);
        component.instance().hookEnter(mockOtherKeyPressEvent);
        expect(component.instance().state).toEqual({ text: 'Some text ...OtherKey' });
        expect(mockSagaAddPoint).toHaveBeenCalledTimes(0);
    });
    it('InputText - hookEnter when enter pressed but input field is empty',() => {
        const mockOtherKeyPressEvent = { target: {value: ''}, key: 'Enter'};
        component.instance().handleInput(mockOtherKeyPressEvent);
        component.instance().hookEnter(mockOtherKeyPressEvent);
        expect(component.instance().state).toEqual({ text: '' });
        expect(mockSagaAddPoint).toHaveBeenCalledTimes(0);
    });
});