var imgload = $("#img_load");
var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);
var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {
    detailsTable = $("#div_dailyattandance");
    lbldate = $("#lbldate");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/DailyAttendance',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "dateFrom": "2021-06-01", "dateTo": "2021-06-01", "employeeId": "", "branchId": "", "officeWorker": "", "TemporaryPermanent": "", "designationId": "", "departmentId": "", "gender": "" }),
        // data:_creJson,// JSON.stringify(_cre ),
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            
            if (response.statusCode == 200) {

                var today = 'Print By : ' + response.data["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var rowdata = '';
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>DAILY ATTENDANCE</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '</thead>';

                const department_1 = response.data["dailyAttendanceLists"];
                var department = [];
                for (i = 0; i < department_1.length; i++) {
                    if (department.findIndex(x => x._nam == department_1[i].departmentName) == -1) {
                        department.push({ _nam: department_1[i].departmentName });
                    }
                }
                department.sort((a, b) => (a._nam > b._nam) ? 1 : -1);


                for (var department_cnt = 0; department_cnt < department.length; department_cnt++) {
                    var sno = 1;

                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th>SNo.</th>' +
                        '<th>Name</th>' +
                        '<th>Designation</th>' +
                        '<th>Roaster</th>' +
                        '<th>In/Out Date</th>' +
                        '<th>In Out</th>' +
                        '<th>Late Coming Mins</th>' +
                        '<th>Late Coming Hrs</th>' +
                        '<th>Over Time Mins</th>' +
                        '<th>Over Time Hrs</th>' +
                        '<th>Remarks</th>' +
                        '</tr>';
                    rowdata += '<tr>' +
                        '<th style="text-align:left;" colspan=8>Department : ' + department[department_cnt]._nam + '</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    const Date_1 = response.data["dailyAttendanceLists"].filter(d => d.departmentName == department[department_cnt]._nam);
                    var _Date = [];
                    for (i = 0; i < Date_1.length; i++) {
                        if (_Date.findIndex(x => x._dt == Date_1[i].dailyDate) == -1) {
                            _Date.push({ _dt: Date_1[i].dailyDate });
                        }
                    }
                    _Date.sort((a, b) => (a._dt > b._dt) ? 1 : -1);

                    for (var dt_cnt = 0; dt_cnt < _Date.length; dt_cnt++) {

                        const employee_1 = response.data["dailyAttendanceLists"].filter(d => d.departmentName == department[department_cnt]._nam && d.dailyDate == _Date[dt_cnt]._dt);

                        var employee = [];
                        for (i = 0; i < employee_1.length; i++) {
                            if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                                employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                            }
                        }
                        employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

                        rowdata += '<tbody>';

                        var sno = 1;
                        for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                            const employeeFilter = response.data["dailyAttendanceLists"].filter(d => d.employeeId == employee[row_cnt]._id && d.departmentName == department[department_cnt]._nam && d.dailyDate == _Date[dt_cnt]._dt);
                            for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                                rowdata += '<tr style="font-size:8pt;">' +
                                    '<td>' + sno++ + '</td>' +
                                    '<td>' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                                    '<td>' + employeeFilter[row_cnt_filter]["designationName"] + '</td>' +
                                    '<td>' + (employeeFilter[row_cnt_filter]["rosterInn"] != null ? moment(employeeFilter[row_cnt_filter]["rosterInn"]).format("LT") : '') + '<br/>' + (employeeFilter[row_cnt_filter]["rosterOut"] != null ? moment(employeeFilter[row_cnt_filter]["rosterOut"]).format("LT") : '') + '</td>' +
                                    '<td>' + moment(employeeFilter[row_cnt_filter]["innTime"]).format("DD-MMM-YYYY") + '<br/>' + moment(employeeFilter[row_cnt_filter]["outTime"]).format("DD-MMM-YYYY") + '</td>' +
                                    '<td>' + (employeeFilter[row_cnt_filter]["innTime"] != null ? moment(employeeFilter[row_cnt_filter]["innTime"]).format("LT") : '') + '<br/>' + (employeeFilter[row_cnt_filter]["outTime"] != null ? moment(employeeFilter[row_cnt_filter]["outTime"]).format("LT") : '') + '</td>' +
                                    '<td>' + employeeFilter[row_cnt_filter]["lateComingMin"] + '</td>' +
                                    '<td>' + employeeFilter[row_cnt_filter]["lateComingHr"] + '</td>' +
                                    '<td>' + employeeFilter[row_cnt_filter]["overTimeMin"] + '</td>' +
                                    '<td>' + employeeFilter[row_cnt_filter]["overTimehr"] + '</td>' +
                                    '<td>' + (employeeFilter[row_cnt_filter]["remarks"] != null ? employeeFilter[row_cnt_filter]["remarks"] : '') + '</td>' +
                                    '</tr>';
                            }

                        }
                        rowdata += '</tbody>';

                    }
                }



                rowdata += '</table>';

                detailsTable.append(rowdata);
                imgload.hide();
            }
            else {
                imgload.hide();
                //                alert(response.message);
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

                //window.location.href = "@Url.Content("/login")";
            }
        },
        error: function (error) {
            imgload.hide();

            Swal.fire({
                title: 'Error ' + error,

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
$(document).on("click", '#btnExport', function (e) {
    //  window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()), new Date() + '.xls');
    //  e.preventDefault();

    var a = document.createElement('a');
    //getting data from our div that contains the HTML table
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = encodeURIComponent($('#Print_Div').html());
    // var table_html = table_div.outerHTML.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_div;
    //setting the file name
    a.download = 'Voucher' + moment(new Date()).format('DDMMYYYYHHmmss') + '.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
});
$(document).on("click", '#btnPrint', function (e) {
    $("#btnPrint").hide();
    $("#btnExport").hide();
    window.print();
    $("#btnPrint").show();
    $("#btnExport").show();

    e.preventDefault();
});




