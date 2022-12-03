var alertcnt = 0, titlecnt = 0;
var lbltitle = $("#lbl_title");
var title = '';
var strkey = "";
var apiUrl_View =window.location.origin

jQuery(document).ready(function () {
    if (localStorage.getItem(apiUrl_HD) != null) { strkey = localStorage.getItem(apiUrl_HD); }
    fillMenu();
    startTime();
    Metronic.init(); // init metronic core componets
    Layout.init(); // init layout
    Demo.init(); // init demo features
    // Index.init(); // init index page
    checkinternetspeed();
    Tasks.initDashboardWidget(); // init tash dashboard widget

});
function spanchangecolor() {
    $('#spn_alert_master').css("background", "gray");
    lbltitle.html(title);
    titlecnt = 0;
};
//Timing Start
function startTime() {
    var today = new Date();
    $("#ClockTime").html(
        "Date: " + moment(today).format("DD-MMM-YYYY") + " Time : " + moment(today).format("HH:mm:ss"));
    var t = setTimeout(startTime, 500);
}
//Time End
//logout Start
async function logout_func() {
    // var dataip = "_";// localStorage.getItem(12);
    // await $.getJSON("https://jsonip.com?callback=?", function (data) {
    //     dataip = data.ip;
    // });
    $.ajax({
        url: apiUrl + '/api/Auth/v1/Auth/LogoutUser',
        type: "Get",
        cache: false,
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        success: function (response) {
            if (response.statusCode == 200) {
                localStorage.clear();
                window.location.assign(apiUrl_View + '/login');

            }
            else {
                alert(response[0].Remarks);
                console.log(response[0].Remarks);
            }
        },
        error: function (error) {
            console.log('Error ${error}')
        }
    });
}
//Logout End

function ChangePassword_modal() {
    $('#changepassword_data_Modal').modal('show');
}

//Change Password Start
function ChangePassword_func() {
    var ck = ckvalidationPassword();
    var ckval = ck.ckval;
    var _cre = ck.creteria;
    if (ckval == 1) { return; }
    var txtnpwd = $("#txt_npwd").val();
    $.ajax({
        url: apiUrl + '/api/Auth/v1/Auth/ResetPassword',
        type: "Put",
        cache: false,
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        //  data: JSON.stringify({ "Token": strkey, "UserPassword": txtopwd, "NewPassword": txtcpwd }),
        success: function (response) {

            if (response.statusCode == 200) {
                $('#changepassword_data_Modal').modal('hide');
                Swal.fire({
                    title: "Password Change",

                    icon: 'success',
                    showConfirmButton: true,

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                })
            }
            else {
                var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
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
        },
        error: function (xhr, status, err) {
            Swal.fire({
                title: xhr.status.toString() + ' ' + err.toString(),

                icon: 'error',
                showConfirmButton: true,

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }

            })
        }
    });
    //});


}
//Change Password End

