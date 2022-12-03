var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var txtdat1 = $("#txt_dat");
var txtdat2 = $("#txt_sdat");
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
var _Supplier_Id = 0;
var _Supplier_Name = "";
var _gstPercentage = 0;


var _Cur_ID = '0';
var _Cur_Name = '';

var _GRN_Id = '0';
var _GRN_Name = '';

var _srNo = 1;

var ApiForm = '';

$(function () {
    txtdat1.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdat2.datetimepicker({ format: 'DD/MMM/YYYY' });
});


//Discon Start
function discon() {
    document.getElementById('create_form').reset();
    _gstPercentage = 0;


    _Currency.select2('val', '');
    _Currency.html('');
    slsmn.select2('val', '');
    slsmn.html('');
    $('#txt_id').html('');

    $('#ck_taxNo').iCheck('update')[0].checked;
    $('#ck_taxNo').iCheck('check'); //To check the radio button


    $("#txt_no").html('');
    //taxid.empty();
    btnsav.hide();
    btnupd.hide();
    btnnew.show();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    imgload.hide();
    imgloadsav.hide();
    ComponentsDropdowns.init();

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
    txtdat2.find("input").val(CurrentDate);



});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Procurement/v1';
    Onload();
    ComponentsDropdowns.init();
});

//Onload Start
function Onload() {
    $.ajax({
        url: ApiForm + '/Bill',
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

                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },
                            { data: 'category' },
                            { data: 'grnName' },
                            { data: 'supplierName' },
                            { data: 'taxNo' },
                            { data: 'itemName' },
                            {
                                data: 'netAmount',
                                render: function (data, type, row) {
                                    return accounting.format(data, 0)
                                }
                            },
                            { data: 'remarks' },
                            {
                                data: 'stage'
                            },


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
                url: ApiForm + '/Bill',
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
                url: ApiForm + '/Bill',
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

//Fill GRN Start
function fillGRN() {
    $("#txt_grn").select2({
        placeholder: "Search for grn",
        triggerChange: true,
        multiple: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPurchase/GetGRNBySupplierId',
            type: "Get",
            contentType: "application/json",
            dataType: "json",

            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_Id", $('#txt_sup').select2('data').id);
                };

                return $.ajax(params);

            },
            data: function (term, page) {
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
            var data = { "id": _GRN_Id, "text": _GRN_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Fill GRN End

//Fill Supplier Start
function fillSupplier() {
    $("#txt_sup").select2({
        placeholder: "Search for a supllier",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPurchase/GetSuppliers',
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
                            gstPercentage: item.gstPercentage,

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


//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        //Fetch Currency Start
        fillCurrency();
        //Currency End

        //Supplier Start
        fillSupplier();
        //Supplier End


        //GRN Start
        fillGRN();
        //GRN End

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
    var _no = data['no'];

    var _Stage = data['stage'];
    if (_Stage != "Open") {
        Swal.fire({
            title: "Bill has been " + _Stage,
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
                url: ApiForm + '/Bill/GetBillById',
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
                        $("#txt_no").html(response["data"]["no"]);

                        $('#txt_taxNo').val(response["data"]["taxNo"]);
                        $('#txt_supbil').val(response["data"]["supplierBillNo"]);
                        txtdat1.find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));
                        txtdat2.find("input").val(moment(response["data"]["supplierDate"]).format("DD/MMM/YYYY"));
                        $('#txt_exrate').val(response["data"]["exchangeRate"]);

                        $('#txt_amt').val(accounting.format(response["data"]["grossAmount"]));
                        $('#txt_disper').val(response["data"]["discountPercentage"]);
                        $('#txt_disamt').val(accounting.format(response["data"]["discountAmount"], 0));
                        $('#txt_netamt').val(accounting.format(response["data"]["netAmount"], 0));
                        $('#txt_rmk').val(response["data"]["remarks"]);
                        $('#ddl_category').val(response["data"]["category"]);

                        _Supplier_Id = response["data"]["supplierId"];
                        _Supplier_Name = response["data"]["supplierName"];
                        _gstPercentage = response["data"]["gstPercentage"];
                        $('#txt_sup').val(_Supplier_Id); // Select the option with a value of '1'
                        $('#txt_sup').trigger('change'); // Notify any JS components that the value changed


                        _Cur_ID = response["data"]["currencyId"];
                        _Cur_Name = response["data"]["currencyName"];
                        $('#txt_cur').val(_Cur_ID); // Select the option with a value of '1'
                        $('#txt_cur').trigger('change'); // Notify any JS components that the value changed




                        //check
                        if (!response["data"]["ck_TaxNo"]) {
                            $('#ck_taxNo').iCheck('uncheck');
                            $("#txt_taxNo").prop("readonly", true);
                        } else {
                            $('#ck_taxNo').iCheck('check');
                            $("#txt_taxNo").prop("readonly", false);
                        }


                        if (response["data"]["billDetailByIdViewModel"] != null) {
                            var _DetailRecord = response["data"]["billDetailByIdViewModel"];
                            var _UserTable = $("#detailsTable tbody");
                            _UserTable.empty();
                            var sno = 1;
                            for (var user_row_cnt = 0; user_row_cnt < _DetailRecord.length; user_row_cnt++) {
                                _GRN_Id = response["data"]["grnMasterId"];
                                _GRN_Name = response["data"]["grnNo"];
                                $('#txt_grn').val(_GRN_Id); // Select the option with a value of '1'
                                $('#txt_grn').trigger('change'); // Notify any JS components that the value changed

                                var _Row = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td>' + sno + '</td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["grnMasterId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["grnNo"] + '</td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["itemId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["itemName"] + '</td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["accountNo"] + '</td>' +
                                    '<td >' + _DetailRecord[user_row_cnt]["accountName"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["qty"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["rate"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["amount"] + '</td>' +
                                    '<td><input type="text" id="disper" class="form-control" style="width:40px" onchange="calculation()" value=' + _DetailRecord[user_row_cnt]["gstPer"] + '></td>' +
                                    '<td><input type="text" id="disper" class="form-control" style="width:80px" onchange="calculation()" readonly value=' + accounting.format(_DetailRecord[user_row_cnt]["gstAmount"], 0) + '></td>' +
                                    '<td><input type="text" id="disper" class="form-control" style="width:80px" onchange="calculation()" readonly value=' + accounting.format(_DetailRecord[user_row_cnt]["netAmount"], 0) + '></td>' +
                                    '<td><input type="text" id="disper" class="form-control" style="width:70px" onchange="calculation()" value=' + _DetailRecord[user_row_cnt]["remarks"] + '></td>' +
                                    '<td style="display:none;">' + _DetailRecord[user_row_cnt]["itemCategoryId"] + '</td>' +
                                    '<td>' + _DetailRecord[user_row_cnt]["itemCategoryName"] + '</td>' +
                                    '</tr>';
                                _UserTable.append(_Row);
                                sno++;

                            }
                            // $("#txt_amount").val(_TotalAmount);
                            calculation();
                            document.getElementById("ddl_category").disabled =true ;
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


//Add GRN
function AddGRN() {
    var arrGRN = $("#txt_grn").val();
    if (arrGRN == '') {
        Swal.fire({
            title: 'Please select GRN#',

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
        url: ApiForm + '/LOVServicesPurchase/GetGRNItemDetail',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Id", arrGRN);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                //Detail Start
                var detailsTableBody = $("#detailsTable tbody");
                detailsTableBody.empty();
                const _DetailRecord = response["data"];
                var productItem;
                for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {
                    // console.log(row_cnt,sno);
                    var _amount = _DetailRecord[row_cnt]["qty"] * _DetailRecord[row_cnt]["rate"];
                    // _srNo = _srNo + row_cnt;
                    productItem += '<tr>' +
                        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                        '<td>' + _srNo + ' </td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["id"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["no"] + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["itemId"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["itemName"] + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["accountNo"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["accountName"] + '</td>' +
                        '<td >' + accounting.format(_DetailRecord[row_cnt]["qty"], 0) + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["rate"] + '</td>' +
                        '<td>' + accounting.format(_amount, 0) + '</td>' +
                        '<td > <input type="text" class="form-control" style="width:40px" value="' + _gstPercentage + '" onchange="calculation()" readonly></td>' +
                        '<td><input type="text" class="form-control" style="width:70px" readonly value="0"></td>' +
                        '<td><input type="text"  class="form-control" style="width:70px" readonly value="0"></td>' +
                        '<td > <input type="text" id="rmk" class="form-control" style="width:100px"></td>' +
                        '<td style="display:none;width:50px">' + _DetailRecord[row_cnt]["itemCategoryId"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["itemCategoryName"] + '</td>' +
                        '</tr>';
                    _srNo++;
                }

                $("#txt_amt").val(accounting.format(_amount, 0));
                $("#txt_disper").val('0');
                $("#txt_disamt").val('0');
                $("#txt_netamt").val(accounting.format(_amount, 0));


                detailsTableBody.append(productItem);
                imgload.hide();
                calculation();
                _srNo = 1;
                document.getElementById("ddl_category").disabled =true ;

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

function calculation() {
    var rows_create = $("#detailsTable tbody >tr");

    var amount = 0;
    var disPer = 0;
    var Amount = 0;
    var grossAmount = 0;
    var gstPer = 0;
    var netAmount = 0;

    var netamt = 0;
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        amount = accounting.unformat($(columns[10]).html(), 0);
        gstPer = $(columns[11]).find("input[type='text']").val();

        //GST Amount
        var gstAmount = parseFloat(amount) * (parseFloat(gstPer) / 100);
        $(columns[12]).find("input[type='text']").val(accounting.format(gstAmount, 0));
        //NetAmount
        netAmount = parseFloat(amount) + parseFloat(gstAmount);
        $(columns[13]).find("input[type='text']").val(accounting.format(netAmount, 0));

        netamt += netAmount;
    }
    $("#txt_amt").val(accounting.format(netamt, 0));
    $("#txt_netamt").val(accounting.format(netamt, 0));
}
//Delete Start
$('table').on('click', '.btn-delete', function (e) {

    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _no = data['no'];
    var _Stage = data['stage'];
    if (_Stage != "Open") {
        Swal.fire({
            title: "Bill has been " + _Stage,
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
                url: ApiForm + '/Bill',
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

function calculationMaster() {
    var amount = 0;
    var disper = 0;
    var disamt = 0;
    var Conveyance = 0;
    var desingamt = 0;
    var othamt = 0;
    var netAmount = 0;
    amount = accounting.unformat($("#txt_amt").val(), 0);
    disper = accounting.unformat($("#txt_disper").val(), 0);


    //discount Amount


    if ($("#txt_disamt").val() == 0) {
        disamt = amount * (disper / 100);
        accounting.format($("#txt_disamt").val(disamt.toFixed(0)), 0)
    }
    netAmount = amount - disamt;
    accounting.format($("#txt_netamt").val(netAmount.toFixed(0)), 0);

}




$('#ck_taxNo').on('ifClicked', function () {

    var taxno = $('#ck_taxNo').iCheck('update')[0].checked

    if (taxno == true) {
        $("#txt_taxNo").prop("readonly", true);
    }
    else {
        $("#txt_taxNo").prop("readonly", false);
    }

});

//Validation Start
function ckvalidation() {

    var ck = 0, _Error = '', _cre = '';

    var txtid = $('#txt_id').html();
    var txtsupBil = $("#txt_supbil").val();
    var txtTaxNo = $('#txt_taxNo').val();
    var txtsup = $('#txt_sup');
    var txtCurrency = $('#txt_cur');
    var txtExRate = $('#txt_exrate').val();
    var ddl_category = $('#ddl_category');

    var txtamount = accounting.unformat($('#txt_amt').val(), 0);
    var txtdiscountper = $('#txt_disper').val();
    var txtdiscountamt = accounting.unformat($('#txt_disamt').val(), 0);
    var txtnetAmt = accounting.unformat($('#txt_netamt').val(), 0);

    var ck_taxNo = $("#ck_taxNo").iCheck('Update')[0].checked;
    var txtrmk = $("#txt_rmk");

    var date1 = moment(txtdat1.find("input").val()).format("YYYY-MM-DD");
    var date2 = moment(txtdat2.find("input").val()).format("YYYY-MM-DD");

    if (txtTaxNo == '') {
        ck = 1;
        _Error = 'TaxNo required';
        $('#txt_taxNo').focus();
    }

    if (txtsup.val() == '') {
        ck = 1;
        _Error = 'Please Select Supplier';
        txtsup.focus();
    }
    if (txtExRate == '' || txtExRate <= 0) {
        ck = 1;
        _Error = 'Exchange rate should be greater then zero';
        txtsup.focus();
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

        detail_record.push({
            "grnMasterId": $(columns[2]).html().trim(),
            "itemId": $(columns[4]).html().trim(),
            "accountNo": $(columns[6]).html().trim(),
            "qty": accounting.unformat($(columns[8]).html().trim(), 0),
            "rate": $(columns[9]).html().trim(),
            "amount": accounting.unformat($(columns[10]).html().trim(), 0),
            "gstPer": $(columns[11]).find("input[type='text']").val(),
            "gstAmount": accounting.unformat($(columns[12]).find("input[type='text']").val(), 0),
            "netAmount": accounting.unformat($(columns[13]).find("input[type='text']").val(), 0),

            "remarks": $(columns[14]).find("input[type='text']").val(),
            "itemCategoryId": $(columns[15]).html().trim(),
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
            "supplierDate": date2,
            "currencyId": txtCurrency.val(),
            "ck_TaxNo": ck_taxNo,
            "taxNo": parseInt(txtTaxNo),
            "supplierBillNo": txtsupBil,
            "supplierId": txtsup.val(),
            "exchangeRate": txtExRate,
            "amount": txtamount,
            "discountPercentage": txtdiscountper,
            "discountAmount": txtdiscountamt,
            "netAmount": txtnetAmt,
            "remarks": txtrmk.val(),
            "category": ddl_category.val(),
            "billDetailViewModels": detail_record,
            "type": "U",
            "menu_Id": _menuid
        });
    }
    console.log(_cre);
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
                });
            }
        }
    })
    var rows_create = $("#detailsTable tbody >tr");
    if (rows_create.length == 1) {
        document.getElementById("ddl_category").disabled = false;
    }

});
//Delete from Table End
$('#txt_sup').on("select2-selected", function (e) {
    _gstPercentage = $("#txt_sup").select2('data').gstPercentage;
});

//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();

    var _no = data['no'];
    var _dateFrom = data['date'];
    _dateFrom = moment(_dateFrom).format("YYYY-MM-DD");



    Swal.fire({
        title: "Are sure wants to print Bill # " + _no + "?",
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

            var win = window.open(apiUrl_View + '/Purchase/Report/PurchaseBillReport?S=' + sessid, '_blank');

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