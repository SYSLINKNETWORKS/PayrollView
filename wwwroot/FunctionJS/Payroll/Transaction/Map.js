//var x = document.getElementById("demo");
var _address=[];
var _latitude=[];
var _longitude=[];
var _checktime=[];
var _lat_long=[[],[],[],[],[]];
let map;

var _emppro_nam='';
var sessid_url = document.URL.split("&");
var _Employee_ID=sessid_url[1];
var _Date=sessid_url[2];



$(document).ready(function () {
   
});




function initMap() {
    var _maxlatlong=_lat_long[0][4]-1;
    var myLatLng = {lat: _lat_long[_maxlatlong][1], lng: _lat_long[_maxlatlong][2]};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: myLatLng,
        });
         
    var count=0;
    var flightPlanCoordinates = [];
    var mapcount=0;
    for (count = 0; count <= _maxlatlong; count++) { 
        if (count==0){mapcount="Start";}
        else if (count==_maxlatlong){mapcount="End";}
        else {mapcount=(count+1).toString();}
        flightPlanCoordinates.push({lat: _lat_long[count][1], lng: _lat_long[count][2]})
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(_lat_long[count][1], _lat_long[count][2]),
            label: mapcount.toString(),
            map: map
            });
           
        
            marker.info = new google.maps.InfoWindow({
                content: _lat_long [count][3]+ ' <br/> '+_lat_long [count][0]
                });
                
               
                

            google.maps.event.addListener(marker, 'click', function() {  

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
  async function onload()
  {
    await $.ajax({
        url: apiUrl +'/DashBoard/EmployeeGetLocation/'+_Employee_ID+'/'+_Date+'/' + strkey,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function () {
            //imgboxtotalstrength.show();
        },
        success: function (response) {
            if (response[0].status >= 1) {
                _emppro_nam=response[0]["Result"][0]["Name"];
                var _row_count=response[0]["Result"].length;
                $("#lbl_title").html(response[0]["Result"][0]["Name"]+ ' Date : '+_Date) ;
                for (i = 0; i < response[0]["Result"].length; i++) {                                                  
                    _address[i]=response[0]["Result"][i]["address"];
                    _latitude[i]=response[0]["Result"][i]["latitude"];
                    _longitude[i]=response[0]["Result"][i]["longitude"];
                    _checktime[i]= moment(response[0]["Result"][i]["CHECKTIME"]).format("HH:mm");
                    _lat_long[i]=[_address[i],_latitude[i], _longitude[i],_checktime[i],_row_count]
                }
                //showPosition();
               
                initMap();
                return true;
            }
            else {
                //imgboxtotalstrength.hide();
            }

        },
        error: function (request, status, error) {
            console.log('Error '+request.status + ' ' +request.responseText)
            alert('Error '+request.status + ' ' +request.responseText);
        }
    })
}