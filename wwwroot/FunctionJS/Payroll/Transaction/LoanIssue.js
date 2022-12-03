var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
var txtdat = $("#txt_dat");
var ApiForm = '';
var labelCheque = $("#lbl_cheque");
var textboxcheque = $("#txt_cheque");
var lblaccount = $("#lbl_account");
var txtaccount = $("#txt_account");

var _Employee_ID = 0;
var _Employee_Name = '';
var _LoanCategory_ID = 0;
var _LoanCategory_Name = '';

$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1';
    imgload.hide();
    imgloadsav.hide();


    textboxcheque.attr('readonly', true);
    lblaccount.attr('readonly', true);
    txtaccount.attr('readonly', true);
    discon();

    ComponentsDropdowns.init();
});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
}

var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        FillEmployee(); //Fill Select 2 of Employee
        FillLoanCategory(); //Fill Select 2 of Loan Category
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

function FillEmployee() {
    $("#txt_employee").select2({
        placeholder: "Search Employee",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPayroll/GetEmployee',
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
                            machineid: item.machineID,
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
            var data = { "id": _Employee_ID, "text": _Employee_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_employee').on("select2-selected", function (e) {
    _Employee_ID = $("#txt_employee").select2('data').id;
});

$('#txt_employee').on("select2-removed", function (e) {
    _Employee_ID = "0";

});


function FillLoanCategory() {
    $("#txt_category").select2({
        placeholder: "Search Loan Category",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPayroll/GetLoanCategory',
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
                            machineid: item.machineID,
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
            var data = { "id": _LoanCategory_ID, "text": _LoanCategory_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_category').on("select2-selected", function (e) {
    _LoanCategory_ID = $("#txt_category").select2('data').id;
});

$('#txt_category').on("select2-removed", function (e) {
    _LoanCategory_ID = "0";

});

$("#ddl_ModeOfPayment").change(function () {
    var modeofPayment = this.value;
    if (modeofPayment == 'B') {
        textboxcheque.attr('readonly', false);
        txtaccount.attr('readonly', false);
    }
    else if (modeofPayment == 'C') {
        textboxcheque.attr('readonly', true);
        txtaccount.attr('readonly', true);
    }
});

function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/LoanIssue?_MenuId=' + _menuid,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var action_button = ' ';
                //New
                if (response["data"][0]["newPermission"] == 'true') {
                    btnnew.show();
                }

                //Update
                if (Boolean(response["data"][0]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }
                //Delete
                if (Boolean(response["data"][0]["deletePermission"])) {
                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
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
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },

                            { data: 'employee' },
                            {
                                data: 'amount',
                                render: function (data, type, row) { return accounting.format(data) }
                            },
                            {
                                data: 'loanStatus',
                                render: function (data, type, row) {
                                    if (Boolean(data)) {
                                        return 'Complete'
                                    }
                                    return 'In-Process'
                                }
                            },


                        ],
                        "order": [[1, "desc"]],
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
    btnupd.hide();
    btnsav.show();
    imgloadsav.hide();
});

// $("#txt_installmenAmount").keypress(function (e) {
//     dgcal();
// });

// $("#txt_Amount").keypress(function (e) {
//     dgcal();
// });


function ckvalidation() {
    dgcal();
    var ck = 0, _Error = '', _cre = '';


    txtid = $("#txt_id").html();
    txtdate = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    cheqcash = $("#ddl_ModeOfPayment");
    txtemployee = $('#txt_employee');
    txtcategory = $('#txt_category');
    txtamount = $('#txt_amount');
    txtnoofInstalment = $('#txt_noofInstallment');
    txtinstalmentAmount = $('#txt_installmenAmount');
    txtremarks = $('#txt_remarks');


    if (txtamount.val() == '') {
        txtamount.val('0');
    }
    if (txtnoofInstalment.val() == '') {
        txtnoofInstalment.val('0');
    }

    if (txtinstalmentAmount.val() == '') {
        txtinstalmentAmount.val('0');
    }


    if (txtamount.val() == '0') {
        ck = 1;
        _Error = "Amount can't be zero";
        txtamount.focus();
    }
    else if (txtnoofInstalment.val() == '0') {
        ck = 1;
        _Error = "No .of Instalment can't be zero";
        txtnoofInstalment.focus();
    }
    else if (txtinstalmentAmount.val() == '0') {
        ck = 1;
        _Error = "Instalment Amount can't be zero";
        txtinstalmentAmount.focus();
    }
    else if (txtemployee.val() == '') {
        ck = 1;
        _Error = 'Please Select Employee';
        txtemployee.focus();
    }
    else if (txtcategory.val() == '') {
        ck = 1;
        _Error = 'Please Select Loan Category';
        txtcategory.focus();
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "Id": txtid,
            "employeeId": _Employee_ID,
            "loanCategoryId": _LoanCategory_ID,
            "date": txtdate,
            "cheaqueCash": cheqcash.val(),
            "amount": txtamount.val(),
            "noOfInstalment": txtnoofInstalment.val(),
            "instalmentAmount": txtinstalmentAmount.val(),
            "remarks": txtremarks.val(),
            "menu_Id": _menuid
        });

    }
    return { ckval: ck, creteria: _cre };
}

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
                url: ApiForm + '/LoanIssue',
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
                url: ApiForm + '/LoanIssue',
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




//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _employee = data['employee'];
    var _type = data['type'];

    if (_type == "S") {
        Swal.fire({
            title: "This is system generated record!",
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
        title: 'Are sure wants to edit <br/>' + _employee + '?',
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

                url: ApiForm + '/LoanIssue/GetLoanIssueById',
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

                        txtdat.find("input").val(moment(response["data"]["date"]).format('DD/MMM/YYYY'));
                        $('#txt_amount').val(response["data"]["amount"]);
                        $('#txt_noofInstallment').val(response["data"]["noOfInstalment"]);
                        $('#txt_installmenAmount').val(response["data"]["instalmentAmount"]);

                        if (response["data"]["cheaqueCash"] == 'C') {
                            $("#ddl_ModeOfPayment").val('C');
                        } else {
                            $("#ddl_ModeOfPayment").val('B');
                        }


                        _Employee_ID = response["data"]["employeeId"];
                        _Employee_Name = response["data"]["employeeName"];
                        $('#txt_employee').val(_Employee_ID); // Select the option with a value of '1'
                        $('#txt_employee').trigger('change'); // Notify any JS components that the value changed

                        _LoanCategory_ID = response["data"]["loanCategoryId"];
                        _LoanCategory_Name = response["data"]["loanCategoryName"];
                        $('#txt_category').val(_LoanCategory_ID); // Select the option with a value of '1'
                        $('#txt_category').trigger('change'); // Notify any JS components that the value changed

                        $('#txt_remarks').val(response["data"]["remarks"]);

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
    var _employee = data['employee'];
    var _type = data['type'];


    if (_type == "S") {
        Swal.fire({
            title: "This is system generated record!",
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
        title: 'Are sure wants to delete <br> ' + _employee + '?',
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
                url: ApiForm + '/LoanIssue',
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

function dgcal() {
    var _txtamount = $("#txt_amount").val();
    var _txtinstalmenAmount = $("#txt_installmenAmount").val();
    var _monthlyinstallment = 0;
    // if (parseFloat(_txtinstalmenAmount) > 0) {
    _monthlyinstallment = parseFloat(_txtamount) / parseFloat(_txtinstalmenAmount);
    //    }
    $("#txt_noofInstallment").val(_monthlyinstallment);

}
