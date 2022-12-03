var imgload = $("#img_load");
var btnsub = $("#btn_sub");
var latitude1 = 0;
var longitude1 = 0;
var strkey = "";
var ApiForm = '';

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function error(err) {
    btnsub.hide();
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
$(document).ready(function () {
    ApiForm = apiUrl + '/api/Auth/v1';
    btnsub.hide();
    var _yy = moment(new Date()).format("YYYY")
    $('#footer_Mark').html('©' + _yy + ' All Rights Reserved - MMC');
    imgload.hide();
    $("#txtusername").focus();
    AllowLocationcheck();
});

function AllowLocationcheck() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error, options);
        btnsub.show();
    } else {

        Swal.fire({
            title: "Geolocation is not supported by this browser.",

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

};


function GetLocationcheck() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        checksavrec();
    } else {
        Swal.fire({
            title: "Geolocation is not supported by this browser.",

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

};

function showPosition(position) {
    latitude1 = position.coords.latitude;
    longitude1 = position.coords.longitude;

}



async function checksavrec() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var txt_nam = $("#txtusername").val();
    var txt_pwd = $("#txtuserpassword").val();
    var divlog = $("#div_log");
    if (txt_nam == "") {
        Swal.fire({
            title: "Please enter your login",

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return false;
    } else if (!txt_nam.match(mailformat)) {
        Swal.fire({
            title: "Invalid email",

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true;

    } else if (txt_pwd == "") {
        Swal.fire({
            title: "Please enter your password",

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return false;
    }
    var dataip = "_";// localStorage.getItem(12);
    // await $.getJSON("https://jsonip.com?callback=?", function (data) {
    //     dataip = data.ip;
    // });

    $.ajax({
        type: "POST",
        cache: false,
        url: ApiForm + '/Auth/Login',
        contentType: "application/json",
        dataType: "json",
        //        data: JSON.stringify({ "UserName": txt_nam, "UserPassword": txt_pwd, "userheader": navigator.userAgent, "wanip": dataip }),
        data: JSON.stringify({ "email": txt_nam, "password": txt_pwd, "header": navigator.userAgent, "wanip": dataip, "latitude": latitude1, "longitude": longitude1 }),
        beforeSend: function () {
            imgload.show();
            btnsub.hide();
        },

        success: function (response) {
            if (response.statusCode == 200) {
                imgload.hide();
                btnsub.show();
               // divlog.hide();
                // Swal.fire({
                //     title: "Attendance Mark",

                //     icon: 'warning',
                //     showConfirmButton: true,

                //     showClass: {
                //         popup: 'animated fadeInDown faster'
                //     },
                //     hideClass: {
                //         popup: 'animated fadeOutUp faster'
                //     }

                // })
                Swal.fire({
                    title: 'Attendance Mark',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#5cb85c',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'ok',
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                }).then((result) => {
                    if (result.value) {
                        window.location.assign(apiUrl_View + '/login');
                    }
                })
            }
            else {
                imgload.hide();
                btnsub.show();

                //    txt_err.html("<h2>" + response.message + "</h2>");
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
        error: function (xhr, status, err) {
            imgload.hide();
            btnsub.show();
            var _Error = "";
            if (xhr.status.toString() == "0") { _Error = "Server not found"; }
            else { _Error = xhr.status.toString() + ' ' + err.toString(); }

            Swal.fire({
                title: _Error,

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

    return true;

}
//Login End


$("#txtusername").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#txtuserpassword").focus();
    }
});
$("#txtuserpassword").keyup(function (e) {
    if (e.keyCode === 13) {
        checksavrec();
    }
});
