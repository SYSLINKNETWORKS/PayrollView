var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var txtdat = $("#txt_dat");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_update");
var imgloadupd = $("#img_load_upd");
var dramtmaster = $("#txt_dr_amt_master");
var dramtmaster = $("#txt_dr_amt_master");
var _typeId = "05";
var txt_id = "";
var masdpt = $("#txt_CostCenter");
var masacc = $("#txt_acc_mas");
var detacc = $("#txt_acc_det");
var _CostCenter_ID = "0";
var _CostCenter_Name = "";
var _Currency_ID = "0"
var _Currency_Name = "";
var _Account_No = "0";
var _Account_Name = "";
var _mvch_cb = 'C';
var ApiForm = '';

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    imgloadsav.hide();
    btnsav.show();
    $('#create_data_Modal').modal('show');
    $("#detailsTable > tbody").html("");
    btnupd.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
});

$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1/Voucher';
    //    btnnew.hide();
    discon();
    ComponentsDropdowns.init();
});
// Onload_Device Start 
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
            xhr.setRequestHeader("TypeNo", _typeId);
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
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        columns: [
                            {
                                data: null,
                                "defaultContent": action_button
                            },
                            { data: 'id' },
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },
                            { data: 'exchangeRate' },
                            { data: 'status' },
                            { data: 'type' }
                        ],
                        "pageLength": 10,
                        "order": [[2, "desc"], [1, "desc"]]
                    });

                    imgload.hide();
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


    return true;

}

