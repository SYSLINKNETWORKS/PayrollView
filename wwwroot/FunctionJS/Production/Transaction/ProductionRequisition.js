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
var btnnew = $("#btn_new ");
var ApiForm = '';

var _Job_Id = 0;
var _Job_Name = '';

var SO_Id = 0;
var mso_id = 0;

var _Item_ID = 0;
var _Item_Name = "";
var _productioDepartment_Id = 0;
var _productioDepartment_Name = '';

$(function () {
    txtdat.datetimepicker({ format: 'DD-MMM-YYYY' });
});


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Production/v1';
    imgload.hide();
    discon();
    ComponentsDropdowns.init();
});


//#region select 2
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FILLPRODUCTIONDEPARTMENT(); //Fill Select 2 of Production Department    
        FillJob();   //Fill Select 2 of SalesOrder
        FILLITEM(); //Fill Select 2 of SalesOrderItem
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

function FillJob() {
    $("#txt_job").select2({
        placeholder: "Search Job",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesProduction/GetJob',
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
            var data = { "id": _Job_Id, "text": _Job_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_job').on("select2-selected", function (e) {
    _Job_Id = $("#txt_job").select2('data').id;
});

$('#txt_job').on("select2-removed", function (e) {
    _Job_Id = "0";

});


function FILLITEM() {
    $("#txt_itm").select2({
        placeholder: "Search Item",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemExceptFinishGood',
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
                            uom: item.uom,
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

$('#txt_itm').on("select2-removed", function (e) {
    _Item_ID = "0";
});



function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    Onload();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);
    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();

    $('#txt_job').select2('val', '');
    $('#txt_job').html('');

    $('#txt_dpt').select2('val', '');
    $('#txt_dpt').html('');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');
    $('#txt_scale').html('');
    $('#txt_qty').val('0');

    imgload.hide();
}

function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/ProductionRequisition',
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
                            { data: 'productionDepartmentName' },
                            {
                                data: 'status',
                                render: function (data, type, row) {
                                    if (Boolean(data)) {
                                        return "Issued"
                                    }
                                    else {
                                        return "Pending"

                                    }
                                },
                            }
                        ],
                        "order": [[1, "desc"], [2, "asc"]],
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
            // else {
            //     imgload.hide();
            //     Swal.fire({
            //         title: response.message,

            //         icon: 'warning',
            //         showConfirmButton: true,

            //         showClass: {
            //             popup: 'animated fadeInDown faster'
            //         },
            //         hideClass: {
            //             popup: 'animated fadeOutUp faster'
            //         }

            //     })
            // }

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

    var rows_create = $("#detailsTable tbody >tr");
    rows_create.empty();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
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
                url: ApiForm + '/ProductionRequisition',
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
                url: ApiForm + '/ProductionRequisition',
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
    if (Boolean(_status)) {
        Swal.fire({
            title: "Requisition has been issued",
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
                url: ApiForm + '/ProductionRequisition',
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
    var _no = data['no'];
    var _status = data['status'];
    if (Boolean(_status)) {
        Swal.fire({
            title: "Requisition has been issued",
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
                url: ApiForm + '/ProductionRequisition/GetProductionRequisitionById',
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
                        $('#txt_no').html(response["data"]["no"]);
                        $('#txt_mrmk').val(response["data"]["remarks"]);
                        $('#txt_dat').val(moment(response["data"]["date"]).format("DD-MMM-YYYY"));


                        // _Job_Id = response["data"]["departmentId"];
                        // _Job_Name = response["data"]["departmentName"];
                        // $('#txt_job').val(_Job_Id); // Select the option with a value of '1'
                        // $('#txt_job').trigger('change'); // Notify any JS components that the value changed

                        _productioDepartment_Id = response["data"]["productionDepartmentId"];
                        _productioDepartment_Name = response["data"]["productionDepartmentName"];
                        $('#txt_dpt').val(_productioDepartment_Id); // Select the option with a value of '1'
                        $('#txt_dpt').trigger('change'); // Notify any JS components that the value changed


                        if (response["data"]["productionRequisitionDetailByIdViewModel"] != null) {
                            var _UserTable = $("#detailsTable tbody");
                            _UserTable.empty();
                            for (var user_row_cnt = 0; user_row_cnt < response["data"]["productionRequisitionDetailByIdViewModel"].length; user_row_cnt++) {
                                _ItemId = response["data"]["productionRequisitionDetailByIdViewModel"][user_row_cnt]["itemId"];
                                _ItemName = response["data"]["productionRequisitionDetailByIdViewModel"][user_row_cnt]["itemName"];
                                var JobID = response["data"]["productionRequisitionDetailByIdViewModel"][user_row_cnt]["jobOrderMasterId"];
                                var JobName = response["data"]["productionRequisitionDetailByIdViewModel"][user_row_cnt]["jobName"];
                                _qty = response["data"]["productionRequisitionDetailByIdViewModel"][user_row_cnt]["qty"];
                                _scalename = response["data"]["productionRequisitionDetailByIdViewModel"][user_row_cnt]["uom"];

                                var _Row = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td hidden>' + JobID + '</td>' +
                                    '<td>' + JobName + '</td>' +
                                    '<td hidden>' + _ItemId + '</td>' +
                                    '<td>' + _ItemName + '</td>' +
                                    '<td>' + _qty + '</td>' +
                                    '<td>' + _scalename + '</td>';

                                _Row += '</tr>';
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

function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var txtdpt = $('#txt_dpt');
    var txtdate = moment(txtdat.find("input")).format("YYYY-MM-DD");

    if (txtdpt.val == '') {
        ck = 1;
        _Error = 'Please select department';
        txtdpt.focus();
    }



    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        var jobId = $(columns[1]).html().trim();
        var ItemId = $(columns[3]).html().trim();
        var qty = parseFloat($(columns[5]).html().trim());

        detail_record.push({
            "itemId": ItemId,
            "jobOrderMasterId": jobId,
            "qty": qty,
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
            "date": txtdate,
            "productionDepartmentId": txtdpt.val(),
            "productionRequisitionDetailViewModels": detail_record,
            "type": "U",
            "menu_Id": _menuid
        });

    }
    console.log(_cre);
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

function AddDetail() {
    var txt_job = $("#txt_job");
    var txt_itm = $("#txt_itm");
    var txt_qty = $("#txt_qty");
    var txt_scale = $('#txt_scale').html();

    var _detailsTable = $("#detailsTable tbody");
    var rows_create = $("#detailsTable tbody >tr");
    var _Error = '';
    var ck = false;


    if (txt_job.select2('data') == null) {
        _Error = 'please select Job';
        txt_job.focus();
        ck = true;
    }
    else if (txt_itm.select2('data') == null) {
        _Error = 'Items not selected';
        txt_itm.focus();
        ck = true;
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return;
    }

    var _Row = '<tr>' +
        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
        '<td hidden>' + txt_job.select2('data').id + '</td>' +
        '<td>' + txt_job.select2('data').text + '</td>' +
        '<td hidden>' + txt_itm.select2('data').id + '</td>' +
        '<td>' + txt_itm.select2('data').text + '</td>' +
        '<td>' + txt_qty.val() + '</td>' +
        '<td>' + txt_scale + '</td>';
    _Row += '</tr>';
    _detailsTable.append(_Row);

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    $('#txt_qty').val('0');
}
$('#txt_itm').on("select2-selected", function (e) {
    $('#txt_scale').html($('#txt_itm').select2('data').uom);

});

$('#txt_itm').on("select2-removed", function (e) {
    $('#txt_scale').val('');
});

function FILLPRODUCTIONDEPARTMENT() {
    $("#txt_dpt").select2({
        placeholder: "Search Production Department",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesProduction/GetProductionDepartment',
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
            var data = { "id": _productioDepartment_Id, "text": _productioDepartment_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
