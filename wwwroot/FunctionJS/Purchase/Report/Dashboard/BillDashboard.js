import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../..//Login/DashboardPermissionByName.js';

var txtdatfrom = $("#txt_datFrombill");
var txtdatTo = $("#txt_datTobill");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxbill = $("#img_box_total_bill");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Procurement/v1/PurchaseDashboard';
    // CallNotification('Procurement');
    imgboxbill.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}


async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("BillDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //Getbill();
    }

 }
 $(document).on('click', '#bill', function () {
    
    Getbill();

});
// function MenuPermission() {
//     $.ajax({
//         url: apiUrl + '/api/Auth/v1/LOVServices/GetDashboardPermissionByName',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuName", "BillDashboard");

//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 _viewPermission = response["data"]["view_Permission"];
//                 _checkPermission = response["data"]["check_Permission"];
//                 _approvedPermission = response["data"]["approve_Permission"];
//                 if (Boolean(_viewPermission)) {
//                     Getbill();
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
//Get bill
function Getbill() {

    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_nobill").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });

    var div_datamaster = $("#div_billmaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_bill" style="text-align:right;">' +
        '</div>' +
        '</div>');

    var div_data = $("#div_bill");
    div_data.empty();


    var _CheckTotal = 0
    var _ApprovalTotal = 0;


    var txtbox_total_bill = $("#box_total_bill");
    var spn_totalbill = $("#spn_totalbill");

    txtbox_total_bill.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-bill glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelbill'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);


    var tblbillheader = '';
    //Heading
    tblbillheader = '<table class="table table-striped" id="Table_View_bills" style="font-size:small;width:100%">';
    tblbillheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblbillheader += '<tr>';
    tblbillheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tblbillheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Check</th>';
    tblbillheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tblbillheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Cancel</th>';
    tblbillheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Close</th>';
    tblbillheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tblbillheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tblbillheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Category</th>';
    tblbillheader += '<th scope="col" style="width:15%;padding-top: 4%;text-align:center">Supplier</th>';
    tblbillheader += '<th scope="col" style="width:15%;padding-top: 4%;text-align:center">Item</th>';
    tblbillheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Amount</th>';
    tblbillheader += '</tr>';
    tblbillheader += '</thead>';
    tblbillheader += '<tbody style="text-align:left">';
    tblbillheader += '</tbody>';
    tblbillheader += '</table>';
    div_data.append(tblbillheader);

    imgboxbill.show();
    $.ajax({
        url: ApiForm + '/Getbill',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgboxbill.show();

        },
        success: function (response) {
            if (response.statusCode == 200) {

                _CheckTotal = response["data"].filter(c => c.check == false && c.approved == false).length;
                _ApprovalTotal = response["data"].filter(a => a.check == true && a.approved == false).length;

                txtbox_total_bill.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");

                spn_totalbill.html(response["data"].length);





                var TableViewbills = $('#Table_View_bills');

                var action_button = "";
                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-bill glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }

                TableViewbills.dataTable({
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
                                    return "<select id=ddl_check class='ddl-approved'  " + _disableCheck + ">" +
                                        "<option value=1 selected>Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_check class='ddl-approved'  " + _disableCheck + ">" +
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
                                return "<a href='#' class='btn-print-bill'>" + data.no + "</a>"// ;
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
                        {
                            data: null,
                            render: function (data, type, row) { return accounting.format(data.amount, 2) }
                        },

                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Bill',
                    }
                    ],
                    "order": [[5, "desc"], [6, "asc"]],
                    "pageLength": 10
                });
                exportCSV()

                imgboxbill.hide();

            }
            else {
                imgboxbill.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxbill.hide();
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


$(document).on('click', '.btn-edit-bill', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_bills').DataTable().row(currentRow).data();
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
    updrecbill(_data);
});

$(document).on('click', '.btn-refresh-bill', function (e) {

    e.preventDefault();
    Getbill();
});


//Print bill
$(document).on('click', '.btn-print-bill', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_bills').DataTable().row(currentRow).data();
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


});

//bill Update
function updrecbill(_data) {

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
                url: ApiForm + '/Updatebill',
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
                        Getbill();

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

$(document).on('click', '#btnSearchbill', function (e) {
    e.preventDefault();
    Getbill();
});
