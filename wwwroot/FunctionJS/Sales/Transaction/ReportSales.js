var creheading = $("#creheading");
var imgload = $("#img_load");
var divdatfrmto = $("#div_datfrmto");
var divdatason = $("#div_datason");
var divtitm = $("#div_titm");
var reportid = $("#reportid");
var divrpttyp = $("#div_rpttyp");
var ddlrpttyp = $("#ddl_rpttyp");
var txtdatfrm = $("#txt_datefrom");
var txtdatTo = $("#txt_dateto");
var txtdatason = $("#txt_datason");
var divlot = $("#div_lot");
var datfrm;
var datto;
var Customer = '0';
var Salesman = '0';
var ItemCategory = '0';
var ItemSubCategoryMaster = '0';
var ItemSubCategory = '0';
var ItemBrand = '0';
var Item = '0';
var Lot = '0';
var warehouse = '0';

$(function () {
    txtdatfrm.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatTo.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatason.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    reportpermission();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdatfrm.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);
    txtdatason.find("input").val(CurrentDate);
    discon(0);
    ComponentsDropdowns.init();
});
function discon(_reportid) {
    imgload.hide();
    creheading.html('');
    reportid.value = '';
    divdatfrmto.hide();
    divdatason.hide();
    divtitm.hide();
    divlot.hide();
    divrpttyp.hide();
    ddlrpttyp.empty();
    reportid.value = _reportid;


    //Click Quotaiton Report Start
    if (reportid.value == '1') {
        divdatfrmto.show();
        divtitm.show();
        divlot.hide();
        divrpttyp.show();
        creheading.html($('#ReportQuotation').html().toUpperCase());
        $('#so').hide();
        $('#warehouse').hide();
        ddlrpttyp.append($('<option></option>').val('QuotationSummary').html('Quotation Summary'));
        ddlrpttyp.append($('<option></option>').val('Quotation').html('Quotation'));
    }
    //Click Quotation Report End


}
function reportpermission() {
    var _ReportQuotation = $("#ReportQuotation");



    _ReportQuotation.hide();
    
    $.ajax({
        url: apiUrl + '/Menu/FetchSalesReportMenu',
        type: "Post",
        data: JSON.stringify({ "Token": strkey }),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response[0].status == 1) {
                for (var men_cnt = 0; men_cnt < response[0]["Result"].length; men_cnt++) {
                    //Chart of Accounts
                    if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportsalesestimate') {
                        _ReportQuotation.show();
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

//Trigger after Selection Start
$('#txt_itmcat').on("select2-selected", function (e) {
    var txtitmcat = $("#txt_itmcat");
    ItemCategory = txtitmcat.select2('data').id;
});
$('#txt_cus').on("select2-selected", function (e) {
    var cus = $("#txt_cus");
    Customer = cus.select2('data').id;
});
$('#txt_slsmn').on("select2-selected", function (e) {
    var slsmn = $("#txt_slsmn");
    Salesman = slsmn.select2('data').id;
});
$('#txt_itmsubmas').on("select2-selected", function (e) {
    var txtitmsubmas = $("#txt_itmsubmas");
    ItemSubCategoryMaster = txtitmsubmas.select2('data').id;
});
$('#txt_itmsub').on("select2-selected", function (e) {
    var txtitmsub = $("#txt_itmsub");
    ItemSubCategory = txtitmsub.select2('data').id;
});
$('#txt_bd').on("select2-selected", function (e) {
    var txtbd = $("#txt_bd");
    ItemBrand = txtbd.select2('data').id;
});
$('#txt_titm').on("select2-selected", function (e) {
    var txttitm = $("#txt_titm");
    Item = txttitm.select2('data').id;
});

$('#txt_wh').on("select2-selected", function (e) {
    var txtwh = $("#txt_wh");
    warehouse = txtwh.select2('data').id;
});
//Trigger after Selection End

//Trigger after Clear Start
$('#txt_itmcat').on("select2-removed", function (e) {
    ItemCategory = "0";
});
$('#txt_cus').on("select2-removed", function (e) {
    Customer = "0";
});
$('#txt_slsmn').on("select2-removed", function (e) {
    Salesman = "0";
});
$('#txt_itmsubmas').on("select2-removed", function (e) {
    ItemSubCategoryMaster = "0";
});
$('#txt_itmsub').on("select2-removed", function (e) {
    ItemSubCategory = "0";
});
$('#txt_bd').on("select2-removed", function (e) {
    ItemBrand = "0";
});
$('#txt_titm').on("select2-removed", function (e) {
    Item = "0";
});
$('#txt_wh').on("select2-removed", function (e) {
    warehouse = "0";
});
//Trigger after Clear End

//Comment Start
var ComponentsDropdowns = function () {



    var handleSelect2 = function () {
        //Customer Start
        $("#txt_cus").select2({
            placeholder: "Search Customer",
            minimumInputLength: 1,
            triggerChange: true,
            allowClear: true,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: apiUrl + '/SetupCombo/FillCustomer',
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
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Customer
                            //id: item.acc_no,
                            //text: item.Account_Name
                        })
                    })
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
        //Customer End

        //Salesman Start
        $("#txt_slsmn").select2({
            placeholder: "Search Salesman",
            minimumInputLength: 1,
            triggerChange: true,
            allowClear: true,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: apiUrl + '/SetupCombo/FillSalesMan',
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
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.SalesMan_Name
                        })
                    })
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
        //Customer End

        //Item Category Start
        $("#txt_itmcat").select2({
            placeholder: "Search Item Category",
            minimumInputLength: 1,
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
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Category
                            //id: item.acc_no,
                            //text: item.Account_Name
                        })
                    })
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
        //Item Category End

        //Item Sub-Category Master Start
        $("#txt_itmsubmas").select2({
            placeholder: "Search Item Sub-Category Master",
            minimumInputLength: 1,
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
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Sub_Category_Master
                            //id: item.acc_no,
                            //text: item.Account_Name
                        })
                    })
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
        //Item Sub-Category Master End

        //Item Sub-Category Start
        $("#txt_itmsub").select2({
            placeholder: "Search Item Sub-Category",
            minimumInputLength: 1,
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
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Sub_Category
                            //id: item.acc_no,
                            //text: item.Account_Name
                        })
                    })
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
        //Item Sub-Category Master End

        //Item Brand Start
        $("#txt_bd").select2({
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
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Brand
                            //id: item.acc_no,
                            //text: item.Account_Name
                        })
                    })
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
        //Item Brand End

        //Item Start
        $("#txt_titm").select2({
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
                        _srch: term, // search term
                        _ItemCategory: ItemCategory, // search term
                        _ItemSubCategoryMaster: ItemSubCategoryMaster, // search term
                        _ItemSubCategory: ItemSubCategory, // search term
                        _ItemBrand: ItemBrand, // search term
                        page: page // page number
                    };
                },
                results: function (data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter remote JSON data
                    var myResults = [];
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Item
                            //id: item.acc_no,
                            //text: item.Account_Name
                        })
                    })
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
        //Item End

        //Warehouse Start
        $("#txt_wh").select2({
            placeholder: "Search Warehouse",
            minimumInputLength: 1,
            triggerChange: true,
            allowClear: true,
            ajax: {
                url: apiUrl + '/Inventory/Item/GetWarehouse',
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
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.wh_id,
                            text: item.wh_nam
                        })
                    })
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
        //Warehouse End
    }

    return {
        //main function to initiate the module
        init: function () {

            handleSelect2();
        }
    };

}();
//Comment End

