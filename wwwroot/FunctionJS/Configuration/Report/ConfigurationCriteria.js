var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);
var _MenuID = urlParams.get('M');
var ApiForm = '';

var txtdatfrom = $("#txt_dat_frm");
var txtdateto = $("#txtdate_to");
var txtdatason = $("#txt_dat_ason");


var div_dateason = $("#div_dateason");
var div_datefromto = $("#div_datefromto");
var div_valueConfiguration = $("#div_valueConfiguration");
var div_userConfiguration = $("#div_userConfiguration");
var div_actionConfiguration = $("#div_actionConfiguration");
var div_menuConfiguration = $("#div_menuConfiguration");

var creheading = $("#creheading");
var imgload = $("#img_load");
var reportid = $("#reportid");

$(function () {
    txtdatason.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdateto.datetimepicker({ format: 'DD/MMM/YYYY' });

});

$(document).ready(function () {
    ApiForm = apiUrl + '/api';

    discon(0);
    reportpermission();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdatason.find("input").val(CurrentDate);
    txtdatfrom.find("input").val(CurrentDate);
    txtdateto.find("input").val(CurrentDate);
    ComponentsDropdowns.init();
});

function reportpermission() {
    var _audit = $("#Audit");


    _audit.hide();

    $.ajax({
        url: apiUrl + '/api/Auth/v1/GetMenu/GetReportMenu',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _MenuID);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                imgload.hide();
                for (var men_cnt = 0; men_cnt < response["data"].length; men_cnt++) {
                    //Audit
                    if (response["data"][men_cnt]["menuName"] == 'AuditReport') {
                        _audit.show();
                    }


                }

            }
            else {
                imgload.hide();
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

}
//#region select 2
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillUser();
        FillAction();
        FillMenu();
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

function FillUser() {
    $("#txt_user").select2({
        placeholder: "Search User",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Log/v1/LOV/GetAuditUser',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {
                        myResults.push({
                            id: item.id,
                            text: item.name,
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },

            cache: true
        },
        // initSelection: function (element, callback) {
        //     var data = { "id": _Brand_Id, "text": _Brand_Name };
        //     callback(data);
        // },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

function FillAction() {
    $("#txt_action").select2({
        placeholder: "Search Action",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Log/v1/LOV/GetAuditAction',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {
                        myResults.push({
                            id: item.id,
                            text: item.name,
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },

            cache: true
        },
        // initSelection: function (element, callback) {
        //     var data = { "id": _Brand_Id, "text": _Brand_Name };
        //     callback(data);
        // },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
function FillMenu() {
    $("#txt_menu").select2({
        placeholder: "Search Menu",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Log/v1/LOV/GetAuditMenu',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    //request.setRequestHeader("CustomerId", $('#txt_supplier').select2('data').id);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {
                        myResults.push({
                            id: item.id,
                            text: item.name,
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },

            cache: true
        },
        // initSelection: function (element, callback) {
        //     var data = { "id": _Item_Id, "text": _Item_Name };
        //     callback(data);
        // },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}


function discon(_reportid) {

    div_dateason.hide();
    div_datefromto.hide();
    div_userConfiguration.hide();
    div_actionConfiguration.hide();
    div_menuConfiguration.hide();
    div_valueConfiguration.hide();


    imgload.hide();
    creheading.html('');
    reportid.value = '';



    reportid.value = _reportid;

    $("#ddl_reporttype").html("")
    var ddlreportType = document.getElementById("ddl_reporttype");


    //Audit
    if (reportid.value == '1') {
        div_datefromto.show();
        div_userConfiguration.show();
        div_actionConfiguration.show();
        div_menuConfiguration.show();
        div_valueConfiguration.show();

        creheading.html($('#Audit').html().toUpperCase());

    }



}

//View Start
$(document).on("click", '#btn_view', function () {

    var _dateFrom = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
    var _dateTo = moment(txtdateto.find("input").val()).format("YYYY-MM-DD");

    if (reportid.value == '') {
        Swal.fire({
            title: "Report not selected",

            icon: 'error',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        });

        return;
    }
    var cre = "";
    var _user = "", _menu = "", _action = "", _newvalue = "", _oldvalue = "";

    if ($("#txt_user").select2('data') != null) { _user = $("#txt_user").select2('data').id; }
    if ($("#txt_menu").select2('data') != null) { _menu = $("#txt_menu").select2('data').id; }
    if ($("#txt_action").select2('data') != null) { _action = $("#txt_action").select2('data').id; }
    if ($("#txt_newvalue").val != '') { _newvalue = $("#txt_newvalue").val(); }
    if ($("#txt_oldvalue").val != '') { _oldvalue = $("#txt_oldvalue").val(); }




    var viewreport_url = '';

    //Click Audit Report 
    if (reportid.value == '1') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{ "dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","newvalue":"' + _newvalue + '","oldvalue":"' + _oldvalue + '","username":"' + _user + '","actionName":"' + _action + '","menuAlias":"' + _menu + '","menuId":"' + _MenuID + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Configuration/Report/AuditReport?S=' + sessid;
    }

    window.open(viewreport_url, '_blank');

});



//View End

