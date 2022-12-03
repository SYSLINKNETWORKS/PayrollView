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
var btnupd = $("#btn_update");
var taxid = $("#txt_id");
var txtpodat = $("#txt_podat");
var txtdat = $("#txt_dat");

var _Warehouse_ID = 0;
var _Warehouse_Name = "0";

var _SO_ID = 0;
var _SO_Name = "0";


var _Customer_ID = 0;
var _Salesman_ID = 0;

var _rate = 0;
var _gstPercentage = 0;


var strkey = "0";
if (localStorage.getItem(1) != null) { strkey = localStorage.getItem(1); }

$(function () {
    txtpodat.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });

});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Sales/v1';
    discon();
});

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtpodat.find("input").val(CurrentDate);
    txtdat.find("input").val(CurrentDate);
    btnsav.show();
    btnupd.hide();
    imgloadsav.hide();
});


//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    $("#txt_id").html('');
    $("#txt_no").val('0');

    btnsav.hide();
    btnupd.hide();
    Onload();
    ComponentsDropdowns.init();
    imgload.hide();
    imgloadsav.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtpodat.find("input").val(CurrentDate);
    txtdat.find("input").val(CurrentDate);
    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();

    $('#txt_so').select2('val', '');
    $('#txt_so').html('');


}
//Discon End

//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        //Fill SO Start
        FillSO()
        //Fill SO End

        //Fill WH Start
        FillWH()
        //Fill WH End

        //Fill Item Start
        FillItem();
        //Fill Item End

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End




