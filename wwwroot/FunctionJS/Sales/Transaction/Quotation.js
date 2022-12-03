
var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var ApiForm = '';
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnsave = $("#btn_save");
var btnupd = $("#btn_update");
var taxid = $("#txt_id");
var txtdat = $("#txt_dat");
var _Item_ID = 0;
var _Item_Name = "";
var _Customer_ID = 0;
var _Customer_Name = "";
var _Previous_ID = 0;
var _Previous_Name = "";
var _Location_ID = 0;
var _Location_Name = "";
var _salesman_id = 0;
var _salesman_nam = "";
var app_checkid = 0;
var _PrintColor_ID = 0;
var _PrintColor_Name = '';
var _WaterBase_ID = 0;
var _WaterBase_Name = '';
var _OPV_ID = 0;
var _OPV_Name = '';
var _UVC_ID = 0;
var _UVC_Name = '';
var _UVCA_ID = 0;
var _UVCA_Name = '';
var _UVHC_ID = 0;
var _UVHC_Name = '';
var _UVHCA_ID = 0;
var _UVHCA_Name = '';
var _LC_ID = 0;
var _LC_Name = '';
var _LCA_ID = 0;
var _LCA_Name = '';
var _FHS_ID = 0;
var _FHS_Name = '';
var _FHSA_ID = 0;
var _FHSA_Name = '';
var _DC_ID = 0;
var _DC_Name = '';
var _Pasting_ID = 0;
var _Pasting_Name = '';
var _Eyelet_ID = 0;
var _Eyelet_Name = '';
var _Sublet_ID = 0;
var _Sublet_Name = '';
var _PN_ID = 0;
var _PN_Name = '';
var _Brand_Id = 0;
var _Brnad_Name = '';
var _SubCat_Id = 0;
var _SubCat_Name = '';

// var _ItemSubCater_ID = 0;
// var _Item_Name = "";


$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Sales/v1/Quotation';
    imgload.hide();
    ComponentsDropdowns.init();

    discon();
});

$(document).on("click", "#btn_itmmodal", function () {

    $('#txt_bd').select2('val', '');
    $('#txt_sb').select2('val', '');
    $('#txt_nam').val('');
    //btnsave.show();
    $('#item_data_Modal').modal('show');
})

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    btnsav.show();
    btnupd.hide();
    imgloadsav.hide();
    $("#ck_saleTax").iCheck('Update')[0].checked;
    $('#ck_saleTax').iCheck('uncheck');
    FillTermsCondition();

    //discon();
});

