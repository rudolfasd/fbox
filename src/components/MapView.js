import React from 'react';

import loadScript from '../services/loadScript';
import ymapCreate from '../services/ymap';


const MAP_PARENT_ELEMENT = 'MapView';
const scriptSrc = process.env.REACT_APP_YMAPS_SCRIPT
    .replace('<apikey>',process.env.REACT_APP_YMAPS_API_KEY);
const scriptId = 'YMaps';

export const scriptOnloadCallback = () => ymapCreate(
    MAP_PARENT_ELEMENT,
    {
        center: [57, 95],
        zoom: 3
    },{
        searchControlProvider: 'yandex#search',
        balloonPanelMaxMapArea: Infinity
    }
)


class MapView extends React.Component {

    componentDidMount(){
        loadScript(scriptSrc, scriptId, scriptOnloadCallback);
    }

    render(){
        return(
            <div className='map-view' id={MAP_PARENT_ELEMENT}></div>
        );
    }
}

export default MapView;

