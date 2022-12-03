var creheading = $("#cre_heading");
var imgload = $("#img_load");
var reportid = $("#reportid");
var divmain = $("#div_main");
var divdatason = $("#div_datason");
var divdatfrmto = $("#div_datfrmto");
var divmonth = $('#div_month');
var divrpttyp = $("#div_rpttyp");
var ddlrpttyp = $("#ddl_rpttyp");
var txtdatfrm = $("#txt_dat_frm");
var txtdatto = $("#txt_dat_to");
var txtdatason = $("#txt_datason");
$(function () {
    txtdatfrm.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatto.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatason.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    reportpermission();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);
    txtdatason.find("input").val(CurrentDate);


    discon(0);
    ComponentsDropdowns.init();

});

function reportpermission() {
    var _ReportOpeningInventory = $("#ReportOpeningInventory");
    var _ReportStockLedger = $("#ReportStockLedger");
    var _ReportStockLedgervaluation = $("#ReportStockLedgervaluation");
    var _ReportStockSummary = $("#ReportStockSummary");
    var _ReportStockSummaryvaluation = $("#ReportStockSummaryvaluation");
    var _ReportStockMovement = $("#ReportStockMovement");

    _ReportOpeningInventory.hide();
    _ReportStockLedger.hide();
    _ReportStockLedgervaluation.hide();
    _ReportStockSummary.hide();
    _ReportStockSummaryvaluation.hide();
    _ReportStockMovement.hide();


    $.ajax({
        url: apiUrl + '/Menu/FetchInventoryReportMenu',
        type: "Post",
        data: JSON.stringify({ "Token": strkey }),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response[0].status == 1) {
                for (var men_cnt = 0; men_cnt < response[0]["Result"].length; men_cnt++) {
                    ////Opening Stock
                    //if (response[0]["Result"][men_cnt]["Menu_Name"] == 'setupitemopeningstock') {
                    //    _ReportOpeningInventory.show();
                    //}
                    //Stock Ledger
                    //    else
                    if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportinventorystockledger') {
                        _ReportOpeningInventory.show();

                        _ReportStockLedger.show();
                        _ReportStockLedgervaluation.show();
                    }
                    ////Stock Ledger Valuation
                    //else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportinventorystockledger') {
                    //    _ReportStockLedgervaluation.show();
                    //}
                    //Stock Summary
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportinventorystocksummary') {
                        _ReportStockSummary.show();
                        _ReportStockSummaryvaluation.show();
                    }
                    ////Stock Summary Valuation
                    //else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportinventorystocksummary') {
                    //    _ReportStockSummaryvaluation.show();
                    //}

                    //Stock Movement
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportinventorystockmovement') {
                        _ReportStockMovement.show();
                    }


                }

            }
            else {
                localStorage.clear();
                window.location.href = '/login';
            }
        },
        error: function (error) {
            alert('Error ' + error)
        }
    })

}

function discon(_reportid) {
    imgload.hide();
    creheading.html('');
    reportid.value = '';
    divmain.hide();
    divdatfrmto.hide();
    divmonth.hide();
    divdatason.hide();
    divrpttyp.hide();
    ddlrpttyp.empty();
    reportid.value = _reportid;
    //Opening Stock Start
    if (reportid.value == 6) {
        divmain.show();
       // $('#div_stkcat').hide();
        creheading.html($('#ReportOpeningInventory').html().toUpperCase());
    }
    //Opening Stock End
    //Stock Ledger Start
    else if ([1, 2].includes(reportid.value)) {
        divmain.show();
        divmonth.show();
        if (reportid.value == 1) {
            creheading.html($('#ReportStockLedger').html().toUpperCase());
        }
        else if (reportid.value == 2) {
            creheading.html($('#ReportStockLedgervaluation').html().toUpperCase());
        }
    }
    //Stock Ledger End

    //Stock Summary Start
    else if ([3, 4].includes(reportid.value)) {
        divmain.show();
        divdatason.show();
        if (reportid.value == 3) {
            creheading.html($('#ReportStockSummary').html().toUpperCase());
        }
        else if (reportid.value == 4) {
            creheading.html($('#ReportStockSummaryvaluation').html().toUpperCase());
        }
    }
    //Stock Summary End

    //Stock Movement Start
    else if (reportid.value == 5) {
        divmain.show();
        divmonth.show();
        creheading.html($('#ReportStockMovement').html().toUpperCase());
    }
    //Stock Movement End
}


