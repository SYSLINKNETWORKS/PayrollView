var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}


var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
var ApiForm = '';

var txtDate = $("#txt_Date");

$(function () {
    txtDate.datetimepicker({ format: 'DD/MMM/YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1/NightOverTime';
    imgload.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtDate.find("input").val(CurrentDate);

    discon();


});

function discon() {
    imgload.hide();
}


function Onload() {
    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
    $('#Table_View').DataTable().clear().destroy();

    $.ajax({
        url: ApiForm,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("dateAsOn", txtDate1);
            imgload.show();
        },
        success: function (response) {

            if (response.statusCode == 200) {
                var action_button = ' ';
                //New
                if (response["data"][0]["newPermission"] == 'true') {
                    btnnew.show();
                }
                var sno = 1;

                if (response["data"] != null) {
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        paging: false,
                        search: false,
                        bFilter: false,
                        bInfo: false,
                        bSort: false,
                        columns: [
                            {
                                data: 'employeeName',
                            },
                            {
                                data: 'designationName',
                            },
                            {
                                data: 'overTime',
                                render: function (data, type, row) {

                                    return '<input type="text" class="form-control" id="txt_inntime" name="txt_inntime" value="' + data + '" />'
                                }

                            },


                        ],
                      //  "order": [[0, "asc"]],

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



    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return { ckval: ck, creteria: _cre };;
    }
    for (var i = 0; i < rows_create.length; i++) {

        columns = $(rows_create[i]).find('td');
        var txtdt = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
        var txtoverTime = $(columns[2]).find("input").val();

        var data = $('#Table_View').DataTable().row(i).data();


        detail_record.push({
            "employeeId": data['employeeId'],
            "date": txtdt,
            "overTime": txtoverTime,
            "menuId": _menuid
        })


    }
    if (!Boolean(ck)) {
        _cre = JSON.stringify({ "NightOverTimeListAddModel": detail_record });
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
                url: ApiForm,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        imgload.hide();
                        discon();
                        btnsav.show();
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
                    btnsav.show();
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

$("#txtin").keyup(function (e) {

    if (e.keyCode === 13) {
        savrec();
    }
});


$("#txt_outtime").keyup(function (e) {
    if (e.keyCode === 13) {
        savrec();
    }
});



$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['employeeId'];
    var _name = data['employeeName'];
    var _date = moment(data['date']).format("YYYY-MM-DD");
    //data['date']; 

    var _approved = data['approved'];
    if (_approved) {
        Swal.fire({
            title: "This is Approved Record can't be edit!",
            icon: 'warning',
            showConfirmButton: true,
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return;
    }
    Swal.fire({
        title: 'Are sure wants to edit <br/>' + _name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'edit',
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
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.hide();
                },
                data: JSON.stringify({
                    "employeeId": _id,
                    "date": _date,
                    "menuId": _menuid
                }),
                success: function (response) {
                    if (response.statusCode == 200) {
                        $('#data_Modal').modal('show');


                        _Employee_ID = response["data"][0]["employeeId"];
                        _Employee_Name = response["data"][0]["employeeName"];
                        $('#txt_employee').val(_Employee_ID); // Select the option with a value of '1'
                        $('#txt_employee').trigger('change'); // Notify any JS components that the value changed

                        txtdat.find("input").val(moment(response["data"][0]["date"]).format('DD/MMM/YYYY'));

                        _InOutCategory_ID = response["data"][0]["inOutCategoryId"];
                        _InOutCategory_Name = response["data"][0]["inOutCategoryName"];
                        $('#txt_inoutCategory').val(_InOutCategory_ID); // Select the option with a value of '1'
                        $('#txt_inoutCategory').trigger('change'); // Notify any JS components that the value changed

                        for (var i = 0; i < response["data"].length; i++) {
                            if (response["data"][i]["checkType"] == 'I') {
                                $('#ck_inn').iCheck('check');
                                txtinn.find("input").val(moment(response["data"][i]["checktime"]).format('HH:mm'));
                            }

                            if (response["data"][i]["checkType"] == 'O') {
                                $('#ck_out').iCheck('check');
                                txtout.find("input").val(moment(response["data"][i]["checktime"]).format('HH:mm'));
                            }
                        }

                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();
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
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.show();
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
});
function FillRoster() {

    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
    var txtDateTo1 = moment(txtDateTo.find("input").val()).format("YYYY-MM-DD");

    $.ajax({

        url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetRosterByEmployeeId',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("RosterDate", txtDate1);
            xhr.setRequestHeader("RosterDateTo", txtDateTo1);
            xhr.setRequestHeader("EmployeeId", $("#txt_employee").val());
            imgloadsav.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                $("#txt_inntime").find("input").val(moment(response["data"]["rosterInn"]).format('HH:mm'));
                $("#txt_outtime").find("input").val(moment(response["data"]["rosterOut"]).format('HH:mm'));

                imgloadsav.hide();
            }

            else {
                imgloadsav.hide();
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
            imgloadsav.hide();
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