//View Start
$(document).on("click", '#btn_view', function () {
    $('#status').change(function () {
        var sta = $('#status option:selected');
        status = sta.text();
    })
    var id = $('#txt_id').val();
    var so_no = $('#txt_so').val();
    var dateason = txtdatason.find("input").val();
    var dateFrom = txtdatfrm.find("input").val();
    var dateTo = txtdatTo.find("input").val();
    var status_str = $("#ddl_status option:selected").val();
    var status = -1;
    if (status_str == 'In-Process') {
        status = 0;
    }
    else if (status_str == 'Complete') {
        status = 1;
    }


    if (reportid.value == '') {
        alert('Report not selected');
        return;
    }
    var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_date = "D" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");

    var cre = "";
    var cre_name = "";


    sessionStorage.setItem(sessid_name, cre_name);

    var viewreport_url = '';
    //SO Start
    if (reportid.value == '1') {
        cre = cre + " and mpso_dat between '" + dateFrom + "' and '" + dateTo + "'";
        cre_name = cre_name + " mpso_dat from " + moment(dateFrom).format("DD-MMM-YYYY") + " and " + moment(dateTo).format("DD-MMM-YYYY");

        // Status
        //if (status > -1) {
        //    cre = cre + " and Status='" + status + "'";
        //    cre_name = cre_name + " Status : " + status_str;
        //}
        // ID
        if (id != "") {
            cre = cre + " and [mpso_id]=" + id;
            cre_name = cre_name + " mpso_id : " + id;
        }

        //Customer
        if (Customer != "0") {
            cre = cre + " and v_rpt_pso.cus_id=" + Customer;
            cre_name = cre_name + " Customer : " + $("#txt_cus").select2('data').text;
        }
        //Salesman
        if (Salesman != "0") {
            cre = cre + "and v_rpt_pso.emppro_id=" + Salesman;
            cre_name = cre_name + " Salesman : " + $("#txt_slsmn").select2('data').text;
        }

        // Item Category
        if (ItemCategory != "0") {
            cre = cre + " and v_titm.titm_id=" + ItemCategory;
            cre_name = cre_name + " Item Category : " + $("#txt_itmcat").select2('data').text;
        }


        //Item Category Sub Category Master
        if (ItemSubCategoryMaster != "0") {
            cre = cre + " and v_titm.itmsub_id in (select m_itmsub.itmsub_id from m_itmsub where itmsubmas_id=" + ItemSubCategoryMaster + ")";
            cre_name = cre_name + " Item Sub-Category Master : " + $("#txt_itmsubmas").select2('data').text;
        }

        //Item Category Sub Category
        if (ItemSubCategory != "0") {
            cre = cre + " and v_titm.itmsub_id =" + ItemSubCategory;
            cre_name = cre_name + " Item Sub-Category : " + $("#txt_itmsub").select2('data').text;
        }

        //Item Brand
        if (ItemBrand != "0") {
            cre = cre + " and v_titm.bd_id =" + ItemBrand;
            cre_name = cre_name + " Brand : " + $("#txt_bd").select2('data').text;
        }

        //Item
        if (Item != "0") {
            cre = cre + " and v_titm.titm_id =" + Item;
            cre_name = cre_name + " Item : " + $("#txt_titm").select2('data').text;
        }        
        sessionStorage.setItem(sessid, cre);
        //  sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        
        if (ddlrpttyp.val() == 'Quotation') {
            viewreport_url = apiUrl_View + '/Sale_Reports/Quotation?2059&' + sessid + '&' + sessid_name;
        } else if (ddlrpttyp.val() == 'QuotationSummary') {
            viewreport_url = apiUrl_View + '/Sale_Reports/QuotationSummary?2059&' + sessid + '&' + sessid_name, '_blank';
        }
        window.open(viewreport_url, '_blank');
    }
    //SO End

});
//View End

