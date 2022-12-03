var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var txtdat = $("#txt_Date");
var imgload = $("#img_load");
var ApiForm = '';


$(function () {
    txtdat.datetimepicker({ format: 'MMM/YYYY' });
});
$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1';
    discon();
});
function discon() {
    var CurrentDate = moment(new Date()).format("MMM/YYYY");

    txtdat.find("input").val(CurrentDate);
    imgload.hide();
}
$(document).on("click", '#btn_salaryview', function () {
    Swal.fire({
        title: 'Are you sure you want to view salary?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            viewGrid();
        }
    })
});
function viewGrid() {
    var txtDate1 = moment('01/' + txtdat.find("input").val()).format("YYYY-MM-DD");
    _cre = '{"dateFrom": "' + txtDate1 + '","dateTo":"' + txtDate1 + '"}';


    $.ajax({
        url: apiUrl + '/api/Payroll/v1/PayrollReport/SalaryRegisterStaff',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {


                var _IsVoucherPost = response.data["salaryProcessViewModels"].filter(d => d.voucherPostCk == true).length > 0 ? true : false;
                var _SalaryGeneratebutton = document.getElementById("btn_salarygenerate");
                _SalaryGeneratebutton.disabled = _IsVoucherPost;

                var _voucherpostbutton = document.getElementById("btn_salarypostvoucher");
                _voucherpostbutton.disabled = _IsVoucherPost;

                if (Boolean(_IsVoucherPost)) {
                    $("#div_VoucherPost").html("<h2> Voucher Post</h2>");
                }
                else {
                    $("#div_VoucherPost").html("<h2> Voucher Not Post</h2>");
                }

                var sno = 1;
                $('#Table_View').DataTable().clear().destroy();
                detailsTableBody = $("#Table_View").dataTable({
                    data: response.data["salaryProcessViewModels"],
                    destroy: true,
                    retrieve: true,
                    paging: false,
                    search: false,
                    bFilter: false,
                    bInfo: false,
                    columns: [
                        {
                            "render": function (data, type, full, meta) {
                                return sno++;
                            }
                        },
                        { data: 'employeeNo' },
                        { data: 'employeeName' },
                        {
                            data: 'payableAmount',
                            render: function (data, type, row) { return accounting.formatNumber(data); }
                        },
                        {
                            data: 'employeeId',
                            render: function (data, type, row) {
                                var _salarybtn = '';
                                if (!Boolean(_IsVoucherPost)) {
                                    _salarybtn = '<button id="btn_salarygenerate_Employee" class="btn btn-warning" onclick= generateSalary(\'' + data + '\')>Process Again</button>';
                                }
                                return _salarybtn;
                            }
                        }
                    ],

                    // "order": [[2, "asc"]],
                });

                imgload.hide();
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
}
$(document).on("click", '#btn_salarygenerate', function () {
    generateSalary('0');
});

function generateSalary(_EmployeeId) {
    Swal.fire({
        title: 'Are you sure you want to generate salary?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            var txtdat1 = txtdat.find("input").val();

            $.ajax({

                url: ApiForm + '/SalaryProcess/StaffSalaryProcess',
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("Menuid", _menuid);
                    xhr.setRequestHeader("SalaryDate", txtdat1);
                    xhr.setRequestHeader("EmployeeId", _EmployeeId);
                    imgload.show();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgload.hide();
                        Swal.fire({
                            title: "Salary Process",

                            icon: 'success',
                            showConfirmButton: true,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                        viewGrid();
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
$(document).on("click", '#btn_salaryprint', function () {

    Swal.fire({
        title: 'Are you sure you want to print salary register?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
            var txtDate1 = moment('01/' + txtdat.find("input").val()).format("YYYY-MM-DD");
            _cre = '{"dateFrom": "' + txtDate1 + '","dateTo":"' + txtDate1 + '"}';
            sessionStorage.setItem(sessid, _cre);

            viewreport_url = apiUrl_View + '/Payroll/Report/SalaryRegisterStaff?S=' + sessid;
            window.open(viewreport_url, '_blank');
        }
    })
});


$(document).on("click", '#btn_salaryslipprint', function () {

    Swal.fire({
        title: 'Are you sure you want to print salary slip?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
            var _dateFrom = moment('01/' + txtdat.find("input").val()).format("YYYY-MM-DD");
            var _dateTo = moment(_dateFrom).endOf('month').format("YYYY-MM-DD");
            _cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","officeWorker":"Office"}';
            sessionStorage.setItem(sessid, _cre);
            viewreport_url = apiUrl_View + '/Payroll/Report/SalaryPaySlip?S=' + sessid;
            window.open(viewreport_url, '_blank');
        }
    })
});

$(document).on("click", '#btn_salarypostvoucher', function () {
    Swal.fire({
        title: 'Are you sure you want to post salary voucher?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            var txtdat1 = txtdat.find("input").val();

            $.ajax({

                url: ApiForm + '/SalaryProcess/StaffSalaryVoucherPost',
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("Menuid", _menuid);
                    xhr.setRequestHeader("SalaryDate", txtdat1);
                    imgload.show();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgload.hide();
                        Swal.fire({
                            title: "Salary voucher post",

                            icon: 'success',
                            showConfirmButton: true,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                        viewGrid();
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
});
