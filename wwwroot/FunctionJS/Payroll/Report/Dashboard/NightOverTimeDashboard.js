import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../../Login/DashboardPermissionByName.js';
var txtdatfrom = $("#txt_datFromnightovertime");
var txtdatTo = $("#txt_datTonightovertime");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxnightovertime = $("#img_box_total_nightovertime");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Payroll/v1/PayrollApprovalDashboard';
    //CallNotification('Accounts');
    imgboxnightovertime.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}

async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("NightOverTime");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //Getnightovertime();
    }

}
$(document).on('click', '#nightovertime', function () {
    
    Getnightovertime();

});

//Get nightovertime
function Getnightovertime() {

    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_nonightovertime").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });
    var div_datamaster = $("#div_nightovertimemaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_nightovertime" style="text-align:right;">' +
        '</div>' +
        '</div>');


    var div_data = $("#div_nightovertime");
    div_data.empty();


    var _ApprovalTotal = 0;


    var txtbox_total_nightovertime = $("#box_total_nightovertime");
    var spn_totalnightovertime = $("#spn_totalnightovertime");

    txtbox_total_nightovertime.html("Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-nightovertime glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelnightovertime'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);

    var tblnightovertimeheader = '';
    //Heading
    tblnightovertimeheader = '<table class="table table-striped" id="Table_View_nightovertimes" style="font-size:small;width:100%">';
    tblnightovertimeheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblnightovertimeheader += '<tr>';
    tblnightovertimeheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tblnightovertimeheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tblnightovertimeheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tblnightovertimeheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Employee</th>';
    tblnightovertimeheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tblnightovertimeheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Hours</th>';
    tblnightovertimeheader += '</tr>';
    tblnightovertimeheader += '</thead>';
    tblnightovertimeheader += '<tbody style="text-align:left">';
    tblnightovertimeheader += '</tbody>';
    tblnightovertimeheader += '</table>';
    div_data.append(tblnightovertimeheader);

    imgboxnightovertime.show();
    $.ajax({
        url: ApiForm + '/GetNightOverTime',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            //            xhr.setRequestHeader("MenuId", _menuid);
            imgboxnightovertime.show();

        },
        success: function (response) {

            if (response.statusCode == 200) {

                _ApprovalTotal = response["data"].filter(a => a.approved == false).length;

                txtbox_total_nightovertime.html("Approval : " + _ApprovalTotal + "");

                spn_totalnightovertime.html(response["data"].length);





                var TableViewnightovertimes = $('#Table_View_nightovertimes');

                var action_button = "";
                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-nightovertimeMaster glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }


                TableViewnightovertimes.dataTable({
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
                            data: "machineId",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=No>' + data + '</span>';
                            }
                        },

                        {
                            data: "employeeName",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Employee>' + data + '</span>'
                            }
                        },
                        {
                            data: 'date',
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Date>' + moment(data).format('DD-MMM-YYYY') + '</span>'
                            }
                        },
                        {
                            data: 'hours',
                            render: function (data, type, row) {
                                return '<input type="text" id="txt_hours" class="form-control" value=' + data + ' />'// <span data-toggle="tooltip" title=Hours>' + data + '</span>'
                            }
                        },

                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Night Over Time',
                    }
                    ],
                    "order": [[4, "desc"]],
                    //,[5, "desc"], [3, "asc"]
                    "pageLength": 10
                });
                exportCSV()

                imgboxnightovertime.hide();

            }
            else {
                imgboxnightovertime.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxnightovertime.hide();
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

$(document).on('click', '.btn-edit-nightovertimeMaster', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_nightovertimes').DataTable().row(currentRow).data();
    var _Id = data["employeeId"];
    var _approved = $(this).closest('tr').find('#ddl_approved option:selected').val();
    var _date = data["date"];
    var _hour = $(this).closest('tr').find('#txt_hours').val();

    var _data = JSON.stringify({
        "Id": _Id,
        "Date": _date,
        "approved": _approved,
        "Hours": _hour
    });
    updrecnightovertime(_data);
});

$(document).on('click', '.btn-refresh-nightovertime', function (e) {

    e.preventDefault();
    Getnightovertime();
});


// //Print nightovertime
// $(document).on('click', '.btn-print-nightovertime', function (e) {
//     e.preventDefault();
//     var currentRow = $(this).closest("tr");
//     var data = $('#Table_View_nightovertimes').DataTable().row(currentRow).data();
//     var _employeeId = data['employeeId'];
//     var _no = data['machineId'];
//     var _date = data['date'];


//     var _cre = JSON.stringify({


//         "dateFrom": _date,
//         "dateTo": _date,
//         "no": String(_no),
//         "employeeId": _employeeId,
//     });
//     var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
//     sessionStorage.setItem(sessid, _cre);

//     var win = window.open(apiUrl_View + '/Sales/Report/nightovertimeReport?S=' + sessid, '_blank');


//     if (win) {
//         //Browser has allowed it to be opened
//         win.focus();
//     } else {
//         //Browser has blocked it
//         Swal.fire({
//             title: 'Please allow popups for this website',
//             icon: 'error'
//         })
//     }


// });

//nightovertime Update
function updrecnightovertime(_data) {

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
                url: ApiForm + '/UpdateNightOverTime',
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
                        Getnightovertime();

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

$(document).on('click', '#btnSearchnightovertime', function (e) {
    e.preventDefault();
    Getnightovertime();
});