$(document).on("click", '#btn_valadd', function () {
    if ($('#txt_itm').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Enter Item",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_location').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Enter Location",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($("#txt_qty").val() == 0) {
        Swal.fire({
            icon: 'error',
            title: "Please Enter Quantity",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    }
    $('#data_ValAddModal').modal('show');
});

//Item Discon Start
function disconItem() {
    $('#txt_location').select2('val', '');
    $('#txt_location').html('');
    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');
}
//Item Discon End

//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    $("#txt_id").html('');
    // $('#ck_can').iCheck('update')[0].checked;
    // $('#ck_can').iCheck('uncheck'); //To check the radio button

    // $('#ck_cmp').iCheck('update')[0].checked;
    // $('#ck_cmp').iCheck('uncheck'); //To check the radio button

    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();
    imgloadsav.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    //$('#Table_View').DataTable().clear().destroy();
    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();

    $('#txt_cus').select2('val', '');
    $('#txt_cus').html('');

    $('#txt_slsman').select2('val', '');
    $('#txt_slsman').html('');

    $('#txt_pquo').select2('val', '');
    $('#txt_pquo').html('');


    discondet();
    app_checkid = 0;
}
//Discon End

//Discon Detail Start
function discondet() {
    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    $('#txt_location').select2('val', '');
    $('#txt_location').html('');

    $('#txt_pitem').select2('val', '');
    $('#txt_pitem').html('');


    _PrintColor_ID = -1;
    _PrintColor_Name = "N.A.";
    $('#txt_pcolor').val(_PrintColor_ID); // Select the option with a value of '1'
    $('#txt_pcolor').trigger('change'); // Notify any JS components that the value changed


    _WaterBase_ID = -1;
    _WaterBase_Name = "N.A.";
    $('#txt_pwbase').val(_WaterBase_ID); // Select the option with a value of '1'
    $('#txt_pwbase').trigger('change'); // Notify any JS components that the value changed

    _OPV_ID = -1;
    _OPV_Name = "N.A.";
    $('#txt_popv').val(_OPV_ID); // Select the option with a value of '1'
    $('#txt_popv').trigger('change'); // Notify any JS components that the value changed

    _UVC_ID = -1;
    _UVC_Name = "N.A.";
    $('#txt_uvc').val(_UVC_ID); // Select the option with a value of '1'
    $('#txt_uvc').trigger('change'); // Notify any JS components that the value changed

    _UVCA_ID = -1;
    _UVCA_Name = "N.A.";
    $('#txt_uvca').val(_UVCA_ID); // Select the option with a value of '1'
    $('#txt_uvca').trigger('change'); // Notify any JS components that the value changed

    _UVHC_ID = -1;
    _UVHC_Name = "N.A.";
    $('#txt_uvhc').val(_UVHC_ID); // Select the option with a value of '1'
    $('#txt_uvhc').trigger('change'); // Notify any JS components that the value changed

    _UVHCA_ID = -1;
    _UVHCA_Name = "N.A.";
    $('#txt_uvhca').val(_UVHCA_ID); // Select the option with a value of '1'
    $('#txt_uvhca').trigger('change'); // Notify any JS components that the value changed

    _LC_ID = -1;
    _LC_Name = "N.A.";
    $('#txt_lc').val(_LC_ID); // Select the option with a value of '1'
    $('#txt_lc').trigger('change'); // Notify any JS components that the value changed

    _LCA_ID = -1;
    _LCA_Name = "N.A.";
    $('#txt_lca').val(_LCA_ID); // Select the option with a value of '1'
    $('#txt_lca').trigger('change'); // Notify any JS components that the value changed

    _FHS_ID = -1;
    _FHS_Name = "N.A.";
    $('#txt_fhs').val(_FHS_ID); // Select the option with a value of '1'
    $('#txt_fhs').trigger('change'); // Notify any JS components that the value changed

    _FHSA_ID = -1;
    _FHSA_Name = "N.A.";
    $('#txt_fhsa').val(_FHSA_ID); // Select the option with a value of '1'
    $('#txt_fhsa').trigger('change'); // Notify any JS components that the value changed

    _DC_ID = -1;
    _DC_Name = "N.A.";
    $('#txt_dc').val(_DC_ID); // Select the option with a value of '1'
    $('#txt_dc').trigger('change'); // Notify any JS components that the value changed

    _Pasting_ID = -1;
    _Pasting_Name = "N.A.";
    $('#txt_pasting').val(_Pasting_ID); // Select the option with a value of '1'
    $('#txt_pasting').trigger('change'); // Notify any JS components that the value changed

    _Eyelet_ID = -1;
    _Eyelet_Name = "N.A.";
    $('#txt_eyelet').val(_Eyelet_ID); // Select the option with a value of '1'
    $('#txt_eyelet').trigger('change'); // Notify any JS components that the value changed

    _Sublet_ID = -1;
    _Sublet_Name = "N.A.";
    $('#txt_sublet').val(_Eyelet_ID); // Select the option with a value of '1'
    $('#txt_sublet').trigger('change'); // Notify any JS components that the value changed

    _PN_ID = -1;
    _PN_Name = "N.A.";
    $('#txt_pn').val(_PN_ID); // Select the option with a value of '1'
    $('#txt_pn').trigger('change'); // Notify any JS components that the value changed
}
//Discon Detail End
//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        //Fill Item Start
        FillItem();
        //Fill Item End


        //Brand Start
        FillBrand();
        //Brand End

        //manufacturer Scale Start 
        FillManufacturer();
        //manufacturer Scale End

        //SUB Category Start
        FillISubcat();
        //SUB Category END

        //Fill Customer Start
        FillCustomer()
        //Fill Customer End

        //Fill Location Start
        FillLocation()
        //Fill Location End

        //Fill Salesman Start
        fillSalesman()
        //Fill Salesman End
        //Terms & Condition Start
        FillTermsCondition();
        //Terms & Condition End

        //Previous Quotation Start
        FillPreviousQuotation();
        //Previous Quotation End

        //Value Addition
        FillPaperItem()
        FillPColor()
        FillPWB()
        FillPOPV()
        FillUVC()
        FillUVCA()
        FillUVHC()
        FillUVHCA()
        FillLC()
        FillLCA()
        FillFHS()
        FillFHSA()
        FillDC()
        FillPasting()
        FillEyelet()
        FillSublet()
        FillPN()
        //Value Addition
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End

//Brand Start
function FillBrand() {
    $("#txt_bd").select2({
        placeholder: "Search for Brand",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: {
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/Getbrand',
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
        initSelection: function (element, callback) {
            var data = { "id": _Brand_Id, "text": _Brnad_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Brand End

//Sub Category Start
function FillISubcat() {
    $("#txt_sb").select2({
        placeholder: "Search for Sub Category",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: {
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemSubCatgory',
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
        initSelection: function (element, callback) {
            var data = { "id": _SubCat_Id, "text": _SubCat_Name };
            ;
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Sub Category End

//manufacturer Scale Start 
function FillManufacturer() {
    $("#txt_mqty_scale").select2({
        placeholder: "Manufacturer Scale",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            //   /SetupCombo/GetItemManufacturer/{_srch?}/{_key?}
            url: apiUrl + '/SetupCombo/FillScale/',
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
                        text: item.Scale
                    })
                })
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        initSelection: function (element, callback) {
            var data = { "id": _Inner_Scale_ID, "text": _Inner_Scale_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//manufacturer Scale End

//Fill Item Start

function FillItem() {
    $("#txt_itm").select2({
        placeholder: "Search for Item",
        minimumInputLength: 0,
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
                    request.setRequestHeader("CustomerId", $('#txt_cus').select2('data').id);
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

        initSelection: function (element, callback) {
            var data = { "id": _Item_ID, "text": _Item_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Item End

//Fill Customer Start
function FillCustomer() {
    $("#txt_cus").select2({
        placeholder: "Search for Customer",
        minimumInputLength: 0,
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

        initSelection: function (element, callback) {
            var data = { "id": _Customer_ID, "text": _Customer_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Customer End

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
        initSelection: function (element, callback) {
            var data = { "id": _salesman_id, "text": _salesman_nam };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Salesman End

$('#txt_cus').on("select2-selected", function (e) {
    _Customer_ID = $('#txt_cus').select2('data').id;
});
$('#txt_cus').on("select2-removed", function (e) {
    $('#txt_location').select2('val', '');
    $('#txt_location').html('');
    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');
    _Customer_ID = 0;
});

$('#txt_brand').on("select2-selected", function (e) {
    _Brand_Id = $("#txt_brand").select2('data').id;
});

$('#txt_brand').on("select2-removed", function (e) {
    _Brand_Id = "0";

});

//Fill Location Start
function FillLocation() {
    $("#txt_location").select2({
        placeholder: "Search for Location",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetCustomerLocation',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CustomerId", $('#txt_cus').select2('data').id);
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

        initSelection: function (element, callback) {
            var data = { "id": _Location_ID, "text": _Location_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Location End

//Onload Start
function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $.ajax({
        url: ApiForm,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
            imgload.show();
        },
        success: function (response) {
            var sno = 1;
            if (response.statusCode == 200) {
                var action_button = '';
                //New
                if (response["data"][0]["newPermission"] == 'true') {
                    btnnew.show();
                }

                //Delete
                if (Boolean(response["data"][0]["deletePermission"])) {
                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                }
                //Update
                if (Boolean(response["data"][0]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }

                if (response["data"] != null) {


                    $('#Table_View').DataTable().clear().destroy();
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        columns: [
                            {
                                data: null,
                                "defaultContent": action_button
                            },
                            { data: 'no' },

                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },
                            {
                                data: 'category',
                            },
                            { data: 'customerName' },
                            { data: 'employeeName' },

                            { data: 'remarks' },
                            {
                                data: 'check', render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'approved',
                                render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'cancel',
                                render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'close',
                                render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            { data: 'previousNo' }
                        ],
                        "order": [[1, "desc"], [2, "asc"]],
                        "pageLength": 10
                    });
                    imgload.hide();
                }
            }
            else {
                imgload.hide();
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
//Onload End

// Create Start 
function savrec() {

    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;

    Swal.fire({
        title: 'Are you sure you want to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            detailrecord = ck.detailrecord;
            var urlStr = ApiForm;
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        $("#txt_id").html(response.message)
                        imgloadsav.hide();
                        discon();
                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        Swal.fire({
                            title: "Record Save",// response.message,

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
                        imgloadsav.hide();
                        btnsav.show();
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
                    imgloadsav.hide();
                    btnsav.show();
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
            })

        }
    })

}
// Create End 


//item Save Record start
function itemsavrec() {

    var ck = ckvalidationforItems();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;

    Swal.fire({
        title: 'Are you sure you want to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: apiUrl + '/api/Inventory/v1/Item',
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        $("#txt_id").html(response.message)
                        imgloadsav.hide();
                        discon();
                        btnsav.show();
                        $('#item_data_Modal').modal('hide');
                        Swal.fire({
                            title: "Record Save",// response.message,

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
                        imgloadsav.hide();
                        btnsav.show();
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
                    imgloadsav.hide();
                    btnsav.show();
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
            })

        }
    })

}
//item save Record end

// Update Start 
function updrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var cre = ck.creteria;
    
    Swal.fire({
        title: 'Are you sure you want to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm,
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnupd.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        discon();

                        imgloadsav.show();
                        btnupd.hide();

                        $('#data_Modal').modal('hide');

                        Swal.fire({
                            title: 'Record Update',

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
                        imgloadsav.hide();
                        btnupd.show();
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
                    imgloadsav.hide();
                    btnupd.show();
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
            })

        }
    })

}

// Update End

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    var detailsTableBodyTC = $("#termscondition_Table tbody");
    detailsTableBodyTC.empty();



    var _id = data['id'];
    var _No = data['no'];
    var _Check = data['check'];
    var _Approved = data['approved'];
    var _Close = data['close'];
    var _Cancel = data['cancel'];


    if (Boolean(_Approved)) {
        Swal.fire({
            title: "Quotation has been approved",
            icon: 'warning',
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

    if (Boolean(_Check)) {
        Swal.fire({
            title: "Quotation has been checked",
            icon: 'warning',
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

    Swal.fire({
        title: 'Are sure wants to edit <br/>' + _No + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Edit',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({

                url: ApiForm + '/GetQuotationById',
                type: "Get",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("_MenuId", _menuid);
                    xhr.setRequestHeader("_Id", _id);
                    imgload.show();
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.hide();
                },
                success: function (response) {
                    if (response.statusCode == 200) {

                        $('#data_Modal').modal('show');

                        $("#txt_id").html(response["data"]["id"]);
                        $("#txt_no").val(response["data"]["no"])
                        txtdat.find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));

                        if (response["data"]["previousId"] != "") {
                            _Previous_ID = response["data"]["previousId"];
                            _Previous_Name = response["data"]["previousName"];
                            $('#txt_pquo').val(_Previous_ID); // Select the option with a value of '1'
                            $('#txt_pquo').trigger('change'); // Notify any JS components that the value changed

                        }
                        if (!response["data"]["ck_SaleTax"]) {
                            $('#ck_saleTax').iCheck('uncheck');
                        } else { $('#ck_saleTax').iCheck('check'); }

                        // $("#txt_cat").val(response["data"]["category"]);
                        $("#txt_rmk").val(response["data"]["remarks"]);

                        _Customer_ID = response["data"]["customerId"];
                        _Customer_Name = response["data"]["customerName"];
                        $('#txt_cus').val(_Customer_ID); // Select the option with a value of '1'
                        $('#txt_cus').trigger('change'); // Notify any JS components that the value changed

                        _salesman_id = response["data"]["employeeId"];
                        _salesman_nam = response["data"]["employeeName"];
                        $('#txt_slsman').val(_salesman_id); // Select the option with a value of '1'
                        $('#txt_slsman').trigger('change'); // Notify any JS components that the value changed


                        //Detail Start

                        const _DetailRecord = response["data"]["quotationDetailViewModels"];
                        var sno = 1;
                        var productItem;
                        for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {
                            var ck = false;
                            if (_DetailRecord[row_cnt]["approved"] == true) {
                                ck = 'checked';
                            }
                            productItem += '<tr>' +
                                //                               
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                '<td>' + sno++ + '</td>' +
                                '<td style="display: none;">' + _DetailRecord[row_cnt]["itemId"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["itemName"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["quantity"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["rate"] + '</td>' +
                                '<td style="display: none;">' + _DetailRecord[row_cnt]["customerLocationId"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["customerLocationName"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["deliveryDay"] + '</td>' +
                                '<td> <input type="checkbox" id="app_check' + row_cnt + '" class="icheck" data-checkbox="icheckbox_square-grey" ' + ck + '>' + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["remarks"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["description"] + '</td>' +
                                '<td style="display: none;">' + _DetailRecord[row_cnt]["itemSubCategoryIdPaper"] + '</td>' +
                                '<td style="display: none;">' + _DetailRecord[row_cnt]["printingColorId"] + '</td>' +
                                '<td style="display: none;">' + _DetailRecord[row_cnt]["id"] + '</td>' +
                                '<td style="display:none;">' + _DetailRecord[row_cnt]["rowId"] + '</td>' +

                                '</tr>';
                            app_checkid = row_cnt
                        }
                        detailsTableBody.append(productItem);


                        //Terms Condition Start

                        const _TermsConditionRecord = response["data"]["quotationTermsConditionViewModels"];
                        var productItemTC;
                        for (var row_cnt = 0; row_cnt < _TermsConditionRecord.length; row_cnt++) {
                            var _checked = Boolean(_TermsConditionRecord[row_cnt]["mandatory"]) ? 'checked' : '';
                            var _checked1 = Boolean(_TermsConditionRecord[row_cnt]["check"]) ? 'checked' : '';
                            var _style = Boolean(_TermsConditionRecord[row_cnt]["mandatory"]) ? 'disabled' : '';

                            productItemTC += '<tr>' +
                                '<td style="display:none;">' + _TermsConditionRecord[row_cnt]["mandatory"] + '</td>' +
                                '<td ><input id="ck_tc" name="ck_tc" type="checkbox" ' + _checked + ' ' + _checked1 + ' ' + _style + ' /></td>' +
                                '<td>' + _TermsConditionRecord[row_cnt]["name"] + '</td>' +
                                '</tr>';
                        }
                        detailsTableBodyTC.append(productItemTC);

                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();

                        return true;
                    }
                    else {
                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();

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
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.show();
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

            })
        }
    })
});
//Edit End
//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _No = data['no'];
    var _Check = data['check'];
    var _Approved = data['approved'];

    var _Active = data['active'];
    if (Boolean(_Active)) {
        Swal.fire({
            title: "Order has been processed",
            icon: 'warning',
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

    if (Boolean(_Approved)) {
        Swal.fire({
            title: "Quotation has been approved",
            icon: 'warning',
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

    if (Boolean(_Check)) {
        Swal.fire({
            title: "Quotation has been checked",
            icon: 'warning',
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

    //var _nam = data['Name'];
    Swal.fire({
        title: 'Are sure wants to edit <br/>' + _No + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm,
                type: "Delete",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "ID": _id,
                    "menu_Id": _menuid
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        imgload.hide();
                        discon();
                        Swal.fire({
                            title: response.message,

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
                    imgloadsav.hide();
                    btnsav.show();
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
            })
        }
    })
});
//Delete End

//Value Addition Start

//Fill Paper Item Start
function FillPaperItem() {

    $("#txt_pitem").select2({
        placeholder: "Search for Paper Item",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemSubCategoryPaper',
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

        initSelection: function (element, callback) {
            var data = { "id": _Item_ID, "text": _Item_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Item End

//Fill Printing Color Start
function FillPColor() {
    $("#txt_pcolor").select2({
        placeholder: "Search for Printing Color",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetPrintingColor',
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

        initSelection: function (element, callback) {
            var data = { "id": _Item_ID, "text": _Item_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Printing Color End

//Fill Printing Water Base Start
function FillPWB() {
    $("#txt_pwbase").select2({
        placeholder: "Search for Water Base",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetPrintingWaterBase',
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

        initSelection: function (element, callback) {
            var data = { "id": _WaterBase_ID, "text": _WaterBase_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Printing Water Base End

//Fill Printing OPV Start
function FillPOPV() {
    $("#txt_popv").select2({
        placeholder: "Search for OPV",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetPrintingOPV',
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

        initSelection: function (element, callback) {
            var data = { "id": _OPV_ID, "text": _OPV_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Printing OPV End

//Fill UV Coating  Start
function FillUVC() {
    $("#txt_uvc").select2({
        placeholder: "Search for Coating",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetUvCoating',
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

        initSelection: function (element, callback) {
            var data = { "id": _UVC_ID, "text": _UVC_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill UV Coating End

//Fill UV Coating Area  Start
function FillUVCA() {
    $("#txt_uvca").select2({
        placeholder: "Search for Coating Area",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetUvCoatingArea',
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

        initSelection: function (element, callback) {
            var data = { "id": _UVCA_ID, "text": _UVCA_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill UV Coating Area End

//Fill UV Holographic Coating Start
function FillUVHC() {
    $("#txt_uvhc").select2({
        placeholder: "Search for Holographic Coating ",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetUvHolographicCoating',
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

        initSelection: function (element, callback) {
            var data = { "id": _UVHC_ID, "text": _UVHC_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}//Fill UV Holographic Coating  End

//Fill UV Holographic Coating Area  Start
function FillUVHCA() {
    $("#txt_uvhca").select2({
        placeholder: "Search for Holographic Coating Area",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetUvHolographicCoatingArea',
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

        initSelection: function (element, callback) {
            var data = { "id": _UVHCA_ID, "text": _UVHCA_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill UV Holographic Coating Area End


//Fill Lamination Coating Start
function FillLC() {
    $("#txt_lc").select2({
        placeholder: "Search for Lamination Coating ",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetLaminationCoating',
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

        initSelection: function (element, callback) {
            var data = { "id": _LC_ID, "text": _LC_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Lamination Coating  End

//Fill Lamination Coating Area  Start
function FillLCA() {
    $("#txt_lca").select2({
        placeholder: "Search for Lamination Coating Area",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetLaminationCoatingArea',
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

        initSelection: function (element, callback) {
            var data = { "id": _LCA_ID, "text": _LCA_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Lamination Coating Area End

//Fill Foiling Hot Stamping  Start
function FillFHS() {
    $("#txt_fhs").select2({
        placeholder: "Search for Foiling Hot Stamping ",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetFoilingHotStamping',
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

        initSelection: function (element, callback) {
            var data = { "id": _FHS_ID, "text": _FHS_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Foiling Hot Stamping End

//Fill Foiling Hot Stamping Area  Start
function FillFHSA() {
    $("#txt_fhsa").select2({
        placeholder: "Search for Foiling Hot Stamping Area",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetFoilingHotStampingArea',
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

        initSelection: function (element, callback) {
            var data = { "id": _FHSA_ID, "text": _FHSA_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Foiling Hot Stamping Area End

//Fill Die Cutting  Start
function FillDC() {
    $("#txt_dc").select2({
        placeholder: "Search for Die Cutting",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetDieCutting',
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

        initSelection: function (element, callback) {
            var data = { "id": _DC_ID, "text": _DC_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Die Cutting End

//Fill Pasting  Start
function FillPasting() {
    $("#txt_pasting").select2({
        placeholder: "Search for Pasting",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetPasting',
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

        initSelection: function (element, callback) {
            var data = { "id": _Pasting_ID, "text": _Pasting_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Pasting End

//Fill Eyelet  Start
function FillEyelet() {
    $("#txt_eyelet").select2({
        placeholder: "Search for Eyelet",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetEyelet',
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

        initSelection: function (element, callback) {
            var data = { "id": _Eyelet_ID, "text": _Eyelet_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Eyelet End

//Fill Sublet  Start
function FillSublet() {
    $("#txt_sublet").select2({
        placeholder: "Search for Sublet",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetSublet',
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

        initSelection: function (element, callback) {
            var data = { "id": _Sublet_ID, "text": _Sublet_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Sublet End

//Fill PN  Start
function FillPN() {
    $("#txt_pn").select2({
        placeholder: "Search for Nature of Packing",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Production/v1/LOVServicesProduction/GetPackingNature',
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

        initSelection: function (element, callback) {
            var data = { "id": _PN_ID, "text": _PN_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill PN End

//Value Addition End

//Detail Add 
function detail() {

    if ($('#txt_pitem').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Enter Item",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_pcolor').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Color",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_pwbase').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Water Base",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_popv').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any OPV",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_uvc').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any UV Coating",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_uvca').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any UV Coating Area",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_uvhc').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Holographic Coating",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_uvhca').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Holographic Coating Area",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_lc').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Lamination Coating",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_lca').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Lamination Coating Arae",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_fhs').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Hot stamping",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_fhsa').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Hot stamping Area",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_dc').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Die Cutting",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_pasting').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Pasting",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_eyelet').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Eyelet",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_sublet').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Sublet",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    } else if ($('#txt_pn').val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Select Any Nature of Packing",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return false;
    }

    var txtdday = $("#txt_deldays").val()
    var txtqty = $("#txt_qty").val();
    var txtitm_id = $('#txt_itm').select2('data').id
    var txtitm_nam = $('#txt_itm').select2('data').text
    var txtlocation_id = $('#txt_location').select2('data').id;
    var txtlocation_nam = $('#txt_location').select2('data').text;
    var txtrmk = $("#txt_itmrmk").val();
    var _PrintColorName = '', _WaterBaseName = '', _OPVName = '', _UVCName = '', _UVCAName = '', _UVHCName = '', _UVHCAName = '', _LCName = '', _LCAName = '', _FHSName = '', _FHSAName = '', _DCName = '', _PastingName = '', _EyeletName = '', _SubletName = '', _PNName = '';

    if ($('#txt_pcolor').select2('data').id != -1) {
        _PrintColorName = ' Color : ' + $('#txt_pcolor').select2('data').text;
    }
    if ($('#txt_pwbase').select2('data').id != -1) {
        _WaterBaseName = ' Water Base : ' + $('#txt_pwbase').select2('data').text;
    }
    if ($('#txt_popv').select2('data').id != -1) {
        _OPVName = ' OPV : ' + $('#txt_popv').select2('data').text;
    }
    if ($('#txt_uvc').select2('data').id != -1) {
        _UVCName = ' Coating : ' + $('#txt_uvc').select2('data').text;
    }


    if ($('#txt_uvca').select2('data').id != -1) {
        _UVCAName = ' Coating Area : ' + $('#txt_uvca').select2('data').text;
    }
    if ($('#txt_uvhc').select2('data').id != -1) {
        _UVHCName = ' Holographic Coating : ' + $('#txt_uvhc').select2('data').text;
    }

    if ($('#txt_uvhca').select2('data').id != -1) {
        _UVHCAName = ' Holographic Coating Area : ' + $('#txt_uvhca').select2('data').text;
    }
    if ($('#txt_lc').select2('data').id != -1) {
        _LCName = ' Coating : ' + $('#txt_lc').select2('data').text;
    }


    if ($('#txt_lca').select2('data').id != -1) {
        _LCAName = ' Coating Area : ' + $('#txt_lca').select2('data').text;
    }
    if ($('#txt_fhs').select2('data').id != -1) {
        _FHSName = ' Hot Stamping : ' + $('#txt_fhs').select2('data').text;
    }

    if ($('#txt_fhsa').select2('data').id != -1) {
        _FHSAName = ' Hot Stanping Area : ' + $('#txt_fhsa').select2('data').text;
    }
    if ($('#txt_dc').select2('data').id != -1) {
        _DCName = ' Die Cutting : ' + $('#txt_dc').select2('data').text;
    }

    if ($('#txt_pasting').select2('data').id != -1) {
        _PastingName = ' Pasting : ' + $('#txt_pasting').select2('data').text;
    }
    if ($('#txt_eyelet').select2('data').id != -1) {
        _EyeletName = ' Eyelet : ' + $('#txt_eyelet').select2('data').text;
    }

    if ($('#txt_sublet').select2('data').id != -1) {
        _SubletName = ' Sublet : ' + $('#txt_sublet').select2('data').text;
    }
    if ($('#txt_pn').select2('data').id != -1) {
        _PNName = ' Nature Of Packing : ' + $('#txt_pn').select2('data').text;
    }

    var _TableDetail = $("#detailsTable tbody");
    var app_checkid = _TableDetail.length;
    var sno = app_checkid + 1;
    _TableDetail.append('<tr>' +

        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
        '<td>' + sno++ + '</td>' +
        '<td style="display: none;">' + txtitm_id + '</td>' +
        '<td>' + txtitm_nam + '</td>' +
        '<td>' + txtqty + '</td>' +
        '<td>' + 0 + '</td>' +
        '<td style="display: none;">' + txtlocation_id + '</td>' +
        '<td>' + txtlocation_nam + '</td>' +
        '<td>' + txtdday + '</td>' +
        '<td> <input type="checkbox" id="app_check' + app_checkid + '" class="icheck" data-checkbox="icheckbox_square-grey">' + '</td>' +
        '<td>' + txtrmk + '</td>' +
        '<td>' + $('#txt_pitem').select2('data').text + ' ' + _PrintColorName + ' ' + _WaterBaseName + ' ' + _OPVName + ' ' + _UVCName + ' ' + _UVCAName + ' ' + _UVHCName + ' ' + _UVHCAName + ' ' + _LCName + ' ' + _LCAName + ' ' + _FHSName + ' ' + _FHSAName + ' ' + _DCName + ' ' + _PastingName + ' ' + _EyeletName + ' ' + _SubletName + ' ' + _PNName + '</td>' +
        '<td style="display: none;">' + $('#txt_pitem').select2('data').id + '</td>' +
        '<td style="display: none;">' + $('#txt_pcolor').select2('data').id + '</td>' +
        '<td style="display: none;">' + 0 + '</td>' +
        '</tr>');

    app_checkid++;
    discondet();


}
//Detail Add



//Validation Start
function ckvalidation() {

    var ck = 0, _Error = '', _cre = '';
    txtid = $("#txt_id").html();
    txtdat1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    txtcus = $('#txt_cus');
    txtslsman = $('#txt_slsman');
    txtrmk = $("#txt_rmk");
    txtpquo = $("#txt_pquo");
    var ck_saletax = $("#ck_saleTax").iCheck('Update')[0].checked;

    var rows_create = $("#detailsTable tbody >tr");
    var rows_create_termscondition = $("#termscondition_Table tbody >tr");
    var detail_record = [];

    var detail_record_termscondition = [];


    if (txtdat1 == "") {
        ck = 1;
        _Error = "Please enter date";
    } else if (txtcus.val() == "") {
        ck = 1;
        _Error = "Please select customer";
        txtcus.focus();
    } else if (txtslsman.val() == "") {
        ck = 1;
        _Error = "Please select salesman";
        txtslsman.focus();
    }
    else if (rows_create.length == 0) {
        ck = 1;
        _Error = "Detail not found";
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {

        for (var i = 0; i < rows_create.length; i++) {
            columns = $(rows_create[i]).find('td');
            detail_record.push({
                "itemId": $(columns[2]).html(),
                "quantity": $(columns[4]).html(),
                "customerLocationId": $(columns[6]).html(),
                "deliveryDay": $(columns[8]).html(),
                "remarks": $(columns[10]).html(),
                "description": $(columns[11]).html(),
                "itemSubCategoryIdPaper": $(columns[12]).html(),
                "printingColorId": $(columns[13]).html(),
                "detailId": $(columns[14]).html(),
                "rowId": $(columns[15]).html(),
            })

        }

        for (var i = 0; i < rows_create_termscondition.length; i++) {
            columnstermscondition = $(rows_create_termscondition[i]).find('td');
            var _checkValue = $(columnstermscondition[1]).find('[name="ck_tc"]').prop('checked');
            var _ckman = false;
            if ($(columnstermscondition[0]).html() == 'true') { _ckman = true; }

            if (Boolean(_checkValue)) {
                detail_record_termscondition.push({
                    "mandatory": _ckman,
                    "name": $(columnstermscondition[2]).html(),
                })
            }
        }

        _cre = JSON.stringify({
            "Id": txtid,
            "date": txtdat1,
            "remarks": txtrmk.val(),
            "employeeId": txtslsman.val(),
            "customerId": txtcus.val(),
            "ck_SaleTax": ck_saletax,
            "previousId": txtpquo.val(),
            "quotationDetailViewModels": detail_record,
            "quotationTermsConditionViewModels": detail_record_termscondition,
            "menu_Id": _menuid,
        });
    }
    return { ckval: ck, creteria: _cre };
}
//Validation End


//Validation for item Start
function ckvalidationforItems() {

    var ck = 0, _Error = '', _cre = '';
    var txtbd = $('#txt_bd').val();
    var txtitsub_id = $("#txt_sb").val();
    var txtnam = $('#txt_nam').val();




    if (txtbd == "") {
        ck = 1;
        _Error = "Please select Item";
    } else if (txtitsub_id == "") {
        ck = 1;
        _Error = "Please select SubCategory";

    }
    else if (txtnam == '') {
        ck = 1;
        _Error = "Please Enter Name";
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {

        _cre = JSON.stringify({
            "name": txtnam,
            "qty": 0,
            "masterQty": 0,
            "minQty": 0,
            "manufacturerQty": 0,
            "reOrderQty": 0,
            "hight": 0,
            "width": 0,
            "weight": 0,
            "paperScale": "",
            "type": 'U',
            "itemSubCategoryId": txtitsub_id,
            "brandId": txtbd,
            "innerscaleId": '4F7075A5-B13A-4B20-AFDD-1DB14E61A543',
            "manufactureScaleId": '4F7075A5-B13A-4B20-AFDD-1DB14E61A543',
            "masterScaleId": '4F7075A5-B13A-4B20-AFDD-1DB14E61A543',
            "itemCategoryId": '5BD498DB-C9EE-462D-9A6E-2C5789D92E0B',
            "menu_Id": _menuid,


        });
    }
    return { ckval: ck, creteria: _cre };
}
//Validation for itm End
// //Validation End



//Trigger after Selection Start
$('#txt_innerscale').on("select2-selected", function (e) {
    var txtinnerscale = $("#txt_innerscale");
    var lblmasterscale = $("#lbl_masterscale");
    lblmasterscale.html(txtinnerscale.select2('data').text + 'In a');
});

//Trigger after Clear Start
$('#txt_innerscale').on("select2-removed", function (e) {
    var lblmasterscale = $("#lbl_masterscale");
    lblmasterscale.html('In a');
});
//Trigger after Clear End
//Delete from Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    Swal.fire({
        text: "Are sure wants to delete",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            e.preventDefault();
            var $self = $(this);
            if ($(this).attr('data-itemId') == "0") {
                $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
                    $(this).remove();
                });
            }
        }
    })
});
//Delete from Table End

//Terms & Conditions
function FillTermsCondition() {
    var detailsTableBody = $("#termscondition_Table tbody");
    detailsTableBody.empty();
    $.ajax({
        url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetTermsCondition',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
        },
        success: function (response) {
            if (response.statusCode == 200) {

                var productItem;
                for (var row_cnt = 0; row_cnt < response.data.length; row_cnt++) {
                    var _checked = Boolean(response.data[row_cnt]["mandatory"]) ? 'checked' : '';
                    var _style = Boolean(response.data[row_cnt]["mandatory"]) ? 'disabled' : '';
                    productItem += '<tr>' +
                        '<td style="display:none;">' + response.data[row_cnt]["mandatory"] + '</td>' +
                        '<td ><input id="ck_tc" name="ck_tc" type="checkbox" ' + _checked + ' ' + _style + ' /></td>' +
                        '<td>' + response.data[row_cnt]["name"] + '</td>' +
                        '</tr>';
                }
                detailsTableBody.append(productItem);
            }

        },
        error: function (xhr, status, err) {
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


//Fill Previous Quotation Start
function FillPreviousQuotation() {
    $("#txt_pquo").select2({
        placeholder: "Search for previous quotation",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetPreviousQuotationByCustomer',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CustomerId", $('#txt_cus').select2('data').id);
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

        initSelection: function (element, callback) {
            var data = { "id": _Previous_ID, "text": _Previous_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Customer End



$('#txt_pquo').on("select2-selected", function (e) {

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    var detailsTableBodyTC = $("#termscondition_Table tbody");
    detailsTableBodyTC.empty();
    $.ajax({

        url: ApiForm + '/GetQuotationById',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
            xhr.setRequestHeader("_Id", $("#txt_pquo").select2('data').id);
        },
        success: function (response) {
            if (response.statusCode == 200) {
                //Detail Start

                const _DetailRecord = response["data"]["quotationDetailViewModels"];
                var sno = 1;
                var productItem;
                for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {
                    var ck = false;
                    if (_DetailRecord[row_cnt]["approved"] == true) {
                        ck = 'checked';
                    }
                    productItem += '<tr>' +
                        //                               
                        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                        '<td>' + sno++ + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["itemId"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["itemName"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["quantity"] + '</td>' +
                        '<td>0</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["customerLocationId"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["customerLocationName"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["deliveryDay"] + '</td>' +
                        '<td> <input type="checkbox" id="app_check' + row_cnt + '" class="icheck" data-checkbox="icheckbox_square-grey" ' + ck + '>' + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["remarks"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["description"] + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["itemSubCategoryIdPaper"] + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["printingColorId"] + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["id"] + '</td>' +
                        '<td style="display:none;">' + _DetailRecord[row_cnt]["rowId"] + '</td>' +

                        '</tr>';
                    app_checkid = row_cnt
                }
                detailsTableBody.append(productItem);


                //Terms Condition Start

                const _TermsConditionRecord = response["data"]["quotationTermsConditionViewModels"];
                var productItemTC;
                for (var row_cnt = 0; row_cnt < _TermsConditionRecord.length; row_cnt++) {
                    var _checked = Boolean(_TermsConditionRecord[row_cnt]["mandatory"]) ? 'checked' : '';
                    var _checked1 = Boolean(_TermsConditionRecord[row_cnt]["check"]) ? 'checked' : '';
                    var _style = Boolean(_TermsConditionRecord[row_cnt]["mandatory"]) ? 'disabled' : '';

                    productItemTC += '<tr>' +
                        '<td style="display:none;">' + _TermsConditionRecord[row_cnt]["mandatory"] + '</td>' +
                        '<td ><input id="ck_tc" name="ck_tc" type="checkbox" ' + _checked + ' ' + _checked1 + ' ' + _style + ' /></td>' +
                        '<td>' + _TermsConditionRecord[row_cnt]["name"] + '</td>' +
                        '</tr>';
                }
                detailsTableBodyTC.append(productItemTC);

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

    })

});

