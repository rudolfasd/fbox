
import ymapCreate from '../ymap'
import {
    ymapAddPlacemark,
    ymapDrawPolyline,
    ymapDefPlacemarkAddress,
    ymapPlacemarksReorder,
    ymapDelPlacemarks,
    ymapDelPlacemarkById,
} from '../ymap'


describe('YMAP',() => {

    const { ymaps } = window;
    const mockGeoObjectCollectionEventsAdd = jest.fn();
    const mockGeoObjectCollectionRemoveAll = jest.fn();
    const mockGeoObjectCollectionRemove =jest.fn();

    const mockPlacemarksArray = [
        {   options: { index: 2, id: 6, get(k){return this[k]}, set(k,v){return this[k]=v} },
            geometry: { getCoordinates(){return [31,32]}},
            properties: {set(k,v){return this[k]=v}} },
        {   options: { index: 0, id: 2, get(k){return this[k]}, set(k,v){return this[k]=v} },
            geometry: { getCoordinates(){return [11,12]}},
            properties: {set(k,v){return this[k]=v}} },
        {   options: { index: 1, id: 4, get(k){return this[k]}, set(k,v){return this[k]=v} },
            geometry: { getCoordinates(){return [21,22]}},
            properties: {set(k,v){return this[k]=v}} },    
    ]
    const mockGeoObjectCollectionToArray = jest.fn().mockImplementation(() => {
        return mockPlacemarksArray;
    });

    const mockPlacemarkEventsAdd = jest.fn();
    const mockPlacemark = {                    
        geometry:{ coords: [10,20], getCoordinates(){return this.coords} },
        options: {
            lastLocatedCoords: [10,21],
            get(k){return this[k]},
            set(k,v){return this[k]=v}
        },
        properties: {
            balloonContent: '',
            get(k){return this[k]},
            set(k,v){return this[k]=v}
        }
    };

    beforeAll(() => {
        mockGeoObjectCollectionToArray.mockClear();

        delete window.ymaps;
        window.ymaps = {
            ready: fn => fn(),
            Map: jest.fn().mockImplementation(() => {
                return {
                    geoObjects: { add :jest.fn(() => ({ add(){} })) },
                    getCenter: jest.fn()
                }
            }),
            GeoObjectCollection: jest.fn().mockImplementation(() => {
                return {
                    add: jest.fn(),
                    events:{
                        add: mockGeoObjectCollectionEventsAdd
                    },
                    toArray: mockGeoObjectCollectionToArray,
                    removeAll: mockGeoObjectCollectionRemoveAll,
                    remove: mockGeoObjectCollectionRemove
                }
            }),
            Polyline: jest.fn().mockImplementation(() => {
                return { geometry:{ setCoordinates: jest.fn() }}
            }),
            Placemark: jest.fn().mockImplementation(() => {
                const events = {}
                mockPlacemarkEventsAdd.mockImplementation(function(e,cb){
                    this[e]=cb
                });
                events['add'] = mockPlacemarkEventsAdd.bind(events)
                return { events }
            })
        };
        ymapCreate();
    });
    afterAll(() => {
        window.ymaps = ymaps;
    });

    it('ymapCreate',() => {
        expect(window.ymaps.Map).toHaveBeenCalledTimes(1);
        expect(window.ymap.geoObjects).toBeTruthy();
        expect(window.ymap.geoObjects.add).toBeTruthy();

        expect(window.ymaps.GeoObjectCollection).toHaveBeenCalledTimes(1);
        expect(mockGeoObjectCollectionEventsAdd).toHaveBeenCalledTimes(2);
        expect(mockGeoObjectCollectionEventsAdd)
            .toHaveBeenCalledWith('geometrychange',ymapDrawPolyline);
        expect(mockGeoObjectCollectionEventsAdd)
            .toHaveBeenCalledWith('remove',ymapDrawPolyline);
        expect(window.ymapPlacemarks.events.add).toBeTruthy();
        expect(window.ymapPlacemarks.toArray).toBeTruthy();
        
        expect(window.ymaps.Polyline).toHaveBeenCalledTimes(1);
        expect(window.ymapPolyline.geometry).toBeTruthy();
        expect(window.ymapPolyline.geometry.setCoordinates).toBeTruthy();
    });

    it('ymapCreate - several attempts to create a map', () => {
        ymapCreate();
        ymapCreate();
        expect(window.ymaps.Map).toHaveBeenCalledTimes(1);
    });

    it('ymapDrawPolyline',() => {
        ymapDrawPolyline();
        expect(window.ymapPolyline.geometry.setCoordinates)
            .toHaveBeenCalledTimes(1);
        expect(window.ymapPolyline.geometry.setCoordinates)
            .toHaveBeenCalledWith( [[11,12],[21,22],[31,32]] );
      
    });

    describe('ymapDrawPolyline - cover "return 0" on sorting',() => {
        let toArray;
        beforeAll(() => {
            toArray = window.ymapPlacemarks.toArray;
            delete window.ymapPlacemarks.toArray
            window.ymapPlacemarks.toArray = (() => [       
            {   options: { index: 0, get(k){return this[k]} },
                geometry: { getCoordinates(){return [11,12]}} },
            {   options: { index: 0, get(k){return this[k]} },
                geometry: { getCoordinates(){return [21,22]}} }
            ]);
        });
        afterAll(()=>{
            window.ymapPlacemarks.toArray = toArray;
        });
        it('cover "return 0" test',() => {
            ymapDrawPolyline();
        });
    });
    
    it('ymapAddPlacemark',() => {
        ymapAddPlacemark();
        expect(mockPlacemarkEventsAdd).toHaveBeenCalledTimes(3);
        expect(mockPlacemarkEventsAdd)
            .toHaveBeenCalledWith('balloonopen',expect.anything());
        expect(mockPlacemarkEventsAdd)
            .toHaveBeenCalledWith('balloonclose',expect.anything());
        expect(mockPlacemarkEventsAdd)
            .toHaveBeenCalledWith('dragend',expect.anything());
        expect(window.ymapPlacemarks.add).toHaveBeenCalledTimes(1);
        expect(window.ymapPlacemarks.add).toHaveBeenCalledTimes(1);
    });

    it('ymapAddPlacemark - events covering', () => {
        ymapAddPlacemark();
        const events = window.ymapPlacemarks.add.mock.calls[0][0].events;
        window.ymap['balloon'] = {isOpen: () => false}
        const mockEvent = {target:mockPlacemark, get(k){return this[k]}}
        events.dragend(mockEvent);
        events.balloonclose(mockEvent);
        events.balloonopen(mockEvent);

        const mockPlacemarkNotDragged = {                    
            geometry:{ coords: [10,20], getCoordinates(){return this.coords} },
            options: {
                get(k){return this[k]},
                set(k,v){return this[k]=v}
            },
            properties: {
                balloonContent: '',
                get(k){return this[k]},
                set(k,v){return this[k]=v}
            }
        };
        const mockEventNotDragged = {target: mockPlacemarkNotDragged, get(k){return this[k]}}
        events.balloonopen(mockEventNotDragged);

        mockPlacemarkNotDragged.options['lastLocatedCoords'] = [10,20]
        mockEventNotDragged.target = mockPlacemarkNotDragged
        events.balloonopen(mockEventNotDragged);
    });

    it('ymapDefPlacemarkAddress',() => {
        expect.assertions(3);
        const mockYmapsGeoCode = () => {
            return new Promise((resolve) => {
                resolve({geoObjects: {
                    0:{getAddressLine:() => 'mockAddress'},
                    get(k){return this[k]} }});
            })
        };
        window.ymap['balloon'] = {isOpen: () => true}
        window.ymaps.geocode = mockYmapsGeoCode;
        expect(mockPlacemark.options.lastLocatedCoords).toEqual([10,21]);
        ymapDefPlacemarkAddress(mockPlacemark);
        return window.ymaps.geocode().then(() => {
            expect(mockPlacemark.properties.balloonContent).toBe('mockAddress');
            expect(mockPlacemark.options.lastLocatedCoords).toEqual([10,20]);
        });
    });

    it('ymapPlacemarksReorder',() => {
        ymapPlacemarksReorder([2,4,6]);
        expect(window.ymapPlacemarks.toArray()).toMatchSnapshot();
    });

    it('ymapDelPlacemarks',() => {
        ymapDelPlacemarks();
        expect(mockGeoObjectCollectionRemoveAll).toHaveBeenCalledTimes(1);
    });

    it('ymapDelPlacemarkById',() => {
        ymapDelPlacemarkById(4);
        expect(mockGeoObjectCollectionRemove).toHaveBeenCalledTimes(1);
        expect(mockGeoObjectCollectionRemove).toMatchSnapshot();
    }); 
});