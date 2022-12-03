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
var ApiForm = '';

var _Category_ID = '0';
var _Category_Name = '';
var _SubCategory_ID = '0';
var _SubCategory_Name = '';
var _Zone_ID = '0';
var _Zone_Name = '';
var _Salesman_Id = '0';
var _Salesman_Name = '';
var _Department_Id = '0';
var _Department_Name = '';
var _Currency_ID = '0';
var _Currency_Name = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Sales/v1';
    imgload.hide();
    discon();
    ComponentsDropdowns.init();
});

var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillCategory();   //Fill Select 2 of Category
        FillSubCategory();   //Fill Select 2 of SubCategory
        FillZone();   //Fill Select 2 of Zone
        FillSalesman();   //Fill Select 2 of Zone
        FillDepartment();   //Fill Select 2 of Department
        FillCurrency(); //Fill Select 2 of Currency        
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

function FillCategory() {
    $("#txt_category").select2({
        placeholder: "Search Category",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetCustomerCategories',
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
            var data = { "id": _Category_ID, "text": _Category_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_category').on("select2-selected", function (e) {
    _Category_ID = $("#txt_category").select2('data').id;
});

$('#txt_category').on("select2-removed", function (e) {
    _Category_ID = "0";

});


function FillSubCategory() {
    $("#txt_subcategory").select2({
        placeholder: "Search Sub Category",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetCustomerSubCategories',
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
            var data = { "id": _SubCategory_ID, "text": _SubCategory_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_subcategory').on("select2-selected", function (e) {
    _SubCategory_ID = $("#txt_subcategory").select2('data').id;
});

$('#txt_subcategory').on("select2-removed", function (e) {
    _SubCategory_Name = "0";

});


function FillZone() {
    $("#txt_zone").select2({
        placeholder: "Search Zone",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesSales/GetZone',
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
            var data = { "id": _Zone_ID, "text": _Zone_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_zone').on("select2-selected", function (e) {
    _Zone_ID = $("#txt_zone").select2('data').id;
});

$('#txt_zone').on("select2-removed", function (e) {
    _Zone_ID = "0";

});
function FillSalesman() {
    $("#txt_emp").select2({
        placeholder: "Search Salesman",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetSalesman',
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
            var data = { "id": _Salesman_Id, "text": _Salesman_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

function FillDepartment() {
    $("#txt_dpt").select2({
        placeholder: "Search Department",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetDepartment',
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
            var data = { "id": _Department_Id, "text": _Department_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}





function discon() {
    document.getElementById('create_form').reset();
    $('#txt_id').html('');
    $('#ck_active').iCheck('update')[0].checked;
    $('#ck_active').iCheck('check'); //To check the radio button

    $('#ck_stn').iCheck('update')[0].checked;


    $('#rb_normal').iCheck('update')[0].checked;
    $('#rb_normal').iCheck('check'); //To check the radio button
    $('#rb_sick').iCheck('update')[0].checked;
    $('#rb_dead').iCheck('update')[0].checked;

    $('#txt_category').select2('val', '');
    $('#txt_category').html('');
    $('#txt_category').select2('val', '');

    $('#txt_subcategory').select2('val', '');
    $('#txt_subcategory').html('');
    $('#txt_subcategory').select2('val', '');

    $('#txt_zone').select2('val', '');
    $('#txt_zone').html('');
    $('#txt_zone').select2('val', '');

    $("#txt_cusName").val("");
    $("#txt_cusDes").val("");
    $("#txt_cusPhone").val("");
    $("#txt_cusMobile").val("");
    $("#txt_cusEmail").val("");
    $("#txt_dpt").select2('val', '');

    $('#txt_currency').select2('val', '');
    $('#txt_currency').html('');

    _Currency_ID = '0';
    _Currency_Name = '';


    var detailsTableLocation = $("#detailslctnTable tbody >tr");
    detailsTableLocation.remove();

    var detailsTableContactDetail = $("#CustomerContactDetail tbody >tr");
    detailsTableContactDetail.remove();

    _Category_ID = '0';
    _Category_Name = '';

    _SubCategory_ID = '0';
    _SubCategory_Name = '';

    _Zone_ID = '0';
    _Zone_Name = '';
    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();
}


function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/Customer',
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
                            { data: 'customerCategory' },
                            { data: 'customerSubCategory' },
                            { data: 'name' },
                            { data: 'employeeName' },
                            { data: 'zone' },
                            { data: 'currencyName' },
                            { data: 'status' },
                            {
                                data: 'active', render: function (data) {
                                    return data == true ? 'Yes' : 'No'
                                },
                            },
                            {
                                data: 'type',
                                "render": function (data, type, full, meta) {
                                    if (data == 'S') {
                                        return 'System';
                                    }
                                    else { return 'User'; }
                                }
                            }
                        ],
                        "order": [[3, "asc"]],
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
                url: ApiForm + '/Customer',
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
                url: ApiForm + '/Customer',
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
                url: ApiForm + '/Customer',
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
                url: ApiForm + '/Customer/GetCustomerById',
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
                        $('#txt_cp').val(response["data"]["contactPerson"]);
                        $('#txt_address').val(response["data"]["address"]);
                        $('#txt_cnic').val(response["data"]["cnic"]);
                        $('#txt_gstPer').val(response["data"]["gstPercentage"]);
                        $('#txt_phone').val(response["data"]["phone"]);
                        $('#txt_mobile').val(response["data"]["mobile"]);
                        $('#txt_pv').val(response["data"]["productionVariance"]);

                        $('#txt_fax').val(response["data"]["fax"]);
                        $('#txt_email').val(response["data"]["email"]);
                        $('#txt_web').val(response["data"]["web"]);
                        $('#txt_ntn').val(response["data"]["ntn"]);
                        $('#txt_lctn').val(response["data"]["location"]);
                        $('#txt_stn').val(response["data"]["stn"]);
                        $('#txt_credays').val(response["data"]["creditday"]);
                        $('#txt_amountlimit').val(response["data"]["amountlimit"]);


                        _Category_ID = response["data"]["customerCategoryId"];
                        _Category_Name = response["data"]["customerCategoryName"];
                        $('#txt_category').val(_Category_ID); // Select the option with a value of '1'
                        $('#txt_category').trigger('change'); // Notify any JS components that the value changed

                        _SubCategory_ID = response["data"]["customerSubCategoryId"];
                        _SubCategory_Name = response["data"]["customerSubCategoryName"];
                        $('#txt_subcategory').val(_SubCategory_ID); // Select the option with a value of '1'
                        $('#txt_subcategory').trigger('change'); // Notify any JS components that the value changed

                        _Zone_ID = response["data"]["zoneId"];
                        _Zone_Name = response["data"]["zone"];
                        $('#txt_zone').val(_Zone_ID); // Select the option with a value of '1'
                        $('#txt_zone').trigger('change'); // Notify any JS components that the value changed

                        _Salesman_Id = response["data"]["employeeId"];
                        _Salesman_Name = response["data"]["employeeName"];
                        $('#txt_emp').val(_Salesman_Id); // Select the option with a value of '1'
                        $('#txt_emp').trigger('change'); // Notify any JS components that the value changed


                        _Currency_ID = response["data"]["currencyId"];
                        _Currency_Name = response["data"]["currencyName"];
                        $('#txt_currency').val(_Currency_ID); // Select the option with a value of '1'
                        $('#txt_currency').trigger('change'); // Notify any JS components that the value changed


                        //check
                        if (!response["data"]["active"]) {
                            $('#ck_active').iCheck('uncheck');
                        } else { $('#ck_active').iCheck('check'); }

                        if (!response["data"]["stnCheck"]) {
                            $('#ck_stn').iCheck('uncheck');
                        } else { $('#ck_stn').iCheck('check'); }

                        if (response["data"]["status"] == "N") {
                            $('#rb_normal').iCheck('check');
                        }
                        if (response["data"]["status"] == "S") {
                            $('#rb_sick').iCheck('check');
                        }
                        if (response["data"]["status"] == "D") {
                            $('#rb_dead').iCheck('check');
                        }

                        if (response["data"]["locationLists"] != null) {
                            var _UserTable = $("#detailslctnTable tbody");
                            _UserTable.empty();
                            for (var user_row_cnt = 0; user_row_cnt < response["data"]["locationLists"].length; user_row_cnt++) {

                                var _Row = '<tr>' +
                                    '<td style="width:100px"><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td hidden>' + response["data"]["locationLists"][user_row_cnt]["locationId"] + '</td>' +
                                    '<td>' + response["data"]["locationLists"][user_row_cnt]["location"] + '</td>';
                                _Row += '</tr>';
                                _UserTable.append(_Row);
                            }
                        }


                        if (response["data"]["customerContactList"] != null) {
                            var _UserContatTable = $("#CustomerContactDetail tbody");
                            _UserContatTable.empty();
                            for (var user_row_cnts = 0; user_row_cnts < response["data"]["customerContactList"].length; user_row_cnts++) {

                                var _Rows = '<tr>' +
                                    '<td style="width:100px"><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td>' + response["data"]["customerContactList"][user_row_cnts]["name"] + '</td>' +
                                    '<td>' + response["data"]["customerContactList"][user_row_cnts]["designation"] + '</td>' +
                                    '<td>' + response["data"]["customerContactList"][user_row_cnts]["phone"] + '</td>' +
                                    '<td>' + response["data"]["customerContactList"][user_row_cnts]["mobile"] + '</td>' +
                                    '<td>' + response["data"]["customerContactList"][user_row_cnts]["email"] + '</td>' +
                                    '<td hidden>' + response["data"]["customerContactList"][user_row_cnts]["departmentId"] + '</td>' +
                                    '<td>' + response["data"]["customerContactList"][user_row_cnts]["departmentName"] + '</td>';
                                _Rows += '</tr>';
                                _UserContatTable.append(_Rows);
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

//Delete from Image Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    output = confirm('Are sure wants to delete?');
    if (output == false) {
        return false;
    }
    e.preventDefault();
    var $self = $(this);
    if ($(this).attr('data-itemId') == "0") {
        $(this).parents('tr').css("background-color", "#FF6347").fadeOut(800, function () {
            $(this).remove();
            dgcal();
        });
    }
});

//Location table
$("body").on("click", "#btn_addlocation", function () {
    var Location = $("#txt_lctn").val();

    if (Location != "") {
        var _LocationTable = $("#detailslctnTable tbody");
        var _RowLocation = '<tr>' +
            '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
            '<td hidden></td>' +
            '<td>' + Location + '</td>';
        _RowLocation += '</tr>';
        _LocationTable.append(_RowLocation);
        $("#txt_lctn").val("");
    }
    else {
        Swal.fire({
            title: "Document name is not found",
            icon: 'error',
            showConfirmButton: false,
            showCancelButton: true,
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        })
    }
});

//Customer DetailTable table
$("body").on("click", "#btn_addCustomer", function () {
    var txtdpt = $("#txt_dpt").val();
    if (txtdpt != "") {
        var _LocationTable = $("#CustomerContactDetail tbody");
        var _RowLocation = '<tr>' +
            '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
            '<td>' + $("#txt_cusName").val() + '</td>' +
            '<td>' + $("#txt_cusDes").val() + '</td>' +
            '<td>' + $("#txt_cusPhone").val() + '</td>' +
            '<td>' + $("#txt_cusMobile").val() + '</td>' +
            '<td>' + $("#txt_cusEmail").val() + '</td>' +
            '<td hidden>' + $("#txt_dpt").select2('data').id + '</td>' +
            '<td>' + $("#txt_dpt").select2('data').text + '</td>';

        _RowLocation += '</tr>';
        _LocationTable.append(_RowLocation);
        $("#txt_cusName").val("");
        $("#txt_cusDes").val("");
        $("#txt_cusPhone").val("");
        $("#txt_cusMobile").val("");
        $("#txt_cusEmail").val("");
        $("#txt_dpt").select2('val', '');

    }
    else {
        Swal.fire({
            title: "Document name is not found",
            icon: 'error',
            showConfirmButton: false,
            showCancelButton: true,
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        })
    }
});



function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var txtname = $('#txt_name');
    var txtCategory = $('#txt_category');
    var txt_subcategory = $('#txt_subcategory');
    var txtzone = $('#txt_zone');
    var txtcurrency = $('#txt_currency');


    ck_active = $("#ck_active").iCheck('Update')[0].checked;
    var ckstn = $("#ck_stn").iCheck('Update')[0].checked;
    var rbnormal = $("#rb_normal").iCheck('Update')[0].checked;
    var rbsick = $("#rb_sick").iCheck('Update')[0].checked;
    var rbdead = $("#rb_dead").iCheck('Update')[0].checked;
    var txtcp = $('#txt_cp');
    var txtcredays = $('#txt_credays');
    var txt_address = $('#txt_address');
    var txtamountlimit = $('#txt_amountlimit');
    var txtcnic = $('#txt_cnic');
    var txtgstPer = $('#txt_gstPer');
    var txtphone = $('#txt_phone');
    var txtmobile = $('#txt_mobile');
    var txtfax = $('#txt_fax');
    var txtemail = $('#txt_email');
    var txtweb = $('#txt_web');
    var txtntn = $('#txt_ntn');
    var txtlocation = $('#txt_lctn');
    var txtstn = $('#txt_stn');
    var txtpv = $('#txt_pv');
    var txtsales = $('#txt_emp');

    if (txtname.val() == '') {
        ck = 1;
        _Error = 'Please Enter Name';
        txtname.focus();
    }

    if (txtCategory.val() == '') {
        ck = 1;
        _Error = 'Please Select Catgory';
        txtCategory.focus();
    }

    if (txt_subcategory.val() == '') {
        ck = 1;
        _Error = 'Please Select Sub-Category';
        txt_subcategory.focus();
    }

    if (txtzone.val() == '') {
        ck = 1;
        _Error = 'Please Select Zone';
        txtzone.focus();
    }
    if (txtcurrency.val() == '') {
        ck = 1;
        _Error = 'Please Select Currency';

    }

    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (txtemail.val() != '') {
        if (!emailReg.test(txtemail.val())) {
            ck = 1;
            _Error = 'Please Enter Valid Email';
            txtemail.focus();
        }
    }

    var _status = '';

    if (rbnormal == true) {
        _status = 'N';
    }
    else if (rbsick == true) {
        _status = 'S';
    }
    else if (rbdead) {
        _status = 'D';
    }

    var rows_create = $("#detailslctnTable tbody > tr");
    var locdetail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        var _LocationId = $(columns[1]).html().trim();
        var _Location = $(columns[2]).html().trim();
        locdetail_record.push({
            "locationId": _LocationId,
            "location": _Location,
        })
    }

    var rows_create_cus = $("#CustomerContactDetail tbody > tr");
    var cusdetail_record = [];

    for (var i = 0; i < rows_create_cus.length; i++) {
        columns = $(rows_create_cus[i]).find('td');

        cusdetail_record.push({
            "departmentId": $(columns[6]).html().trim(),
            "name": $(columns[1]).html().trim(),
            "designation": $(columns[2]).html().trim(),
            "phone": $(columns[3]).html().trim(),
            "mobile": $(columns[4]).html().trim(),
            "email": $(columns[5]).html().trim(),
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
            "name": txtname.val(),
            "contactPerson": txtcp.val(),
            "address": txt_address.val(),
            "phone": txtphone.val(),
            "mobile": txtmobile.val(),
            "cNIC": txtcnic.val(),
            "fax": txtfax.val(),
            "email": txtemail.val(),
            "web": txtweb.val(),
            "nTN": txtntn.val(),
            "sTNCheck": ckstn,
            "sTN": txtstn.val(),
            "gstPercentage": txtgstPer.val(),
            "EmployeeId": txtsales.val(),
            "ProductionVariance": txtpv.val(),
            "location": txtlocation.val(),
            "status": _status,
            "creditday": txtcredays.val(),
            "amountlimit": txtamountlimit.val(),
            "customerCategoryId": _Category_ID,
            "customerSubCategoryId": _SubCategory_ID,
            "zoneId": _Zone_ID,
            "currencyId": txtcurrency.val(),
            "active": ck_active,
            "locationLists": locdetail_record,
            "customerContactList": cusdetail_record,
            "type": "U",
            "menu_Id": _menuid
        });

    }
    return { ckval: ck, creteria: _cre };
}

//Currency Start

function FillCurrency() {
    console.log(apiUrl);
    $("#txt_currency").select2({
        placeholder: "Search Currency",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetCurrency',// apiUrl + '/SetupCombo/GetBankType',
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