var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var txtdat1 = $("#txt_dat");
var txtdat2 = $("#txt_bdat");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var _Currency = $("#txt_cur");
var slsmn = $("#txt_slsmn");
var wahouse = $("#txt_wahouse");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_update");
var taxid = $("#txt_id");

var amt = 0;
var namt = 0;
var dis_per = 0;
var dis_amt = 0;
var txtstkqty = 0;
var txtsca = 0;
var amount = 0;

var _InvoiceId = 0;
var _InvoiceName = "";

var _Cur_ID = 0;
var _so_nam = "";
var _Supplier_Id = 0;
var _Supplier_Name = "";


var _Cur_ID = '0';
var _Cur_Name = '';



var ApiForm = '';

$(function () {
    txtdat1.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdat2.datetimepicker({ format: 'DD/MMM/YYYY' });

});


//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    amount = 0;
    $("#txt_invoice").select2('val', '');
    $("#txt_invoice").html('');

    $('#txt_bilqty').val('');
    $('#txt_rtnqty').val('');

    // _Currency.select2('val', '');
    // _Currency.html('');
    slsmn.select2('val', '');
    slsmn.html('');
    $('#txt_id').html('');



    //taxid.empty();
    btnsav.hide();
    btnupd.hide();
    btnnew.show();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    imgload.hide();
    imgloadsav.hide();
    Onload();
    ComponentsDropdowns.init();
};
//Discon End

$(document).on("click", '#btn_new', function () {
    discon();
    discon_detail();
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    $("#detailsTable > tbody").html("");
    btnsav.show();
    btnupd.hide();
    imgloadsav.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat1.find("input").val(CurrentDate);
    txtdat2.find("input").val(CurrentDate);



});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Sales/v1';
    discon();
});

