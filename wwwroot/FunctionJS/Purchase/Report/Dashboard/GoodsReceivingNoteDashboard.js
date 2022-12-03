import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../..//Login/DashboardPermissionByName.js';

var txtdatfrom = $("#txt_datFromDC");
var txtdatTo = $("#txt_datToDC");

var ApiForm = '';
var _checkPermission = false;
var _approvedPermission = false;
var _viewPermission = false;
var imgboxgoodsreceivingnote = $("#img_box_total_goodsreceivingnote");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Procurement/v1/PurchaseDashboard';
    //CallNotification('Procurement');
    imgboxgoodsreceivingnote.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}

async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("goodsreceivingnoteDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //Getgoodsreceivingnote();
    }

}
$(document).on('click', '#goodsreceivingnote', function () {
    
    Getgoodsreceivingnote();

});
// function MenuPermission() {
//     $.ajax({
//         url: apiUrl + '/api/Auth/v1/LOVServices/GetDashboardPermissionByName',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuName", "goodsreceivingnoteDashboard");

//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 _viewPermission = response["data"]["view_Permission"];
//                 _checkPermission = response["data"]["check_Permission"];
//                 _approvedPermission = response["data"]["approve_Permission"];
//                 if (Boolean(_viewPermission)) {
//                     Getgoodsreceivingnote();
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
//Get goodsreceivingnote
function Getgoodsreceivingnote() {

    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_noDC").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });

    var div_datamaster = $("#div_goodsreceivingnotemaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_goodsreceivingnote" style="text-align:right;">' +
        '</div>' +
        '</div>');

    var div_data = $("#div_goodsreceivingnote");
    div_data.empty();


    var _CheckTotal = 0
    var _ApprovalTotal = 0;


    var txtbox_total_goodsreceivingnote = $("#box_total_goodsreceivingnote");
    var spn_totalgoodsreceivingnote = $("#spn_totalgoodsreceivingnote");

    txtbox_total_goodsreceivingnote.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-goodsreceivingnote glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelgoodsreceivingnote'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);


    var tblgoodsreceivingnoteheader = '';
    //Heading
    tblgoodsreceivingnoteheader = '<table class="table table-striped" id="Table_View_goodsreceivingnotes" style="font-size:small;width:100%">';
    tblgoodsreceivingnoteheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblgoodsreceivingnoteheader += '<tr>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Check</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Cancel</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Close</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Category</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">PO</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Supplier</th>';
    tblgoodsreceivingnoteheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Item</th>';
    tblgoodsreceivingnoteheader += '</tr>';
    tblgoodsreceivingnoteheader += '</thead>';
    tblgoodsreceivingnoteheader += '<tbody style="text-align:left">';
    tblgoodsreceivingnoteheader += '</tbody>';
    tblgoodsreceivingnoteheader += '</table>';
    div_data.append(tblgoodsreceivingnoteheader);

    imgboxgoodsreceivingnote.show();
    $.ajax({
        url: ApiForm + '/Getgoodsreceivingnote',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            //            xhr.setRequestHeader("MenuId", _menuid);
            imgboxgoodsreceivingnote.show();

        },
        success: function (response) {

            if (response.statusCode == 200) {

                _CheckTotal = response["data"].filter(c => c.check == false && c.approved == false).length;
                _ApprovalTotal = response["data"].filter(a => a.check == true && a.approved == false).length;

                txtbox_total_goodsreceivingnote.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");

                spn_totalgoodsreceivingnote.html(response["data"].length);





                var TableViewgoodsreceivingnotes = $('#Table_View_goodsreceivingnotes');

                var action_button = "";
                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-goodsreceivingnote glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }


                TableViewgoodsreceivingnotes.dataTable({
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
                                return "<a href='#' class='btn-print-goodsreceivingnote'>" + data.no + "</a>"// ;
                            }
                        },
                        {
                            data: 'date',
                            type: 'date',
                            render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
                        },
                        { data: "category" },
                        { data: "poNo" },
                        { data: "supplierName" },
                        { data: "itemName" },

                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Goods Receiving Note',
                    }
                    ],
                    "order": [[5, "desc"], [6, "asc"]],
                    "pageLength": 10
                });
                exportCSV()

                imgboxgoodsreceivingnote.hide();

            }
            else {
                imgboxgoodsreceivingnote.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxgoodsreceivingnote.hide();
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

$(document).on('click', '.btn-edit-goodsreceivingnote', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_goodsreceivingnotes').DataTable().row(currentRow).data();
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
    updrecgoodsreceivingnote(_data);
});

$(document).on('click', '.btn-refresh-goodsreceivingnote', function (e) {

    e.preventDefault();
    Getgoodsreceivingnote();
});


//Print goodsreceivingnote
$(document).on('click', '.btn-print-goodsreceivingnote', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_goodsreceivingnotes').DataTable().row(currentRow).data();
    var _employeeId = data['employeeId'];
    var _no = data['no'];
    var _date = data['date'];


    var _cre = JSON.stringify({
        "dateFrom": _date,
        "dateTo": _date,
        "no": String(_no),
    });
    var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
    sessionStorage.setItem(sessid, _cre);

    var win = window.open(apiUrl_View + '/Purchase/Report/GoodsReceivingNoteReport?S=' + sessid, '_blank');


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

//goodsreceivingnote Update
function updrecgoodsreceivingnote(_data) {

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
                url: ApiForm + '/Updategoodsreceivingnote',
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
                        Getgoodsreceivingnote();

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

$(document).on('click', '#btnSearchgoodsreceivingnote', function (e) {
    e.preventDefault();
    Getgoodsreceivingnote();
});
