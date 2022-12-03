//var x = document.getElementById("demo");
var _latitude = [];
var _longitude = [];
var _lat_long = [[], []];

var _emppro_nam = '';
$(document).ready(function () {
    onload();
    //mapworking();
});

function mapworking() {
    map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());

    epsg4326 = new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
    var lon1 = _lat_long[0][0];
    var lat1 = _lat_long[0][1];
    var lonLat = new OpenLayers.LonLat(lon1, lat1).transform(epsg4326, projectTo);

    var zoom = 14;
    map.setCenter(lonLat, zoom);

    var vectorLayer = new OpenLayers.Layer.Vector("Overlay");


    //Loop through the markers array
    for (var i = 0; i < _lat_long.length; i++) {

        var lon = _lat_long[i][0];
        var lat = _lat_long[i][1];

        var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lon, lat).transform(epsg4326, projectTo),
            //{description: "marker number " + i} ,
            { description: _emppro_nam },
            { externalGraphic: '/images/MapIcons/1.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset: -12, graphicYOffset: -25 }
        );
        vectorLayer.addFeatures(feature);
    }

    map.addLayer(vectorLayer);
}
async function onload() {
    await $.ajax({

        url: apiUrl + '/DashBoard/EmployeeGetLocation/6/2020-10-24/' + strkey,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function () {
            //imgboxtotalstrength.show();
        },
        success: function (response) {
            if (response[0].status >= 1) {
                _emppro_nam = response[0]["Result"][0]["Name"];
                for (i = 0; i < response[0]["Result"].length; i++) {
                    _latitude[i] = response[0]["Result"][i]["longitude"];
                    _longitude[i] = response[0]["Result"][i]["latitude"];
                    _lat_long[i] = [response[0]["Result"][i]["latitude"], response[0]["Result"][i]["longitude"]]
                }
                //showPosition();
                //mapworking();
                return true;
            }
            else {
                //imgboxtotalstrength.hide();
            }

        },
        error: function (error) {
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}

// function getLocation() {

// if (navigator.geolocation) {

//      navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//      x.innerHTML = "Geolocation is not supported by this browser.";
//    }

// }

function showPosition(position) {
    for (var _latcnt = 0; _latcnt < _latitude.length; _latcnt++) {
        // Target's GPS coordinates.
        var target = L.latLng(_latitude[_latcnt], _longitude[_latcnt]);
    }
    x.innerHTML = "Latitude: " + _latitude + "<br>Longitude: " + _longitude;

    // Where you want to render the map.
    var element = document.getElementById('osm-map');

    // Height has to be set. You can do this in CSS too.
    element.style = 'height:300px;';

    // Create Leaflet map on map element.
    var map = L.map(element);

    // Add OSM tile leayer to the Leaflet map.
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // Set map's center to target with zoom 14.
    map.setView(target, 14);

    // Place a marker on the same location.
    L.marker(target).addTo(map)
}