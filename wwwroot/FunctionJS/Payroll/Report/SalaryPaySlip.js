var imgload = $("#img_load");
//var currentURL = document.URL;
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
    detailsTable = $("#div_SalaryPaySlip");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/SalaryPaySlip',
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
                //var Dates = 'Date From  : ' + moment(response.data["dateFrom"]).format("DD-MMM-YYYY") + ' To : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY");
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:7pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21> Salary Slip For Month of ' + moment(response.data["dateFrom"]).format("MMM-YYYY") + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '</thead>';

                const employee_1 = response.data["salaryPaySlipLists"];

                var employee = [];
                for (i = 0; i < employee_1.length; i++) {
                    if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                        employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                    }
                }
                employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                    var sno = 1;
                    const employeeFilter = response.data["salaryPaySlipLists"].filter(d => d.employeeId == employee[row_cnt]._id);
                    // var _amount = 0, _receivingAmount = 0, _balanceAmount = 0, _status = 'InProcess';

                    // for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                    //     _receivingAmount += parseFloat(employeeFilter[row_cnt_filter]["receiving"]);
                    // }
                    // _amount = employeeFilter[0]["amount"];
                    // _balanceAmount = parseFloat(_amount) - parseFloat(_receivingAmount);
                    // if (parseFloat(_balanceAmount) == 0) { _status = 'Complete'; }

                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th colspan=10>Employee : ' + '[' + employeeFilter[0]["employeeNo"] + ']' + ' - ' + employeeFilter[0]["employeeName"] + '&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp' + ' Date of join : ' + moment(employeeFilter[0]["dateOfJoin"]).format("DD-MMM-YYYY") + '&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp' + ' Department : ' + employeeFilter[0]["departmentName"] + '</th>' +
                        '</tr>';

                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th>Date</th>' +
                        '<th>Roster</th>' +
                        '<th>Time</th>' +
                        '<th>Late Coming</th>' +
                        '<th>Early Going</th>' +
                        '<th>Over Time</th>' +
                        '<th>Early OverTime</th>' +
                        '<th>Total Overtime</th>' +
                        '<th>Remarks</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    const Date_1 = response.data["salaryPaySlipLists"].filter(d => d.employeeId == employee[row_cnt]._id);
                    const salaryDetails = response.data["salaryDetails"].filter(d => d.employeeId == employee[row_cnt]._id);


                    var _Date = [];
                    for (i = 0; i < Date_1.length; i++) {
                        if (_Date.findIndex(x => x._dt == Date_1[i].date) == -1) {
                            _Date.push({ _dt: Date_1[i].date });
                        }
                    }
                    _Date.sort((a, b) => (a._dt > b._dt) ? 1 : -1);
                    for (var dt_cnt = 0; dt_cnt < _Date.length; dt_cnt++) {
                        const employeeFilterDate = response.data["salaryPaySlipLists"].filter(d => d.employeeId == employee[row_cnt]._id && d.date == _Date[dt_cnt]._dt);
                        rowdata += '<tbody">';
                        for (var row_cnt_filter = 0; row_cnt_filter < employeeFilterDate.length; row_cnt_filter++) {
                            var _rosgpin = '', _rosgpout = '', _inn = '', _out = '';
                            if (employeeFilterDate[row_cnt_filter]["rosterInn"] != null) {
                                _rosgpin = moment(employeeFilterDate[row_cnt_filter]["rosterInn"]).format("HH:mm")
                            }
                            if (employeeFilterDate[row_cnt_filter]["rosterOut"] != null) {
                                _rosgpout = moment(employeeFilterDate[row_cnt_filter]["rosterOut"]).format("HH:mm")
                            }

                            if (employeeFilterDate[row_cnt_filter]["innTime"] != null) {
                                _inn = moment(employeeFilterDate[row_cnt_filter]["innTime"]).format("HH:mm")
                            }

                            if (employeeFilterDate[row_cnt_filter]["outTime"] != null) {
                                _out = moment(employeeFilterDate[row_cnt_filter]["outTime"]).format("HH:mm")
                            }

                            rowdata += '<tr style="font-size:7pt;">' +
                                '<td style="font-weight:bold;" >' + moment(employeeFilterDate[row_cnt_filter]["dailyDate"]).format("DD-MMM-YYYY") + '</td>' +
                                '<td>' + _rosgpin + ' - ' + _rosgpout + '</td>' +
                                '<td>' + _inn + ' - ' + _out + '</td>' +
                                '<td>' + employeeFilterDate[row_cnt_filter]["lateComing"] + '</td>' +
                                '<td>' + employeeFilterDate[row_cnt_filter]["earlyGoing"] + '</td>' +
                                '<td>' + employeeFilterDate[row_cnt_filter]["overTime"] + '</td>' +
                                '<td>' + employeeFilterDate[row_cnt_filter]["earlyOverTime"] + '</td>' +
                                '<td>' + employeeFilterDate[row_cnt_filter]["totalOverTime"] + '</td>' +
                                '<td>' + employeeFilterDate[row_cnt_filter]["remarks"] + '</td>' +
                                '</tr>';
                        }
                    }
                    rowdata += '</tbody">';
                    rowdata += '<tfooter">';
                    if (salaryDetails.length > 0) {
                        rowdata += '<tr><td style="font-weight:bold;">&nbsp Salary Detail </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Basic Salary </td><td>' + accounting.formatNumber(salaryDetails[0]["basicSalary"]) + '</td><td style="font-weight:bold;">Allowance </td><td>' + accounting.formatNumber(salaryDetails[0]["allowance"]) + '</td><td style="font-weight:bold;">Gross Salary </td><td>' + accounting.formatNumber(salaryDetails[0]["grossSalary"]) + '</td><td style="font-weight:bold;">Month Days </td><td>' + salaryDetails[0]["monthDays"] + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">P/A Days </td><td>' + salaryDetails[0]["presentDays"] + '/' + salaryDetails[0]["absentDays"] + '</td><td style="font-weight:bold;">L.D/L.D.D </td><td>' + salaryDetails[0]["lateDays"] + '/' + salaryDetails[0]["lateDaysDeduction"] + '</td><td style="font-weight:bold;">Payable Days </td><td>' + salaryDetails[0]["payableDays"] + '</td><td style="font-weight:bold;">Att. Allow </td><td>' + accounting.formatNumber(salaryDetails[0]["attendanceAllowance"]) + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Others Addition </td><td>' + accounting.formatNumber(salaryDetails[0]["otherAddition"]) + '</td><td style="font-weight:bold;">Late Deduction </td><td>' + accounting.formatNumber(salaryDetails[0]["lateDeduction"]) + '</td><td style="font-weight:bold;">Advance </td><td>' + accounting.formatNumber(salaryDetails[0]["advance"]) + '</td><td style="font-weight:bold;">Loan </td><td>' + accounting.formatNumber(salaryDetails[0]["loan"]) + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Takaful </td><td>' + accounting.formatNumber(salaryDetails[0]["takaful"]) + '</td><td style="font-weight:bold;">Income Tax </td><td>' + accounting.formatNumber(salaryDetails[0]["incomeTax"]) + '</td><td style="font-weight:bold;">Others Deduction </td><td>' + accounting.formatNumber(salaryDetails[0]["otherDeduction"]) + '</td><td style="font-weight:bold;">T.Gross Salary </td><td>' + accounting.formatNumber(salaryDetails[0]["totalGrossSalary"]) + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">OT Hrs </td><td>' + salaryDetails[0]["oThours"] + '</td><td style="font-weight:bold;">OT Amount </td><td>' + accounting.formatNumber(salaryDetails[0]["otAmount"]) + '</td><td style="font-weight:bold;">Net Salary </td><td>' + accounting.formatNumber(salaryDetails[0]["netSalary"]) + '</td></tr>'
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