var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);
var _menuid = urlParams.get('M');
var ApiForm = '';

var div_common = $("#div_common");
var divdatfrmto = $("#div_datefromto");
var divdatason = $("#div_dateason");

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
    ApiForm = apiUrl + '/api/Inventory/v1/';
    discon(0);
    reportpermission();

    ComponentsDropdowns.init();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdatason.find("input").val(CurrentDate);
    txtdatfrom.find("input").val(CurrentDate);
    txtdateto.find("input").val(CurrentDate);
});

function reportpermission() {
    var _OpeningStock = $("#OpeningStock");
    var _StockLedger = $("#StockLedger");
    var _StockLedgerValuation = $("#StockLedgerValuation");
    var _StockSummary = $("#StockSummary");
    var _StockSummaryValuation = $("#StockSummaryValuation");
    var _StockMovement = $("#StockMovement");
    var _StockRequisition = $("#StockRequisition");
    var _StockIssue = $("#StockIssue");


    _OpeningStock.hide();
    _StockLedger.hide();
    _StockLedgerValuation.hide();
    _StockSummary.hide();
    _StockSummaryValuation.hide();
    _StockMovement.hide();
    _StockRequisition.hide();
    _StockIssue.hide();

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
                    //Opening Stock
                    if (response["data"][men_cnt]["menuName"] == 'OpeningStock') {
                        _OpeningStock.show();
                    }
                    //StockLedger
                    else if (response["data"][men_cnt]["menuName"] == 'StockLedger') {
                        _StockLedger.show();
                    }
                    //StockLedgerValuation
                    else if (response["data"][men_cnt]["menuName"] == 'StockLedgerValuation') {
                        _StockLedgerValuation.show();
                    }
                    //StockSummary
                    else if (response["data"][men_cnt]["menuName"] == 'StockSummary') {
                        _StockSummary.show();
                    }
                    //StockSummaryValuation
                    else if (response["data"][men_cnt]["menuName"] == 'StockSummaryValuation') {
                        _StockSummaryValuation.show();
                    }
                    //StockMovement
                    else if (response["data"][men_cnt]["menuName"] == 'StockMovement') {
                        _StockMovement.show();
                    }
                    //Stock Requisition
                    else if (response["data"][men_cnt]["menuName"] == 'StockRequisition') {
                        _StockRequisition.show();
                    }
                    //Stock Issue
                    else if (response["data"][men_cnt]["menuName"] == 'StockIssue') {
                        _StockIssue.show();
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


var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        fillWarehouses();
        fillItemCategory();
        fillItemSubCategoryMaster();
        fillItemSubCategory();
        fillItemBrand();
        fillItem();

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();

//Warehouse Start
function fillWarehouses() {
    $("#txtwarehouse").select2({
        placeholder: "Search Warehouse",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetWarehouse',
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
                            text: item.name
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}


//Category Start
function fillItemCategory() {
    $("#txtItemCategory").select2({
        placeholder: "Search Category",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetItemCatgory',
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
                            text: item.name
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}


//Sub-Category Master Start
function fillItemSubCategoryMaster() {
    $("#txtItemSubCategoryMaster").select2({
        placeholder: "Search Sub-Category Master",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetItemSubCategoryMaster',
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
                            text: item.name
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

//Sub-Category  Start
function fillItemSubCategory() {
    $("#txtItemSubCategory").select2({
        placeholder: "Search Sub-Category",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetItemSubCatgory',
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
                            text: item.name
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Brand Start
function fillItemBrand() {
    $("#txtItemBrand").select2({
        placeholder: "Search Brand",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetBrand',
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
                            text: item.name
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

//Brand Start
function fillItem() {
    $("#txtItem").select2({
        placeholder: "Search Item",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetItem',
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
                            text: item.name
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}


function discon(_reportid) {

    $('#ddl_warehouse').val(null).trigger('change');
    $('#ddl_itmbrand').val(null).trigger('change');

    $('#ddl_itmhead').val(null).trigger('change');
    $('#ddl_itmtypepro').empty();
    $('#ddl_itmtypepro').val(null).trigger('change');
    $('#ddl_itmcatpro').empty();
    $('#ddl_itmcatpro').val(null).trigger('change');

    imgload.hide();
    creheading.html('');
    reportid.value = '';

    reportid.value = _reportid;


    divdatfrmto.hide();
    divdatason.hide();
    div_common.hide();

    //Opening Stock Start
    if (reportid.value == 1) {
        div_common.show();

        // $('#div_stkcat').hide();
        creheading.html($('#OpeningStock').html().toUpperCase());
    }
    //Opening Stock End

    //Stock Ledger Start
    else if ([2, 3, 7, 8].includes(reportid.value)) {
        divdatfrmto.show();
        div_common.show();
        if (reportid.value == 2) {
            creheading.html($('#StockLedger').html().toUpperCase());
        }
        else if (reportid.value == 3) {
            creheading.html($('#StockLedgerValuation').html().toUpperCase());
        }
        else if (reportid.value == 7) {
            creheading.html($('#StockRequisition').html().toUpperCase());
        }
        else if (reportid.value == 8) {
            creheading.html($('#StockIssue').html().toUpperCase());
        }

    }
    //Stock Ledger End

    //Stock Summary Start
    else if ([4, 5].includes(reportid.value)) {
        divdatason.show();
        div_common.show();
        if (reportid.value == 4) {
            creheading.html($('#StockSummary').html().toUpperCase());
        }
        else if (reportid.value == 5) {
            creheading.html($('#StockSummaryValuation').html().toUpperCase());
        }
    }
    //Stock Summary End

    //Stock Movement Start
    else if (reportid.value == 6) {
        divdatfrmto.show();
        div_common.show();
        creheading.html($('#StockMovement').html().toUpperCase());
    }
    //Stock Movement End
}

//View Start
$(document).on("click", '#btn_view', function () {

    var _dateFrom = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
    var _dateTo = moment(txtdateto.find("input").val()).format("YYYY-MM-DD");
    var _dateason = moment(txtdatason.find("input").val()).format("YYYY-MM-DD");

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

    var _warehouseId = "", _categoryId = "", _subcategorymasterId = "", _subcategoryId = "", _brandId = "", _itemId = "";
    if ($("#txtwarehouse").select2('data') != null) { _warehouseId = $("#txtwarehouse").select2('data').id; }
    if ($("#txtItemCategory").select2('data') != null) { _categoryId = $("#txtItemCategory").select2('data').id; }
    if ($("#txtItemSubCategoryMaster").val() != "1") { _subcategorymasterId = $("#txtItemSubCategoryMaster").val(); }
    if ($("#txtItemSubCategory").val() != "1") { _subcategoryId = $("#txtItemSubCategory").val(); }
    if ($("#txtItemBrand").select2('data') != null) { _brandId = $("#txtItemBrand").select2('data').id; }
    if ($("#txtItem").select2('data') != null) { _itemId = $("#txtItem").select2('data').id; }

    var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_date = "D" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");

    var cre = "";
    var cre_name = "";
    var viewreport_url = '';



    //Opening Inventory Start
    if (reportid.value == 1) {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","itemCategoryId":"' + _categoryId + '","itemSubCategoryMasterId":"' + _subcategorymasterId + '","itemSubCategoryId":"' + _subcategoryId + '","itemBrandId":"' + _brandId + '","itemId":"' + _itemId + '","warehouseID":"' + _warehouseId + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Inventory/Report/StockOpening?S=' + sessid;
    }
    //Opening Stock End

    //Stock Ledger Start
    else if ([2, 3].includes(reportid.value)) {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","itemCategoryId":"' + _categoryId + '","itemSubCategoryMasterId":"' + _subcategorymasterId + '","itemSubCategoryId":"' + _subcategoryId + '","itemBrandId":"' + _brandId + '","itemId":"' + _itemId + '","warehouseID":"' + _warehouseId + '"}';
        sessionStorage.setItem(sessid, cre);

        if (reportid.value == 2) {
            viewreport_url = apiUrl_View + '/Inventory/Report/StockLedger?S=' + sessid;
        }
        else if (reportid.value == 3) {
            viewreport_url = apiUrl_View + '/Inventory/Report/StockLedgerValuation?S=' + sessid;
        }
    }
    //Stock Ledger End

    //Stock Summary Start
    else if ([4, 5].includes(reportid.value)) {



        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateason + '","dateTo":"' + _dateason + '","itemCategoryId":"' + _categoryId + '","itemSubCategoryMasterId":"' + _subcategorymasterId + '","itemSubCategoryId":"' + _subcategoryId + '","itemBrandId":"' + _brandId + '","itemId":"' + _itemId + '","warehouseID":"' + _warehouseId + '"}';
        sessionStorage.setItem(sessid, cre);

        if (reportid.value == 4) {
            viewreport_url = apiUrl_View + '/Inventory/Report/StockSummary?S=' + sessid;
        }
        else if (reportid.value == 5) {
            viewreport_url = apiUrl_View + '/Inventory/Report/StockSummaryValuation?S=' + sessid;
        }
    }
    //Stock Summary End

    //Stock Movement Start
    else if (reportid.value == 6) {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","itemCategoryId":"' + _categoryId + '","itemSubCategoryMasterId":"' + _subcategorymasterId + '","itemSubCategoryId":"' + _subcategoryId + '","itemBrandId":"' + _brandId + '","itemId":"' + _itemId + '","warehouseID":"' + _warehouseId + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Inventory/Report/StockMovement?S=' + sessid;
    }
    //Stock Movement End

    //Stock Requisition / Issuance Start
    else if ([7,8].includes(reportid.value)) {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","itemCategoryId":"' + _categoryId + '","itemSubCategoryMasterId":"' + _subcategorymasterId + '","itemSubCategoryId":"' + _subcategoryId + '","itemBrandId":"' + _brandId + '","itemId":"' + _itemId + '","warehouseID":"' + _warehouseId + '"}';
        sessionStorage.setItem(sessid, cre);

        if (reportid.value == 7) {
            viewreport_url = apiUrl_View + '/Inventory/Report/StockRequisition?S=' + sessid;
        }
        else if (reportid.value == 8) {
            viewreport_url = apiUrl_View + '/Inventory/Report/StockIssuance?S=' + sessid;
        }
    }
    //Stock Ledger End

    window.open(viewreport_url, '_blank');

});
//View End

