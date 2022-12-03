var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);
var _MenuID = urlParams.get('M');
var ApiForm = '';

var txtdatfrom = $("#txt_dat_frm");
var txtdateto = $("#txtdate_to");
var txtdatason = $("#txt_dat_ason");


var div_supplier = $("#div_supplier");
var div_dateason = $("#div_dateason");
var div_datefromto = $("#div_datefromto");
var div_no = $("#div_no");
var div_item = $("#div_item");
var div_reporttype = $("#div_reporttype");
var div_processtype = $("#div_processtype");
var div_taxabletype = $("#div_taxabletype");

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
    var _purchaseSupplier = $("#purchaseSupplier");
    var _purchaseRequisition = $("#purchaseRequisition");
    var _PurchaseOrder = $("#PurchaseOrder");
    var _goodsreceivingNote = $("#goodsreceivingNote");
    var _PurchaseBill = $("#PurchaseBill");
    var _payment = $("#payment");
    var _debitnote = $("#debitnote");
    var _Aging = $("#aging");
    var _Suplier = $("#supplier");


    _purchaseSupplier.hide();
    _purchaseRequisition.hide();
    _PurchaseOrder.hide();
    _goodsreceivingNote.hide();
    _PurchaseBill.hide();
    _payment.hide();
    _debitnote.hide();
    _Aging.hide();
    // _Suplier.hide();

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
                    //Supplier
                    if (response["data"][men_cnt]["menuName"] == 'SupplierReport') {
                        _purchaseSupplier.show();
                    }
                    //Requistion
                    if (response["data"][men_cnt]["menuName"] == 'RequisitionReport') {
                        _purchaseRequisition.show();
                    }
                    //Purchase Order
                    else if (response["data"][men_cnt]["menuName"] == 'PurchaseOrderReport') {
                        _PurchaseOrder.show();
                    }
                    //GRN
                    else if (response["data"][men_cnt]["menuName"] == 'GRNReport') {
                        _goodsreceivingNote.show();
                    }

                    //Bill
                    else if (response["data"][men_cnt]["menuName"] == 'BillReport') {
                        _PurchaseBill.show();
                    }
                    //Payment
                    else if (response["data"][men_cnt]["menuName"] == 'PaymentReport') {
                        _payment.show();
                    }
                    //Debit Note
                    else if (response["data"][men_cnt]["menuName"] == 'DebitNoteReport') {
                        _debitnote.show();
                    }
                    //Aging
                    else if (response["data"][men_cnt]["menuName"] == 'AgingReport') {
                        _Aging.show();
                    }
                    //supplier
                    else if (response["data"][men_cnt]["menuName"] == 'SupplierReport') {
                        _Suplier.show();
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
        // fillSalesman() //Fill Select 2 of Salesman
        FillBrand();   //Fill Select 2 of Brand
        FillItem();    //Fill Select 2 of Item
        FillItemCategory(); //Fill Select 2 of ItemCategory
        FillItemSubCategory();//Fill Select 2 of ItemSubCategory
        FillSupplier();  //Fill Select 2 of Supplier
        FillSupplierCategory();  //Fill Select 2 of Supplier Category
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
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemExceptFinishGood',
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
//Supplier
function FillSupplier() {

    $("#txt_supplier").select2({
        placeholder: "Search Supplier",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Procurement/v1/LOVServicesPurchase/GetSuppliers',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    // request.setRequestHeader("_id", $('#txt_slsman').select2('data').id);
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

//Supplier Category
function FillSupplierCategory() {
    $("#txt_SupplierCategory").select2({
        placeholder: "Search Supplier-Category",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Procurement/v1/LOVServicesPurchase/GetSupplierCategories',
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
// function fillSalesman() {
//     $("#txt_slsman").select2({
//         placeholder: "Search for a salesman",
//         minimumInputLength: 0,
//         //triggerChange: true,
//         allowClear: true,
//         ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
//             url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetSalesman',
//             type: "Get",
//             dataType: 'json',
//             delay: 250,
//             transport: function (params) {
//                 params.beforeSend = function (request) {
//                     request.setRequestHeader("Authorization", 'Bearer ' + strkey);
//                 };
//                 return $.ajax(params);
//             }, data: function (term, page) {
//                 return {
//                     _srch: term, // search term                            
//                     page: page // page number
//                 };
//             },
//             results: function (data, page) { // parse the results into the format expected by Select2.
//                 // since we are using custom formatting functions we do not need to alter remote JSON data
//                 var myResults = [];
//                 if (data.statusCode != 200) {
//                     myResults.push({
//                         id: data.statusCode,
//                         text: data.message
//                     })
//                 }
//                 else {
//                     $.each(data.data, function (index, item) {
//                         myResults.push({
//                             id: item.id,
//                             text: item.name
//                         })
//                     })
//                 }
//                 var more = (page * 30) < myResults.length; // whether or not there are more results available
//                 // notice we return the value of more so Select2 knows if more results can be loaded
//                 return { results: myResults, more: more };
//             },
//             cache: true
//         },
//         // initSelection: function (element, callback) {
//         //     var data = { "id": _salesman_id, "text": _salesman_nam };
//         //     callback(data);
//         // },
//         dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
//         escapeMarkup: function (m) {
//             return m;
//         } // we do not want to escape markup since we are displaying html in results
//     });
// }
//Fill Salesman End

function discon(_reportid) {

    div_supplier.hide();
    div_dateason.hide();
    div_datefromto.hide();
    div_no.hide();
    div_item.hide();
    div_reporttype.hide();
    div_processtype.hide();
    div_taxabletype.hide();

    $("#lbl_refno").hide();
    $("#txt_refno").hide();

    imgload.hide();
    creheading.html('');
    reportid.value = '';



    reportid.value = _reportid;

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


    if (reportid.value == '8') {
        div_supplier.show();
        creheading.html($('#purchaseSupplier').html().toUpperCase());

    }
    else if (reportid.value == '1') {
        div_datefromto.show();
        div_no.show();
        div_item.show();
        div_reporttype.show();
        div_processtype.show();

        creheading.html($('#purchaseRequisition').html().toUpperCase());
    }

    else if (reportid.value == '2') {
        div_supplier.show();
        div_datefromto.show();
        div_no.show();
        div_item.show();
        div_reporttype.show();
        div_processtype.show();
        creheading.html($('#PurchaseOrder').html().toUpperCase());
    }
    else if (reportid.value == '3') {
        div_supplier.show();
        div_datefromto.show();
        div_no.show();
        div_item.show();
        div_reporttype.show();
        div_processtype.show();
        creheading.html($('#goodsreceivingNote').html().toUpperCase());

    }
    else if (reportid.value == '4') {
        div_supplier.show();
        div_datefromto.show();
        div_no.show();
        div_item.show();
        div_reporttype.show();
        div_processtype.show();
        div_taxabletype.show();
        creheading.html($('#PurchaseBill').html().toUpperCase());

    }
    else if (reportid.value == '5') {
        div_supplier.show();
        div_datefromto.show();
        div_no.show();
        div_item.show();
        creheading.html($('#payment').html().toUpperCase());

    }
    else if (reportid.value == '6') {
        div_supplier.show();
        div_datefromto.show();
        div_no.show();
        div_item.show();
        creheading.html($('#debitnote').html().toUpperCase());

    }
    else if (reportid.value == '7') {
        div_dateason.show();
        div_supplier.show();
        creheading.html($('#aging').html().toUpperCase());

    }
    if (reportid.value == '8') {
        div_salesman.show();
        div_datefromto.show();
        div_no.show();
        div_item.show();
        div_reporttype.show();
        div_processtype.show();
        div_taxabletype.show();

        creheading.html($('#supplier').html().toUpperCase());
    }

}

//View Start
$(document).on("click", '#btn_view', function () {

    var _dateFrom = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
    var _dateTo = moment(txtdateto.find("input").val()).format("YYYY-MM-DD");
    var _dateason = moment(txtdatason.find("input").val()).format("YYYY-MM-DD");
    var ddlreportType = $("#ddl_reporttype");
    var ddltaxableType = $('#ddl_taxabletype');
    var ddlprocessType = $('#ddl_processtype');

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
    var _no = "", _refno = "", _supplierId = "", _supplierCategoryId = "", _brandId = "", _itemId = "", _itemCategoryId = "", _itemSubCategoryId = "";

    if ($("#txt_no").val != '') { _no = $("#txt_no").val(); }
    if ($("#txt_refno").val != '') { _refno = $("#txt_refno").val(); }
    if ($("#txt_supplier").select2('data') != null) { _supplierId = $("#txt_supplier").select2('data').id; }
    if ($("#txt_SupplierCategory").select2('data') != null) { _supplierCategoryId = $("#txt_SupplierCategory").select2('data').id; }
    if ($("#txt_brand").select2('data') != null) { _brandId = $("#txt_brand").select2('data').id; }
    if ($("#txt_item").select2('data') != null) { _itemId = $("#txt_item").select2('data').id; }
    if ($("#txt_itemCategory").select2('data') != null) { _itemCategoryId = $("#txt_itemCategory").select2('data').id; }
    if ($("#txt_itemSubCategory").select2('data') != null) { _itemSubCategoryId = $("#txt_itemSubCategory").select2('data').id; }



    var viewreport_url = '';


    //Click Supplier Report 
    if (reportid.value == '8') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{ "supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Purchase/Report/SupplierReport?S=' + sessid;
    }
    //Click RequisitionReport 
    if (reportid.value == '1') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{ "dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '","processType":"' + ddlprocessType + '","taxable":"' + ddltaxableType + '","processType":"' + ddlprocessType.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Purchase/Report/RequisitionReport?S=' + sessid;
        }
        else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Purchase/Report/RequisitionSummaryReport?S=' + sessid;
            // console.log(cre,"RequisitionReport","summary");
        }

    }
    //Click PurchaseOrderReport
    if (reportid.value == '2') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '","processType":"' + ddlprocessType.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Purchase/Report/PurchaseOrderReport?S=' + sessid;
        } else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Purchase/Report/PurchaseOrderSummaryReport?S=' + sessid;

        }
    }

    //Click GoodsReceivingNoteReport
    if (reportid.value == '3') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","refno":"' + _refno + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '","processType":"' + ddlprocessType.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Purchase/Report/GoodsReceivingNoteReport?S=' + sessid;
        } else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Purchase/Report/GoodsReceivingNoteSummaryReport?S=' + sessid;

        }
    }

    //Click PurchaseBillReport
    if (reportid.value == '4') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","refno":"' + _refno + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '","taxableType":"' + ddltaxableType.val() + '","processType":"' + ddlprocessType.val() + '"}';

        sessionStorage.setItem(sessid, cre);
        if (ddlreportType.val() == "D") {
            viewreport_url = apiUrl_View + '/Purchase/Report/PurchaseBillReport?S=' + sessid;
        } else if (ddlreportType.val() == "S") {
            viewreport_url = apiUrl_View + '/Purchase/Report/PurchaseBillSummaryReport?S=' + sessid;

        }
    }

    //Click Payment Report
    if (reportid.value == '5') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","refno":"' + _refno + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        // if (ddlreportType.val() == "D") {
        viewreport_url = apiUrl_View + '/Purchase/Report/PaymentReport?S=' + sessid;
        // } else if (ddlreportType.val() == "S") {
        //     viewreport_url = apiUrl_View + '/Purchase/Report/PaymentSummaryReport?S=' + sessid;

        // }
    }

    //Click DebitNote Report
    if (reportid.value == '6') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","refno":"' + _refno + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Purchase/Report/DebitNoteReport?S=' + sessid;
    }
    //Click Aging Start
    if (reportid.value == '7') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{"dateFrom": "' + _dateason + '","dateTo":"' + _dateason + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Purchase/Report/AgingReport?S=' + sessid;
    }
    //Click RequisitionReport 
    if (reportid.value == '8') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");


        cre = '{ "dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","no":"' + _no + '","supplierId":"' + _supplierId + '","supplierCatId":"' + _supplierCategoryId + '","brandId":"' + _brandId + '","itemId":"' + _itemId + '","itemCatId":"' + _itemCategoryId + '","itemSubCatId":"' + _itemSubCategoryId + '"}';

        sessionStorage.setItem(sessid, cre);
        // if (ddlreportType.val() == "D") {
        //     viewreport_url = apiUrl_View + '/Purchase/Report/RequisitionReport?S=' + sessid;
        // }
        // if (ddlreportType.val() == "S") {
        viewreport_url = apiUrl_View + '/Purchase/Report/SupplierReport?S=' + sessid;
        // console.log(cre,"RequisitionReport","summary");
        // }

    }

    window.open(viewreport_url, '_blank');

});



//View End