//Onload Start
function Onload() {
    $.ajax({
        url: ApiForm + '/CreditNote',
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
                            { data: 'invoiceName' },
                            { data: 'customerName' },
                            { data: 'itemName' },
                            {
                                data: 'netAmount',
                                render: function (data, type, row) {
                                    return accounting.format(data, 0)
                                }
                            },
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
                url: ApiForm + '/CreditNote',
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
                url: ApiForm + '/CreditNote',
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

//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        //Fetch Bill Start
        fillInvoice();
        //Fetch Bill Start

        // //Supplier Start
        // fillSupplier();
        // //Supplier End

        // //Fetch Currency Start
        // fillCurrency();
        // //Currency End

        //Items Start
        fillItems();
        //Items End

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();

//Fill Bill Start
function fillInvoice() {
    $("#txt_invoice").select2({
        placeholder: "Search for a Invoice",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetInvoice',
            type: "Get",
            dataType: 'json',
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
                            CustomerId: item.customerId,
                            CustomerName: item.customerName,
                            InvoiceNO: item.invoiceNO,
                            InvoiceDate: item.invoiceDate,
                            CurrencyId: item.currencyId,
                            CurrencyName: item.currencyName,
                            Rate: item.rate,

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
            var data = { "id": _InvoiceId, "text": _InvoiceName };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Bill End

$('#txt_invoice').on("select2-selected", function (e) {
    $("#txt_bilno").val($("#txt_invoice").select2('data').InvoiceNO);
    $("#txt_rat").val($("#txt_invoice").select2('data').Rate);
    $('#txt_cur').val($("#txt_invoice").select2('data').CurrencyName);
    $('#txt_cus').val($("#txt_invoice").select2('data').CustomerName);
    $('#txt_bildat').val(moment($("#txt_invoice").select2('data').InvoiceDate).format("DD/MMM/YYYY"));
});



//Fill Item Start
function fillItems() {
    $("#txt_itm").select2({
        placeholder: "Search for Items",
        triggerChange: true,
        //multiple: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/InoviceDetailById',
            type: "Get",
            contentType: "application/json",
            dataType: "json",

            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("InvoiceId", $("#txt_invoice").select2('data').id);
                };

                return $.ajax(params);

            },
            data: function (term, page) {
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
                            Rate: item.rate,
                            WarehouseId: item.warehouseId,
                            WarehouseName: item.warehouseName,
                            Amount: item.amount,
                            Quantity: item.quantity,
                            DiscountPercentage: item.discountPercentage,
                            DiscountAmount: item.discountAmount,
                            GSTPer: item.gstPer,
                            GSTAmount: item.gstAmount,
                            NetAmount: item.netAmount

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
//Fill GRN End

$('#txt_itm').on("select2-selected", function (e) {
    $("#txt_bilqty").val($("#txt_itm").select2('data').Quantity);
    $("#txt_rate").val($("#txt_itm").select2('data').Rate);
    $("#txt_damt").val($("#txt_itm").select2('data').Amount);
});



//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _no = data['no'];
    var _name = data['name'];
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
    } Swal.fire({
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
                url: ApiForm + '/CreditNote/GetCreditNoteById',
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
                    btnupd.show();
                },

                success: function (response) {
                    if (response.statusCode == 200) {


                        $('#data_Modal').modal('show');

                        $('#txt_id').html(response["data"]["id"]);
                        $('#txt_no').html(response["data"]["no"]);

                        $("#txt_bilno").val(response["data"]["invoiceNo"]);
                        $("#txt_rat").val(response["data"]["rate"]);
                        $('#txt_cur').val(response["data"]["currencyName"]);
                        $('#txt_cus').val(response["data"]["customerName"]);
                        $("#txt_bildat").val(moment(response["data"]["invoiceDate"]).format("DD/MMM/YYYY"));
                        txtdat1.find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));


                        $('#txt_amt').val(accounting.format(response["data"]["grossAmount"]));
                        $('#txt_disper').val(response["data"]["discountPer"]);
                        $('#txt_disamt').val(accounting.format(response["data"]["discountAmount"], 0));
                        $('#txt_netamt').val(accounting.format(response["data"]["netAmount"], 0));
                        $('#txt_rmk').val(response["data"]["remarks"]);

                        _InvoiceId = response["data"]["invoiceMasterId"];
                        _InvoiceName = response["data"]["invoiceName"];
                        $('#txt_invoice').val(_InvoiceId); // Select the option with a value of '1'
                        $('#txt_invoice').trigger('change'); // Notify any JS components that the value changed



                        if (response["data"]["creditNoteDetailByIdViewModel"] != null) {
                            var _DetailRecord = response["data"]["creditNoteDetailByIdViewModel"];
                            var _UserTable = $("#detailsTable tbody");
                            _UserTable.empty();
                            for (var user_row_cnt = 0; user_row_cnt < _DetailRecord.length; user_row_cnt++) {

                                var _Row = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["itemId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["itemName"] + '</td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["warehouseId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["warehouseName"] + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["invoiceQty"], 0) + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["qty"], 0) + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["rate"] + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["amount"], 0) + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["gstPer"] + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["gstAmount"], 0) + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["netAmount"], 0) + '</td>' +

                                    '</tr>';
                                _UserTable.append(_Row);

                            }
                        }

                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();
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
    //var _nam = data['Name'];
    Swal.fire({
        title: 'Are sure wants to Delete <br/>' + _no + '?',
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
                url: ApiForm + '/CreditNote',
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

//Validation Start
function ckvalidation() {

    var ck = 0, _Error = '', _cre = '';

    var txtid = $('#txt_id').html();
    var txtinvoice = $("#txt_invoice");
    var txtrmk = $("#txt_rmk");

    var txtamount = accounting.unformat($('#txt_amt').val(), 0);
    var txtdiscountper = $('#txt_disper').val();
    var txtdiscountamt = accounting.unformat($('#txt_disamt').val(), 0);
    var txtnetAmt = accounting.unformat($('#txt_netamt').val(), 0);



    var date1 = moment(txtdat1.find("input").val()).format("YYYY-MM-DD");
    //var date2 = moment(txtdat2.find("input").val()).format("YYYY-MM-DD");





    if (txtinvoice.val() == '') {
        ck = 1;
        _Error = 'Please Select Invoice';
        txtinvoice.focus();
    }

    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        detail_record.push({
            "itemId": $(columns[1]).html().trim(),
            "warehouseId": $(columns[3]).html().trim(),
            "qty": accounting.unformat($(columns[6]).html().trim(), 0),
            "rate": $(columns[7]).html().trim(),
            "amount": accounting.unformat($(columns[8]).html().trim(), 0),
            "gstPer": $(columns[9]).html().trim(),
            "gstAmount": accounting.unformat($(columns[10]).html().trim(), 0),
            "netAmount": accounting.unformat($(columns[11]).html().trim(), 0),

        })
    }

    if (detail_record == '') {
        ck = 1;
        _Error = 'Please fill Detail Table';
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }

    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "ID": txtid,
            "date": date1,
            "invoiceMasterId": txtinvoice.val(),
            "amount": txtamount,
            "discountPer": txtdiscountper,
            "discountAmount": txtdiscountamt,
            "netAmount": txtnetAmt,
            "remarks": txtrmk.val(),
            "creditNoteDetailViewModels": detail_record,
            "type": "U",
            "menu_Id": _menuid
        });
    }
    return { ckval: ck, creteria: _cre };
}

//Validation End

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
                    var rows_create = $("#detailsTable tbody >tr");
                    var _totalAmount = 0;
                    for (var i = 0; i < rows_create.length; i++) {
                        columns = $(rows_create[i]).find('td');
                        _totalAmount += accounting.unformat($(columns[11]).html().trim(), 0);
                    }
                    $("#txt_amt").val(accounting.format(_totalAmount, 0));
                    $("#txt_netamt").val(accounting.format(_totalAmount, 0));
                    calculationMaster();
                });
            }
        }
    })
});
//Delete from Table End

