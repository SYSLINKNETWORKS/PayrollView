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
var txtcdat = $("#txt_cdat");
var btnnew = $("#btn_new ");
var ApiForm = '';

var _Customer_Id = '0';
var _Customer_Name = '';

var _Currency_Id = '0';
var _Currency_Name = '';

var _Account_Id = '0';
var _Account_Name = '';


$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtcdat.datetimepicker({ format: 'DD/MMM/YYYY' });
});


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Sales/v1';
    //ApiForm ='https://localhost:44368/api/Production/v1';
    imgload.hide();
    ComponentsDropdowns.init();
    discon();
});

//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        fillCustomer();
        fillCustomerBank();
        fillCurrency();
        fillAccount();

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();

//Fill Customer Start
function fillCustomer() {

    $("#txt_cus").select2({
        placeholder: "Search For Customer",
        //minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetCustomer',
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
                            UOM: item.uom,
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
            var data = { "id": _Customer_Id, "text": _Customer_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Customer End

//Fill Customer Bank Start
function fillCustomerBank() {

    $("#txt_customerBank").select2({
        placeholder: "Search For Customer Bank",
        //minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetCustomerBank',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            // tags:true,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CustomerId", $("#txt_cus").val());
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
            var data = { "id": _CustomerBank_Id, "text": _CustomerBank_Name };
            callback(data);
        },
        //Allow manually entered text in drop down.
        createSearchChoice: function (term, results) {
            if ($(results).filter(function () {
                return term.localeCompare(this.text) === 0;
            }).length === 0) {
                return { id: term, text: term + ' [New]' };
            }
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Bill Detail 
$('#txt_cus').on("select2-selected", function (e) {
    $.ajax({
        url: ApiForm + '/LOVServicesSales/GetInvoiceByCustomer',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Id", $('#txt_cus').select2('data').id);
        },

        success: function (response) {
            if (response.statusCode == 200) {
                var detailsTable = $("#detailsTable tbody");
                detailsTable.empty();
                var _detailRecord = response["data"];
                var productItem;
                var balance = 0;
                for (var user_row_cnt = 0; user_row_cnt < _detailRecord.length; user_row_cnt++) {

                    balance = _detailRecord[user_row_cnt]["amount"] - _detailRecord[user_row_cnt]["received"];
                    productItem += '<tr>' +
                        //                               
                        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                        '<td hidden>' + _detailRecord[user_row_cnt]["id"] + '</td>' +
                        '<td >' + _detailRecord[user_row_cnt]["inovceNo"] + '</td>' +
                        '<td >' + _detailRecord[user_row_cnt]["taxNo"] + '</td>' +
                        '<td>' + _detailRecord[user_row_cnt]["customerPO"] + '</td>' +
                        '<td>' + (_detailRecord[user_row_cnt]["dueDate"] != null ? moment(_detailRecord[user_row_cnt]["dueDate"]).format('DD-MMM-YYYY') : "") + '</td>' +
                        '<td>' + _detailRecord[user_row_cnt]["rate"] + '</td>' +
                        '<td>' + accounting.format(_detailRecord[user_row_cnt]["amount"], 0) + '</td>' +
                        '<td>' + accounting.format(_detailRecord[user_row_cnt]["received"], 0) + '</td>' +
                        '<td>' + accounting.format(balance, 0) + '</td>' +
                        '<td> <input type="text" id="txt_blnc"  class="form-control" value="0" onchange="calculation()"/></td>' + //Payment
                        '<td > <input type="text"    class="form-control" value="0" onchange="calculation()" /></td>' + // WHT %
                        '<td> 0 </td>' +
                        '<td> ' + accounting.format(balance, 0) + ' </td>' +
                        '<td> ' + accounting.format(balance, 0) + ' </td>' +



                        '</tr>';
                }
                detailsTable.append(productItem);
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

});


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
                            UOM: item.uom,
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

//Fill Account Start
function fillAccount() {

    $("#txt_acc").select2({
        placeholder: "Search For Account",
        //minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetChartOfAccountCBJ',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CBJ", $('select#ddl_mop option:selected').val());
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
            var data = { "id": _Account_Id, "text": _Account_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Account End



function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    Onload();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    txtcdat.find("input").val(CurrentDate);


    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();




    $('#txt_cus').select2('val', '');
    $('#txt_cus').html('');

    $('#txt_cur').select2('val', '');
    $('#txt_cur').html('');

    $('#txt_acc').select2('val', '');
    $('#txt_acc').html('');

    //    $("#chqdate").css("display", "none");
    $("#div_bank").hide();

    imgload.hide();
}

function Onload() {
    $.ajax({
        url: ApiForm + '/Receiving',
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
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },
                            { data: 'customerName' },
                            {
                                data: 'modeOfReceiving',
                                type: 'date',
                                render: function (data, type, row) {
                                    if (data == 'B') {
                                        return 'Bank'
                                    }
                                    if (data == 'C') {
                                        return 'Cash'
                                    }
                                    if (data == 'J') {
                                        return 'JOURNAL VOURCHER'
                                    }
                                }

                            },
                            { data: 'accountName' },
                            {
                                data: 'amount',
                                render: function (data, type, row) {
                                    return accounting.format(data, 0)
                                }
                            },
                            { data: 'remarks' },
                            { data: "status" },



                        ],
                        "order": [[2, "desc"], [1, "asc"]],
                        "pageLength": 10,

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

$(document).on("click", '#btn_new', function () {

    $('#data_Modal').modal('show');
    $('#txt_id').html("");

    $('#txt_job').select2('val', '');
    $('#txt_job').html('');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    // $("#txt_chq").hide();
    // $("#lblchq").hide();


    var rows_create = $("#detailsTable tbody >tr");
    rows_create.empty();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);

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
                url: ApiForm + '/Receiving',
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
                url: ApiForm + '/Receiving',
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
                url: ApiForm + '/Receiving',
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
    var _date = moment(data['date']).format('DD-MMM-YYYY');
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
                url: ApiForm + '/Receiving/GetReceivingById',
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
                        $('#txt_rat').val(response["data"]["rate"]);
                        $('#txt_chq').val(response["data"]["chqNo"]);
                        $('#txt_dat').find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));
                        $('#txt_cdat').find("input").val(moment(response["data"]["chqDate"]).format("DD/MMM/YYYY"));
                        $('#txt_chq').val(response["data"]["chqNo"]);
                        $('#txt_rmk').val(response["data"]["remarks"]);
                        $('#txt_amount').val(response["data"]["amount"]);



                        if (response["data"]["modeOfReceiving"] == 'B') {
                            $("#div_bank").show();
                            $('#ddl_mop').val('B');
                        }
                        else if (response["data"]["modeOfReceiving"] == 'C') {
                            $('#ddl_mop').val('C');
                        }
                        else if (response["data"]["modeOfReceiving"] == 'J') {
                            $('#ddl_mop').val('J');
                        }

                        if (Boolean(response["data"]["onlineCheck"])) {
                            $("#ddl_online").val(1);
                        } else {
                            $("#ddl_online").val(0);
                        }


                        _Customer_Id = response["data"]["customerMasterId"];
                        _Customer_Name = response["data"]["customerName"];
                        $('#txt_cus').val(_Customer_Id); // Select the option with a value of '1'
                        $('#txt_cus').trigger('change'); // Notify any JS components that the value changed

                        _Currency_Id = response["data"]["currencyId"];
                        _Currency_Name = response["data"]["currencyName"];
                        $('#txt_cur').val(_Currency_Id); // Select the option with a value of '1'
                        $('#txt_cur').trigger('change'); // Notify any JS components that the value changed

                        _Account_Id = response["data"]["accountNo"];
                        _Account_Name = response["data"]["chartOfAccountName"];
                        $('#txt_acc').val(_Account_Id); // Select the option with a value of '1'
                        $('#txt_acc').trigger('change'); // Notify any JS components that the value changed



                        _CustomerBank_Id = response["data"]["customerBank"];
                        _CustomerBank_Name = response["data"]["customerBank"];
                        $('#txt_customerBank').val(_CustomerBank_Id); // Select the option with a value of '1'
                        $('#txt_customerBank').trigger('change'); // Notify any JS components that the value changed

                        var _detailsTable = $("#detailsTable tbody");
                        _detailsTable.empty();
                        var _detailRecord = response["data"]["receivingDetailByIdViewModel"];
                        if (_detailRecord != null) {
                            for (var user_row_cnt = 0; user_row_cnt < _detailRecord.length; user_row_cnt++) {
                                balance = _detailRecord[user_row_cnt]["amount"] - _detailRecord[user_row_cnt]["received"];
                                var _Row = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td hidden>' + _detailRecord[user_row_cnt]["invoiceMasterId"] + '</td>' +
                                    '<td >' + _detailRecord[user_row_cnt]["invoiceNo"] + '</td>' +
                                    '<td >' + _detailRecord[user_row_cnt]["taxNo"] + '</td>' +
                                    '<td>' + _detailRecord[user_row_cnt]["customerPONo"] + '</td>' +
                                    '<td>' + (_detailRecord[user_row_cnt]["dueDate"] != null ? moment(_detailRecord[user_row_cnt]["dueDate"]).format("DD-MMM-YYYY") : "") + '</td>' +
                                    '<td>' + _detailRecord[user_row_cnt]["rate"] + '</td>' +
                                    '<td>' + accounting.format(_detailRecord[user_row_cnt]["amount"], 0) + '</td>' +
                                    '<td>' + accounting.format(_detailRecord[user_row_cnt]["received"], 0) + '</td>' +
                                    '<td>' + accounting.format(balance, 0) + '</td>' +
                                    '<td> <input type="text" id="txt_blnc"  class="form-control" value="' + _detailRecord[user_row_cnt]["receiving"] + '" onchange="calculation()"/></td>' + //Payment
                                    '<td > <input type="text"    class="form-control" value="' + _detailRecord[user_row_cnt]["whtPercentage"] + '" onchange="calculation()" /></td>' + // WHT %
                                    '<td> ' + _detailRecord[user_row_cnt]["whtAmount"] + ' </td>' +
                                    '<td> ' + accounting.format(_detailRecord[user_row_cnt]["netAmount"], 0) + ' </td>' +
                                    '<td> ' + accounting.format((balance - _detailRecord[user_row_cnt]["netAmount"]), 0) + ' </td>';
                                _Row += '</tr>';
                                calculation();
                                _detailsTable.append(_Row);
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


//Mode of Payment Changes
$("#ddl_mop").change(function (e) {
    // $("#chqdate").css("display", "none");
    var value = $('select#ddl_mop option:selected').val();

    // if (value == 'J') { $("#txt_chq").css("display", "none"); $("#lblchq").css("display", "none"); }
    // else if (value == 'B') { $("#chqdate").show(); $("#txt_chq").show(); $("#lblchq").show() }
    // else if (value == 'C') { $("#txt_chq").hide(); $("#lblchq").hide() }
    $("#div_bank").hide();

    if (value == 'B') { $("#div_bank").show(); }

    $('#txt_acc').select2('val', '');
    $('#txt_acc').html('');

});



// Calculation
function calculation() {
    var rows_create = $("#detailsTable tbody >tr");

    var Receiving = 0;
    var whtPer = 0;
    var whtAmount = 0;
    var netAmount = 0;
    var netBalance = 0;
    var balance = 0;

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        balance = accounting.unformat($(columns[9]).html(), 0);
        Receiving = parseFloat($(columns[10]).find("input[type='text']").val());
        whtPer = parseFloat($(columns[11]).find("input[type='text']").val());

        //wht amount 

        whtAmount = Math.round(balance * (whtPer / 100), 0);
        netAmount = Receiving + whtAmount;
        netBalance = (balance - netAmount);

        $(columns[12]).html(accounting.format(whtAmount, 0));
        $(columns[13]).html(accounting.format(netAmount, 0));
        $(columns[14]).html(accounting.format(netBalance, 0));


    }
}

function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var txtcus = $('#txt_cus');
    var txtcurrency = $('#txt_cur');
    var txtmoc = $('#ddl_mop');
    var txtacc = $('#txt_acc');
    var txtrat = $('#txt_rat').val();
    var txtrmk = $('#txt_rmk');
    var txtchq = $('#txt_chq');
    var txtamount = $('#txt_amount');
    var txtcustomerBank = $('#txt_customerBank').val();
    var _ckonline = false;
    if ($('#ddl_online').val() == "1") { _ckonline = true; };

    var date1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    var date2 = moment(txtcdat.find("input").val()).format("YYYY-MM-DD");
    if (txtrat == '') {
        txtrat = 0;
    }

    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];
    var _receivingAmount = 0, _totalReceivingAmount = 0, _whtPercentage = 0, _netAmount = 0;
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        _receivingAmount = parseFloat($(columns[10]).find("input[type='text']").val());

        if (parseFloat(_receivingAmount) > 0) {
            _netAmount = accounting.unformat($(columns[13]).html(), 0);
            _totalReceivingAmount += parseFloat(_receivingAmount);
            _whtPercentage = parseFloat($(columns[11]).find("input[type='text']").val());

            if (_netAmount < 0) {
                Swal.fire({
                    title: "NetAmount should be greater or equal Zero",
                    icon: 'error'
                })
                return;
            }
            detail_record.push({
                "invoiceMasterId": $(columns[1]).html(),
                "receiving": _receivingAmount,
                "whtPercentage": _whtPercentage,
                "whtAmount": accounting.unformat($(columns[12]).html(), 0),
                "netAmount": accounting.unformat($(columns[13]).html(), 0),
            })
        }
    }


    if (txtcus.val() == '') {
        ck = 1;
        _Error = 'Please Select Customer';
        txtcus.focus();
    }
    if (txtcurrency.val() == '') {
        ck = 1;
        _Error = 'Please Select currency';
        txtcurrency.focus();
    }
    if (txtacc.val() == '') {
        ck = 1;
        _Error = 'Please Select Account';
        txtacc.focus();
    }
    if (txtamount.val() <= 0) {
        ck = 1;
        _Error = 'Receiving amount cannot be zero';
        txtamount.focus();

    }
    if (txtamount.val() < _receivingAmount) {
        ck = 1;
        _Error = 'Receiving amount is less than adjusted amount';
        txtamount.focus();

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
            "customerMasterId": txtcus.val(),
            "date": date1,
            "currencyId": txtcurrency.val(),
            "modeOfReceiving": txtmoc.val(),
            "accountNo": txtacc.val(),
            "rate": txtrat,
            "chqNo": txtchq.val(),
            "chqDate": date2,
            "Amount": txtamount.val(),
            "customerBank": txtcustomerBank,
            "onlineCheck": _ckonline,
            "remarks": txtrmk.val(),
            "receivingDetailViewModels": detail_record,
            "type": "U",
            "menu_Id": _menuid,
        });
    }
    return { ckval: ck, creteria: _cre };
}
