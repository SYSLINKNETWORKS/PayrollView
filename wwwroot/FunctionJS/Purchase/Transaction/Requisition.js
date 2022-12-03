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
var txtddat = $("#txt_ddat");
var btnnew = $("#btn_new ");
var ApiForm = '';

var _Item_Id = '0';
var _Item_Name = '';



$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtddat.datetimepicker({ format: 'DD/MMM/YYYY' });
});


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Procurement/v1';
    //ApiForm ='https://localhost:44368/api/Production/v1';
    imgload.hide();
    ComponentsDropdowns.init();
    discon();

});

//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        //Fetch Item Start
        fillItem();
        //Item End

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();

//Fill Item Start
function fillItem() {

    $("#txt_itm").select2({
        placeholder: "Search For Item",
        //minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
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
            var data = { "id": _Item_Id, "text": _Item_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Item End

$('#txt_itm').on("select2-selected", function (e) {
    $("#txt_uom").val($("#txt_itm").select2('data').UOM)


});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    Onload();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    txtddat.find("input").val(CurrentDate);

    var detailsTableBody = $("#detailsTable tbody >tr");
    detailsTableBody.remove();


    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    $("#txt_qty").val('0');
    $("#txt_uom").val('');
    $("#txt_drmk").val('');
    $("#txt_rmk").val('');

    imgload.hide();
}

function Onload() {
    $.ajax({
        url: ApiForm + '/Requisition',
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
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },
                            {
                                data: 'deliveryDate',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },
                            { data: 'category' },
                            { data: 'itemName' },
                            { data: 'remarks' },
                            { data: 'stage' },

                        ],
                        "order": [[1, "desc"], [2, "asc"]],
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
    $('#txt_id').html("");

    $('#txt_job').select2('val', '');
    $('#txt_job').html('');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    var rows_create = $("#detailsTable tbody >tr");
    rows_create.empty();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    txtddat.find("input").val(CurrentDate);

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
                url: ApiForm + '/Requisition',
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
                url: ApiForm + '/Requisition',
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

    var _Stage = data['stage'];

    if (_Stage != 'Open') {
        Swal.fire({
            title: "Requisition has been " + _Stage,
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
                url: ApiForm + '/Requisition',
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

                        });
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

    var _Stage = data['stage'];

    if (_Stage != 'Open') {
        Swal.fire({
            title: "Requisition has been " + _Stage,
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
                url: ApiForm + '/Requisition/GetRequisitionById',
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


                        $('#txt_dat').find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));
                        $('#txt_ddat').find("input").val(moment(response["data"]["deliveryDate"]).format("DD/MMM/YYYY"));
                        $('#txt_rmk').val(response["data"]["remarks"]);
                        $('#ddl_category').val(response["data"]["category"]);


                        var _detailsTable = $("#detailsTable tbody");
                        _detailsTable.empty();
                        var _detailRecord = response["data"]["requisitionDetailViewByIdLists"];

                        if (_detailRecord != null) {
                            for (var user_row_cnt = 0; user_row_cnt < _detailRecord.length; user_row_cnt++) {



                                var _Row = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td hidden>' + _detailRecord[user_row_cnt]["itemId"] + '</td>' +
                                    '<td >' + _detailRecord[user_row_cnt]["itemName"] + '</td>' +
                                    '<td>' + _detailRecord[user_row_cnt]["uom"] + '</td>' +
                                    '<td>' + _detailRecord[user_row_cnt]["priority"] + '</td>' +
                                    '<td>' + _detailRecord[user_row_cnt]["qty"] + '</td>' +
                                    '<td>' + _detailRecord[user_row_cnt]["remarks"] + '</td>';
                                _Row += '</tr>';
                                _detailsTable.append(_Row);
                            }

                        }

                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();
                        document.getElementById("ddl_category").disabled =true ;
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

    var rows_create = $("#detailsTable tbody >tr");
    if (rows_create.length == 1) {
        document.getElementById("ddl_category").disabled = false;
    }


});

//add Detail
function AddDetail() {


    var txt_ItemId = $("#txt_itm");
    var txt_qty = $("#txt_qty");
    var txt_uom = $("#txt_uom");
    var txt_drmk = $("#txt_drmk");
    var txt_priority = $("#txt_Priority");


    var _detailsTable = $("#detailsTable tbody");

    var _Error = '';
    var ck = false;
    if (txt_ItemId.select2('data') == null) {
        _Error = 'Item not selected';
        ck = true;
    }

    if (txt_qty.val() == '') {
        _Error = 'Quantity not empty';
        ck = true;
    }
    if (txt_qty.val() == '0' || txt_qty.val() < '0') {
        _Error = 'Quantity should greater then zero';
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
        '<td hidden>' + $("#txt_itm").select2('data').id + '</td>' +
        '<td>' + $("#txt_itm").select2('data').text + '</td>' +
        '<td>' + txt_uom.val() + '</td>' +
        '<td>' + txt_priority.val() + '</td>' +
        '<td>' + txt_qty.val() + '</td>' +
        '<td>' + txt_drmk.val() + '</td>';
    _Row += '</tr>';
    _detailsTable.append(_Row);

    txt_qty.val('0');
    txt_uom.val('');
    txt_drmk.val('');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');
    //    $('#ddl_category').disabled=true;
    document.getElementById("ddl_category").disabled = true;
}

//Validation
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var ddl_category = $('#ddl_category');
    var txt_rmk = $('#txt_rmk');

    var txtdate1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    var txtdate2 = moment(txtddat.find("input").val()).format("YYYY-MM-DD");



    var rows_create = $("#detailsTable tbody >tr");
    var detail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        detail_record.push({
            "itemId": $(columns[1]).html().trim(),
            "uom": $(columns[3]).html(),
            "priority": $(columns[4]).html(),
            "qty": $(columns[5]).html(),
            "remarks": $(columns[6]).html()
        })
    }
    if (detail_record == '') {
        ck = 1;
        _Error = 'Please Fill Detail Table';

    }
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return;
    }

    _cre = JSON.stringify({
        "ID": txtid,
        "date": txtdate1,
        "deliveryDate": txtdate2,
        "category": ddl_category.val(),
        "remarks": txt_rmk.val(),
        "type": "U",
        "menu_Id": _menuid,
        "requisitionDetailAddModel": detail_record,
    });
    return { ckval: ck, creteria: _cre };
}

//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _no = data['no'];
    var _dateFrom = data['date'];

    // console.log(data,_mdn_id);
    // return;

    Swal.fire({
        title: "Are sure wants to print Requisition # " + _no + "?",
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
            cre = '{ "dateFrom": "' + _dateFrom + '","dateTo":"' + _dateFrom + '","no":"' + _no + '"}';
            var sessid = "D" + moment(new Date()).format("DDMMYYYYHHmmss");
            sessionStorage.setItem(sessid, cre);

            var win = window.open(apiUrl_View + '/Purchase/Report/RequisitionReport?S=' + sessid, '_blank');

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