// 
function AddRecord() {
    var _returnQty = $("#txt_rtnqty").val();
    var _billQty = $("#txt_bilqty").val();

    if ($("#txt_rtnqty").val() == '') {
        Swal.fire({
            title: "Return quantity should be greater then zero",
            icon: 'error'
        })
        return;
    }
    if ($("#txt_rtnqty").val() < 0) {
        Swal.fire({
            title: "Return quantity should be greater then zero",
            icon: 'error'
        })
        return;
    }
    if (parseFloat(_billQty) < parseFloat(_returnQty)) {
        Swal.fire({
            title: "Return quantity should be less then BillQty",
            icon: 'error'
        })
        return;
    }
    if ($("#txt_itm").val() == "") {
        Swal.fire({
            title: "Plese select Item",
            icon: 'error'
        })
        return;
    }

    detailsTableBody = $("#detailsTable tbody");
    var _Amount = ($("#txt_rtnqty").val() * $("#txt_rate").val());
    var _DiscountAmount = _Amount * ($("#txt_itm").select2('data').DiscountPercentage / 100);
    var _GrossAmount = _Amount - _DiscountAmount;
    var _GSTAmount = _GrossAmount * ($("#txt_itm").select2('data').GSTPer / 100);
    var _NetAmount = _GrossAmount + _GSTAmount;
    var productItem = '<tr>' +
        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
        '<td hidden>' + $("#txt_itm").select2('data').id + '</td>' +
        '<td>' + $("#txt_itm").select2('data').text + '</td>' +
        '<td hidden>' + $("#txt_itm").select2('data').WarehouseId + '</td>' +
        '<td>' + $("#txt_itm").select2('data').WarehouseName + '</td>' +
        '<td>' + accounting.format($("#txt_bilqty").val(), 0) + '</td>' +//bill qty
        '<td>' + accounting.format($("#txt_rtnqty").val(), 0) + '</td>' +
        '<td>' + $("#txt_rate").val() + '</td>' +// rate
        '<td>' + accounting.format(_Amount, 0) + '</td>' +//discount %
        '<td>' + $("#txt_itm").select2('data').GSTPer + '</td>' +
        '<td>' + accounting.format(_GSTAmount, 0) + '</td>' +
        '<td>' + accounting.format(_NetAmount, 0) + '</td>' +
        '</tr>';
    detailsTableBody.append(productItem);
    _Amount = 0; _GSTAmount = 0; _NetAmount = 0;

    var rows_create = $("#detailsTable tbody >tr");
    var _totalAmount = 0;
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        _totalAmount += accounting.unformat($(columns[11]).html().trim(), 0);
    }
    $("#txt_amt").val(accounting.format(_totalAmount, 0));
    $("#txt_netamt").val(accounting.format(_totalAmount, 0));
    discon_detail();
}
function calculationMaster() {
    var amount = 0;
    var disper = 0;
    var disamt = 0;
    var netAmount = 0;
    amount = accounting.unformat($("#txt_amt").val(), 0);
    disper = accounting.unformat($("#txt_disper").val(), 0);



    //discount Amount


    if (parseFloat(disper) > 0) {
        disamt = amount * (disper / 100);
        accounting.format($("#txt_disamt").val(disamt.toFixed(0)), 0)
    }
    netAmount = accounting.format(parseFloat(amount) - parseFloat(disamt), 0);
    $("#txt_netamt").val(accounting.format(netAmount, 0));
    // else {
    //     $("#txt_disper").val('0');
    //     disamt = $("#txt_disamt").val();
    //     disper = (disamt / amount) * 100;
    //     accounting.format($("#txt_disper").val(disper.toFixed(0)), 0);
    // }



}

function discon_detail() {
    $("#txt_itm").select2('val', '');
    $("#txt_itm").text('');
    $("#txt_bilqty").val('');
    $("#txt_rtnqty").val('');
    $("#txt_rate").val('');
    $("#txt_damt").val('');

}



