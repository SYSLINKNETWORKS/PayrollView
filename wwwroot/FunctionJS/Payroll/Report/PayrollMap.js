var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);
var strkey = "";

var _address = [];
var _latitude = [];
var _longitude = [];
var _checktime = [];
var _lat_long = [[], [], [], [], []];
let map;
var ApiForm = '';



$(document).ready(function () {
});




function initMap() {
    var _maxlatlong = _lat_long[0][4] - 1;
    var myLatLng = { lat: _lat_long[_maxlatlong][1], lng: _lat_long[_maxlatlong][2] };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: myLatLng,
    });

    var count = 0;
    var flightPlanCoordinates = [];
    var mapcount = 0;
    for (count = 0; count <= _maxlatlong; count++) {
        if (count == 0) { mapcount = "Start"; }
        else if (count == _maxlatlong) { mapcount = "End"; }
        else { mapcount = (count + 1).toString(); }
        flightPlanCoordinates.push({ lat: _lat_long[count][1], lng: _lat_long[count][2] })
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(_lat_long[count][1], _lat_long[count][2]),
            label: mapcount.toString(),
            map: map
        });


        marker.info = new google.maps.InfoWindow({
            content: _lat_long[count][3] + ' <br/> ' + _lat_long[count][0]
        });




        google.maps.event.addListener(marker, 'click', function () {

            // this = marker
            var marker_map = this.getMap();
            this.info.open(marker_map, this);
            // Note: If you call open() without passing a marker, the InfoWindow will use the position specified upon construction through the InfoWindowOptions object literal.
        });


    }
    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);

}
async function onload() {
    ApiForm = apiUrl + '/api/Payroll/v1/PayrollDashboard';
    if (localStorage.getItem(apiUrl_HD) != null) { strkey = localStorage.getItem(apiUrl_HD); }
    await $.ajax({
        url: ApiForm + '/GetLocation',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        success: function (response) {

            if (response.statusCode == 200) {
               
                _emppro_nam = response["data"][0]["name"];
                var _row_count = response["data"].length;
                $("#lbl_title").html(response["data"][0]["employeeName"]);
                for (i = 0; i < response["data"].length; i++) {
                    _address[i] = response["data"][i]["address"];
                    _latitude[i] = response["data"][i]["latitude"];
                    _longitude[i] = response["data"][i]["longitude"];
                    _checktime[i] = moment(response["data"][i]["checkTime"]).format("DD-MMM-YYYY HH:mm");
                    _lat_long[i] = [_address[i], _latitude[i], _longitude[i], _checktime[i], _row_count]
                }
                //showPosition();

                initMap();
                return true;
            }
            else {
                Swal.fire({
                    title: response.message,

                    icon: 'warning',
                    showConfirmButton: true,

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                })
            }

        },
        error: function (error) {

            Swal.fire({
                title: 'Error ' + error,

                icon: 'warning',
                showConfirmButton: true,

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }

            })

        }
    })
}