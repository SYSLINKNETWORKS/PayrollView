var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var ApiForm = '';
var app_checkid = 0;
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
var ApiForm = '';

var txtdat = $("#txt_dat");
var txtddat = $("#txt_ddat");
var txtpodat = $("#txt_podat");

var _Customer_ID = 0;
var _Amount = 0;
var _Customer_Name = '';
var _Salesman_ID = 0;
var _Salesman_Name = '';
var _Item_ID = 0;
var _Item_Name = '';


$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtddat.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtpodat.datetimepicker({ format: 'DD/MMM/YYYY' });

});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Sales/v1';
    imgload.hide();
    discon();
    ComponentsDropdowns.init();

});

//#region select 2
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FILLCUSTOMER();   //Fill Select 2 of Customer
        FILLSALESMAN();   //Fill Select 2 of Salesman
        //FILLITEM();  //Fill Select 2 of Item
        FILLDESCRIPTION(); // Fill Description
        //FILLITEMDESCRIPTION();// fill item description
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

function FILLCUSTOMER() {
    $("#txt_cus").select2({
        placeholder: "Search Customer",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetCustomerBySalesman',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_id", $('#txt_slsman').select2('data').id);
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
            var data = { "id": _Customer_ID, "text": _Customer_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_cus').on("select2-selected", function (e) {
    _Customer_ID = $("#txt_cus").select2('data').id;
    $("#txt_gstper").val($("#txt_cus").select2('data').gstper);

});

$('#txt_cus').on("select2-removed", function (e) {
    _Customer_ID = "0";
    $("#txt_gstper").val(0);

});

function FILLSALESMAN() {
    $("#txt_slsman").select2({
        placeholder: "Search for a salesman",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetSalesman',
            type: "Get",
            dataType: 'json',
            delay: 250,
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
            var data = { "id": _Salesman_ID, "text": _Salesman_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_slsman').on("select2-selected", function (e) {
    _Salesman_ID = $("#txt_slsman").select2('data').id;
});

$('#txt_slsman').on("select2-removed", function (e) {
    _Salesman_ID = "0";

});

// function FILLITEM() {
//     $("#txt_itm").select2({
//         placeholder: "Search for Item",
//         minimumInputLength: 0,
//         triggerChange: true,
//         allowClear: true,
//         ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
//             url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemFinishGoodByCustomer',
//             type: "Get",
//             dataType: 'json',
//             delay: 250,
//             transport: function (params) {
//                 params.beforeSend = function (request) {
//                     request.setRequestHeader("Authorization", 'Bearer ' + strkey);
//                     request.setRequestHeader("CustomerId", $('#txt_cus').select2('data').id);
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
//                             id: item.id,
//                             text: item.name
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
//             var data = { "id": _Item_ID, "text": _Item_Name };
//             callback(data);
//         },

//         dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
//         escapeMarkup: function (m) {

//             return m;
//         } // we do not want to escape markup since we are displaying html in results
//     });
// }

function FILLDESCRIPTION() {

    $("#txt_des").select2({
        placeholder: "Search for Description",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetDescriptionForSaleOrder',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("_customerId", $('#txt_cus').select2('data').id);
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
                            rate: item.rate,
                            qty: item.qty,

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
            var data = { "id": _Item_ID, "text": _Item_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_itm').on("select2-selected", function (e) {
    _Item_ID = $("#txt_itm").select2('data').id;
});

$('#txt_des').on("select2-selected", function (e) {

    $("#txt_rate").val($("#txt_des").select2('data').rate);
    $("#txt_qty").val($("#txt_des").select2('data').qty);

});

$('#txt_des').on("select2-removed", function (e) {
    $("#txt_rate").val(0);
    $("#txt_qty").val(0);


});
// function GetAmount(DetailId) {
//     $.ajax({
//         url: apiUrl + '/api/v1/LOVServicesSales/GetQutationDetail',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         infoEmpty: "No records available - Got it?",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("DetailId", DetailId);
//             imgload.show();
//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 $("#txt_rate").val(response["data"]["rate"])
//                 $("#txt_qty").val(response["data"]["amount"])




//             }
//             else {
//                 imgload.hide();
//                 Swal.fire({
//                     title: response.message,

//                     icon: 'warning',
//                     showConfirmButton: true,

//                     showClass: {
//                         popup: 'animated fadeInDown faster'
//                     },
//                     hideClass: {
//                         popup: 'animated fadeOutUp faster'
//                     }

//                 })
//             }
//         },
//         error: function (xhr, status, err) {
//             imgload.hide();
//             Swal.fire({
//                 title: xhr.status.toString() + ' ' + err.toString(),

//                 icon: 'warning',
//                 showConfirmButton: true,

//                 showClass: {
//                     popup: 'animated fadeInDown faster'
//                 },
//                 hideClass: {
//                     popup: 'animated fadeOutUp faster'
//                 }

//             })
//         }
//     })
//     return true;
// }

$('#txt_itm').on("select2-removed", function (e) {
    _Item_ID = "0";

});

function discon() {
    document.getElementById('create_form').reset();
    $('#txt_id').html('');

    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    txtddat.find("input").val(CurrentDate);
    txtpodat.find("input").val(CurrentDate);

    $('#txt_des').select2('val', '');
    $('#txt_des').html('');

    // $('#txt_itmDes').select2('val', '');
    // $('#txt_itmDes').html('');

    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();
}


$("#txt_qty").keyup(function (e) {
    if (e.keyCode === 13) {

        var txtrate = $("#txt_rate").val();
        var txtqty = $("#txt_qty").val();
        var _amount = txtqty * txtrate;
        $("#txt_amt").val(_amount);

        var txtrmk = $("#txt_rmk").val();

        var  _gstper = parseFloat($("#txt_gstper").val()), _gstamt = 0, _netamount = 0;

        _gstamt = parseFloat(_amount) * (parseFloat(_gstper) / 100);
        _netamount = parseFloat(_amount) + parseFloat(_gstamt);


        var descriptionid = $("#txt_des").select2('data').id;
        var descriptionName = $("#txt_des").select2('data').text;



        $("#detailsTable tbody").append('<tr>' +
            '<td><a data-itemId="0" class="deleteItem">Remove</a></td>' +
            //'<td >' + descriptionid + '</td>' +
            '<td style="display: none;">' + descriptionid + '</td>' +
            '<td>' + descriptionName + '</td>' +
            '<td>' + txtrmk + '</td>' +
            '<td>' + txtddat.find("input").val() + '</td>' +
            '<td >' + txtrate + '</td>' +
            '<td>' + txtqty + '</td>' +
            '<td>' + _amount + '</td>' +
            '<td>' + _gstper + '</td>' +
            '<td>' + _gstamt + '</td>' +
            '<td>' + _netamount + '</td>' +
            '</tr>');

        $("#txt_rate").val('0');
        $("#txt_qty").val('0');
        $("#txt_amt").val('');
        $("#txt_rmk").val('');

        $('#txt_des').select2('val', '');
        $('#txt_des').html('');


    }
});

//Onload Start
function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $.ajax({
        url: ApiForm + '/saleOrder',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
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
                                render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
                            },
                            { data: 'customerName' },
                            //                            { data: 'customerPO' },
                            {
                                data: null,
                                // type: 'date',
                                render: function (data, type, row) {
                                    if (data.customerPO != '') {
                                        return data.customerPO + '<br>' + moment(data.poDate).format('DD-MM-YYYY')
                                    }
                                    else {
                                        return '';
                                    }
                                }


                            },
                            { data: 'employeeName' },
                            {
                                data: 'check', render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'approved',
                                render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'ckJobCard',
                                render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'cancel',
                                render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'close', render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
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


$(document).on("click", '#btn_new', function () {
    $('#data_Modal').modal('show');
    $('#txt_id').html("");


    $('#txt_cus').select2('val', '');
    $('#txt_po').val('');
    $('#txt_slsman').select2('val', '');
    $('#txt_des').val('');
    // $('#txt_itmDes').select2('val', '');
    $('#txt_rmk').val('');
    $('#txt_rate').val('0');
    $('#txt_qty').val('0');



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
                url: ApiForm + '/SaleOrder',
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
                url: ApiForm + '/SaleOrder',
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
    var _sno = data['soNo'];
    var _Check = data['check'];
    var _Approved = data['approved'];
    var _JobCard = data['ckJobCard'];

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


    if (Boolean(_Approved)) {
        Swal.fire({
            title: "Sale order has been approved",
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

    if (Boolean(_Check)) {
        Swal.fire({
            title: "Sale order has been checked",
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
    if (Boolean(_JobCard)) {
        Swal.fire({
            title: "Job Card has been proceed",
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
        title: 'Are sure wants to delete <br> ' + _sno + '?',
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
                url: ApiForm + '/SaleOrder',
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


//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _sno = data['no'];
    var _Check = data['check'];
    var _Approved = data['approved'];
    var _JobCard = data['ckJobCard'];

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





    if (Boolean(_Approved)) {
        Swal.fire({
            title: "Sale order has been approved",
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

    if (Boolean(_Check)) {
        Swal.fire({
            title: "Sale order has been checked",
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
    if (Boolean(_JobCard)) {
        Swal.fire({
            title: "Job Card has been proceed",
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
        title: 'Are sure wants to edit <br/>' + _sno + '?',
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
                url: ApiForm + '/SaleOrder/GetSaleOrderById',
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

                        txtdat.find("input").val(moment(response["data"]["date"]).format('DD/MMM/YYYY'))
                        txtpodat.find("input").val(moment(response["data"]["poDate"]).format('DD/MMM/YYYY'))
                        txtpodat.find("input").val(moment(response["data"]["deliveryDate"]).format('DD/MMM/YYYY'))

                        $('#txt_po').val(response["data"]["customerPO"]);
                        // $('#txt_rmk').val(response["data"]["remarks"]);
                        // $('#txt_rate').val(response["data"]["rate"]);
                        // $('#txt_des').val(response["data"]["description"]);
                        // $('#txt_qty').val(response["data"]["qty"]);

                        _Customer_ID = response["data"]["customerId"];
                        _Customer_Name = response["data"]["customerName"];
                        $('#txt_cus').val(_Customer_ID); // Select the option with a value of '1'
                        $('#txt_cus').trigger('change'); // Notify any JS components that the value changed
                        $('#txt_gstper').val(response["data"]["saleOrderDetailViewByIdLists"][0]["gstPercentage"]);

                        // _Item_ID = response["data"]["itemId"];
                        // _Item_Name = response["data"]["itemName"];
                        // $('#txt_itm').val(_Item_ID); // Select the option with a value of '1'
                        // $('#txt_itm').trigger('change'); // Notify any JS components that the value changed

                        _Salesman_ID = response["data"]["employeeId"];
                        _Salesman_Name = response["data"]["employeeName"];
                        $('#txt_slsman').val(_Salesman_ID); // Select the option with a value of '1'
                        $('#txt_slsman').trigger('change'); // Notify any JS components that the value changed


                        //Detail Start
                        var detailsTableBody = $("#detailsTable tbody");
                        detailsTableBody.empty();
                        const _DetailRecord = response["data"]["saleOrderDetailViewByIdLists"];

                        var productItem;
                        for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {

                            var _amount = parseFloat(_DetailRecord[row_cnt]["amount"]), _gstper = parseFloat(_DetailRecord[row_cnt]["gstPercentage"]), _gstamt = 0, _netamount = 0;
                            _gstamt = parseFloat(_amount) * (parseFloat(_gstper) / 100);
                            _netamount = parseFloat(_amount) + parseFloat(_gstamt);

                            productItem += '<tr>' +

                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                '<td style="display: none;">' + _DetailRecord[row_cnt]["quotationDetailId"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["description"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["remarks"] + '</td>' +
                                '<td>' + moment(_DetailRecord[row_cnt]["deliveryDate"]).format("YYYY-MM-DD") + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["rate"] + '</td>' +
                                '<td>' + _DetailRecord[row_cnt]["qty"] + '</td>' +
                                '<td>' + _amount + '</td>' +
                                '<td>' + _gstper + '</td>' +
                                '<td>' + _gstamt + '</td>' +
                                '<td>' + _netamount + '</td>' +

                                '</tr>';


                        }
                        detailsTableBody.append(productItem);
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

function ckvalidation() {

    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var ddlcustomer = $('#txt_cus');
    var txtpo = $('#txt_po');
    var ddlsalesman = $('#txt_slsman');
    var ddlitem = $('#txt_itm');

    var date1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    //date1=date1.slice(1);


    var _txtpodat1 = moment(txtpodat.find("input").val()).format("YYYY-MM-DD");
    //txtpodat1=txtpodat1.slice(1);






    if (ddlcustomer.val() == '') {
        ck = 1;
        _Error = 'Please Select Customer';
        ddlcustomer.focus();
    }

    if (ddlsalesman.val() == '') {
        ck = 1;
        _Error = 'Please Select Salesman';
        ddlsalesman.focus();
    }

    // if (ddlitem.val() == '') {
    //     ck = 1;
    //     _Error = 'Please Select item ';
    //     ddlitem.focus();
    // }


    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        var descriptionId = $(columns[1]).html().trim();
        var description = $(columns[2]).html().trim();
        var remarks = $(columns[3]).html().trim();
        var txtddates = ($(columns[4]).html().trim());
        var _ddate = moment(txtddates).format('YYYY-MM-DD')
        var rate = $(columns[5]).html().trim();
        var qty = $(columns[6]).html().trim();
        var amount = $(columns[7]).html().trim();
        var gstPercentage = $(columns[8]).html().trim();
        //_ddate = _ddate.slice(1),

        detail_record.push({
            "quotationDetailId": descriptionId,
            "deliveryDate": _ddate,
            // "itemDescriptionId": itemDescriptionId,
            "qty": qty,
            "rate": rate,
            "amount": amount,
            "gstPercentage": gstPercentage,
            "description": description,
            "remarks": remarks
        })
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
            "customerPO": txtpo.val(),
            "poDate": _txtpodat1,
            "customerId": _Customer_ID,
            "employeeId": _Salesman_ID,
            "saleOrderDetailAddModels": detail_record,
            "amount": 0,
            "type": "U",
            "menu_Id": _menuid
        });
    }
    return { ckval: ck, creteria: _cre };
}


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
});
//Delete from Table End

// function FILLITEMDESCRIPTION() {
//     $("#txt_itmDes").select2({
//         placeholder: "Search for Item Description",
//         minimumInputLength: 0,
//         triggerChange: true,
//         allowClear: true,
//         ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
//             url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetItemDescription',
//             type: "Get",
//             dataType: 'json',
//             delay: 250,
//             transport: function (params) {
//                 params.beforeSend = function (request) {
//                     request.setRequestHeader("Authorization", 'Bearer ' + strkey);
//                     request.setRequestHeader("_Id", $('#txt_cus').select2('data').id);
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
//                             id: item.id,
//                             text: item.name
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
//             var data = { "id": _Item_ID, "text": _Item_Name };
//             callback(data);
//         },

//         dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
//         escapeMarkup: function (m) {

//             return m;
//         } // we do not want to escape markup since we are displaying html in results
//     });
// }