//Trigger after Selection Start
$('#txt_ItemCategory').on("select2-selected", function (e) {
    FillItem();
});
$('#txt_ItemSubCategoryMaster').on("select2-selected", function (e) {
    FillItem();
});
$('#txt_ItemSubCategory').on("select2-selected", function (e) {
    FillItem();
});
$('#txt_Brand').on("select2-selected", function (e) {
    FillItem();
});
//Trigger after Selection End

//Trigger after Clear Start
$('#txt_brand').on("select2-removed", function (e) {
    FillItem();
});
//Trigger after Clear End

//View Start
$(document).on("click", '#btn_view', function () {

    var _ItemCategory = '0';
    var _ItemSubCategortMaster = '0';
    var _ItemSubCategory = '0';
    var _ItemBrand = '0';
    var _Item = '0';

    if ($("#txt_ItemCategory").val() != '') { _ItemCategory = $("#txt_ItemCategory").select2('data').id; }
    if ($("#txt_ItemSubCategoryMaster").val() != '') { _ItemSubCategortMaster = $("#txt_ItemSubCategoryMaster").select2('data').id; }
    if ($("#txt_ItemSubCategory").val() != '') { _ItemSubCategory = $("#txt_ItemSubCategory").select2('data').id; }
    if ($("#txt_Brand").val() != '') { _ItemBrand = $("#txt_Brand").select2('data').id; }
    if ($("#txt_Item").val() != '') { _Item = $("#txt_Item").select2('data').id; }

    var datason = txtdatason.find("input").val();
    var datfrm = txtdatfrm.find("input").val();
    var datto = txtdatto.find("input").val();
    var stockcategory = $('#ddl_stkcat').val();

    if (reportid.value == '') {
        alert('Report not selected');
        return;
    }
    var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_date = "D" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");

    var cre = "";
    var cre_name = "";

    //sessionStorage.setItem(sessid_name, cre_name);
    var viewreport_url = '';

    //Opening Inventory Start
    if (reportid.value == 6) {

        //if ($("#txt_bd").val() != '') {
        //    cre = cre + " v_titm.bd_id =" + $("#txt_bd").select2('data').id;
        //    cre_name = cre_name + " Brand : " + $("#txt_bd").select2('data').text;

        //}
        // Item Category
        if (_ItemCategory != "0") {
            cre = cre + " and v_titm_pg.Item_Category_ID=" + _ItemCategory;
            cre_name = cre_name + " Item Category : " + $("#txt_ItemCategory").select2('data').text;
        }

        //Item Category Sub Category Master
        if (_ItemSubCategortMaster != "0") {
            cre = cre + " and v_titm_pg.Item_SubCategoryMaster_ID =_ItemSubCategortMaster";
            cre_name = cre_name + " Item Sub-Category Master : " + $("#txt_ItemSubCategoryMaster").select2('data').text;
        }

        //Item Category Sub Category
        if (_ItemSubCategory != "0") {
            cre = cre + " and v_titm_pg.Item_SubCategory_ID =" + _ItemSubCategory;
            cre_name = cre_name + " Item Sub-Category : " + $("#txt_ItemSubCategory").select2('data').text;
        }

        //Item Brand
        if (_ItemBrand != "0") {
            cre = cre + " and v_titm_pg.Brand_ID =" + _ItemBrand;
            cre_name = cre_name + " Brand : " + $("#txt_Brand").select2('data').text;
        }

        //Item
        if (_Item != "0") {
            cre = cre + " and v_titm_pg.Item_ID =" + _Item;
            cre_name = cre_name + " Item : " + $("#txt_Item").select2('data').text;
        }
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Inventory_Reports/StockOpening?1&' + sessid + '&' + sessid_name;
        window.open(viewreport_url, '_blank');

    }
    //Opening Stock End
    //Stock Ledger Start
    else if ([1, 2].includes(reportid.value)) {

        // Item Category
        if (_ItemCategory != "0") {
            cre = cre + " and v_rpt_stk_led.Item_Category_ID=" + _ItemCategory;
            cre_name = cre_name + " Item Category : " + $("#txt_ItemCategory").select2('data').text;
        }

        //Item Category Sub Category Master
        if (_ItemSubCategortMaster != "0") {
            cre = cre + " and v_rpt_stk_led.Item_SubCategoryMaster_ID =_ItemSubCategortMaster";
            cre_name = cre_name + " Item Sub-Category Master : " + $("#txt_ItemSubCategoryMaster").select2('data').text;
        }

        //Item Category Sub Category
        if (_ItemSubCategory != "0") {
            cre = cre + " and v_rpt_stk_led.Item_SubCategory_ID =" + _ItemSubCategory;
            cre_name = cre_name + " Item Sub-Category : " + $("#txt_ItemSubCategory").select2('data').text;
        }

        //Item Brand
        if (_ItemBrand != "0") {
            cre = cre + " and v_rpt_stk_led.Brand_ID =" + _ItemBrand;
            cre_name = cre_name + " Brand : " + $("#txt_Brand").select2('data').text;
        }

        //Item
        if (_Item != "0") {
            cre = cre + " and v_rpt_stk_led.Item_ID =" + _Item;
            cre_name = cre_name + " Item : " + $("#txt_Item").select2('data').text;
        }

        //Stock Category
        if (stockcategory != '') {
            cre = cre + " and v_rpt_stk_led.stk_cat =" + "'" + stockcategory + "'";
            cre_name = cre_name + " Stock Category : " + "'" + stockcategory + "'";

        }
        sessionStorage.setItem(sessid, cre);
        if (reportid.value == 1) {
            viewreport_url = apiUrl_View + '/Inventory_Reports/StockLedger?1&' + sessid + '&' + sessid_name + '&' + datfrm + '&' + datto;
        }
        else if (reportid.value == 2) {
            viewreport_url = apiUrl_View + '/Inventory_Reports/StockLedgerValuation?1&' + sessid + '&' + sessid_name + '&' + datfrm + '&' + datto;
        }
        window.open(viewreport_url, '_blank');
    }
    //Stock Ledger End


    //Stock Summary Start
    else if ([3, 4].includes(reportid.value)) {



        //Date End
        // Item Category
        if (_ItemCategory != "0") {
            cre = cre + " and v_titm_pg.Item_Category_ID=" + _ItemCategory;
            cre_name = cre_name + " Item Category : " + $("#txt_ItemCategory").select2('data').text;
        }

        //Item Category Sub Category Master
        if (_ItemSubCategortMaster != "0") {
            cre = cre + " and v_titm_pg.Item_SubCategoryMaster_ID =_ItemSubCategortMaster";
            cre_name = cre_name + " Item Sub-Category Master : " + $("#txt_ItemSubCategoryMaster").select2('data').text;
        }

        //Item Category Sub Category
        if (_ItemSubCategory != "0") {
            cre = cre + " and v_titm_pg.Item_SubCategory_ID =" + _ItemSubCategory;
            cre_name = cre_name + " Item Sub-Category : " + $("#txt_ItemSubCategory").select2('data').text;
        }

        //Item Brand
        if (_ItemBrand != "0") {
            cre = cre + " and v_titm_pg.Brand_ID =" + _ItemBrand;
            cre_name = cre_name + " Brand : " + $("#txt_Brand").select2('data').text;
        }

        //Item
        if (_Item != "0") {
            cre = cre + " and v_titm_pg.Item_ID =" + _Item;
            cre_name = cre_name + " Item : " + $("#txt_Item").select2('data').text;
        }

        //Stock Category
        if (stockcategory != '') {
            cre = cre + " and stk_cat =" + "'" + stockcategory + "'";
            cre_name = cre_name + " Stock Category : " + "'" + stockcategory + "'";

        }

        sessionStorage.setItem(sessid, cre);
        if (reportid.value == 3) {
            viewreport_url = apiUrl_View + '/Inventory_Reports/StockSummary?1&' + sessid + '&' + sessid_name + '&' + datason + '&' + stockcategory;
        }
        else if (reportid.value == 4) {
            viewreport_url = apiUrl_View + '/Inventory_Reports/StockSummaryValuation?1&' + sessid + '&' + sessid_name + '&' + datason + '&' + stockcategory;
        }

        sessionStorage.setItem(sessid, cre);
        window.open(viewreport_url, '_blank');
    }
    //Stock Summary End

    //Stock Movement Start
    else if (reportid.value == 5) {
        // Item Category
        if (_ItemCategory != "0") {
            cre = cre + " and v_rpt_stk_led.Item_Category_ID=" + _ItemCategory;
            cre_name = cre_name + " Item Category : " + $("#txt_ItemCategory").select2('data').text;
        }

        //Item Category Sub Category Master
        if (_ItemSubCategortMaster != "0") {
            cre = cre + " and v_rpt_stk_led.Item_SubCategoryMaster_ID =_ItemSubCategortMaster";
            cre_name = cre_name + " Item Sub-Category Master : " + $("#txt_ItemSubCategoryMaster").select2('data').text;
        }

        //Item Category Sub Category
        if (_ItemSubCategory != "0") {
            cre = cre + " and v_rpt_stk_led.Item_SubCategory_ID =" + _ItemSubCategory;
            cre_name = cre_name + " Item Sub-Category : " + $("#txt_ItemSubCategory").select2('data').text;
        }

        //Item Brand
        if (_ItemBrand != "0") {
            cre = cre + " and v_rpt_stk_led.Brand_ID =" + _ItemBrand;
            cre_name = cre_name + " Brand : " + $("#txt_Brand").select2('data').text;
        }

        //Item
        if (_Item != "0") {
            cre = cre + " and v_rpt_stk_led.Item_ID =" + _Item;
            cre_name = cre_name + " Item : " + $("#txt_Item").select2('data').text;
        }

        //Stock Category
        if (stockcategory != '') {
            cre = cre + " and v_rpt_stk_led.stk_cat =" + "'" + stockcategory + "'";
            cre_name = cre_name + " Stock Category : " + "'" + stockcategory + "'";

        }
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Inventory_Reports/StockMovement?1&' + sessid + '&' + sessid_name + '&' + datfrm + '&' + datto + '&' + stockcategory;
        window.open(viewreport_url, '_blank');

    }
    //Stock Movement End



});
//View End

