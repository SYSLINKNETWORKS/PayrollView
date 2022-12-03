var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var btnupd = $('#btn_update');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
var txtdat1 = $("#txt_dat");
var ApiForm = '';

var _Req_ID = 0;
var _Req_Name = '0';
var SO_Id = 0;
var mso_id = 0;
var _Warehouse_ID = '0';
var _Warehouse_Name = ''

$(function () {
    txtdat1.datetimepicker({ format: 'DD/MMM/YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Production/v1';
    imgload.hide();
    discon();
    ComponentsDropdowns.init();
});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    $('#txt_id').html('');
    $('#txt_no').html('');
    ComponentsDropdowns.init();
    Onload();
    imgload.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat1.find("input").val(CurrentDate);
    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();




}

function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/ProductionIssue',
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
    var rows_create = $("#detailsTable tbody >tr");
    rows_create.remove();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat1.find("input").val(CurrentDate);


    $('#txt_req').select2('val', '');
    $('#txt_req').html('');

    $('#txt_wh').select2('val', '');
    $('#txt_wh').html('');
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
                url: ApiForm + '/ProductionIssue',
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
                url: ApiForm + '/ProductionIssue',
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
    var _no = data['no'];
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
                url: ApiForm + '/ProductionIssue/GetProductionIssueById',
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
                        $('#txt_dat').val(moment(response["data"]["date"]).format("DD-MMM-YYYY"));

                        ;

                        if (response["data"]["productionIssueDetailByIdViewModel"] != null) {
                            var _UserTable = $("#detailsTable tbody");
                            _UserTable.empty();
                            for (var user_row_cnt = 0; user_row_cnt < response["data"]["productionIssueDetailByIdViewModel"].length; user_row_cnt++) {
                                _ItemId = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["itemId"];
                                _ItemName = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["itemName"];
                                var JobID = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["productionRequisitionMasterId"];
                                var JobName = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["productionRequisitionMasterName"];

                                var whid = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["warehouseId"];
                                var whName = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["warehouseName"];

                                var _qty = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["qty"];
                                var _stk = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["stock"];
                                var _issue = response["data"]["productionIssueDetailByIdViewModel"][user_row_cnt]["issue"];

                                var _Row = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td hidden>' + JobID + '</td>' +
                                    '<td>' + JobName + '</td>' +
                                    '<td hidden>' + _ItemId + '</td>' +
                                    '<td>' + _ItemName + '</td>' +
                                    '<td hidden>' + whid + '</td>' +
                                    '<td>' + whName + '</td>' +
                                    '<td>' + accounting.format(_qty, 4) + '</td>' +
                                    '<td>' + accounting.format(_stk, 4) + '</td>' +
                                    '<td><input type="text"  class="form-control" style="width:70px"  value=' + accounting.format(_issue, 4) + '></td>';

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




//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _no = data['no'];
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
                url: ApiForm + '/ProductionIssue',
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

//comment start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillProductionRequisition();

        //Fill WH Start
        FillWH()
        //Fill WH End
    }

    return {
        //main function to initiate the module
        init: function () {

            handleSelect2();
        }
    };
}();

//comment end


//Fill ProductionRequisition

function FillProductionRequisition() {
    $("#txt_req").select2({
        placeholder: "Search requisition",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        multiple: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesProduction/GetProductionRequisition',
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
            var data = { "id": _Req_ID, "text": _Req_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

//Fill ProductionRequisition

//Fill WH Start
function FillWH() {
    $("#txt_wh").select2({
        placeholder: "Search for Warehouse",
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetWarehouse',
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
            var data = { "id": _Warehouse_ID, "text": _Warehouse_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill WH End




function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var date1 = moment(txtdat1.find("input").val()).format("YYYY-MM-DD");



    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];


    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        var jobId = $(columns[1]).html().trim();
        var ItemId = $(columns[3]).html().trim();
        var whId = $(columns[5]).html().trim();
        var _qty = accounting.unformat($(columns[7]).html(), 0);
        var _stock = accounting.format($(columns[8]).html(), 0);
        var _issue = parseFloat($(columns[9]).find("input[type='text']").val());


        if (_issue == 0) {
            _Error = 'Issance qty can not be zero';
            ck = true;

        }

        if (_issue > _stock) {
            _Error = 'Issance qty is greater then stock available';
            ck = true;
        }

        if (_issue > _qty) {
            _Error = 'issuence not greater then Production requisition';
            ck = true;
        }

        detail_record.push({
            "itemId": ItemId,
            "warehouseId": whId,
            "productionRequisitionMasterId": jobId,
            "issue": _issue,
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
            "productionIssueDetailViewModels": detail_record,
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
                });
            }
        }
    })
});
//Delete from Table End

//Add Requisition
function AddRequisition() {
    var _RequisitionId = $("#txt_req").val();
    if (_RequisitionId == '') {
        Swal.fire({
            title: 'Please select Requisition#',

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
    if ($("#txt_wh").select2('data') == null) {
        Swal.fire({
            title: 'Please select warehouse',

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
        url: ApiForm + '/LOVServicesProduction/GetProductionRequisitionDetailById',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("WarehouseID", $("#txt_wh").select2('data').id);
            xhr.setRequestHeader("Id", _RequisitionId);
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
                for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {

                    var _amount = _DetailRecord[row_cnt]["qty"] * _DetailRecord[row_cnt]["rate"];
                    productItem += '<tr>' +
                        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                        '<td style="display: none;">' + _RequisitionId + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["jobName"] + '</td>' +
                        '<td style="display: none;">' + _DetailRecord[row_cnt]["itemId"] + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["itemName"] + '</td>' +

                        '<td style="display: none;">' + $("#txt_wh").select2('data').id + '</td>' +
                        '<td>' + $("#txt_wh").select2('data').text + '</td>' +

                        '<td >' + accounting.format(_DetailRecord[row_cnt]["productionRequisition"], 4) + '</td>' +
                        '<td>' + _DetailRecord[row_cnt]["stock"] + '</td>' +
                        '<td> <input type="text" id="txt_issue" class="form-control" value="0" placeholder="0" style="width:70px"  ></td>' +
                        '</tr>';
                }
                detailsTableBody.append(productItem);
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

