import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../../Login/DashboardPermissionByName.js';
var txtdatfrom = $("#txt_datFrom");
var txtdatTo = $("#txt_datTo");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxinouteditor = $("#img_box_total_inouteditor");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Payroll/v1/PayrollApprovalDashboard';
    //CallNotification('Accounts');
    imgboxinouteditor.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}

async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("InOutEditor");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //Getinouteditor();
    }

}
$(document).on('click', '#inouteditor', function () {
    
    Getinouteditor();

});
//Get inouteditor
function Getinouteditor() {

    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_no").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });
    var div_datamaster = $("#div_inouteditormaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_inouteditor" style="text-align:right;">' +
        '</div>' +
        '</div>');


    var div_data = $("#div_inouteditor");
    div_data.empty();


    var _ApprovalTotal = 0;


    var txtbox_total_inouteditor = $("#box_total_inouteditor");
    var spn_totalinouteditor = $("#spn_totalinouteditor");

    txtbox_total_inouteditor.html("Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-inouteditorMaster glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelinouteditor'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);

    var tblinouteditorheader = '';
    //Heading
    tblinouteditorheader = '<table class="table table-striped" id="Table_View_inouteditors" style="font-size:small;width:100%">';
    tblinouteditorheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblinouteditorheader += '<tr>';
    tblinouteditorheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tblinouteditorheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tblinouteditorheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tblinouteditorheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Employee</th>';
    tblinouteditorheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tblinouteditorheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Time</th>';
    tblinouteditorheader += '</tr>';
    tblinouteditorheader += '</thead>';
    tblinouteditorheader += '<tbody style="text-align:left">';
    tblinouteditorheader += '</tbody>';
    tblinouteditorheader += '</table>';
    div_data.append(tblinouteditorheader);

    imgboxinouteditor.show();
    $.ajax({
        url: ApiForm + '/Getinouteditor',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            //            xhr.setRequestHeader("MenuId", _menuid);
            imgboxinouteditor.show();

        },
        success: function (response) {

            if (response.statusCode == 200) {

                _ApprovalTotal = response["data"].filter(a => a.approved == false).length;

                txtbox_total_inouteditor.html("Approval : " + _ApprovalTotal + "");

                spn_totalinouteditor.html(response["data"].length);





                var TableViewinouteditors = $('#Table_View_inouteditors');

                var action_button = "";
                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-inouteditorMaster glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }


                TableViewinouteditors.dataTable({
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
                            data: 'checkTime',

                            render: function (data, type, row) { return '<span data-toggle="tooltip" title=Time>' + moment(data).format('hh:mm A') + '</span>' }
                        },

                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'In-Out Editor',
                    }
                    ],
                    // "order": [[3, "asc"]],
                    //,[5, "desc"], [3, "asc"]
                    "pageLength": 10
                });
                exportCSV()

                imgboxinouteditor.hide();

            }
            else {
                imgboxinouteditor.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxinouteditor.hide();
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

$(document).on('click', '.btn-edit-inouteditorMaster', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_inouteditors').DataTable().row(currentRow).data();
    var _MachineId = data["machineId"];
    var _approved = $(this).closest('tr').find('#ddl_approved option:selected').val();
    var _date = data["checkTime"];

    var _data = JSON.stringify({
        "MachineId": _MachineId,
        "checkTime": _date,
        "approved": _approved,
        "menuId": _menuid
    });
    updrecinouteditor(_data);
});

$(document).on('click', '.btn-refresh-inouteditorMaster', function (e) {

    e.preventDefault();
    Getinouteditor();
});


// //Print inouteditor
// $(document).on('click', '.btn-print-inouteditor', function (e) {
//     e.preventDefault();
//     var currentRow = $(this).closest("tr");
//     var data = $('#Table_View_inouteditors').DataTable().row(currentRow).data();
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

//     var win = window.open(apiUrl_View + '/Sales/Report/inouteditorReport?S=' + sessid, '_blank');


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

//inouteditor Update
function updrecinouteditor(_data) {

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
                url: apiUrl + '/api/Payroll/v1/InOutEditorApproval',
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
                        Getinouteditor();

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

$(document).on('click', '#btnSearchinouteditor', function (e) {
    e.preventDefault();
    Getinouteditor();
});