//Comment Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {
        //Item Category Start
        FillItemCategory();
        //Item Category End

        //Item Sub-Category Master Start
        FillItemSubCategoryMaster();
        //Item Sub-Category Master End

        //Item Sub-Category Start
        FillItemSubCategory();
        //Item Sub-Category End

        //Item Brand Start
        FillBrand();
        //Item Brand End

        //Item Start
        //FillItem();
        //Item End

    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Comment End

//Item Category Start
function FillItemCategory() {
    $("#txt_ItemCategory").select2({
        placeholder: "Search Category",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/Inventory/ItemReport/GetItemCategory',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Category
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
//Item Category End

//Item Sub-Category Master Start
function FillItemSubCategoryMaster() {
    $("#txt_ItemSubCategoryMaster").select2({
        placeholder: "Search Item Sub-Category Master",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/Inventory/ItemReport/GetItemSubCategoryMaster',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Sub_Category_Master
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
//Item Sub-Category Master End

//Item Sub-Category Start
function FillItemSubCategory() {
    $("#txt_ItemSubCategory").select2({
        placeholder: "Search For Sub Category",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/Inventory/ItemReport/GetItemSubCategory',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Sub_Category
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
//Item Sub-Category End


//Item Brand Start
function FillBrand() {
    $("#txt_Brand").select2({
        placeholder: "Search Brand",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/Inventory/ItemReport/GetItemBrand',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Brand
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
//Item Brand End

//Item Start
function FillItem() {
    var _ItemCategory = '0';
    var _ItemSubCategortMaster = '0';
    var _ItemSubCategory = '0';
    var _ItemBrand = '0';

    if ($("#txt_ItemCategory").val() != '') { _ItemCategory = $("#txt_ItemCategory").select2('data').id; }
    if ($("#txt_ItemSubCategoryMaster").val() != '') { _ItemSubCategortMaster = $("#txt_ItemSubCategoryMaster").select2('data').id; }
    if ($("#txt_ItemSubCategory").val() != '') { _ItemSubCategory = $("#txt_ItemSubCategory").select2('data').id; }
    if ($("#txt_Brand").val() != '') { _ItemBrand = $("#txt_Brand").select2('data').id; }


    $("#txt_Item").select2({
        placeholder: "Search Item",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/Inventory/ItemReport/GetItem',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _ItemCategory: _ItemCategory,
                    _ItemSubCategoryMaster: _ItemSubCategortMaster,
                    _ItemSubCategory: _ItemSubCategory,
                    _ItemBrand: _ItemBrand,
                    _srch: term, // search term
                    page: page // page number

                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {
                        myResults.push({
                            id: item.ID,
                            text: item.Item_Name
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
//Item End