function fillMenu() {

    $("#div_menu_demo").empty();
    $.ajax({
        url: apiUrl + '/api/Auth/v1/GetMenu',
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + strkey
        },
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response.statusCode == 200) {

                $('#lbl_company_name').html((response["data"]["branchName"]).toUpperCase());
                $("#lbl_year").html(response["data"]["fiscalYear"]);
                $("#lbl_title").html('MMC');
                $("#userName").html(response["data"]["userName"]);
                // $("#lbl_ver").html('<i class="icon-handbag"></i>' + response["data"]["version"] + ' E');
                const menu_1 = response["data"]["getMenuUserWises"];//.filter(d => d.men_view == true && d.per_view == true);
                var moduleid = [];
                for (i = 0; i < menu_1.length; i++) {
                    if (moduleid.findIndex(x => x._id == menu_1[i].moduleId) == -1) {
                        moduleid.push({ _id: menu_1[i].moduleId, _nam: menu_1[i].moduleName, _icon: menu_1[i].moduleIcon });
                    }
                }
                moduleid.sort((a, b) => (a._id > b._id) ? 1 : -1);
                for (var m1_cnt = 0; m1_cnt < moduleid.length; m1_cnt++) {
                    var M1_ID = "M1" + moduleid[m1_cnt]._id;// menu_1[m1_cnt]["module_id"];
                    $("#div_menu_demo").append(
                        '<li id="' + M1_ID + '"><a href="javascript:;"><i class="' + moduleid[m1_cnt]._icon + '"></i><span class="title">' + moduleid[m1_cnt]._nam + '</span><span class="arrow "></span></a>');
                    AddMasterMenu(response, M1_ID, moduleid[m1_cnt]._id);
                    $("#div_menu_demo").append('</li>');
                }
            }
            else {
                localStorage.setItem(apiUrl_HD, "");
                window.location.assign(apiUrl_View + '/login');
            }
        },
        error: function (xhr, status, err) {
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
            if (xhr.status == 401) {
                window.location.assign(apiUrl_View + '/login');
            }

        }
    })
}
function AddMasterMenu(response, M1_ID, moduleid) {
    const menu_2 = response["data"]["getMenuUserWises"].filter(d => d.moduleId == moduleid && d.menuCategoryId != '');//&& d.men_view == true && d.per_view == true && d.menumaster_id > 0);

    var menumaster = [];
    for (i = 0; i < menu_2.length; i++) {
        if (menumaster.findIndex(x => x._id == menu_2[i].menuSubCategoryId) == -1) {
            menumaster.push({ _id: menu_2[i].menuSubCategoryId, _nam: menu_2[i].menuSubCategoryName, _icon: menu_2[i].menuSubCategoryIcon, _module_id: menu_2[i].moduleId });
        }
    }
    menumaster.sort((a, b) => (a._id > b._id) ? 1 : -1);

    var M2_ID = "M2" + M1_ID;
    $("#" + M1_ID).append('<ul id="' + M2_ID + '" class="sub-menu">');
    for (var m2_cnt = 0; m2_cnt < menumaster.length; m2_cnt++) {
        var M3_ID = "M2" + menumaster[m2_cnt]._module_id + menumaster[m2_cnt]._id;
        $("#" + M2_ID).append('<li id="' + M3_ID + '"><a href="javascript:;"><i class="' + menumaster[m2_cnt]._icon + '"></i><span class="title">' + menumaster[m2_cnt]._nam + '</span><span class="arrow "></span></a></li>');
        AddChildItems(response, M3_ID, menumaster[m2_cnt]._module_id, menumaster[m2_cnt]._id)
    }
    $("#" + M1_ID).append('</ul>');
}

function AddChildItems(response, M3_ID, _module_id, _menumaster_id) {
    const menu_3 = response["data"]["getMenuUserWises"].filter(d => d.moduleId == _module_id && d.menuSubCategoryId == _menumaster_id);//&& d.men_nam != null && d.men_view == true && d.per_view == true);

    var menu3 = [];
    for (i = 0; i < menu_3.length; i++) {
        if (menu3.findIndex(x => x._menuAlias == menu_3[i].menuAlias) == -1) {
            menu3.push({ _menuAlias: menu_3[i].menuAlias, _menuUrl: menu_3[i].menuUrl });
        }
    }
    menu3.sort((a, b) => (a._menuAlias > b._menuAlias) ? 1 : -1);

    var S1_ID = "S1" + M3_ID + "-M" + _module_id + "-MM" + _menumaster_id;
    $("#" + M3_ID).append('<ul id="' + S1_ID + '" class="sub-menu">');
    //    for (var m3_cnt = 0; m3_cnt < menu_3.length; m3_cnt++) {
    for (var m3_cnt = 0; m3_cnt < menu3.length; m3_cnt++) {
        $("#" + S1_ID).append('<li><a href="' + apiUrl_View + '/' + menu3[m3_cnt]["_menuUrl"] + '">' + menu3[m3_cnt]["_menuAlias"] + '</a></li>');
    }
    $("#" + M3_ID).append('</ul>');

}

function checkinternetspeed() {
    var arrTimes = [];
    var i = 0; // start
    var timesToTest = 5;
    var tThreshold = 300;//150; //ms
    var testImage = apiUrl_View + "/images/speed/px.gif";//  "http://www.google.com/images/phd/px.gif"; // small image in your server
    var dummyImage = new Image();
    var isConnectedFast = false;

    testLatency(function (avg) {
        isConnectedFast = (avg <= tThreshold);
        /** output */
        document.body.appendChild(
            document.createTextNode("Time: " + (avg.toFixed(2)) + "ms - isConnectedFast? " + isConnectedFast)
        );
    });

    /** test and average time took to download image from server, called recursively timesToTest times */
    function testLatency(cb) {
        var tStart = new Date().getTime();
        if (i < timesToTest - 1) {
            dummyImage.src = testImage + '?t=' + tStart;
            dummyImage.onload = function () {
                var tEnd = new Date().getTime();
                var tTimeTook = tEnd - tStart;
                arrTimes[i] = tTimeTook;
                testLatency(cb);
                i++;
            };
        } else {
            /** calculate average of array items then callback */
            var sum = arrTimes.reduce(function (a, b) { return a + b; });
            var avg = sum / arrTimes.length;
            cb(avg);
        }
    }
}
//Web Notification Start
function showWebNotification(_msgDateTime, _msg) {
    const notification = new Notification(_msgDateTime, { body: _msg });
    // notification.onclick = (e) => { window.location.href = "https://www.google.com"; };
}
//Web Notification End

