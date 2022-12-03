var url = params = new URLSearchParams(window.location.search);

var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var btnupd = $('#btn_update');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var txtdat = $("#txt_dat");
var txtddat = $("#txt_ddat");
var btnnew = $("#btn_new ");
var ApiForm = '';

var _Currency_Id = '0';
var _Currency_Name = '';

var _Requisition_Id = '0';
var _Requisition_Name = '';

var _Item_Id = '0';
var _Item_Name = '';

var _Supplier_Id = '0';
var _Supplier_Name = '';

var _srNo = 1;


$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtddat.datetimepicker({ format: 'DD/MMM/YYYY' });
});


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Procurement/v1';
    imgload.hide();
    ComponentsDropdowns.init();
    discon();

});

//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        //Fetch Currency Start
        fillCurrency();
        //Currency End

        //Fetch Requisition Start
        fillRequisition();
        //Requisition End

        //Fetch Requisition Start
        fillRequisitionItem();
        //Requisition End

        //Fill Supplier Start
        fillSupplier();
        //Supplier End

        //Terms & Condition Start
        FillTermsCondition();
        //Terms & Condition End

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();

//Fill Currency Start
function fillCurrency() {

    $("#txt_cur").select2({
        placeholder: "Search For Currency",
        //minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetCurrency',
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
        initSelection: function (element, callback) {
            var data = { "id": _Currency_Id, "text": _Currency_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Currency End 

$('#txt_cur').on("select2-selected", function (e) {
    _Currency_Id = $("#txt_cur").select2('data').id
});
//Fill Requisition Start
function fillRequisition() {
    $("#txt_req").select2({
        placeholder: "Search For Requisition",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        //multiple: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Procurement/v1/LOVServicesPurchase/GetRequisition',
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
                    Category: $('#ddl_category').val(),
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
        initSelection: function (element, callback) {
            var data = { "id": _Requisition_Id, "text": _Requisition_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Requisition End

$('#txt_req').on("select2-selected", function (e) {
    _Requisition_Id = $("#txt_req").select2('data').id;
    fillRequisitionItem();
});
function fillRequisitionItem() {
    $("#txt_itm").select2({
        placeholder: "Search For  Item",
        //minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        //multiple: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Procurement/v1/LOVServicesPurchase/GetRequisitionDetail',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_Id", $("#txt_req").select2('data').id);
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
                            id: item.itemId,
                            text: item.itemName,
                            UOM: item.uom,
                            Qty: item.qty,
                            Remarks: item.remarks,

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
            var data = { "id": _Item_Id, "text": _Item_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
$('#txt_itm').on("select2-selected", function (e) {
    _Item_Id = $("#txt_itm").select2('data').id;
    $("#txt_reqQty").val($("#txt_itm").select2('data').Qty);
});

//Fill Supplier Start
function fillSupplier() {

    $("#txt_sup").select2({
        placeholder: "Search For Supplier",
        //minimumInputLength: 1,
        triggerChange: true,
        //allowClear: true,
        //multiple: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPurchase/GetSuppliers',
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
                        text: data.message,

                    })
                }
                else {
                    $.each(data.data, function (index, item) {
                        myResults.push({
                            id: item.id,
                            text: item.name,
                            GSTPercentage: item.gstPercentage,
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
            var data = { "id": _Supplier_Id, "text": _Supplier_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Supplier End

$('#txt_sup').on("select2-selected", function (e) {
    _Supplier_Id = $("#txt_sup").select2('data').id
    $("#txt_gstPer").val($("#txt_sup").select2('data').GSTPercentage);

});


function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    Onload();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    txtddat.find("input").val(CurrentDate);

    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();


    $('#txt_sup').select2('val', '');
    $('#txt_sup').html('');

    $('#txt_cur').select2('val', '');
    $('#txt_cur').html('');

    $('#txt_req').select2('val', '');
    $('#txt_req').html('');

    $("#txt_crd").val('0');
    $("#txt_exr").val('1');
    $("#txt_rmk").val('');
    $("#txt_no").html('');

    imgload.hide();
    _srNo = 1;
}

function Onload() {
    $.ajax({
        url: ApiForm + '/PurchaseOrder',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var action_button = ' ';
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

                //Print
                if (Boolean(response["data"][0]["printPermission"])) {
                    action_button += "<a href='#' class='btn-print glyphicon glyphicon-print' data-toggle='tooltip' title='Print'></a> ";
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
                            { data: 'category' },
                            { data: 'requisitionNo' },
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },

                            { data: 'supplierName' },
                            { data: 'itemName' },
                            {
                                data: 'deliveryDate',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },
                            { data: 'remarks' },
                            { data: 'stage' },

                        ],
                        "order": [[2, "desc"], [1, "asc"]],
                        "pageLength": 10,

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

$(document).on("click", '#btn_new', function () {
    $('#data_Modal').modal('show');
    $('#txt_id').html("");

    $('#txt_job').select2('val', '');
    $('#txt_job').html('');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    var rows_create = $("#detailsTable tbody >tr");
    rows_create.empty();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    txtddat.find("input").val(CurrentDate);
    $("#ck_SalesTax").iCheck('Update')[0].checked;
    $('#ck_SalesTax').iCheck('uncheck');
    FillTermsCondition();

    btnupd.hide();
    btnsav.show();
    imgloadsav.hide();
});


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
            $.ajax({
                url: ApiForm + '/PurchaseOrder',
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


                        btnsav.show();
                        $('#data_Modal').modal('hide');
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
                        imgloadsav.hide();
                        discon();
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

function updrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;


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
                url: ApiForm + '/PurchaseOrder',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnupd.hide();
                },
                success: function (response) {
                    var jres = response;
                    if (response.statusCode == 200) {
                        imgloadsav.hide();
                        discon();
                        btnsav.show();
                        $('#data_Modal').modal('hide');
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

//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _no = data['no'];
    var _name = data['name'];
    var _type = data['type'];


    var _Stage = data['stage'];

    if (_Stage != 'Open') {
        Swal.fire({
            title: "Purchase Order has been " + _Stage,
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
        title: 'Are sure wants to delete <br> ' + _no + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
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
                url: ApiForm + '/PurchaseOrder',
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

                        imgload.hide();
                        discon();
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


//Edit Start
$('table').on('click', '.btn-edit', function (e) {


    e.preventDefault();
    var currentRow = $(this).closest("tr");

    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _no = data['no'];
    var _Stage = data['stage'];

    if (_Stage != 'Open') {
        Swal.fire({
            title: "Purchase Order has been " + _Stage,
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
        title: 'Are sure wants to edit <br/>' + _no + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'edit',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/PurchaseOrder/GetPurchaseOrderById',
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

                        $('#txt_id').html(response["data"]["id"]);
                        $('#txt_no').html(response["data"]["no"]);

                        $('#txt_crd').val(response["data"]["creditDay"]);
                        $('#txt_exr').val(response["data"]["exchangeRate"]);
                        $('#txt_rmk').val(response["data"]["remarks"]);
                        $('#ddl_category').val(response["data"]["category"]);
                        $('#txt_gstPer').val(response["data"]["gstPercentage"]);

                        $('#txt_dat').find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));
                        $('#txt_ddat').find("input").val(moment(response["data"]["deliveryDate"]).format("DD/MMM/YYYY"));


                        if (!response["data"]["ck_SaleTax"]) {
                            $('#ck_SalesTax').iCheck('uncheck');
                        } else { $('#ck_SalesTax').iCheck('check'); }

                        _Currency_Id = response["data"]["currencyId"];
                        _Currency_Name = response["data"]["currencyName"];
                        $('#txt_cur').val(_Currency_Id); // Select the option with a value of '1'
                        $('#txt_cur').trigger('change'); // Notify any JS components that the value changed

                        _Supplier_Id = response["data"]["supplierId"];
                        _Supplier_Name = response["data"]["supplierName"];
                        $('#txt_sup').val(_Supplier_Id); // Select the option with a value of '1'
                        $('#txt_sup').trigger('change'); // Notify any JS components that the value changed

                        var _detailsTable = $("#detailsTable tbody");
                        _detailsTable.empty();
                        var detailsTableBodyTC = $("#termscondition_Table tbody");
                        detailsTableBodyTC.empty();
                        var _detailRecord = response["data"]["purchaseOrderDetailViewModels"];
                        for (var user_row_cnt = 0; user_row_cnt < _detailRecord.length; user_row_cnt++) {

                            var _amount = parseFloat(_detailRecord[user_row_cnt]["amount"]), _gstper = parseFloat(_detailRecord[user_row_cnt]["gstPercentage"]), _gstamt = 0, _netamount = 0;
                            _gstamt = parseFloat(_amount) * (parseFloat(_gstper) / 100);
                            _netamount = parseFloat(_amount) + parseFloat(_gstamt);

                            var _Row = '<tr>' +
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                '<td >' + _srNo + '</td>' +
                                '<td hidden>' + _detailRecord[user_row_cnt]["requisitionId"] + '</td>' +
                                '<td >' + _detailRecord[user_row_cnt]["requisitionName"] + '</td>' +
                                '<td hidden>' + _detailRecord[user_row_cnt]["itemId"] + '</td>' +
                                '<td>' + _detailRecord[user_row_cnt]["itemName"] + '</td>' +
                                '<td>' + _detailRecord[user_row_cnt]["uom"] + '</td>' +
                                '<td>' + accounting.format(_detailRecord[user_row_cnt]["requisitionQty"], 4) + '</td>' +
                                '<td>' + accounting.format(_detailRecord[user_row_cnt]["qty"], 4) + '</td>' +
                                '<td>' + moment(_detailRecord[user_row_cnt]["deliveryDate"]).format("YYYY-MM-DD") + '</td>' +
                                '<td>' + "" + '</td>' +
                                '<td>' + _detailRecord[user_row_cnt]["rate"] + '</td>' +
                                '<td>' + accounting.format(_amount, 0) + '</td>' +
                                '<td>' + _gstper + '</td>' +
                                '<td>' + accounting.format(_gstamt, 0) + '</td>' +
                                '<td>' + accounting.format(_netamount, 0) + '</td>' +
                                '<td>' + _detailRecord[user_row_cnt]["remarks"] + '</td>' +
                                '<td>' + _detailRecord[user_row_cnt]["hsCode"] + '</td>';
                            _Row += '</tr>';

                            _Requisition_Id = _detailRecord[user_row_cnt]["requisitionId"];
                            _Requisition_Name = _detailRecord[user_row_cnt]["requisitionName"];
                            // $('#txt_req').val(_Requisition_Id); // Select the option with a value of '1'
                            // $('#txt_req').trigger('change'); // Notify any JS components that the value changed
                            _detailsTable.append(_Row);
                            _srNo++;


                        }

                        //Terms Condition Start
                        const _TermsConditionRecord = response["data"]["purchaseOrderTermsConditionViewModels"];
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

                        dgcal();


                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();
                        document.getElementById("ddl_category").disabled =true ;
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



//Delete from Record Table Start
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
    var rows_create = $("#detailsTable tbody >tr");
    if (rows_create.length == 1) {
        document.getElementById("ddl_category").disabled = false;
    }

});



//Validation
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var txt_rmk = $('#txt_rmk');
    var txt_sup = $('#txt_sup');
    var txt_cur = $('#txt_cur');
    var txt_exrate = $('#txt_exr');
    var txt_creditday = $('#txt_crd');
    var ddl_category = $('#ddl_category');

    var txtdate1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    var ck_SalesTax = $("#ck_SalesTax").iCheck('Update')[0].checked;


    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];

    var rows_create = $("#detailsTable tbody >tr");
    var rows_create_termscondition = $("#termscondition_Table tbody >tr");
    var detail_record_termscondition = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        detail_record.push({
            "requisitionId": $(columns[2]).html().trim(),
            "itemId": $(columns[4]).html(),
            "uom": $(columns[6]).html(),
            "qty": accounting.unformat($(columns[8]).html(), 0),
            "deliveryDate": $(columns[9]).html(),
            "lastSupplierRateDate": $(columns[10]).html(),
            "rate": parseInt($(columns[11]).html(), 0),
            "amount": accounting.unformat($(columns[12]).html(), 0),
            "gstPercentage": parseInt($(columns[13]).html(), 0),
            "remarks": $(columns[16]).html(),
            "hsCode": $(columns[17]).html(),
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

    if (detail_record == '') {
        ck = 1;
        _Error = 'Please Fill Detail Table';

    }
    if (txt_sup.val() == '') {
        ck = 1;
        _Error = 'Please Fill Supplier';

    }
    if (txt_cur.val() == '') {
        ck = 1;
        _Error = 'Please Fill Currency';

    }
    if (txt_exrate.val() == '' || txt_exrate.val() == '0' || txt_exrate.val < 0) {
        ck = 1;
        _Error = 'Exchange Rate should be greater then zero';

    }
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return;
    }

    _cre = JSON.stringify({
        "ID": txtid,
        "date": txtdate1,
        "creditDay": txt_creditday.val(),
        "exchangeRate": txt_exrate.val(),
        "supplierId": _Supplier_Id,
        "currencyId": _Currency_Id,
        "ck_SaleTax": ck_SalesTax,
        "category": ddl_category.val(),
        "remarks": txt_rmk.val(),
        "type": "U",
        "menu_Id": _menuid,
        "purchaseOrderDetailAddViewModel": detail_record,
        "purchaseOrderTermsConditionViewModels": detail_record_termscondition,
    });
    return { ckval: ck, creteria: _cre };
}

//Add Requisition
function AddReq() {
    var txtdate2 = moment(txtddat.find("input").val()).format("YYYY-MM-DD");
    var _rate = $("#txt_rat").val();
    var _qty = $("#txt_qty").val();

    var _amount = parseFloat(_qty) * parseFloat(_rate);
    var _GSTPercentage = $("#txt_gstPer").val();
    var _GSTAmount = parseFloat(_amount) * (parseFloat(_GSTPercentage / 100));// $("#txt_gstPer").val();
    var _netamount = parseFloat(_amount) + parseFloat(_GSTAmount);// $("#txt_gstPer").val();


    if ($("#txt_sup").select2('data') == null) {
        Swal.fire({
            title: 'Please select supplier',

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true
    }
    if ($("#txt_req").select2('data') == null) {
        Swal.fire({
            title: 'Please select Requisition',

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true
    }
    if ($("#txt_itm").select2('data') == null) {
        Swal.fire({
            title: 'Please select Item',

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true
    }
    if (_rate == '') {
        Swal.fire({
            title: 'Please select rate',

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true
    }
    if (_rate < 0) {
        Swal.fire({
            title: 'rate should greater then zero',

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true
    }
    if (_qty == '') {
        Swal.fire({
            title: 'Please select quantity',

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true
    }
    if (_qty < 0) {
        Swal.fire({
            title: 'quantity should greater then zero',

            icon: 'warning',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return true
    }

    var detailsTableBody = $("#detailsTable tbody");
    // detailsTableBody.empty();
    var productItem;
    var _RequisitionQty = $("#txt_reqQty").val();

    productItem += '<tr>' +
        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
        '<td>' + _srNo + ' </td>' +
        '<td style="display: none;">' + $("#txt_req").select2('data').id + '</td>' +
        '<td>' + $("#txt_req").select2('data').text + '</td>' +
        '<td style="display: none;">' + $("#txt_itm").select2('data').id + '</td>' +
        '<td>' + $("#txt_itm").select2('data').text + '</td>' +
        '<td>' + $("#txt_itm").select2('data').UOM + '</td>' +
        '<td>' + accounting.format(_RequisitionQty, 4) + '</td>' +
        '<td>' + accounting.format(_qty, 4) + '</td>' +
        '<td>' + txtdate2 + '</td>' +
        '<td>' + "" + '</td>' +
        '<td>' + _rate + ' </td>' +
        '<td>' + accounting.format(_amount, 0) + '</td>' +
        '<td>' + _GSTPercentage + '</td>' +
        '<td>' + accounting.format(_GSTAmount, 0) + '</td>' +
        '<td>' + accounting.format(_netamount, 0) + '</td>' +
        '<td>' + $("#txt_itm").select2('data').Remarks + '</td>' +
        '<td>' + "hscode" + '</td>'

    productItem += '</tr>';
    detailsTableBody.append(productItem);
    dgcal();
    clearFields();
    _srNo++;
    document.getElementById("ddl_category").disabled =true ;

}
//End Requisition
function dgcal() {

    var _txtamount = $("#txt_amount");
    var _txtgstamount = $("#txt_gstamount");
    var _txtnetamount = $("#txt_netamount");


    var rows_create = $("#detailsTable tbody >tr");
    var _amount = 0;
    var _GSTAmount = 0;
    var _netamount = 0;

    for (var i = 0; i < rows_create.length; i++) {
        console.log(rows_create);
        columns = $(rows_create[i]).find('td');


        _amount += parseFloat(accounting.unformat($(columns[11]).html(), 0));
        _GSTAmount += parseFloat(accounting.unformat($(columns[13]).html(), 0));
        _netamount += parseFloat(accounting.unformat($(columns[14]).html(), 0));
    }


    _txtamount.val(accounting.format(_amount, 0));
    _txtgstamount.val(accounting.format(_GSTAmount, 0));
    _txtnetamount.val(accounting.format(_netamount, 0));
    console.log(_GSTAmount);
}
function clearFields() {
    // $('#txt_req').select2('val', '');
    // $('#txt_req').html('');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    $("#txt_reqQty").val('0');
    $("#txt_rat").val('1');
    $("#txt_qty").val('0');
}

//Terms & Conditions
function FillTermsCondition() {

    var detailsTableBody = $("#termscondition_Table tbody");
    detailsTableBody.empty();
    $.ajax({
        url: ApiForm + '/LOVServicesPurchase/GetTermsCondition',
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
            // else {
            //     Swal.fire({
            //         title: response.message,

            //         icon: 'warning',
            //         showConfirmButton: true,

            //         showClass: {
            //             popup: 'animated fadeInDown faster'
            //         },
            //         hideClass: {
            //             popup: 'animated fadeOutUp faster'
            //         }

            //     })
            // }
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


//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _no = data['no'];
    var _dateFrom = data['date'];
    _dateFrom = moment(_dateFrom).format("YYYY-MM-DD");

    Swal.fire({
        title: "Are sure wants to print Purchase Order # " + _no + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Print',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            var cre = "";
            cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateFrom + '","no":"' + _no + '"}';
            var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
            sessionStorage.setItem(sessid, cre);

            var win = window.open(apiUrl_View + '/Purchase/Report/PurchaseOrderReport?S=' + sessid, '_blank');

            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                Swal.fire({
                    title: 'Please allow popups for this website',
                    icon: 'error'
                })
            }

        }
    })
});
//Print end