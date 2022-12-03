import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../..//Login/DashboardPermissionByName.js';
var txtdatfrom = $("#txt_datFromDC");
var txtdatTo = $("#txt_datToDC");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxdeliverychallan = $("#img_box_total_deliverychallan");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Sales/v1/SalesDashboard';
    //  CallNotification('Accounts');
    imgboxdeliverychallan.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}

async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("DeliveryChallanDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //GetDeliveryChallan();
    }

}
$(document).on('click', '#deliverychallan', function () {
    
    GetDeliveryChallan();

});

// function MenuPermission() {
//     $.ajax({
//         url: apiUrl + '/api/Auth/v1/LOVServices/GetDashboardPermissionByName',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuName", "DeliveryChallanDashboard");

//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 _viewPermission = response["data"]["view_Permission"];
//                 _checkPermission = response["data"]["check_Permission"];
//                 _approvedPermission = response["data"]["approve_Permission"];
//                 if (Boolean(_viewPermission)) {
//                     GetDeliveryChallan();
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
//Get deliverychallan
function GetDeliveryChallan() {

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


    var div_datamaster = $("#div_deliverychallanmaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_deliverychallan" style="text-align:right;">' +
        '</div>' +
        '</div>');

    var div_data = $("#div_deliverychallan");
    div_data.empty();


    var _CheckTotal = 0
    var _ApprovalTotal = 0;


    var txtbox_total_deliverychallan = $("#box_total_deliverychallan");
    var spn_totaldeliverychallan = $("#spn_totaldeliverychallan");

    txtbox_total_deliverychallan.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-deliverychallan glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModeldeliverychallan'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);


    var tbldeliverychallanheader = '';
    //Heading
    tbldeliverychallanheader = '<table class="table table-striped" id="Table_View_deliverychallans" style="font-size:small;width:100%">';
    tbldeliverychallanheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tbldeliverychallanheader += '<tr>';
    tbldeliverychallanheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Check</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Cancel</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Close</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Label</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Item</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Customer</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">PO #</th>';
    tbldeliverychallanheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Salesman</th>';
    tbldeliverychallanheader += '</tr>';
    tbldeliverychallanheader += '</thead>';
    tbldeliverychallanheader += '<tbody style="text-align:left">';
    tbldeliverychallanheader += '</tbody>';
    tbldeliverychallanheader += '</table>';
    div_data.append(tbldeliverychallanheader);

    imgboxdeliverychallan.show();
    $.ajax({
        url: ApiForm + '/Getdeliverychallan',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            //            xhr.setRequestHeader("MenuId", _menuid);
            imgboxdeliverychallan.show();

        },
        success: function (response) {

            if (response.statusCode == 200) {

                _CheckTotal = response["data"].filter(c => c.check == false && c.approved == false).length;
                _ApprovalTotal = response["data"].filter(a => a.check == true && a.approved == false).length;

                txtbox_total_deliverychallan.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");

                spn_totaldeliverychallan.html(response["data"].length);





                var TableViewdeliverychallans = $('#Table_View_deliverychallans');

                var action_button = "";
                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-deliverychallan glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }


                TableViewdeliverychallans.dataTable({
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
                                return "<a href='#' class='btn-print-deliverychallan'>" + data.no + "</a>"// ;
                            }
                        },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return "<a href='#' class='btn-printSticker-deliverychallan'>" + data.no + "</a>"// ;
                            }
                        },

                        {
                            data: 'date',
                            type: 'date',
                            render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
                        },
                        { data: "itemName" },
                        { data: "customerName" },
                        {
                            data: null,
                            render: function (data, type, row) {
                                if (data.customerPo != '') {
                                    return data.customerPo + '<br/>' + moment(data.customerPoDate).format('DD-MMM-YYYY')
                                }

                                return ''
                            }
                        },

                        { data: "salesmanName" },


                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Delivery Challan',
                    }
                    ],
                    "order": [[5, "desc"], [6, "asc"]],
                    "pageLength": 10
                });
                exportCSV()

                imgboxdeliverychallan.hide();

            }
            else {
                imgboxdeliverychallan.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxdeliverychallan.hide();
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

$(document).on('click', '.btn-edit-deliverychallan', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_deliverychallans').DataTable().row(currentRow).data();
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
    updrecdeliverychallan(_data);
});

$(document).on('click', '.btn-refresh-deliverychallan', function (e) {

    e.preventDefault();
    GetDeliveryChallan();
});


//Print deliverychallan
$(document).on('click', '.btn-print-deliverychallan', function (e) {
    e.preventDefault();

    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_deliverychallans').DataTable().row(currentRow).data();
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

    window.open(apiUrl_View + '/Sales/Report/DCReport?S=' + sessid, '_blank');





});

//deliverychallan Update
function updrecdeliverychallan(_data) {

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
                url: apiUrl + '/api/Sales/v1/SalesDashboard/Updatedeliverychallan',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
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
                        Getdeliverychallan();

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

//Print deliverychallan sticker
$(document).on('click', '.btn-printSticker-deliverychallan', function (e) {
    e.preventDefault();

    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_deliverychallans').DataTable().row(currentRow).data();
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
    var _cre = JSON.stringify({
        "dateFrom": _date,
        "dateTo": _date,
        "no": String(_no),
        "employeeId": _employeeId,
    });


    var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
    sessionStorage.setItem(sessid, _cre);

    window.open(apiUrl_View + '/Sales/Report/DCStickerReport?S=' + sessid, '_blank');
});

$(document).on('click', '#btnSearchdeliverychallan', function (e) {
    e.preventDefault();
    GetDeliveryChallan();
});