//Fill So Start
function FillSO() {

    $("#txt_so").select2({
        placeholder: "Search for Sale Order",
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetSalesOrderForDC',
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
            var data = { "id": _SO_ID, "text": _SO_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill SO End

//Fill Item Start

function FillItem() {

    $("#txt_itm").select2({
        placeholder: "Search for Items",
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetItemForDCSO',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("SOID", $('#txt_so').select2('data').id);
                    request.setRequestHeader("WarehouseId", $("#txt_wh").select2('data').id);
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
                            qty: item.qty,
                            rate: item.rate,
                            gstPercentage: item.gstPercentage,
                            variance: item.variance,
                            stockQty: item.stockQty,
                            saleOrderDetailId: item.saleOrderDetailId,
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
            var data = { "id": _SO_ID, "text": _SO_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Item End


//Fill WH Start
function FillWH() {
    $("#txt_wh").select2({
        placeholder: "Search for Warehouse",
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetWarehouse',
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
            var data = { "id": _Warehouse_ID, "text": _Warehouse_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill WH End

$('#txt_itm').on("select2-selected", function (e) {
    $("#txt_orderqty").val(accounting.format($('#txt_itm').select2('data').qty, 0));
    $("#txt_variance").val($('#txt_itm').select2('data').variance);
    $("#txt_stk").val(accounting.format($('#txt_itm').select2('data').stockQty, 0));
    // _rate = $('#txt_itm').select2('data').rate;
    // _gstPercentage = $('#txt_itm').select2('data').gstPercentage;
    //  $('#txt_rate').val($('#txt_itm').select2('data').rate);
    //  $('#txt_gstper').val($('#txt_itm').select2('data').gstPercentage);

});
$('#txt_itm').on("select2-removed", function (e) {
    $("#txt_orderqty").val('0');
    $("#txt_variance").val('0');
    $("#txt_stk").val('0');

    // $('#txt_cus').val('');
    // $('#txt_po').val('');
    // var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    // txtpodat.find("input").val(CurrentDate);
    // $('#txt_slsman').val('');
});

//Onload Start
function Onload() {
    $.ajax({
        url: ApiForm + '/DeliveryChallan',
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
                            { data: 'customerName' },
                            { data: 'employeeName' },
                            { data: 'wareHouseName' },
                            { data: 'remarks' },
                            { data: "status" },


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
            $.ajax({
                url: ApiForm + '/DeliveryChallan',
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

// Update Start 
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
                url: ApiForm + '/DeliveryChallan',
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
// Update End

//Edit Start

$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _no = data['no'];
    var _status = data['status'];

    if (_status == "Checked") {
        Swal.fire({
            title: "Record is checked",
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
    else if (_status == "Approved") {
        Swal.fire({
            title: "Record is approved",
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
        title: 'Are sure wants to edit <br/>DC # ' + _no + '?',
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
                url: ApiForm + '/DeliveryChallan/GetDeliveryChallanById',
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
                        ;


                        var detailsTableBody = $("#detailsTable tbody");
                        detailsTableBody.empty();

                        $('#data_Modal').modal('show');
                        btnupd.show();

                        //txtid.html(response["data"]["id"]);
                        $("#txt_id").html(response["data"]["id"]);
                        $("#txt_no").val(response["data"]["no"]);
                        txtdat.find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));
                        txtpodat.find("input").val(moment(response["data"]["poDate"]).format("DD/MMM/YYYY"));

                        $("#txt_cus").val(response["data"]["customerName"]);//

                        $("#txt_po").val(response["data"]["pono"]);
                        $("#txt_slsman").val(response["data"]["employeeName"]);

                        $("#txt_rmk").val(response["data"]["remarks"]);

                        _Warehouse_ID = response["data"]["wareHouseId"];
                        _Warehouse_Name = response["data"]["wareHouseName"];
                        $('#txt_wh').val(_Warehouse_ID); // Select the option with a value of '1'
                        $('#txt_wh').trigger('change'); // Notify any JS components that the value changed

                        _SO_ID = response["data"]["saleOrderId"];
                        _SO_Name = response["data"]["saleOrderName"];
                        $('#txt_so').val(_SO_ID); // Select the option with a value of '1'
                        $('#txt_so').trigger('change'); // Notify any JS components that the value changed


                        var DetailRecord = response["data"]["deliveryChallanDetailByIdViewModel"]
                        //Detail Start
                        var productItem;
                        for (var row_cnt = 0; row_cnt < DetailRecord.length; row_cnt++) {

                            productItem += '<tr>' +
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                '<td style="display:none;" >' + DetailRecord[row_cnt]["saleOrderDetailId"] + '</td>' +
                                '<td style="display:none">' + DetailRecord[row_cnt]["itemId"] + '</td>' +
                                '<td>' + DetailRecord[row_cnt]["itemName"] + '</td>' +
                                '<td>' + accounting.format(DetailRecord[row_cnt]["orderQty"], 0) + '</td>' +
                                '<td>' + accounting.format(parseFloat(DetailRecord[row_cnt]["qty"]), 0) + ' </td>' +
                                '<td>' + accounting.format(parseFloat(DetailRecord[row_cnt]["masterQty"]), 0) + ' </td>' +
                                '<td>' + accounting.format(parseFloat(DetailRecord[row_cnt]["innerQty"]), 0) + ' </td>' +
                                '<td>' + DetailRecord[row_cnt]["remarks"] + ' </td>' +
                                '</tr>';


                        }
                        detailsTableBody.append(productItem);

                        return true;
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
});
//Edit End

//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _no = data['no'];

    var _status = data['status'];
    if (_status == "Checked") {
        Swal.fire({
            title: "Record is checked",
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
    else if (_status == "Approved") {
        Swal.fire({
            title: "Record is approved",
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
        title: 'Are sure wants to delete <br> DC # ' + _no + '?',
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
                url: ApiForm + '/DeliveryChallan',
                type: "Delete",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "id": _id,
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



//Validation Start
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var txtno = $("#txt_no").val();
    var soid = $('#txt_so');
    var whid = $('#txt_wh');
    var rmk = $("#txt_rmk").val();
    var txtdate1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");



    var rows_create = $("#detailsTable tbody >tr");
    var columns;
    var detail_record = [];
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        detail_record.push({
            "saleOrderDetailId": $(columns[1]).html().trim(),
            "itemId": $(columns[2]).html().trim(),
            "qty": parseFloat(accounting.unformat($(columns[5]).html())),
            "masterqty": parseFloat(accounting.unformat($(columns[6]).html())),
            "innerqty": parseFloat(accounting.unformat($(columns[7]).html())),
            "remarks": $(columns[8]).html()
        });
    }
    if (detail_record == '') {
        ck = 1;
        _Error = 'Please Fill Table#';

    }
    else if (whid.val() == '') {
        ck = 1;
        _Error = 'Please Select Warehouse#';

    }
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return;
    }
    _cre = JSON.stringify({
        "id": txtid,
        "no": txtno,
        "date": txtdate1,
        "saleOrderId": soid.val(),
        "wareHouseId": whid.val(),
        "remarks": rmk,
        "type": "U",
        "menu_Id": _menuid,
        "deliveryChallanDetailViewModels": detail_record,
    });
    return { ckval: ck, creteria: _cre };

}
//Validation Endf

$("body").on("click", "#btn_add", function () {
    var itemid = $('#txt_itm');
    var masterqty = $('#txt_masterqty');
    var innerqty = $('#txt_innerqty');
    $('#txt_qty').val(parseFloat(masterqty.val()) * parseFloat(innerqty.val()))
    var qty = $('#txt_qty');
    if (qty.val() == '') {
        Swal.fire({
            title: "write Quantity",
            icon: 'error'
        })
        return;
    }
    if (qty.val() == '0') {
        Swal.fire({
            title: "write Quantity",
            icon: 'error'
        })
        return;
    }
    if (itemid.val() != '') {
        var rows_create = $("#detailsTable tbody >tr");
        var columns;
        for (var i = 0; i < rows_create.length; i++) {
            columns = $(rows_create[i]).find('td');
            var _itemId = $(columns[1]).html().trim();
            if (_itemId == $('#txt_itm').select2('data').id) {
                Swal.fire({
                    title: "Item already Exisit",
                    icon: 'warning'
                })
                return;
            }

        }


        var _detailsTable = $("#detailsTable tbody");
        var _RowLocation = '<tr>' +
            '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
            '<td style="display:none;">' + $('#txt_itm').select2('data').saleOrderDetailId + '</td>' +
            '<td style="display:none;">' + $('#txt_itm').select2('data').id + '</td>' +
            '<td>' + $('#txt_itm').select2('data').text + '</td>' +
            '<td>' + $('#txt_orderqty').val() + '</td>' +
            '<td>' + accounting.format($('#txt_qty').val(), 0) + '</td>' +
            '<td>' + accounting.format($('#txt_masterqty').val(), 0) + '</td>' +
            '<td>' + accounting.format($('#txt_innerqty').val(), 0) + '</td>' +
            '<td>' + $('#txt_drmk').val() + '</td>'

        _RowLocation += '</tr>';
        _detailsTable.append(_RowLocation);
        $('#txt_itm').select2('val', '');
        $('#txt_orderqty').val("0");
        $('#txt_variance').val("0");
        $('#txt_stk').val("0");
        $('#txt_masterqty').val("0");
        $('#txt_innerqty').val("0");
        $('#txt_qty').val("0");
        $('#txt_drmk').val("");
        _rate = 0;
        _gstPercentage = 0;
    }
    else {
        Swal.fire({
            title: "Please select Item",
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: false,
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        })
    }
});