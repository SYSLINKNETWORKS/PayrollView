import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../..//Login/DashboardPermissionByName.js';

var txtdatfrom = $("#txt_datFromSo");
var txtdatTo = $("#txt_datToSo");

var ApiForm = '';
var _checkPermission = false;
var _approvedPermission = false;
var _viewPermission = false;
var imgboxpurchaseorder = $("#img_box_total_purchaseorder");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Procurement/v1/PurchaseDashboard';
    // CallNotification('Procurement');
    imgboxpurchaseorder.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}

async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("purchaseorderDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //Getpurchaseorder();
    }

}
$(document).on('click', '#purchaseorder', function () {

    Getpurchaseorder();

});

// function MenuPermission() {
//     $.ajax({
//         url: apiUrl + '/api/Auth/v1/LOVServices/GetDashboardPermissionByName',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuName", "purchaseorderDashboard");

//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 _viewPermission = response["data"]["view_Permission"];
//                 _checkPermission = response["data"]["check_Permission"];
//                 _approvedPermission = response["data"]["approve_Permission"];
//                 if (Boolean(_viewPermission)) {
//                     Getpurchaseorder();
//                 }
//             }
//         },

//         error: function (xhr, status, err) {
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
// }
//Get purchaseorder
function Getpurchaseorder() {

    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_noSo").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });

    var div_datamaster = $("#div_purchaseordermaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_purchaseorder" style="text-align:right;">' +
        '</div>' +
        '</div>');


    var div_data = $("#div_purchaseorder");
    div_data.empty();


    var _CheckTotal = 0
    var _ApprovalTotal = 0;


    var txtbox_total_purchaseorder = $("#box_total_purchaseorder");
    var spn_totalpurchaseorder = $("#spn_totalpurchaseorder");

    txtbox_total_purchaseorder.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-purchaseorder glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelpurchaseorder'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);

    var tblpurchaseorderheader = '';
    //Heading
    tblpurchaseorderheader = '<table class="table table-striped" id="Table_View_purchaseorders" style="font-size:small;width:100%">';
    tblpurchaseorderheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblpurchaseorderheader += '<tr>';
    tblpurchaseorderheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Check</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Cancel</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Close</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Category</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Supplier</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Item</th>';
    tblpurchaseorderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Remarks</th>';
    tblpurchaseorderheader += '</tr>';
    tblpurchaseorderheader += '</thead>';
    tblpurchaseorderheader += '<tbody style="text-align:left">';
    tblpurchaseorderheader += '</tbody>';
    tblpurchaseorderheader += '</table>';
    div_data.append(tblpurchaseorderheader);

    imgboxpurchaseorder.show();
    $.ajax({
        url: ApiForm + '/Getorder',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            //            xhr.setRequestHeader("MenuId", _menuid);
            imgboxpurchaseorder.show();

        },
        success: function (response) {

            if (response.statusCode == 200) {

                _CheckTotal = response["data"].filter(c => c.check == false && c.approved == false).length;
                _ApprovalTotal = response["data"].filter(a => a.check == true && a.approved == false).length;

                txtbox_total_purchaseorder.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");

                spn_totalpurchaseorder.html(response["data"].length);





                var TableViewpurchaseorders = $('#Table_View_purchaseorders');

                var action_button = "";
                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-purchaseorder glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }


                TableViewpurchaseorders.dataTable({
                    data: response["data"],
                    destroy: true,
                    retrieve: true,
                    paging: false,
                    searching: true,
                    columns: [
                        {
                            data: null,
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return action_button;
                                }
                                else {
                                    return action_button;
                                }
                            }
                        },
                        {
                            data: 'check',
                            "render": function (data, type, full, meta) {

                                if (data == true) {
                                    return "<select id=ddl_check class='ddl-approved' " + _disableCheck + ">" +
                                        "<option value=1 selected>Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_check class='ddl-approved' " + _disableCheck + ">" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: 'approved',
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return "<select id=ddl_approved class='ddl-approved' " + _disableapproved + ">" +
                                        "<option value=1 selected>Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_approved class='ddl-approved' " + _disableapproved + ">" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: 'cancel',
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return "<select id=ddl_cancel class='ddl-approved'>" +
                                        "<option value=1 selected> Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_cancel class='ddl-approved'>" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: 'close',
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return "<select id=ddl_close class='ddl-approved'>" +
                                        "<option value=1 selected> Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_close class='ddl-approved'>" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return "<a href='#' class='btn-print-purchaseorder'>" + data.no + "</a>"// ;
                            }
                        },
                        {
                            data: 'date',
                            type: 'date',
                            render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
                        },
                        { data: "category" },
                        { data: "supplierName" },
                        { data: "itemName" },


                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Purchase Order',
                    }
                    ],
                    "order": [[5, "desc"], [6, "asc"]],
                    "pageLength": 10
                });
                exportCSV()
                imgboxpurchaseorder.hide();

            }
            else {
                imgboxpurchaseorder.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxpurchaseorder.hide();
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
};


function exportCSV() {

    $('.csvExport').css('margin-top', -60);
    $('.csvExport').css('margin-right', 120);

}


$(document).on('click', '.btn-edit-purchaseorder', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_purchaseorders').DataTable().row(currentRow).data();
    var id = data["id"];
    var _close = $(this).closest('tr').find('#ddl_close option:selected').val();
    var _check = $(this).closest('tr').find('#ddl_check option:selected').val();
    var _approved = $(this).closest('tr').find('#ddl_approved option:selected').val();
    var _cancel = $(this).closest('tr').find('#ddl_cancel option:selected').val();

    var _data = JSON.stringify({
        "Id": id,
        "check": _check == 1 ? true : false,
        "approved": _approved == 1 ? true : false,
        "cancel": _cancel == 1 ? true : false,
        "close": _close == 1 ? true : false,
        "Type": "U",
        "menu_id": _menuid,
    });
    updrecpurchaseorder(_data);
});

$(document).on('click', '.btn-refresh-purchaseorder', function (e) {

    e.preventDefault();
    Getpurchaseorder();
});


//Print purchaseorder
$(document).on('click', '.btn-print-purchaseorder', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_purchaseorders').DataTable().row(currentRow).data();
    var _employeeId = data['employeeId'];
    var _no = data['no'];
    var _date = data['date'];


    var _cre = JSON.stringify({
        "dateFrom": _date,
        "dateTo": _date,
        "no": String(_no),
        "employeeId": _employeeId,
    });
    var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
    sessionStorage.setItem(sessid, _cre);

    var win = window.open(apiUrl_View + '/Purchase/Report/purchaseorderReport?S=' + sessid, '_blank');


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


});

//purchaseorder Update
function updrecpurchaseorder(_data) {

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
                url: ApiForm + '/UpdateOrder',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    //imgloadsav.show();
                    //btnupd.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {

                        Swal.fire({
                            title: 'Record Update',

                            icon: 'success',
                            showConfirmButton: true,

                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                        Getpurchaseorder();

                    }
                    else {

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

$(document).on('click', '#btnSearchpurchaseorder', function (e) {
    e.preventDefault();
    Getpurchaseorder();
});
