import React from 'react';
import { Provider } from 'react-redux';

import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import  ConnectedApp, { App } from '..';
import InputText from '../InputText';
import PointList from '../PointList';
import Separator from '../Separator';
import MapView from '../MapView';

import * as a from '../../actions';
import * as t from '../../actionTypes';


jest.mock('../MapView',() => {
    return function() {
        return (<div className='map-view'></div>);
    };
});


describe('REACT COMPONENT <App />',()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<App />);
    });

    it('component rendered', () => {
       expect(wrapper.length).toEqual(1)
    });
    it('is a "div" with class "App">', () => {
        expect(wrapper.type()).toEqual('div');
        expect(wrapper.hasClass('App')).toEqual(true);
    });
    it('contains one "InputText"',() => {
        expect(wrapper.find(InputText).length).toEqual(1);
    });
    it('contains one "PointList"',() => {
        expect(wrapper.find(PointList).length).toEqual(1);
    });
    it('contains one "MapView"',() => {
        expect(wrapper.find(MapView).length).toEqual(1);
    });
    it('contains one "Separator"',() => {
        expect(wrapper.find(Separator).length).toEqual(1);
    });
});

describe('REACT COMPONENT <App /> with REDUX store', () => {
    const initState = { pointListState: {nextId: 2, order: [], points: {} }};
    const mockStore = configureStore();
    let store, wrapper;

    beforeEach(() => {
        store = mockStore(initState);
        wrapper = mount(<Provider store={store}><ConnectedApp /></Provider>);
    });

    it('component rendered', () => {
        expect(wrapper.find(ConnectedApp).length).toEqual(1);
    });
    it('check state-prop for pointListReducer',() => {
        expect(wrapper.find(App).prop('pointList'))
        .toEqual(initState.pointListState);
    });
});

describe('REACT-REDUX check actions dispatching',() => {
    const initState = { pointListState: {nextId: 2, order: [], points: {} }};
    const mockStore = configureStore();
    let store;

    beforeEach(() => {
        store = mockStore(initState);
    });

    it('Add point',() => {
        store.dispatch(a.plistAddPoint({text: 'Some text ...'}));
        expect(store.getActions()[0].type).toBe(t.PLIST_ADD_POINT);
    });
    it('Del point',() => {
        store.dispatch(a.plistDelPoint({id: 123}));
        expect(store.getActions()[0].type).toBe(t.PLIST_DEL_POINT);
    });
    it('Del all points',() => {
        store.dispatch(a.plistDelAllPoints());
        expect(store.getActions()[0].type).toBe(t.PLIST_DEL_ALL_POINTS);
    });
});

describe('REACT COMPONENT <App /> - Snapshot', () => {
    const initState = { pointListState: {nextId: 2, order: [], points: {} }};
    const mockStore = configureStore();
    let store, renderedValue;

    beforeEach(() => {
        store = mockStore(initState);
    });

    it('App initialization page', () => {
        renderedValue = renderer.create(
            <Provider store={store}><ConnectedApp /></Provider>
        ).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
});
