var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var txtDate = $("#txt_Date");
var imgload = $("#img_load");
var ApiForm = '';


$(function () {
    txtDate.datetimepicker({ format: 'MMM/YYYY' });

});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1/Holiday';
    imgload.hide();
    var CurrentMonthYear = moment(new Date()).format("MMM/YYYY");
    txtDate.find("input").val(CurrentMonthYear);
    discon();
    Onload()
});

function discon() {
    imgload.hide();

}

function Onload() {

    var txtDate1 = moment('01/' + txtDate.find("input").val()).format("YYYY-MM-DD");
    $.ajax({
        url: ApiForm,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Menuid", _menuid);
            xhr.setRequestHeader("_date", txtDate1);

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
                        paging: false,
                        search: false,
                        bFilter: false,
                        bInfo: false,
                        columns: [
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD/MMM/YYYY') }
                            },
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('dddd') }
                            },
                            {
                                data: 'holidaycheck',
                                "render": function (data, type, full, meta) {
                                    if (data == true) {
                                        return "<select  class='ddl_holidaycheck'>" +
                                            "<option value=0>No</option>" +
                                            "<option value=1 selected>Yes</option>" +
                                            "</select>"
                                    }
                                    else {
                                        return "<select  class='ddl_holidaycheck'>" +
                                            "<option value=0 selected>No</option>" +
                                            "<option value=1>Yes</option>" +
                                            "</select>"
                                    }
                                }
                            },
                            {
                                data: 'remarks',
                                "render": function (data, type, full, meta) {
                                    if (data != "") {
                                        return "<input type='text' id='' class='form-control' Value='" + data + "'/>"
                                    }
                                    else {
                                        return "<input type='text' id='' class='form-control' Value=''/>"
                                    }
                                }

                            },
                        ],
                        //"order": [[1, "desc"]],
                        "pageLength": 31,
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

function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';

    var rows_create = $("#Table_View tbody >tr");
    var detail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        var txtDates = ($(columns[0]).html().trim());
        var _date = moment(txtDates).format('YYYY/MM/DD')
        //        _date = _date.slice(1)
        var txtHolidayCheck = $(columns[2]).find('.ddl_holidaycheck option:selected').val().trim();
        var remarks = $(columns[3]).find("input").val().trim();

        detail_record.push({
            "date": _date,
            "holidayCheck": txtHolidayCheck,
            "remarks": remarks,
            "menuId": _menuid
        })
    }
    if (!Boolean(ck)) {
        _cre = JSON.stringify({ "HolidayListAddModel": detail_record });
    }
    return { ckval: ck, creteria: _cre };
}


function savrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    // return;
    Swal.fire({
        title: 'Are you sure you want to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm ,
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
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