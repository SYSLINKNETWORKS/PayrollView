var txtdat = $("#txt_dat");
var txtbdat = $("#txt_bdat");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_upd");
//var Qtyblock = $("#Qty_block");
//var txtamt = $("#txt_amt");
//var txtdisper = $("#txt_disper");
//var txtdisamt = $("#txt_disamt");
//var txtnetamt = $("#txt_netamt");
//var txtgstper = $("#txt_gstper");
//var txtgstamt = $("#txt_gstamt");

var _MINV_ID = '0';
var _MINV_Name = '';

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    imgloadsav.hide();
    btnsav.show();
    $('#data_Modal').modal('show');
    $("#detailsTable > tbody").html("");
    btnupd.hide();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);
    txtbdat.find("input").val(CurrentDate);

});

$(function () {
    txtdat.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtbdat.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    btnnew.hide();
    discon();
    ComponentsDropdowns.init();
});

// Onload_Device Start 
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/Sales/CreditNote/GetCreditNote',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Menu": _menid }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {

            var jres = response;
            if (jres[0].status == 1) {

                var action_button = ' ';
                //New
                if (Boolean(response[0]["Record_Insert"])) {
                    btnnew.show();
                }

                if (response[0]["Result"] != null) {

                //Print
                if (response[0]["Result"][0]["Permission_Print"] == 'True') {
                    action_button += "<a href='#' class='btn-print glyphicon glyphicon-print' data-toggle='tooltip' title='Print'></a> ";
                }
                //Delete
                if (response[0]["Result"][0]["Permission_Delete"] == 'True') {
                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                }
                //Update
                if (response[0]["Result"][0]["Permission_Update"] == 'True') {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }

                var json = response[0]["Result"];
                array = response[0]["Result"];


                $('#Table_View').DataTable().clear().destroy();
                detailsTableBody = $("#Table_View").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data: null,
                            "defaultContent": action_button
                        },
                        { data: 'ID' },
                        {
                            data: 'Date',
                            type: 'date',
                            render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                        },
                        { data: 'Invoice_ID'},
                        { data: 'Broker' },
                        { data: 'Salesman' },
                        { data: 'Customer' },
                        { data: 'Tax_ID' },
                        { data: 'Amount', render: function (data, type, row) { return accounting.formatNumber(data) }},
                        { data: 'Remarks' }

                    ],
                    "order": [[2, "desc"], [1, "desc"]],
                    "pageLength": 10,
                });
            }
                imgload.hide();

            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,

                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                })
            }

        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: 'Error ' + error,

                icon: 'error',
                showConfirmButton: true,
                timer: 1500,
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
// Onload_Device End 

var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        //Invoice Start
        FillInvoice();
        //Invoice End
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End

//Invoice Start
function FillInvoice() {
    $("#txt_inv").select2({
        placeholder: "Search for Invoice",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: {
            url: apiUrl + '/Sales/CreditNote/GetInvoice/',
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
                            text: item.Name
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
            var data = { "id": _MINV_ID, "text": _MINV_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results            
    });
}
//Invoice End

// Create Start 
function savrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var detailrecord = ck.detailrecord;
    var txtdat1 = txtdat.find("input").val();
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
            var urlStr = apiUrl + '/Sales/CreditNote/create';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "Date": txtdat1,
                    "Invoice_ID": $("#txt_inv").select2('data').id,
                    "Bilty_No": $("#txt_bilty").val(),
                    "Bilty_Dat": txtbdat.find("input").val(),
                    "Return_Type": $("#ddl_return_type").val(),
                    "Cancelled": false,
                    "Remarks": $('#txt_rmk').val(),
                    "Amount": $("#txt_amt").html(),
                    "Discount_Per": $("#txt_disper").html(),
                    "Discount_Amount": $("#txt_disamt").html(),
                    "GST_Per": $("#txt_gstper").html(),
                    "GST_Amount": $("#txt_gstamt").html(),
                    "Unregister_Per": $("#txt_unreg_per").html(),
                    "Unregister_Amount": $("#txt_unreg_amt").html(),
                    "Net_Amount": $("#txt_netamt").html(),
                    "Detail": detailrecord
                }),
                beforeSend: function () {
                    imgloadsav.show();
                    btnsav.hide();
                },
                success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        imgloadsav.hide();

                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            // timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                        discon();
                    }
                    else {
                        imgloadsav.hide();
                        btnsav.show();
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnsav.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
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
                    })
                },
            })
            return true;
        }
    })
}
// Create End

