import React from 'react';

import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import MapView from '../MapView';
import loadScript from '../../services/loadScript';
import ymapCreate from '../../services/ymap';


jest.mock('../../services/loadScript');
jest.mock('../../services/ymap');


describe('REACT COMPONENT <MapView />',() => {

    beforeEach(()=>{
        loadScript.mockClear();
    });

    it('MapView - snapshot',() => {
        const renderedValue = renderer.create(
            <MapView />
        ).toJSON();
        expect(renderedValue).toMatchSnapshot();
    }); 

    it('MapView - componentDidMount should call loadScript', () => {
        shallow(<MapView />);
        expect(loadScript).toHaveBeenCalledTimes(1);
    });

    it('MapView - loadScript should call ymapCreate', () => {
        loadScript.mockImplementation((scriptSrc,scriptId,callback) => {
            return (
                require.requireActual(
                    '../../services/loadScript'
                ).default
            )(scriptSrc,scriptId,callback);
        });
        shallow(<MapView />);
        document.querySelector('script#YMaps').onload();
        expect(ymapCreate).toHaveBeenCalledTimes(1);
    });
});