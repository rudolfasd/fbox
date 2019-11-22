
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import  App from '../components';
import Store from '../store';

import * as serviceWorker from '../serviceWorker';


jest.mock('react-dom', () => ({ render: jest.fn() }));
jest.mock('../serviceWorker', () => ({ unregister: jest.fn() }));


describe('index.js testing',() => {
    const div = document.createElement('div');
    div.id = 'root';

    beforeEach(()=>{
        document.body.appendChild(div);
        require("../index.js");
    });
    
    it("should call ReactDOM.render", () => {
        expect(ReactDOM.render).toHaveBeenCalledWith(
            <Provider store={ Store() }>
                <App />
            </Provider>, document.getElementById('root')
        );
    });
    it("should call serviceWorker.unregister", () => {
        expect(serviceWorker.unregister).toHaveBeenCalled();
    });
});

