var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);
var _menuid = urlParams.get('M');
var ApiForm = '';

var txtdatfrom = $("#txt_dat_frm");
var txtdateto = $("#txtdate_to");
var txtdatason = $("#txt_dat_ason");


var div_salesman = $("#div_salesman");
var div_dateason = $("#div_dateason");
var div_datefromto = $("#div_datefromto");
var div_no = $("#div_no");
var div_customer = $("#div_customer");
var div_item = $("#div_item");
var div_reporttype = $("#div_reporttype");

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
    var _salesQuotaion = $("#salesQuotaion");
    var _costSheet = $("#costSheet");
    var _saleorder = $("#saleorder");
    var _dc = $("#dc");
    var _invoice = $("#invoice");
    var _receipt = $("#receipt");
    var _creditNote = $("#creditnote");
    var _Aging = $("#aging");


    _salesQuotaion.hide();
    _costSheet.hide();
    _saleorder.hide();
    _dc.hide();
    _invoice.hide();
    _receipt.hide();
    _creditNote.hide();
    _Aging.hide();

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
                    //Quotation
                    if (response["data"][men_cnt]["menuName"] == 'QuotationReport') {
                        _salesQuotaion.show();
                    }
                    //Cost Sheet
                    else if (response["data"][men_cnt]["menuName"] == 'CostSheetReport') {
                        _costSheet.show();
                    }
                    //Sale Order
                    else if (response["data"][men_cnt]["menuName"] == 'SaleOrderReport') {
                        _saleorder.show();
                    }
                    //Delivery Challan
                    else if (response["data"][men_cnt]["menuName"] == 'DeliveryChallanReport') {
                        _dc.show();
                    }
                    //Invoice
                    else if (response["data"][men_cnt]["menuName"] == 'InvoiceReport') {
                        _invoice.show();
                    }
                    //Receipt
                    else if (response["data"][men_cnt]["menuName"] == 'ReceiptReport') {
                        _receipt.show();
                    }
                    //Credit Note
                    else if (response["data"][men_cnt]["menuName"] == 'CreditNoteReport') {
                        _creditNote.show();
                    }
                    //Aging
                    else if (response["data"][men_cnt]["menuName"] == 'AgingReport') {
                        _Aging.show();
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
        fillSalesman() //Fill Select 2 of Salesman
        FillBrand();   //Fill Select 2 of Brand
        FillItem();    //Fill Select 2 of Item
        FillItemCategory(); //Fill Select 2 of ItemCategory
        FillItemSubCategory();//Fill Select 2 of ItemSubCategory
        FillCustomer();  //Fill Select 2 of Customer
        FillCustomerCategory();  //Fill Select 2 of Customer Category
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Brand
function FillBrand() {
    $("#txt_brand").select2({
        placeholder: "Search Brand",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetBrand',
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
//Item Category
function FillItemCategory() {
    $("#txt_itemCategory").select2({
        placeholder: "Search Item Category",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemCatgory',
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
        //     var data = { "id": _ItemCat_Id, "text": _ItemCat_Name };
        //     callback(data);
        // },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Item SubCategory
function FillItemSubCategory() {
    $("#txt_itemSubCategory").select2({
        placeholder: "Search Item Sub-Category",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemSubCatgory',
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
        //     var data = { "id": _ItemSubCat_Id, "text": _ItemSubCat_Name };
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
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetCustomerBySalesman',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_id", $('#txt_slsman').select2('data').id);
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

//Customer Category
function FillCustomerCategory() {
    $("#txt_customerCategory").select2({
        placeholder: "Search Customer-Category",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetCustomerCategories',
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
        //     var data = { "id": _CustomerCat_Id, "text": _CustomerCat_Name };
        //     callback(data);
        // },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Salesman Start
function fillSalesman() {
    $("#txt_slsman").select2({
        placeholder: "Search for a salesman",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetSalesman',
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
        // initSelection: function (element, callback) {
        //     var data = { "id": _salesman_id, "text": _salesman_nam };
        //     callback(data);
        // },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Salesman End

function discon(_reportid) {

    div_salesman.hide();
    div_dateason.hide();
    div_datefromto.hide();
    div_no.hide();
    div_customer.hide();
    div_item.hide();
    div_reporttype.hide();

    $("#lbl_customerPo").show();
    $("#txt_customerpono").show();

    imgload.hide();
    creheading.html('');
    reportid.value = '';

    $("#ddl_reporttype").html("")
    var ddlreportType = document.getElementById("ddl_reporttype");

    var option1 = document.createElement('OPTION');
    option1.innerHTML = "Summary";
    option1.value = "S";
    ddlreportType.add(option1);

    var option2 = document.createElement('OPTION');
    option2.innerHTML = "Detail";
    option2.value = "D";
    ddlreportType.add(option2);



    reportid.value = _reportid;

    if (reportid.value == '1') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        div_reporttype.show();
        $("#lbl_customerPo").hide();
        $("#txt_customerpono").hide();

        creheading.html($('#salesQuotaion').html().toUpperCase());

    }

    else if (reportid.value == '2') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#costSheet').html().toUpperCase());
    }
    else if (reportid.value == '3') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        div_reporttype.show();
        creheading.html($('#saleorder').html().toUpperCase());

    }
    else if (reportid.value == '4') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        div_reporttype.show();
        creheading.html($('#dc').html().toUpperCase());

    }
    else if (reportid.value == '5') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        div_reporttype.show();
        creheading.html($('#invoice').html().toUpperCase());

    }
    else if (reportid.value == '6') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#receipt').html().toUpperCase());

    }

    else if (reportid.value == '7') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_customer.show();
        div_item.show();
        creheading.html($('#creditnote').html().toUpperCase());

    }
    else if (reportid.value == '8') {
        div_salesman.show();
        div_dateason.show();
        div_customer.show();
        creheading.html($('#aging').html().toUpperCase());

    }



}

//View Start
$(document).on("click", '#btn_view', function () {

    var _dateFrom = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
    var _dateTo = moment(txtdateto.find("input").val()).format("YYYY-MM-DD");
    var _dateason = moment(txtdatason.find("input").val()).format("YYYY-MM-DD");
    var ddlreportType = $("#ddl_reporttype");

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
    var _no = "", _customerpono = "", _salesmanId = "", _customerId = "", _customerCategoryId = "", _brandId = "", _itemId = "", _itemCategoryId = "", _itemSubCategoryId = "";
    if ($("#txt_slsman").select2('data') == null && reportid.value != '8') {
        Swal.fire({
            title: "Salesman not found",

            icon: 'error',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return;
    }

    if ($("#txt_slsman").select2('data') != null) { _salesmanId = $("#txt_slsman").val(); }
    if ($("#txt_no").val != '') { _no = $("#txt_no").val(); }
    if ($("#txt_customerpono").val != '') { _customerpono = $("#txt_customerpono").val(); }
    if ($("#txt_customer").select2('data') != null) { _customerId = $("#txt_customer").select2('data').id; }
    if ($("#txt_customerCategory").select2('data') != null) { _customerCategoryId = $("#txt_customerCategory").select2('data').id; }
    if ($("#txt_brand").select2('data') != null) { _brandId = $("#txt_brand").select2('data').id; }
    if ($("#txt_item").select2('data') != null) { _itemId = $("#txt_item").select2('data').id; }
    if ($("#txt_itemCategory").select2('data') != null) { _itemCategoryId = $("#txt_itemCategory").select2('data').id; }
    if ($("#txt_itemSubCategory").select2('data') != null) { _itemSubCategoryId = $("#txt_itemSubCategory").select2('data').id; }




    var viewreport_url = '';
    //Click Single Day of Attandance Start


    //Click Quotation Report
    if (reportid.value == '1') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '", "dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);

        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Sales/Report/QuotationReport?S=' + sessid;
        }
        else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Sales/Report/QuotationSummaryReport?S=' + sessid;

        }
    }
    //Click CostSheet Start
    if (reportid.value == '2') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '","dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Sales/Report/CostSheetReport?S=' + sessid;
    }

    //Click SaleOrderReport Start
    if (reportid.value == '3') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '","dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","customerpono":"' + _customerpono + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Sales/Report/SaleOrderReport?S=' + sessid;
        }
        else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Sales/Report/SaleOrderSummaryReport?S=' + sessid;
        }
    }
    //Click DeliveryChallan Start
    if (reportid.value == '4') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '","dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","customerpono":"' + _customerpono + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Sales/Report/DCReport?S=' + sessid;
        }
        else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Sales/Report/DCSummaryReport?S=' + sessid;
        }
    }

    //Click Inovice Start
    if (reportid.value == '5') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '","dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","customerpono":"' + _customerpono + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Sales/Report/InvoiceReport?S=' + sessid;
        }
        else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Sales/Report/InvoiceSummaryReport?S=' + sessid;
        }
    }
    //Click Receipt Start
    if (reportid.value == '6') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '","dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","customerpono":"' + _customerpono + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Sales/Report/ReceiptReport?S=' + sessid;
    }
    //Click Credit Note Start
    if (reportid.value == '7') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '","dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","customerpono":"' + _customerpono + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Sales/Report/CreditNoteReport?S=' + sessid;
    }
    //Click Aging Start
    if (reportid.value == '8') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"employeeId":"' + _salesmanId + '","dateFrom": "' + _dateason + '","dateTo":"' + _dateason + '","no":"' + _no + '","customerpono":"' + _customerpono + '","customerId":"' + _customerId + '","customerCatId":"' + _customerCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Sales/Report/AgingReport?S=' + sessid;
    }


    window.open(viewreport_url, '_blank');

});
//View End

