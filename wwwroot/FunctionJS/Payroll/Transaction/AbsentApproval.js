var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var txtDate = $("#txt_Date");

var imgload = $("#img_load");
var ApiForm = '';
$(function () {
    txtDate.datetimepicker({ format: 'DD/MMM/YYYY' });
});


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1';

    imgload.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtDate.find("input").val(CurrentDate);

    discon();

});

function discon() {
    Onload();
    imgload.hide();

}

function Onload() {
    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");

    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/AbsentApproval',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Menuid", _menuid);
            xhr.setRequestHeader("_Date", txtDate1);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var action_button = ' ';

                action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                if (response["data"] != null) {
                    $('#Table_View').DataTable().clear().destroy();
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        columns: [
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },
                            {
                                data: 'employeeName',
                            },


                            {
                                data: 'approvedAdjust',
                                "render": function (data, type, full, meta) {
                                    if (data == true) {
                                        return "<select id=ddl_approvedadjust class='ddl_approvedadjust'>" +
                                            "<option value=0>Unadjusted</option>" +
                                            "<option value=1 selected>Adjusted</option>" +
                                            "</select>"
                                    }
                                    else {
                                        return "<select id=ddl_approvedadjust class='ddl_approvedadjust'>" +
                                            "<option value=0 selected>Unadjusted</option>" +
                                            "<option value=1>Adjusted</option>" +
                                            "</select>"
                                    }
                                }
                            },
                            {
                                data: 'approvedAdjustType',
                                "render": function (data, type, full, meta) {
                                    if (data == " " || data == "0") {
                                        return "<select id=ddl_approdjusttype class='ddl_approdjusttype'>" +
                                            "<option value='0' selected>Select</option>" +
                                            "<option value='A' >Annual</option>" +
                                            "</select>"
                                    }
                                    else {
                                        return "<select id=ddl_approdjusttype class='ddl_approdjusttype'>" +
                                            "<option value='0' >Select</option>" +
                                            "<option value='A' selected >Annual</option>" +
                                            "</select>"
                                    }
                                }
                            },
                            {
                                data: 'approved',
                                "render": function (data, type, full, meta) {
                                    if (data == true) {
                                        return "<select id=ddl_approved class='ddl-approved'>" +
                                            "<option value=0>Unapproved</option>" +
                                            "<option value=1 selected>Approved</option>" +
                                            "</select>" + action_button;
                                    }
                                    else {
                                        return "<select id=ddl_approved class='ddl-approved'>" +
                                            "<option value=0 selected>Unapproved</option>" +
                                            "<option value=1>Approved</option>" +
                                            "</select>" + action_button;
                                    }
                                }
                            },
                        ],
                        "order": [[0, "asc"]],
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

function updrec(_date, _approved, _approvedadjusted, _approvedadjustedtype, _EmployeeId, absentId) {
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
                url: ApiForm + '/AbsentApproval',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data:
                    JSON.stringify({
                        "date": _date,
                        "approved": _approved,
                        "approvedAdjust": _approvedadjusted,
                        "approvedAdjustType": _approvedadjustedtype,
                        "employeeId": _EmployeeId,
                        "menuId": _menuid
                    }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgload.hide();
                        discon();
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
                    imgload.hide();
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

$('table').on('click', '.btn-edit', function (e) {

    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _approved = $(this).closest('tr').find('.ddl-approved option:selected').val();
    var _approvedadjusted = $(this).closest('tr').find('.ddl_approvedadjust option:selected').val();
    var _approvedadjustedtype = $(this).closest('tr').find('.ddl_approdjusttype option:selected').val();
    var _date = moment(data['date']).format("YYYY-MM-DD");
    var _EmployeeId = data['employeeId'];
    var _AbsentId = data['absentId'];
    updrec(_date, _approved, _approvedadjusted, _approvedadjustedtype, _EmployeeId);
});