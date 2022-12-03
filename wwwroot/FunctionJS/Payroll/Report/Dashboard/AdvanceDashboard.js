import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../../Login/DashboardPermissionByName.js';
var txtdatfrom = $("#txt_datFromadvance");
var txtdatTo = $("#txt_datToadvance");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxadvance = $("#img_box_total_advance");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Payroll/v1/PayrollApprovalDashboard';
    //  CallNotification('Accounts');
    imgboxadvance.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}


async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("Advance");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        // Getadvance();
    }

}
$(document).on('click', '#advance', function () {
    
    Getadvance();

});

//Get advance
function Getadvance() {

    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_noadvance").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });


    var div_datamaster = $("#div_advancemaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_advance" style="text-align:right;">' +
        '</div>' +
        '</div>');

    var div_data = $("#div_advance");
    div_data.empty();


    var _CheckTotal = 0
    var _ApprovalTotal = 0;


    var txtbox_total_advance = $("#box_total_advance");
    var spn_totaladvance = $("#spn_totaladvance");

    txtbox_total_advance.html("Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-advance glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModeladvance'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);

    var tbladvanceheader = '';
    //Heading
    tbladvanceheader = '<table class="table table-striped" id="Table_View_advances" style="font-size:small;width:100%">';
    tbladvanceheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tbladvanceheader += '<tr>';
    tbladvanceheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tbladvanceheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tbladvanceheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tbladvanceheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tbladvanceheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Department</th>';
    tbladvanceheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Designation</th>';
    tbladvanceheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Employee</th>';
    tbladvanceheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Amount</th>';
    tbladvanceheader += '</tr>';
    tbladvanceheader += '</thead>';
    tbladvanceheader += '<tbody style="text-align:left">';
    tbladvanceheader += '</tbody>';
    tbladvanceheader += '</table>';
    div_data.append(tbladvanceheader);

    imgboxadvance.show();
    $.ajax({
        url: ApiForm + '/Getadvance',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            //            xhr.setRequestHeader("MenuId", _menuid);
            imgboxadvance.show();

        },
        success: function (response) {

            if (response.statusCode == 200) {

                _ApprovalTotal = response["data"].filter(a => a.approved == false).length;

                txtbox_total_advance.html("Approval : " + _ApprovalTotal + "");

                spn_totaladvance.html(response["data"].length);





                var TableViewadvances = $('#Table_View_advances');

                var action_button = "";
                //                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableapproved == '') { action_button = "<a href='#' class='btn-edit-advance glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }


                TableViewadvances.dataTable({
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
                                return '<a href="#" class="btn-print-advance"><span data-toggle="tooltip" title=No>' + data + '</span></a>';
                            }
                        },
                        {
                            data: 'date',
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Date>' + moment(data).format('DD-MMM-YYYY') + '</span>'
                            }
                        },

                        {
                            data: "departmentName",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Department>' + data + '</span>'
                            }
                        },
                        {
                            data: "designationName",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Designation>' + data + '</span>'
                            }
                        },
                        {
                            data: "employeeName",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Employee>' + data + '</span>'
                            }
                        },
                        {
                            data: 'amount',
                            render: function (data, type, row) { return '<span data-toggle="tooltip" title=Amount>' + accounting.format(data, 0) + '</span>' }
                        },

                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Advance',
                    }
                    ],
                    "order": [[2, "desc"]],
                    "pageLength": 10
                });
                exportCSV()

                imgboxadvance.hide();

            }
            else {
                imgboxadvance.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxadvance.hide();
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


$(document).on('click', '.btn-edit-advance', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_advances').DataTable().row(currentRow).data();
    var _Id = data["id"];
    var _approved = $(this).closest('tr').find('#ddl_approved option:selected').val();

    var _data = JSON.stringify({
        "Id": _Id,
        "approved": _approved,
    });
    updrecadvance(_data);
});

$(document).on('click', '.btn-refresh-advance', function (e) {

    e.preventDefault();
    Getadvance();
});


//Print advance
$(document).on('click', '.btn-print-advance', function (e) {

    e.preventDefault();

    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_advances').DataTable().row(currentRow).data();
    var _Id = data['id'];
    var _date = data['date'];


    var _cre = JSON.stringify({
        "dateFrom": _date,
        "dateTo": _date,
        "id": _Id,
    });


    var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
    sessionStorage.setItem(sessid, _cre);

    var win = window.open(apiUrl_View + '/Payroll/Report/advance?S=' + sessid, '_blank');


});

//advance Update
function updrecadvance(_data) {

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
                url: ApiForm + '/Updateadvance',
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
                        Getadvance();

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

$(document).on('click', '#btnSearchadvance', function (e) {
    e.preventDefault();
    Getadvance();
});
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize),
            byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}