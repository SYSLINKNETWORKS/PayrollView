var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);
var _menuid = urlParams.get('M');
var ApiForm = '';


var div_dateason = $("#div_dateason");
var div_common = $("#div_common");
var div_datefromto = $("#div_datefromto");
var div_status = $("#div_status");
var div_no = $("#div_no");
var div_customer = $("#div_customer");
var div_item = $("#div_item");

var ddlstatus = $("#ddl_status");
var txtno = $("#txt_no");
var txtsono = $("#txt_sono");
var txtcustomer = $("#txt_customer");
var txtitem = $("#txt_item")

var txtdatfrom = $("#txt_dat_frm");
var txtdateto = $("#txtdate_to");
var txtdatason = $("#txt_dat_ason");

var creheading = $("#creheading");
var imgload = $("#img_load");
var reportid = $("#reportid");

$(function () {
    txtdatason.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdateto.datetimepicker({ format: 'DD/MMM/YYYY' });

});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Production';
    discon(0);
    reportpermission();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdatason.find("input").val(CurrentDate);
    txtdatfrom.find("input").val(CurrentDate);
    txtdateto.find("input").val(CurrentDate);
    ComponentsDropdowns.init();
});

function reportpermission() {
    var _JoborderProduction = $("#JoborderProduction");
    var _PrintinghourlyProduction = $("#PrintinghourlyProduction");
    var _laminationhourlyProduction = $("#laminationhourlyProduction");
    var _UvhourlyProduction = $("#UvhourlyProduction");
    var _foilinghourlyProduction = $("#foilinghourlyProduction");
    var _diecuttinghourlyProduction = $("#diecuttinghourlyProduction");
    var _PastinghourlyProduction = $("#PastinghourlyProduction");
    var _eyelethourlyProduction = $("#eyelethourlyProduction");
    var _SublethourlyProduction = $("#SublethourlyProduction");
    var _PackinghourlyProduction = $("#PackinghourlyProduction");
    var _Requisition = $("#Requisition");
    var _Issuance = $("#Issuance");


    _JoborderProduction.hide();
    _PrintinghourlyProduction.hide();
    _laminationhourlyProduction.hide();
    _UvhourlyProduction.hide();
    _foilinghourlyProduction.hide();
    _diecuttinghourlyProduction.hide();
    _PastinghourlyProduction.hide();
    _eyelethourlyProduction.hide();
    _SublethourlyProduction.hide();
    _PackinghourlyProduction.hide();
    _Requisition.hide();
    _Issuance.hide();

    $.ajax({
        url: apiUrl + '/api/Auth/v1/GetMenu/GetReportMenu',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                imgload.hide();

                for (var men_cnt = 0; men_cnt < response["data"].length; men_cnt++) {
                    //Joborder
                    if (response["data"][men_cnt]["menuName"] == 'JoborderReport') {
                        _JoborderProduction.show();
                    }
                    //Printing
                    else if (response["data"][men_cnt]["menuName"] == 'PrintingReport') {
                        _PrintinghourlyProduction.show();
                    }
                    //Lamination
                    else if (response["data"][men_cnt]["menuName"] == 'LaminationReport') {
                        _laminationhourlyProduction.show();
                    }
                    //UV
                    else if (response["data"][men_cnt]["menuName"] == 'UVReport') {
                        _UvhourlyProduction.show();
                    }
                    //Foiling
                    else if (response["data"][men_cnt]["menuName"] == 'FoilingReport') {
                        _foilinghourlyProduction.show();
                    }
                    //Diecutting
                    else if (response["data"][men_cnt]["menuName"] == 'DiecuttingReport') {
                        _diecuttinghourlyProduction.show();
                    }
                    //Pasting
                    else if (response["data"][men_cnt]["menuName"] == 'PastingReport') {
                        _PastinghourlyProduction.show();
                    }
                    //Eyelet
                    else if (response["data"][men_cnt]["menuName"] == 'EyeletReport') {
                        _eyelethourlyProduction.show();
                    }
                    //Sublet
                    else if (response["data"][men_cnt]["menuName"] == 'SubletReport') {
                        _SublethourlyProduction.show();
                    }
                    //Packing
                    else if (response["data"][men_cnt]["menuName"] == 'PackingReport') {
                        _PackinghourlyProduction.show();
                    }
                    //Reqisition
                    else if (response["data"][men_cnt]["menuName"] == 'Requisition') {
                        _Requisition.show();
                    }
                    //Issuance
                    else if (response["data"][men_cnt]["menuName"] == 'Issuance') {
                        _Issuance.show();
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




function discon(_reportid) {
    div_datefromto.hide();
    div_dateason.hide();
    div_status.hide();
    div_no.hide();
    div_customer.hide();
    div_item.hide();



    imgload.hide();
    creheading.html('');
    reportid.value = '';


    reportid.value = _reportid;


    if (reportid.value == '1') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#diecuttinghourlyProduction').html().toUpperCase());

    }
    if (reportid.value == '2') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#eyelethourlyProduction').html().toUpperCase());
    }
    if (reportid.value == '3') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#foilinghourlyProduction').html().toUpperCase());
    }

    if (reportid.value == '4') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#laminationhourlyProduction').html().toUpperCase());
    }
    if (reportid.value == '5') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#PackinghourlyProduction').html().toUpperCase());
    }
    if (reportid.value == '6') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#PastinghourlyProduction').html().toUpperCase());
    }
    if (reportid.value == '7') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#PrintinghourlyProduction').html().toUpperCase());
    }
    if (reportid.value == '8') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#SublethourlyProduction').html().toUpperCase());
    }
    if (reportid.value == '9') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#UvhourlyProduction').html().toUpperCase());
    }
    if (reportid.value == '10') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#JoborderProduction').html().toUpperCase())
    }

    if (reportid.value == '11') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#Requisition').html().toUpperCase())
    }
    if (reportid.value == '12') {
        div_datefromto.show();
        div_status.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#Issuance').html().toUpperCase())
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




    var viewreport_url = '';
    //Click Single Day of Attandance Start


    //Click Die-Cutting Production Hour Start
    if (reportid.value == '1') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/DiecuttingHourlyProduction?S=' + sessid;
    }


    //Click Eyelet Production Hour Start
    else if (reportid.value == '2') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/EyeletHourlyProduction?S=' + sessid;
    }

    //Click Foiling Production Hour Start

    else if (reportid.value == '3') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/FoilingHourlyProduction?S=' + sessid;
    }

    //Click Foiling Production Hour Start

    else if (reportid.value == '4') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/LaminationHourlyProduction?S=' + sessid;
    }

    else if (reportid.value == '5') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/PackingHourlyProduction?S=' + sessid;
    }

    else if (reportid.value == '6') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/PastingHourlyProduction?S=' + sessid;
    }

    else if (reportid.value == '7') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/PrintingHourlyProduction?S=' + sessid;
    }
    else if (reportid.value == '8') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //      cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/SubletHourlyProduction?S=' + sessid;
    }

    else if (reportid.value == '9') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        //        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '"}';
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/UVHourlyProduction?S=' + sessid;
    }

    else if (reportid.value == '10') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/JobOrderProduction?S=' + sessid;
    }
    else if (reportid.value == '11') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/RequisitionReport?S=' + sessid;
    }
    else if (reportid.value == '12') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","status":"' + ddlstatus.val() + '","no":"' + txtno.val() + '","saleOrderNo":"' + txtsono.val() + '","customerId":"' + txtcustomer.val() + '","itemId":"' + txtitem.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Production/Report/IssuanceReport?S=' + sessid;
    }

    if (viewreport_url == '') {
        Swal.fire({
            title: "Report not found",

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

    window.open(viewreport_url, '_blank');

});
//View End

var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillItem();    //Fill Select 2 of Item
        FillCustomer();  //Fill Select 2 of Customer
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Item
function FillItem() {
    $("#txt_item").select2({
        placeholder: "Search Item",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemSO',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CustomerId", $('#txt_customer').select2('data').id);
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
//Customer
function FillCustomer() {
    $("#txt_customer").select2({
        placeholder: "Search Customer",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetCustomer',
            type: "Get",
            dataType: 'json',
            delay: 250,
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
        //     var data = { "id": _Customer_Id, "text": _Customer_Name };
        //     callback(data);
        // },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