//Update Start
function updrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var txtdat1 = txtdat.find("input").val();

    if (txtdat == "") {
        Swal.fire({
            icon: 'error',
            title: "Please Enter Date",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });


        return false;
    }
    Swal.fire({
        title: 'Are you sure wants to Update?',
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
            detailrecord = ck.detailrecord;
            var urlStr = apiUrl + '/Sales/CreditNote/edit';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "ID": $("#txt_id").html(),
                    "Date": txtdat1,
                    "Invoice_ID": $("#txt_inv").select2('data').id,
                    "Remarks": $('#txt_rmk').val(),
                    "Bilty_No": $("#txt_bilty").val(),
                    "Bilty_Dat": txtbdat.find("input").val(),
                    "Return_Type": $("#ddl_return_type").val(),
                    "Amount": $("#txt_amt").html(),
                    "Discount_Per": $("#txt_disper").html(),
                    "Discount_Amount": $("#txt_disamt").html(),
                    "GST_Per": $("#txt_gstper").html(),
                    "GST_Amount": $("#txt_gstamt").html(),
                    "Unregister_Per": $("#txt_unreg_per").html(),
                    "Unregister_Amount": $("#txt_unreg_amt").html(),
                    "Net_Amount": $("#txt_netamt").html(),
                    "Detail": detailrecord
                }),
                beforeSend: function () {
                    imgloadsav.show();
                    btnupd.hide();
                },
                success: function (response) {
                    if (response[0].status == 1) {
                        imgloadsav.hide();
                        $('#data_Modal').modal('hide');
                        Swal.fire({
                            title: `${response[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            //   timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                        discon();
                    }
                    else {
                        imgloadsav.hide();
                        btnupd.show();
                        Swal.fire({
                            title: `${response[0].Remarks}`,

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
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnupd.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: `Error ${error}`,

                        icon: 'error',
                        showConfirmButton: false,
                        // timer: 1500,
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
    })
}
//Update End


$('#txt_inv').on("select2-selected", function (e) {
    $("#txt_slsmn").val($("#txt_inv").select2('data').slsmn);
    $("#txt_cus").val($("#txt_inv").select2('data').cus);
    FillItem();
});
$('#txt_inv').on("select2-removed", function (e) {
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();

    $("#txt_amt").val(0);
    $("#txt_disamt").val(0);
    $("#txt_gstamt").val(0);
    $("#txt_netamt").val(0);
    $("#txt_qty").val(0);
});
//Item Rate start
function FillItem() {
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    $.ajax({
        url: apiUrl + '/Sales/CreditNote/GetInvoiceItems',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_inv").select2('data').id
        }),
        beforeSend: function () {
            imgloadsav.show();
        },
        success: function (response) {
            if (response[0].status == 1) {
                imgloadsav.hide();
                $("#txt_disper").html(response[0]["Result"][0]["Discount_Per"]);
                $("#txt_gstper").html(response[0]["Result"][0]["GST_Per"]);
                $("#txt_unreg_per").html(response[0]["Result"][0]["Unregister_Per"]);


                for (var rowcnt = 0; rowcnt < response[0]["Result"].length; rowcnt++) {
                    dgrow = rowcnt + 1;
                    var productItem = '<tr>' +
                        '<td> ' + dgrow + '</td >' +
                        '<td><label  id="item' + rowcnt + '" style="text-align:left;">' + response[0]["Result"][rowcnt]["Item_Name"] + '</label></td>' +
                        '<td><input type="text" id="qty' + rowcnt + '" style="width:100px;" class="form-control" value=' + response[0].Result[rowcnt]["Qty"] + ' onkeyup=_dgcal_detail(' + rowcnt + ')>' + '</td>' +
                        '<td><label  id="rat' + rowcnt + '" style="text-align:left;">' + response[0].Result[rowcnt]["Rate"] + '</label></td>' +
                        '<td><label  id="amt' + rowcnt + '" style="text-align:left;">' + response[0].Result[rowcnt]["Amount"] + '</label></td>' +
                        '</tr>';
                    detailsTableBody.append(productItem);
                }
                _dgcal_detail();
                return true;
            }
            else {
                Swal.fire({
                    title: `${response[0].Remarks}`,

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
        },
        error: function (error) {
            console.log('Error ' + error)
            Swal.fire({
                title: 'Error ' + error,

                icon: 'error',
                showConfirmButton: true,
                //timer: 1500,
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

//Item Rate End
//Calculation Start
function _dgcal_detail(_row_id) {


    var rows_create = $("#detailsTable tbody >tr");
    var _amt = 0;
    var _disper = $("#txt_disper").html();
    var _disamt = 0;
    var _gamt = 0;
    var _gstper = $("#txt_gstper").html();
    var _gstamt = 0;
    var _unregper = $("#txt_unreg_per").html();
    var _unregamt = 0;
    var _netamt = 0;


    var qty = 0, amt = 0;

    for (var i = 0; i < rows_create.length; i++) {
        var txtqty = $("#qty" + i).val();
        var txtrat = $("#rat" + i).html();
        var txtamt = parseFloat(parseFloat(txtqty) * parseFloat(txtrat)).toFixed(0);
        $("#amt" + i).html(txtamt);

        qty += parseFloat(txtqty);
        amt += parseFloat(txtamt);
    }
    _amt = amt;
    if (parseFloat(_disper) > 0) {
        _disamt = parseFloat(parseFloat(_amt) * (parseFloat(_disper) / 100)).toFixed(0);
    }
    _gamt = _amt - _disamt;
    if (parseFloat(_gstper) > 0) {
        _gstamt = parseFloat(parseFloat(_gamt) * (parseFloat(_gstper) / 100)).toFixed(0);
    }
    if (_unregper > 0) {
        _unregamt = parseFloat((_unregper / 100) * _gamt).toFixed(0);
    }

    _namt = parseFloat(_gamt) + parseFloat(_gstamt) + parseFloat(_unregamt);

    //$("#txt_amt").val(_amt);
    //$("#txt_disamt").val(_disamt);
    //$("#txt_gstamt").val(_gstamt);
    //$("#txt_unreg_amt").html(_unregamt);
    //$("#txt_netamt").val(_netamt);
    $("#txt_amt").html(_amt);
    $("#txt_disamt").html(_disamt);
    $("#txt_gross_amt").html(_gamt);
    $("#txt_gstamt").html(_gstamt);
    $("#txt_unreg_amt").html(_unregamt);
    $("#txt_netamt").html(_namt);

    $("#txt_qty").val(qty);

}
//Calculation End
//Delete from Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    output = confirm('Are sure wants to delete?');
    if (output == false) {

        return false;
    }

    e.preventDefault();
    var $self = $(this);
    if ($(this).attr('data-itemId') == "0") {
        $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
            $(this).remove();
            dgcal("E");
        });
    }
});
//Delete from Table End


//$("#txt_quantity").keyup(function (e) {
//    if (e.keyCode === 13) {
//        var txtqty = $('#txt_quantity').val();
//        var txtamt = $("#txt_amt");
//        var txtdisamt = $("#txt_disamt");
//        var txtdisper = $("#txt_disper").val();
//        var txtgstamt = $("#txt_gstamt");
//        var txtnetamt = $("#txt_netamt");
//        var rows_create = $("#detailsTable tbody >tr");
//        var qty = 0;
//        var rate = 0;
//        var amt = 0;
//        for (var rowcnt = 0; rowcnt < rows_create.length; rowcnt++) {
//            columns = $(rows_create[rowcnt]).find('td');
//            $(columns[2]).html(txtqty);
//            qty = columns[2].innerHTML;
//            rate = columns[3].innerHTML;
//            $(columns[4]).html(qty * rate);
//            amt += columns[4].innerHTML;
//        }
//        var dis = (amt / 100 * txtdisper);
//        txtamt.val(amt);
//        txtdisamt.val(dis);
//        var gstamt = ((parseInt(amt - dis)) / 100 * 17);
//        txtgstamt.val(gstamt);
//        var netamt = ((amt - dis) + gstamt);
//        txtnetamt.val(netamt);
//    }
//});
//Validation Start
function ckvalidation() {
    var txtdat1 = txtdat.find("input").val();
    var txtbdat1 = txtbdat.find("input").val();
    var detail_record = "";
    var rows_create = $("#detailsTable tbody >tr");
    var columns;
    var ck = 0;
    for (var i = 0; i < rows_create.length; i++) {
        var itemid = $("#item" + i).html();
        var qty = $("#qty" + i).val();
        var rat = $("#rat" + i).html();
        var amt = $("#amt" + i).html();

        if (qty > 0) {
            if (detail_record == "") {
                detail_record = itemid + "|" + qty + "|" + rat + "|" + amt;
            }
            else {
                detail_record += "|" + itemid + "|" + qty + "|" + rat + "|" + amt;
            }
        }
    }
    if (detail_record == '') {
        Swal.fire({
            title: 'Please Select the Invoice Bill',
            icon: 'error'
        })
    }
    if ($("#txt_inv").val() == '') {
        ck = 1;
        Swal.fire({
            title: 'Please select invoice',
            icon: 'error'
        })
    }
    else if (txtdat1 == '') {
        ck = 1;
        Swal.fire({
            title: 'Please Enter Date',
            icon: 'error'
        })
    }
    else if (txtbdat1 == '') {
        ck = 1;
        Swal.fire({
            title: 'Please Enter Bilty Date',
            icon: 'error'
        })

    }
    else if (rows_create.length == 0) {
        ck = 1;
        Swal.fire({
            title: 'Detail Record not found',
            icon: 'error'
        })
    }

    return { ckval: ck, detailrecord: detail_record };
}
//Validation End
//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mdn_id = data['ID'];
    Swal.fire({
        title: "Are you sure wants to delete Debit Note # " + _mdn_id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: apiUrl + '/Purchase/Transaction/DebitNote/delete/' + _mdn_id,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ "Token": strkey }),
                beforeSend: function () {
                    imgload.show();
                    btnsav.hide();
                }, success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        Onload();
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            // timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })

                        imgload.hide();
                        discon();
                        return true;
                    }
                    else {
                        imgload.hide();
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },

                error: function (error) {
                    imgload.hide();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showConfirmButton: true,
                        // timer: 1500,
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
    });
})
//Delete End

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mdn_id = data['ID'];

    imgloadsav.hide();

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Swal.fire({
        title: "Are you sure wants to edit Credit Note # " + _mdn_id + "?",
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
                url: apiUrl + '/Sales/CreditNote/FetchEditCreditNote/' + _mdn_id,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ "Token": strkey }),
                beforeSend: function () {
                    imgload.show();
                    btnupd.hide();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response[0].status == 1) {

                        $('#data_Modal').modal('show');
                        btnupd.show();
                        $("#txt_id").html(response[0]["Result"][0]["ID"]);
                        txtdat.find("input").val(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));

                        $("#txt_bilty").val(response[0]["Result"][0]["Bilty"]);
                        txtbdat.find("input").val(moment(response[0]["Result"][0]["Bilty_Date"]).format("DD-MMM-YYYY"));

                        $("#txt_rmk").val(response[0]["Result"][0]["Remarks"]);

                        $("#txt_disper").html(response[0]["Result"][0]["Discount_Per"]);
                        $("#txt_gstper").html(response[0]["Result"][0]["GST_Per"]);
                        $("#txt_unreg_per").html(response[0]["Result"][0]["Unregister_Per"]);

                        _MINV_ID = response[0]["Result"][0]["Invoice_ID"];
                        _MINV_Name = response[0]["Result"][0]["Name"];
                        $('#txt_inv').val(_MINV_ID); // Select the option with a value of '1'
                        $('#txt_inv').trigger('change'); // Notify any JS components that the value changed


                        for (var rowcnt = 0; rowcnt < response[0]["Result"].length; rowcnt++) {
                            dgrow = rowcnt + 1;
                            var productItem = '<tr>' +
                                '<td> ' + dgrow + '</td >' +
                                '<td><label  id="item' + rowcnt + '" style="text-align:left;">' + response[0]["Result"][rowcnt]["Item_Name"] + '</label></td>' +
                                '<td><input type="text" id="qty' + rowcnt + '" style="width:100px;" class="form-control" value=' + response[0].Result[rowcnt]["Qty"] + ' onkeyup=_dgcal_detail(' + rowcnt + ')>' + '</td>' +
                                '<td><label  id="rat' + rowcnt + '" style="text-align:left;">' + response[0].Result[rowcnt]["Rate"] + '</label></td>' +
                                '<td><label  id="amt' + rowcnt + '" style="text-align:left;">' + response[0].Result[rowcnt]["Amount"] + '</label></td>' +
                                '</tr>';
                            detailsTableBody.append(productItem);
                        }
                        _dgcal_detail();


                        imgload.hide();
                        return true;
                    }
                    else {
                        imgloadsav.hide();
                        btnsav.show();
                        Swal.fire({
                            title: `${response[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnsav.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showConfirmButton: true,
                        // timer: 1500,
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
    });
});
//Edit End
//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mcn_id = data['ID'];


    Swal.fire({
        title: "Are sure wants to print Credit Note # " + _mcn_id + "?",
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
            cre = "ID=" + _mcn_id;
            var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
            var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");
            sessionStorage.setItem(sessid, cre);
            sessionStorage.setItem(sessid_name, '');

            var win = window.open(apiUrl_View + '/Sales_Report/CreditNoteReport?1&' + sessid + '&' + sessid_name, '_blank');

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

//Discon Start
function discon() {
    document.getElementById('create_form').reset();
    $("#txt_id").html('');
    $("#txt_rmk").val('');
    $("#txt_amt").val(0);
    $("#txt_disamt").val(0);
    $("#txt_gstamt").val(0);
    $("#txt_unregamt").val(0);
    $("#txt_netamt").val(0);
    $("#txt_qty").val(0);

    var txtinv = $("#txt_inv");
    txtinv.select2('val', '');
    txtinv.html('');

    btnsav.hide();
    btnupd.hide();

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Onload();
    imgload.hide();
    imgloadsav.hide();
};
//Discon End