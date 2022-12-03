var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var txtdat1 = $("#txt_dat");
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
var _Cur_ID = 0;
var _so_nam = "";
var _Customer_Id = 0;
var _Customer_Name = "";


var _Cur_ID = '0';
var _Cur_Name = '';

var _DC_ID = '0';
var _DC_Name = '';

var ApiForm = '';

$(function () {
    txtdat1.datetimepicker({ format: 'DD/MMM/YYYY' });
});


//Discon Start
function discon() {
    document.getElementById('create_form').reset();


    _Currency.select2('val', '');
    _Currency.html('');
    slsmn.select2('val', '');
    slsmn.html('');
    $('#txt_id').html('');
    $('#txt_no').val('0');
    // $('#ck_taxNo').iCheck('update')[0].checked;
    // $('#ck_taxNo').iCheck('check'); //To check the radio button
    $('#ddl_taxNo').val(1);
    //taxid.empty();
    btnsav.hide();
    btnupd.hide();
    btnnew.show();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    imgload.hide();
    imgloadsav.hide();
    ComponentsDropdowns.init();
    Onload();

};
//Discon End

$(document).on("click", '#btn_new', function () {
    discon();
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    $("#detailsTable > tbody").html("");
    btnsav.show();
    btnupd.hide();
    imgloadsav.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat1.find("input").val(CurrentDate);



});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Sales/v1';
    discon();
});

