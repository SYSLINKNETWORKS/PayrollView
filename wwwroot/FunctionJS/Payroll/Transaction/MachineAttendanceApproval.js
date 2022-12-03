var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var txtDateFrom = $("#txt_DateFrom");
var txtDateTo = $("#txt_DateTo");

var imgload = $("#img_load");
var ApiForm = '';

$(function () {
    txtDateFrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtDateTo.datetimepicker({ format: 'DD/MMM/YYYY' });
});


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1/MachineAttendanceApproval';
    imgload.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtDateFrom.find("input").val(CurrentDate);
    txtDateTo.find("input").val(CurrentDate);

    discon();

});

function discon() {
    Onload();
    imgload.hide();

}


function Onload() {
    var txtDateFrom1 = moment(txtDateFrom.find("input").val()).format("YYYY-MM-DD");
    var txtDateTo1 = moment(txtDateTo.find("input").val()).format("YYYY-MM-DD");
    $.ajax({
        url: ApiForm,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Menuid", _menuid);
            xhr.setRequestHeader("_DateFrom", txtDateFrom1);
            xhr.setRequestHeader("_DateTo", txtDateTo1);
            imgload.show();
        },

        success: function (response) {

            if (response.statusCode == 200) {
                var action_button = ' ';
                
                if (!Boolean(response["data"]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }

                if (response["data"] != null) {
                    $('#Table_View').DataTable().clear().destroy();
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        paging: false,
                        columns: [
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
                            {
                                data: 'employeeName',
                            },
                            {
                                data: 'checkTime',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY HH:mm:ss') }
                            }


                        ],
                        "order": [[1, "asc"]],
                        // "pageLength": 10,

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




function updrec(_MachineId, _date, _approved) {



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
                url: ApiForm,
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data:
                    JSON.stringify({
                        "MachineId": _MachineId,
                        "checkTime": _date,
                        "approved": _approved,
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
    var _date = moment(data['checkTime']).format('YYYY-MM-DD HH:mm:ss');
    var _MachineId = data['machineId'];
    updrec(_MachineId, _date, _approved);
});