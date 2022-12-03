var btnsub = $("#btn_sub");
var imgload = $("#img_load");
var dataip = "_";
var strkey = "";
var ApiForm = '';
var apiUrl_View = window.location.origin

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Auth/v1';
    var _yy = moment(new Date()).format("YYYY")
    $('#footer_Mark').html('©' + _yy + ' All Rights Reserved - MMC');
    imgload.hide();


    localStorage.setItem(apiUrl_HD, "");
    $("#txtusername").focus();
});

//Login Next End
async function Login_next() {
    var strkey = "0";
    if (localStorage.getItem(apiUrl_HD) != null) { strkey = localStorage.getItem(apiUrl_HD); }

    var ddbranch = $('#dd_branch option:selected').val();
    var ddyear = $('#dd_year option:selected').val();

    $.ajax({
        type: "POST",
        cache: false,
        url: ApiForm + '/Auth/LoginNext',// + '/Login/login_next/' + ddbranch + "/" + ddyear,
        contentType: "application/json",
        dataType: "json",
        //        data: JSON.stringify({ "Token": strkey }),
        data: JSON.stringify({ "branchId": ddbranch, "yearId": ddyear }),

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
            btnsub.hide();
        },

        success: function (response) {
            if (response.statusCode == 200) {

                imgload.hide();

                //window.location.assign("@Url.Content("~/Main")");
                window.location.assign("Index");
            }
            else {
                imgload.hide();

                txt_err.html("<h2>" + response.message + "</h2>");
                alert(response.message);
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            btnsub.show();

            Swal.fire({
                title: xhr.status.toString() + ' ' + err.toString(),

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
//Login Next End

//Login Start
async function Login() {

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
    await $.getJSON(apiUrl_IP + '/index.php', function (data) {
        dataip = data.ip;
    });
    console.log(dataip);
    //checklogin();
    $.ajax({
        type: "POST",
        cache: false,
        url: ApiForm + '/Auth/Login',
        contentType: "application/json",
        dataType: "json",
        //        data: JSON.stringify({ "UserName": txt_nam, "UserPassword": txt_pwd, "userheader": navigator.userAgent, "wanip": dataip }),
        data: JSON.stringify({ "email": txt_nam, "password": txt_pwd, "header": navigator.userAgent, "wanip": dataip }),
        beforeSend: function () {
            imgload.show();
            btnsub.hide();
        },

        success: function (response) {
            localStorage.setItem(apiUrl_HD, "");
            if (response.statusCode == 200) {
                imgload.hide();
                btnsub.show();
                localStorage.setItem(apiUrl_HD, response.message);
                Onload_Branch(response["data"]["branchName"]);
                divlog.hide();

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
            var _title = "";
            if (xhr.status.toString() == "0") { _title = "Server not found"; }
            else { _title = xhr.status.toString() + ' ' + err.toString(); }

            _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
            Swal.fire({

                title: _title,

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




// Load Branch Start *@

async function Onload_Branch(id) {
    ddbranch = $("#dd_branch");
    ddbranch.empty();

    var strkey = "0";
    if (localStorage.getItem(apiUrl_HD) != null) { strkey = localStorage.getItem(apiUrl_HD); }

    await $.ajax({
        url: ApiForm + '/LOVServices/GetBranch',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        success: function (response) {
            if (response.statusCode == 200) {
                for (var i = 0; i < response["data"].length; i++) {
                    productItem02 = '<option value="' + response["data"][i]["id"] + '">' + response["data"][i]["name"] + '</option>';
                    ddbranch.append(productItem02);
                }
                if (id > 0) {
                    ddbranch.val(id);
                }

                Onload_year();
            }
            else {
                alert(response.message);
            }


        },
        error: function (xhr, status, err) {
            imgload.hide();
            Swal.fire({
                title: xhr.status.toString() + ' ' + err.toString(),

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

// Load Branch End *@


// Load Year Start *@

async function Onload_year() {
    ddyear = $("#dd_year");
    ddyear.empty();

    var strkey = "0";
    if (localStorage.getItem(apiUrl_HD) != null) { strkey = localStorage.getItem(apiUrl_HD); }


    await $.ajax({
        url: ApiForm + '/LOVServices/GetFinancialYear',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        success: function (response) {
            if (response.statusCode == 200) {
                for (var i = 0; i < response["data"].length; i++) {
                    //productItem02 = '<option value="' + response["data"][i]["id"] + '?' + response["data"][i]["startDate"] + '?' + response["data"][i]["endDate"] + '?' + response["data"][i]["active"] + '">' + response["data"][i]["yearName"] + '</option>';
                    productItem02 = '<option value="' + response["data"][i]["id"] + '">' + response["data"][i]["name"] + '</option>';
                    ddyear.append(productItem02);
                }


            }
            else {
                alert(response.message);
            }


        },
        error: function (xhr, status, err) {
            imgload.hide();
            Swal.fire({
                title: xhr.status.toString() + ' ' + err.toString(),

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

// Load Year End *@

$("#txtusername").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#txtuserpassword").focus();
    }
});
$("#txtuserpassword").keyup(function (e) {
    if (e.keyCode === 13) {
        Login();
    }
});
$("#dd_branch").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#dd_year").focus();
    }
});
$("#dd_year").keyup(function (e) {
    if (e.keyCode === 13) {
        Login_next();
    }
});