function CallSocket() {
    //Socket Start

    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl_Notification + "/notificationMessageHub").build();
    connection.on("ReceiveNotificationMessage", function (topic, _DateTime, customerId, customerName, messageCategory, message) {
        //var encodedMsg = topic + " : DateTime " + _DateTime + " :  Customer Id : " + customerId + " Customer Name : " + customerName + " Message Category " + messageCategory + " Message " + message;
        if (topic == apiUrl_NotificationCompany) {
            if (messageCategory == "Attendance") {

                var msg = message;
                var msgDateTime = moment(_DateTime).format('LT');
                alertcnt += 1;
                titlecnt += 1;
                var ulmsgmaster = $('#ul_msg_master ul');
                var ulmsgmaster_old = ulmsgmaster.html();
                ulmsgmaster.empty();
                ulmsgmaster.append(
                    '<li>' +
                    '<a href="javascript:;">' +
                    '<span class="time">' + msgDateTime + '</span>' +
                    '<span class="details">' +
                    msg +
                    '</span>' +
                    '</a>' +
                    '</li>'
                );
                ulmsgmaster.append(ulmsgmaster_old);
                $('#spn_alert_master').html(alertcnt);
                $('#spn_alert_master').css("background", "red");
                lbltitle.html('(' + titlecnt + ')' + title);


                //Web Notification Start
                if (Notification.permission === "granted") {
                    showWebNotification(msgDateTime, msg);
                }
                else if (Notification.permission !== "denied") {

                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") { showWebNotification(); }
                    });
                }    //Web Notification End
            }
        }
    });
    connection.start().then(function () {
    }).catch(function (err) {
        return console.error(err.toString());
    });
}

function Passvalidation() {

    var pass = 0, _ErrorPass = '';
    var password = $("#txt_npwd");
    var ConfPass = $("#txt_cpwd");
    var passpattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;


    if (password.val() == '') {
        pass = 1;
        _ErrorPass = 'Please Enter Password ';
        password.focus();
    }
    else if (ConfPass.val() == '') {
        pass = 1;
        _ErrorPass = 'Please Enter Confirm Password ';
        ConfPass.focus();
    }
    else if (password.val() != ConfPass.val()) {
        pass = 1;
        _ErrorPass = 'Password and Confirm Password is not matched';
        password.focus();
    }
    else if (!password.val().match(passpattern) && !ConfPass.val().match(passpattern)) {
        pass = 1
        _ErrorPass = '"Password Must contain at least one number and one uppercase and lowercase letter, and Minimum 8 characters" ';
        ConfPass.focus();
    }

    if (Boolean(pass)) {
        Swal.fire({
            title: _ErrorPass,
            icon: 'error'
        })

    }
    return { ckvalpass: pass };

}
function ckvalidationPassword() {
    var ck = 0, _Error = '', _cre = '';
    var txtopwd = $("#txt_opwd");
    var txtnpwd = $("#txt_npwd");
    var txtcpwd = $("#txt_cpwd");

    if (txtopwd.val() == '') {
        ck = 1;
        _Error = 'Please enter old password';
        txtopwd.focus();
    }

    else if (txtnpwd.val() == '') {
        ck = 1;
        _Error = 'Please enter new password';
        txtnpwd.focus();
    }

    else if (txtcpwd.val() == '') {
        ck = 1;
        _Error = 'Please enter confirm password';
        txt_cpwd.focus();
    }

    var _PasswordValidation = Passvalidation();
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (Boolean(_PasswordValidation.ckvalpass)) {
        ck = 1;
        return;
    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "oldPassword": txtopwd.val(),
            "password": txtnpwd.val(),

        })
    }

    return { ckval: ck, creteria: _cre };
}
function HealthCheck() {
    window.location.assign(apiUrl_View + '/HealthCheck');
}