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
var _Currency_ID = '0';
var _Currency_Name = '';
var _BankType_ID = '0';
var _BankType_Name = '';

var _BankAccount_ID = '0';
var _BankAccount_Name = '';

var ApiForm = '';


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    discon();
    ComponentsDropdowns.init();


});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();

    var txtid = $('#txt_id');
    var txtbktyp = $('#txt_bktyp');
    var txtcurrency = $('#txt_currency');


    $('#ck_active').iCheck('update')[0].checked;
    $('#ck_active').iCheck('check'); //To check the radio button

    txtid.html('');


    txtbktyp.select2('val', '');
    txtbktyp.html('');

    txtcurrency.select2('val', '');
    txtcurrency.html('');

    _Currency_ID = '0';
    _Currency_Name = '';
    _BankType_ID = '0';
    _BankType_Name = '';


    Onload();
    imgload.hide();
}
function Onload() {
    $.ajax({
        url: ApiForm + '/BankAccount',
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
                            { data: 'currencyName' },
                            { data: 'bankTypeName' },
                            { data: 'name' },
                            { data: 'title' },
                            { data: 'bankAccount' },
                            { data: 'glAccountId' },
                            {
                                data: 'active',
                                "render": function (data, type, full, meta) {
                                    if (data) {
                                        return 'Yes';
                                    }
                                    else { return 'No'; }
                                }
                            },
                            {
                                data: 'Type',
                                "render": function (data, type, full, meta) {
                                    if (data == 'S') {
                                        return 'System';
                                    }
                                    else { return 'User'; }
                                }
                            }

                        ],
                        "order": [[1, "asc"]],
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



//Save Record Start
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
                url: ApiForm + '/BankAccount',
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
//Save End

//Update Start
function updrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    Swal.fire({
        title: 'Are you sure you want to Update?',
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
                url: ApiForm + '/BankAccount',
                type: "Put",
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
//Update end





//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['name'];
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
        title: 'Are sure wants to edit <br/>' + _name + '?',
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
                url: ApiForm + '/BankAccount/GetBankAccountById',
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
                        $('#txt_name').val(response["data"]["name"]);
                        $('#txt_title').val(response["data"]["title"]);
                        $('#txt_account').val(response["data"]["bankAccount"]);
                        $('#txt_address').val(response["data"]["address"]);
                        $('#txt_cp').val(response["data"]["contactPerson"]);
                        $('#txt_pho').val(response["data"]["phone"]);
                        $('#txt_fax').val(response["data"]["fax"]);
                        $('#txt_email').val(response["data"]["email"]);
                        $('#txt_web').val(response["data"]["web"]);

                        _Currency_ID = response["data"]["currencyId"];
                        _Currency_Name = response["data"]["currencyName"];
                        $('#txt_currency').val(_Currency_ID); // Select the option with a value of '1'
                        $('#txt_currency').trigger('change'); // Notify any JS components that the value changed

                        _BankType_ID = response["data"]["bankTypeId"];
                        _BankType_Name = response["data"]["bankTypeName"];
                        $('#txt_bktyp').val(_BankType_ID); // Select the option with a value of '1'
                        $('#txt_bktyp').trigger('change'); // Notify any JS components that the value changed

                        // _BankAccount_ID = response["data"]["accountNo"];
                        // _BankAccount_Name = response["data"]["accountName"];
                        // $('#txt_account').val(_BankType_ID); // Select the option with a value of '1'
                        // $('#txt_account').trigger('change'); // Notify any JS components that the value changed


                        if (!response["data"]["active"]) {
                            $('#ck_active').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response["data"]["active"]) {
                            $('#ck_active').iCheck('check'); //To check the radio button
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
    var _name = data['name'];
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
        title: 'Are sure wants to delete <br> ' + _name + '?',
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
                url: ApiForm + '/BankAccount/DeleteBankAccount',
                type: "Post",
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


//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        //Bank Type Start
        FillBankType()
        //Bank Type End

        //Currency Start
        FillCurrency();
        //Currency End

        //  //Account Start
        //  FillAccount();
        //  //Account End
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End
//Currency Start

function FillCurrency() {
    $("#txt_currency").select2({
        placeholder: "Search Currency",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesAccounts/GetCurrency',// apiUrl + '/SetupCombo/GetBankType',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_MenuId", _menuid);
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
            var data = { "id": _Currency_ID, "text": _Currency_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

//Currency End

//Bank Type Start

function FillBankType() {
    $("#txt_bktyp").select2({
        placeholder: "Search Bank Type",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesAccounts/GetBankType',// apiUrl + '/SetupCombo/GetBankType',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_MenuId", _menuid);
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
            var data = { "id": _BankType_ID, "text": _BankType_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Bank Type End

// //Account Start

// function FillAccount() {
//     $("#txt_account").select2({
//         placeholder: "Search AccountNo",
//         //  minimumInputLength: 1,
//         triggerChange: true,
//         allowClear: true,
//         ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
//             url:ApiForm+'/ChartOfAccount',// apiUrl + '/SetupCombo/GetBankType',
//             type: "Get",
//             contentType: "application/json",
//             dataType: "json",
//             transport: function (params) {
//                 params.beforeSend = function (request) {
//                     request.setRequestHeader("Authorization", 'Bearer ' + strkey);
//                     request.setRequestHeader("_MenuId", _menuid);
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
//                             id: item.no,
//                             text: item.name,
//                         })
//                     })
//                 }
//                 var more = (page * 30) < myResults.length; // whether or not there are more results available
//                 // notice we return the value of more so Select2 knows if more results can be loaded
//                 return { results: myResults, more: more };
//             },

//             cache: true
//         },
//         initSelection: function (element, callback) {
//             var data = { "id": _BankAccount_ID, "text": _BankAccount_Name };
//             callback(data);
//         },
//         dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
//         escapeMarkup: function (m) {

//             return m;
//         } // we do not want to escape markup since we are displaying html in results
//     });
// }

//Account End


//Validation

function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';

    var txtid = $('#txt_id').html();
    var txtbktyp = $('#txt_bktyp');
    var txtcurrency = $('#txt_currency');
    var txtname = $('#txt_name').val();
    var txttitle = $('#txt_title').val();
    var txtaccount = $('#txt_account').val();
    var txtaddress = $('#txt_address').val();
    var txtcp = $('#txt_cp').val();
    var txtpho = $('#txt_pho').val();
    var txtfax = $('#txt_fax').val();
    var txtemail = $('#txt_email').val();
    var txtweb = $('#txt_web').val();
    var ckactive = $("#ck_active").iCheck('Update')[0].checked;


    if (txtbktyp.val() == '') {
        ck = 1;
        _Error = 'Please Select BankType';

    }
    if (txtcurrency.val() == '') {
        ck = 1;
        _Error = 'Please Select Currency';

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
        "bankTypeId": txtbktyp.val(),
        "currencyId": txtcurrency.val(),
        "name": txtname,
        "title": txttitle,
        "bankAccount": txtaccount,
        "address": txtaddress,
        "contactPerson": txtcp,
        "phone": txtpho,
        "fax": txtfax,
        "email": txtemail,
        "web": txtweb,
        "active": ckactive,
        "type": "U",
        "menu_Id": _menuid,
    });
    return { ckval: ck, creteria: _cre };
}