// Onload_Device End 

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

            $.ajax({
                url: ApiForm,
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
                        $('#create_data_Modal').modal('hide');
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


//Update Start
function updrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;

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

            $.ajax({
                url: ApiForm,
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
                    if (response.statusCode == 200) {
                        imgloadsav.hide();

                        $('#create_data_Modal').modal('hide');
                        Swal.fire({
                            title: response.message,

                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
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
                        var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                        Swal.fire({

                            title: _title,

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
                error: function (xhr, status, err) {
                    imgloadsav.hide();
                    btnupd.show();
                    Swal.fire({
                        title: xhr.status.toString() + ' ' + err.toString(),

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
            })
            return true;
        }
    })
}

//Update End






//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mvch_id = data['id'];
    var _mvch_no = data['no'];
    var _mvch_typ = data['type'];
    var _mvch_check = data['check'];
    var _mvch_approved = data['approved'];
    if (_mvch_typ != 'User') {
        Swal.fire({
            title: "Voucher # " + _mvch_id + "</br> is system generated voucher.For editing or deletion go to respective module",
            icon: "warning",
        })
        return;
    }

    if (Boolean(_mvch_approved)) {
        Swal.fire({
            title: "Voucher # " + _mvch_id + "</br> is approved",
            icon: "warning",
        })
        return;
    }
    if (Boolean(_mvch_check)) {
        Swal.fire({
            title: "Voucher # " + _mvch_id + "</br> is checked",
            icon: "warning",
        })
        return;
    }
    Swal.fire({
        text: "Are you sure wants to delete voucher # " + _mvch_id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: ApiForm,
                type: "Delete",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "no": _mvch_no,
                    "menu_Id": _menuid
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                }, success: function (response) {
                    if (response.statusCode == 200) {
                        Onload();
                        Swal.fire({
                            title: response.message,

                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                        imgload.hide();
                        return true;
                    }
                    else {
                        imgload.hide();
                        var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                        Swal.fire({

                            title: _title,

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
                error: function (xhr, status, err) {
                    imgload.hide();
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
    var _mvch_id = data['id'];
    var _mvch_no = data['no'];
    var _mvch_typ = data['type'];
    var _mvch_check = data['check'];
    var _mvch_approved = data['approved'];
    if (_mvch_typ != 'User') {
        Swal.fire({
            title: "Voucher # " + _mvch_id + "</br> is system generated voucher.For editing or deletion go to respective module",
            icon: "warning",
        })
        return;
    }
    if (Boolean(_mvch_approved)) {
        Swal.fire({
            title: "Voucher # " + _mvch_id + "</br> is approved",
            icon: "warning",
        })
        return;
    }
    if (Boolean(_mvch_check)) {
        Swal.fire({
            title: "Voucher # " + _mvch_id + "</br> is checked",
            icon: "warning",
        })
        return;
    }
    imgloadsav.hide();

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Swal.fire({
        title: 'Are you sure wants to edit voucher # ' + _mvch_id + '?',
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

                url: ApiForm + '/GetVoucherById',
                type: "Get",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("_MenuId", _menuid);
                    xhr.setRequestHeader("_Id", _mvch_no);
                    imgload.show();
                    btnupd.hide();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        $('#create_data_Modal').modal('show');
                        btnupd.show();
                        $("#txt_id").html(response["data"]["id"]);
                        $('#txt_no').html(response["data"]["no"]);
                        txtdat.find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));

                        _CostCenter_ID = response["data"]["costCenterId"];
                        _CostCenter_Name = response["data"]["costCenterName"];
                        $('#txt_CostCenter').val(_CostCenter_ID); // Select the option with a value of '1'
                        $('#txt_CostCenter').trigger('change'); // Notify any JS components that the value changed

                        _Currency_ID = response["data"]["currencyId"];
                        _Currency_Name = response["data"]["currencyName"];
                        $('#txt_Currency').val(_Currency_ID); // Select the option with a value of '1'
                        $('#txt_Currency').trigger('change'); // Notify any JS components that the value changed


                        $('#txt_ExchangeRate').val(response["data"]["exchangeRate"]);
                        $('#txt_rmk').val(response["data"]["remarks"]);


                        //Detail Start
                        var productItem;
                        var _Detail = response["data"]["voucherDetailViewByIdList"];
                        for (var row_cnt = 0; row_cnt < _Detail.length; row_cnt++) {


                            productItem += '<tr>' +
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                '<td>' + _Detail[row_cnt]["accountName"] + '</td>' +
                                '<td>' + _Detail[row_cnt]["naration"] + '</td>' +
                                '<td>' + accounting.format(_Detail[row_cnt]["debitAmount"], 2) + '</td>' +
                                '<td>' + accounting.format(_Detail[row_cnt]["creditAmount"], 2) + '</td>' +
                                '<td hidden>' + _Detail[row_cnt]["accountNo"] + '</td>' +
                                '</tr>';

                        }
                        detailsTableBody.append(productItem);
                        dgcal();
                        imgload.hide();
                        return true;
                    }
                    else {
                        imgloadsav.hide();
                        btnsav.show();
                        var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                        Swal.fire({

                            title: _title,

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
                error: function (xhr, status, err) {
                    imgloadsav.hide();
                    btnsav.show();
                    Swal.fire({
                        title: xhr.status.toString() + ' ' + err.toString(),

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
    });
})
//Edit End
//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mvch_id = data['id'];
    var _mvch_no = data['no'];

    Swal.fire({
        title: "Are sure wants to print voucher # " + _mvch_id + "?",
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
            cre = "No=" + _mvch_no;
            var sessid = new Date();
            sessid = moment(sessid).format("DDMMYYYYHHmmss");
            sessionStorage.setItem(sessid, cre);
            var win = window.open(apiUrl_View + '/GL_Report/Voucher?1&' + sessid, '_blank');
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

$("#txt_nar_mas").keyup(function (e) {
    if (e.keyCode === 13) {
        var txtnarmas = $("#txt_nar_mas");
        var txtaccnar = $("#txt_acc_nar");
        var txtaccdet = $("#txt_acc_det");

        e.preventDefault();
        $('#data_Modal_Detail').modal('show');
        txtaccnar.val(txtnarmas.val());
        txtaccdet.select2('focus');

    }
});
$("#txt_dr_amt").keyup(function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        if ($.trim($("#txt_acc_det").val()) == "" || $.trim($("#txt_acc_nar").val()) == "" || $.trim($("#txt_dr_amt").val()) == "0") return;
        account = $("#txt_acc_det");
        narration = $("#txt_acc_nar").val();
        debit = $("#txt_dr_amt").val();
        dvch_wf = 0,
            detailsTableBody = $("#detailsTable tbody");
        var productItem = '<tr><td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td><td>' + account.select2('data').text + '</td><td>' + narration + '</td><td>' + accounting.formatNumber(debit, 2) + '</td><td>0</td><td hidden>' + account.select2('data').id + '</td></tr>';
        detailsTableBody.append(productItem);
        discon_det();
    }
});
$("#txt_cr_amt").keyup(function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        if ($.trim($("#txt_acc_det").val()) == "" || $.trim($("#txt_acc_nar").val()) == "" || $.trim($("#txt_cr_amt").val()) == "0") return;
        account = $("#txt_acc_det");
        narration = $("#txt_acc_nar").val();
        credit = $("#txt_cr_amt").val();
        dvch_wf = 0,
            detailsTableBody = $("#detailsTable tbody");
        var productItem = '<tr><td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td><td>' + account.select2('data').text + '</td><td>' + narration + '</td><td>0</td><td>' + accounting.formatNumber(credit, 2) + '</td><td hidden>' + account.select2('data').id + '</td></tr>';
        detailsTableBody.append(productItem);
        discon_det();
    }
});

//After Add A New Order In The List, Clear Clean The Form For Add More Order.
function discon_det() {
    dgcal();
    txt_acc_det = $("#txt_acc_det");
    txt_dr_amt = $("#txt_dr_amt");
    txt_cr_amt = $("#txt_cr_amt");
    txt_acc_nar = $("#txt_acc_nar");

    txt_acc_det.select2('val', '');
    txt_acc_det.html('');
    //txt_acc_nar.val('');
    txt_dr_amt.val('0');
    txt_cr_amt.val('0');
    txt_acc_det.select2('focus');
}

// After Add A New Order In The List, If You Want, You Can Remove It.
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
                    dgcal();
                });
            }
        }
    })

});


function dgcal() {
    var rows_create;
    rows_create = $("#detailsTable tbody tr");
    var columns;
    var debitamt = 0;
    var creditamt = 0;
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        debitamt += parseFloat(accounting.unformat($(columns[3]).html()));
        creditamt += parseFloat(accounting.unformat($(columns[4]).html()));
    }
    $("#txt_dr_amt_master").html(accounting.formatNumber(debitamt, 2));
    $("#txt_cr_amt_master").html(accounting.formatNumber(creditamt, 2));
}

//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        //CostCenter Start
        FillCostCenter();

        //Currency Start
        FillCurrency();
        //Detail Account Start
        FillDetailAccount();
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End

//CostCenter Start
function FillCostCenter() {
    $("#txt_CostCenter").select2({
        placeholder: "Search for Cost Center",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetCostCenter',
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
            var data = { "id": _CostCenter_ID, "text": _CostCenter_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//CostCenter End



//Detail Account Start
function FillDetailAccount() {
    $("#txt_acc_det").select2({
        placeholder: "Search for a Account",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetChartOfAccountDetail',
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
//Detail Account End

//Currency Start
function FillCurrency() {
    $("#txt_Currency").select2({
        placeholder: "Search for a Currency",
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetCurrency',
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
            var data = { "id": _Currency_ID, "text": _Currency_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}



//Validation Start
function ckvalidation() {
    //var txtaccmaster = $("#txt_acc_mas");

    //    var txtId = $("#txt_id").html();
    var txtNo = $("#txt_no").html();

    var txtDat1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    var txtRmk = $("#txt_rmk").val();
    var txtCostCenter = $("#txt_CostCenter");
    var txtCurrency = $("#txt_Currency");
    var txtExchangeRate = $("#txt_ExchangeRate").val();

    var txtDebitMaster = $("#txt_dr_amt_master").html();
    var txtCreditMaster = $("#txt_cr_amt_master").html();

    var detail_record = [];
    var rows_create = $("#detailsTable tbody >tr");
    var columns;
    var ck = 0;


    if (txtCurrency.val() == '') {
        ck = 1;
        _Error = 'Please Select Currency';
    }
    else if (txtCostCenter.val() == '') {
        ck = 1;
        _Error = 'Please Select Cost Center';

    }
    else if (rows_create.length == 0) {
        ck = 1;
        _Error = 'Detail not found';

    }
    else if (txtDebitMaster == 0 && txtCreditMaster == 0) {
        _Error = "Debit and Credit cannot be zero";
        ck = 1;
    }
    else if (txtDebitMaster != txtCreditMaster) {
        _Error = "Debit and Credit are not equal";
        ck = 1;
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return;
    }


    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        detail_record.push({
            "accountNo": $(columns[5]).html(),
            "naration": $(columns[2]).html(),
            "debitAmount": accounting.unformat($(columns[3]).html()),
            "creditAmount": accounting.unformat($(columns[4]).html()),
        })
    }
    _cre = JSON.stringify({
        "no": txtNo,
        "date": txtDat1,
        "transactionDate": txtDat1,
        "paidReceived": "",
        "remarks": txtRmk,
        "costCenterId": txtCostCenter.select2('data').id,
        "currencyId": txtCurrency.select2('data').id,
        "exchangeRate": txtExchangeRate,
        "voucherTypeNo": _typeId,
        "menu_Id": _menuid,
        "voucherDetailViewModel": detail_record,
    });
    return { ckval: ck, creteria: _cre };
}
//Validation End
//Function DISCON
function discon() {
    document.getElementById('create_form').reset();
    var txtno = $("#txt_no");
    var txtid = $("#txt_id");
    masdpt.select2('val', '');
    masdpt.html('');
    _CostCenter_ID = "0";
    _CostCenter_Name = "";
    _Account_No = "0";
    _Account_Name = "";
    txtno.html('');
    txtid.html('');

    btnsav.hide();
    btnupd.hide();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    Onload();
    imgload.hide();
    imgloadsav.hide();
    ComponentsDropdowns.init();
};

function showDetail() {
    var txtnarmas = $("#txt_nar_mas");
    var txtaccnar = $("#txt_acc_nar");
    var txtaccdet = $("#txt_acc_det");
    $('#data_Modal_Detail').modal('show');
    txtaccnar.val(txtnarmas.val());
    txtaccdet.select2('focus');

}

