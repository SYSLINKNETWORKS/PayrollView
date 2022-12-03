var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}


var imgload = $("#img_load");
var ApiForm = '';

var _ItemCategory_Id = 0;
var _ItemCategory_Name = '';
var _ItemSubCategory_Id = 0;
var _ItemSubCategory_Name = '';
var _Brand_Id = 0;
var _Brnad_Name = '';

var _Item_Id = 0;
var _Item_Name = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Inventory/v1';
    imgload.hide();
    discon();

    ComponentsDropdowns.init();
});

//#region select 2
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        fillWarehouses();
        fillItem();
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();


//Brand Start
function fillItem() {
    $("#txt_itm").select2({
        placeholder: "Search Item",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetItem',
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
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
$('#txt_itm').on("select2-selected", function (e) {
    _Item_Id = $("#txt_itm").select2('data').id;
});

$('#txt_itm').on("select2-removed", function (e) {
    _Item_Id = "0";
});


//Warehouse Start
function fillWarehouses() {
    $("#txt_warehouse").select2({
        placeholder: "Search Warehouse",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/ReportLOVServices/GetWarehouse',
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
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}


function discon() {
    document.getElementById('create_form').reset();
    $('#txt_id').html('');
    // $('#ck_active').iCheck('update')[0].checked;
    // $('#ck_active').iCheck('check'); //To check the radio button
    var detailsTableBody = $("#DescriptionTable tbody");
    detailsTableBody.empty();
    Onload();
    imgload.hide();
}


function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/OpeningStock',
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
                // //New
                // if (response["data"][0]["newPermission"] == 'true') {
                //     btnnew.show();
                // }

                //Delete
                if (Boolean(response["data"][0]["deletePermission"])) {
                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                }
                // //Update
                // if (Boolean(response["data"][0]["updatePermission"])) {
                //     action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                // }
                
                if (response["data"] != null) {
                    $('#detailsTable').DataTable().clear().destroy();
                    detailsTableBody = $("#detailsTable").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        paging: false,
                        searching: false,
                        columns: [
                            {
                                data: null,
                                "defaultContent": action_button
                            },
                            { data: 'itemName' },
                            { data: 'warehouseName' },
                            { data: 'quantity' },
                            { data: 'rate' },

                        ],
                        "order": [[1, "asc"], [1, "asc"]],
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





//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#detailsTable').DataTable().row(currentRow).data();
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
        title: 'Are sure wants to delete <br> ' + _id + '?',
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
                url: ApiForm + '/OpeningStock',
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



$("body").on("click", "#btn_addDetail", function () {

    var _detailTable = $("#detailsTable tbody");

    if ($("#txt_itm").val() == "") {
        Swal.fire({
            title: "please select Item",
            icon: 'error'
        })
        return
    }
    if ($("#txt_warehouse").val() == "") {
        Swal.fire({
            title: "please select warehouse",
            icon: 'error'
        })
        return
    }

    if ($("#txt_qty").val() == 0) {
        Swal.fire({
            title: "quantity must greater then Zero",
            icon: 'error'
        })
        return
    }

    if ($("#txt_rate").val() == 0) {
        Swal.fire({
            title: "Rate must greater then Zero",
            icon: 'error'
        })
        return
    }

    // var _tableRow = '<tr>' +
    //     '<td style="width:150px;"><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +

    //     '<td style="display:none;">' + $("#txt_itm").select2('data').id + '</td>' +
    //     '<td>' + $("#txt_itm").select2('data').text + '</td>' +
    //     '<td style="display:none;">' + $("#txt_warehouse").select2('data').id + '</td>' +
    //     '<td>' + $("#txt_warehouse").select2('data').text + '</td>' +
    //     '<td>' + $("#txt_qty").val() + '</td>' +
    //     '<td>' + $("#txt_rate").val() + '</td>' +
    //     '</tr>';
    // _detailTable.append(_tableRow);

    _cre = JSON.stringify({
        "itemId": $("#txt_itm").select2('data').id,
        "warehouseId": $("#txt_warehouse").select2('data').id,
        "quantity": $("#txt_qty").val(),
        "rate": $("#txt_rate").val(),
        "type": "U",
        "menu_Id": _menuid
    });

    savrec(_cre);

    //clear all fields
    ClearFields();


});
function ClearFields() {

    $('#txt_warehouse').select2('val', '');
    $('#txt_warehouse').html('');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    $("#txt_qty").val('0');
    $("#txt_rate").val('0');
}

//record save
function savrec(_cre) {
    $.ajax({
        url: ApiForm + '/OpeningStock',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
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
                Onload();
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
