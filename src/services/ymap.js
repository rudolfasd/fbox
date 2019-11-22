
function ymapCreate(parentElement, properties, options) {
    window.ymaps.ready(function(){
        if (window.ymap){ return };
        window.ymap = new window.ymaps.Map(
            parentElement,
            properties,
            options
        );

        function addPlacemarks(){
            let ymapPlacemarks = new window.ymaps.GeoObjectCollection(null, {
                preset: 'islands#lightBlueStretchyIcon',
                draggable: true            
            });
            ymapPlacemarks.events.add('geometrychange', ymapDrawPolyline);
            ymapPlacemarks.events.add('remove', ymapDrawPolyline);
            window.ymapPlacemarks = ymapPlacemarks;
        };
        addPlacemarks();

        function addPolyline(){
            let ymapPolyline = new window.ymaps.Polyline([],{},{
                strokeColor: "#000000",
                strokeWidth: 2,
                strokeOpacity: 0.5            
            });
            window.ymapPolyline = ymapPolyline;
        };
        addPolyline();

        function addObjects(){
            window.ymap.geoObjects
                .add(window.ymapPlacemarks)
                .add(window.ymapPolyline)
                ;
        };
        addObjects();
    });
};

function ymapDefPlacemarkAddress(placemark){
    let coords = placemark.geometry.getCoordinates();
    let lastLocatedCoords = placemark.options.get('lastLocatedCoords')||[];
    if (coords.join('_') === lastLocatedCoords.join('_')){ return };
    if (!window.ymap.balloon.isOpen()){ return };
    placemark.properties.set('balloonContent','...');
    window.ymaps.geocode(coords).then(function(res){
        let firstGeoObject = res.geoObjects.get(0);
        let address = firstGeoObject.getAddressLine();
        placemark.properties.set('balloonContent',address);
        placemark.options.set('lastLocatedCoords',coords);
    });
};

function ymapAddPlacemark(properties, options){
    function addPlacemark(){        
        let coords = window.ymap.getCenter();
        let Placemark = new window.ymaps.Placemark(
            coords,
            properties,
            options
        );
        Placemark.events.add('balloonopen',function(e){
            let placemark = e.get('target');
            placemark.options.set('preset', 'islands#redStretchyIcon');
            ymapDefPlacemarkAddress(placemark);
        });
        Placemark.events.add('balloonclose',function(e){
            e.get('target').options.set('preset');
        });
        Placemark.events.add('dragend',function(e){
            ymapDefPlacemarkAddress(e.get('target'));
        });
        window.ymapPlacemarks.add(Placemark);
    };
    addPlacemark();
};

function ymapDelPlacemark(Placemark){
    window.ymapPlacemarks.remove(Placemark);
};

function ymapDelPlacemarks(){
    window.ymapPlacemarks.removeAll();
};

function ymapDelPlacemarkById(id){
    let placemarks = window.ymapPlacemarks.toArray();
    for (let i = 0, pl = placemarks.length; i < pl; i++){
        let placemark = placemarks[i];
        if (placemark.options.get('id') === id){
            ymapDelPlacemark(placemark);
            break;
        };
    };
};

function ymapDrawPolyline(){
    let placemarks = window.ymapPlacemarks.toArray()
    placemarks.sort(function(a,b){
        a = a.options.get('index');
        b = b.options.get('index');
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
    let coordsList = [];
    for (let i = 0, pl = placemarks.length; i < pl; i++){
        coordsList.push(placemarks[i].geometry.getCoordinates());
    };
    window.ymapPolyline.geometry.setCoordinates(coordsList);
};

function ymapPlacemarksReorder(order){
    let placemarks = window.ymapPlacemarks.toArray();
    for (let i = 0, pl = placemarks.length; i < pl; i++){
        let placemark = placemarks[i];
        let id = placemark.options.get('id');
        let index = order.indexOf(id);
        placemark.options.set('index',index);
        placemark.properties.set('iconContent',index + 1);
    };
};

export { 
    ymapCreate as default,
    
    ymapAddPlacemark,
    ymapDelPlacemark,
    ymapDelPlacemarks,
    ymapDelPlacemarkById,
    ymapDrawPolyline,
    ymapPlacemarksReorder,
    ymapDefPlacemarkAddress
};