//Onload Start
function Onload() {
    $.ajax({
        url: ApiForm + '/Invoice',
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
                            { data: 'soName' },
                            { data: 'employeeName' },//salesman
                            { data: 'customerName' },
                            { data: 'taxNo' },
                            {
                                data: 'amount', render: function (data, type, row) {
                                    return accounting.format(data)
                                }
                            },
                            { data: "status" },


                        ],
                        columnDefs: [
                            { orderable: false, targets: [0, 0], className: 'text-left' }
                        ],
                        "order": [[1, "desc"], [2, "asc"]],
                        "pageLength": 10
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
                url: ApiForm + '/Invoice',
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
                        Onload();
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
                url: ApiForm + '/Invoice',
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
                        Onload();
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

//Fill Currency Start
function fillCurrency() {
    $("#txt_cur").select2({
        placeholder: "Search for Currency",
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
            var data = { "id": _Cur_ID, "text": _Cur_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Fill Currency End

//Fill DC Start
function fillDC() {
    $("#txt_DC").select2({
        placeholder: "Search for Delivery Challan",
        triggerChange: true,
        multiple: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetDeliveryChallanForSO',
            type: "Get",
            contentType: "application/json",
            dataType: "json",

            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_Id", $('#txt_cus').select2('data').id);
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
//Fill DC End

//Fill Salesman Start
function fillCustomer() {
    $("#txt_cus").select2({
        placeholder: "Search for a Customer",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetCustomer',
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
                            gstper: item.gstPer,

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


//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        //Fetch Currency Start
        fillCurrency();
        //Currency End

        //Customer Start
        fillCustomer();
        //Customer End


        //WareHouse Start
        fillDC();
        //WareHouse End

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();



//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['no'];
    var _type = data['type'];

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
                url: ApiForm + '/Invoice/GetInvoiceById',
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
                        $('#txt_no').val(response["data"]["no"]);
                        $('#txt_taxNo').val(response["data"]["taxNo"]);

                        $('#txt_amt').val(accounting.format(response["data"]["grossAmount"], 0));
                        $('#txt_dis').val(response["data"]["discountPer"]);
                        $('#txt_disamt').val(accounting.format(response["data"]["discountAmount"], 0));
                        $('#txt_netamt').val(accounting.format(response["data"]["netAmount"], 0));

                        //  $('#txt_invno').val(response["data"]["invoiceNo"]);
                        txtdat1.find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));
                        $('#txt_exrate').val(response["data"]["exchangeRate"]);
                        $('#txt_rmk').val(response["data"]["remarks"]);



                        _Customer_Id = response["data"]["customerId"];
                        _Customer_Name = response["data"]["customerName"];
                        $('#txt_cus').val(_Customer_Id); // Select the option with a value of '1'
                        $('#txt_cus').trigger('change'); // Notify any JS components that the value changed

                        _Cur_ID = response["data"]["currencyId"];
                        _Cur_Name = response["data"]["currencyName"];
                        $('#txt_cur').val(_Cur_ID); // Select the option with a value of '1'
                        $('#txt_cur').trigger('change'); // Notify any JS components that the value changed

                        if (!response["data"]["ck_TaxNo"]) {
                            $('#ddl_taxNo').val(0);
                        } else {
                            $('#ddl_taxNo').val(1);
                        }

                        ddltaxNoChange();

                        if (response["data"]["invoiceDetailByIdViewModel"] != null) {
                            var _DetailRecord = response["data"]["invoiceDetailByIdViewModel"];
                            $('#txt_gstper').val(_DetailRecord[0]["gstPer"]);

                            var _UserTable = $("#detailsTable tbody");
                            _UserTable.empty();
                            var _TotalAmount = 0;

                            for (var user_row_cnt = 0; user_row_cnt < _DetailRecord.length; user_row_cnt++) {

                                _DC_ID = _DetailRecord[user_row_cnt]["deliveryChallanId"];
                                _DC_Name = _DetailRecord[user_row_cnt]["dcName"];
                                $('#txt_DC').val(_DC_ID); // Select the option with a value of '1'
                                $('#txt_DC').trigger('change'); // Notify any JS components that the value changed

                                var _Row = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["deliveryChallanId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["dcNo"] + '</td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["itemId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["itemName"] + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["qty"], 2) + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["rate"] + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["amount"], 2) + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["gstPer"] + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["gstAmount"], 2) + '</td>' +
                                    '<td>' + accounting.format(_DetailRecord[user_row_cnt]["netAmount"], 2) + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["remarks"] + '</td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["itemCategoryId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["itemCategoryName"] + '</td>' +
                                    '</tr>';


                                _TotalAmount += _DetailRecord[user_row_cnt]["amount"];
                                _UserTable.append(_Row);

                            }
                            $("#txt_amount").val(_TotalAmount);
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


//Add DC
function AddDc() {
    var arrDC = $("#txt_DC").val();
    if (arrDC == '') {
        Swal.fire({
            title: 'Please select DC#',

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

    $.ajax({
        url: ApiForm + '/LOVServicesSales/GetDCDetail',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Id", arrDC);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                //Detail Start
                var detailsTableBody = $("#detailsTable tbody");
                detailsTableBody.empty();
                const _DetailRecord = response["data"];
                var sno = 1;
                var productItem;
                var _TotalAmount = 0, _gstAmount = 0, _amount = 0, _netAmount = 0;

                for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {

                    _amount = _DetailRecord[row_cnt]["qty"] * _DetailRecord[row_cnt]["rate"];
                    _gstper = $("#txt_gstper").val();
                    _gstAmount = _amount * (_gstper / 100);
                    _netAmount = _amount + _gstAmount;
                    productItem += '<tr>' +
                        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["id"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["dcNo"] + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["itemId"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["itemName"] + '</td>' +
                        '<td >' + accounting.format(_DetailRecord[row_cnt]["qty"], 2) + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["rate"] + '</td>' +
                        '<td>' + accounting.format(_amount, 2) + '</td>' +
                        '<td>' + accounting.format(_gstper, 2) + '</td>' +
                        '<td>' + accounting.format(_gstAmount, 2) + '</td>' +
                        '<td>' + accounting.format(_netAmount, 2) + '</td>' +
                        '<td >' + _DetailRecord[row_cnt]["remarks"] + '</td>' +
                        '<td style="display:none;">' + _DetailRecord[row_cnt]["itemCategoryId"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["itemCategoryName"] + '</td>' +
                        '</tr>';
                    //   _TotalAmount += _netAmount;

                }
                // $("#txt_amt").val(accounting.format(_TotalAmount, 0));
                // $("#txt_netamt").val(accounting.format(_TotalAmount, 0));
                detailsTableBody.append(productItem);
                calculation();
                imgload.hide();
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
//End DC


//Delete Start
$('table').on('click', '.btn-delete', function (e) {

    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _No = data['no'];

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
                url: ApiForm + '/Invoice',
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


function ddltaxNoChange() {
    var ddltaxNo = $('#ddl_taxNo').val();
    if (ddltaxNo == 1) {
        $("#txt_taxNo").prop("readonly", false);
    }
    else if (ddltaxNo == 0) {
        $("#txt_taxNo").prop("readonly", true);
    }

}

//Validation Start
function ckvalidation() {

    var ck = 0, _Error = '', _cre = '';

    var txtid = $('#txt_id').html();
    var txtno = $('#txt_no').val();

    var txtamt = accounting.unformat($("#txt_amt").val());
    var txtdiscount = accounting.unformat($("#txt_dis").val());
    var txtdisamount = accounting.unformat($("#txt_disamt").val());
    var txtnetamt = accounting.unformat($("#txt_netamt").val());
    var txtTaxNo = $('#txt_taxNo').val();
    var txtcus = $('#txt_cus');
    var txtCurrency = $('#txt_cur');
    var txtExRate = $('#txt_exrate');
    var txtrmk = $("#txt_rmk");
    var ddltaxNo = $("#ddl_taxNo").val() == 1 ? true : false;

    var date1 = moment(txtdat1.find("input").val()).format("YYYY-MM-DD");

    if (txtcus.val() == '') {
        ck = 1;
        _Error = 'Please Select Customer';
        txtcus.focus();
    }
    if (txtno == '') {
        ck = 1;
        _Error = 'Please Select NO#';
        $('#txt_no').focus();
    }

    if (txtCurrency.val() == '') {
        ck = 1;
        _Error = 'Please Select Currency';
        txtCurrency.focus();
    }



    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        var txtdeliveryChallanId = $(columns[1]).html().trim();
        var txtitemId = $(columns[3]).html().trim();
        var txtqty = accounting.unformat($(columns[5]).html().trim());
        var txtrate = parseFloat($(columns[6]).html().trim());
        var txtamount = accounting.unformat($(columns[7]).html().trim());
        var txtgstPer = accounting.unformat($(columns[8]).html().trim());
        var txtgstAmount = accounting.unformat($(columns[9]).html().trim());
        var txtnetAmount = accounting.unformat($(columns[10]).html().trim());
        var txtremarks = ($(columns[11]).html().trim());
        var txtitemCategoryId = ($(columns[12]).html().trim());

        detail_record.push({
            "deliveryChallanId": txtdeliveryChallanId,
            "itemId": txtitemId,
            "qty": txtqty,
            "rate": txtrate,
            "amount": txtamount,
            "gstPer": txtgstPer,
            "gstAmount": txtgstAmount,
            "netAmount": txtnetAmount,
            "itemCategoryId": txtitemCategoryId,
            "remarks": txtremarks
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
            "no": txtno,
            "date": date1,
            "amount": txtamt,
            "discountPer": txtdiscount,
            "discountAmount": txtdisamount,
            "netAmount": txtnetamt,
            "taxNo": txtTaxNo,
            // "invoiceNo": txtNo,
            "customerId": txtcus.val(),
            "currencyId": txtCurrency.val(),
            "exchangeRate": txtExRate.val(),
            "ck_TaxNo": ddltaxNo,
            "remarks": txtrmk.val(),
            "invoiceDetailViewModel": detail_record,
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
                    calculation();
                });
            }
        }
    })
});
//Delete from Table End

//Calculation
function calculation() {
    var txtnetAmount = 0;
    var rows_create = $("#detailsTable tbody >tr");

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        txtnetAmount += parseInt(accounting.unformat($(columns[10]).html().trim()));
    }

    var _amount = txtnetAmount;
    var _disPer = parseFloat($("#txt_dis").val());
    var _disAmount = 0;
    var _netAmount = txtnetAmount;

    if (_disPer > 0) {
        _disAmount = _amount * _disPer / 100;
        _netAmount = _amount - _disAmount;
    }
    $("#txt_amt").val(accounting.format(txtnetAmount, 0));
    $("#txt_disamt").val(accounting.format(_disAmount, 0));
    $("#txt_netamt").val(accounting.format(_netAmount, 0));

}

$('#txt_cus').on("select2-selected", function (e) {
    _Customer_ID = $("#txt_cus").select2('data').id;
    $("#txt_gstper").val($("#txt_cus").select2('data').gstper);

});

$('#txt_cus').on("select2-removed", function (e) {
    _Customer_ID = "0";
    $("#txt_gstper").val(0);

});
