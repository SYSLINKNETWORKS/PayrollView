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
    detailsTable = $("#div_salaryregisterstaff");
    detailsTable.empty();

    $.ajax({

        url: ApiForm + '/v1/PayrollReport/SalaryRegisterStaff',
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

                var today = 'Print By : ' + response.data["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var rowdata = '';
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=22>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=22>Salary Register Staff  Report</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=22>Salary for the month : ' + moment(response.data["dateFrom"]).format("MMM-YYYY") + ' </th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=22>' + today + '</th></tr>';
                rowdata += '</thead>';


                const department_1 = response.data["salaryProcessViewModels"];
                var department = [];
                for (i = 0; i < department_1.length; i++) {
                    if (department.findIndex(x => x._nam == department_1[i].departmentName) == -1) {
                        department.push({ _nam: department_1[i].departmentName });
                    }
                }
                department.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

                rowdata += '<tr style="font-weight:bold;">' +
                    '<th>S.No.</th>' +
                    '<th>Employee</th>' +
                    '<th>Date of Joining</th>' +
                    '<th>Basic Salary</th>' +
                    '<th>Allowance</th>' +
                    '<th>Gross Salary</th>' +
                    '<th>Month Days</th>' +
                    '<th>P/A Days</th>' +
                    '<th>Payable Days</th>' +
                    '<th>Att. Allow</th>' +
                    '<th>Others Addition</th>' +
                    '<th>Late Deduction</th>' +
                    '<th>Advance</th>' +
                    '<th>Loan</th>' +
                    '<th>Takaful</th>' +
                    '<th>Income Tax</th>' +
                    '<th>Others Deduction</th>' +
                    '<th>T.Gross Salary</th>' +
                    '<th>OT Hrs</th>' +
                    '<th>OT Amount</th>' +
                    '<th>Net Salary</th>' +
                    '</tr>';
                rowdata += '</thead>';
                for (var row_cnt = 0; row_cnt < department.length; row_cnt++) {
                    var sno = 1;


                    const employee_1 = response.data["salaryProcessViewModels"];
                    rowdata += '<tbody">';
                    var sno = 1;
                    var _salary_amount = 0,
                        _salary_allowanceamount = 0,
                        _salary_grossamount = 0,
                        _salary_attendanceallowanceamount = 0,
                        _salary_addition = 0,
                        _employee_salary_staff_latedays_actual_amount = 0,
                        _salary_advance = 0,
                        _salary_loan = 0,
                        _salary_takaful = 0,
                        _salary_incometaxamount = 0,
                        _salary_deduction = 0,
                        _employee_salary_staff_amount_gross = 0,
                        _employee_salary_staff_overtime_actual_amount = 0,
                        _employee_salary_staff_amount_payable = 0
                        ;
                    for (var row_cnt = 0; row_cnt < employee_1.length; row_cnt++) {
                        var _dateFrom = response.data["dateFrom"];
                        var _dateTo = response.data["dateTo"];
                        
                        var _employeeId = employee_1[row_cnt]["employeeId"];
                        var sessidTimeSheetDetail = _employeeId + moment(new Date()).format("DDMMYYYYHHMMSS");

                        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '"}';
                        sessionStorage.setItem(sessidTimeSheetDetail, cre);
                        // viewreport_url = apiUrl_View + '/Payroll/Report/TimeSheetDetail?S=' + sessid;

                        _salary_amount += parseFloat(employee_1[row_cnt]["salaryAmount"]);
                        _salary_allowanceamount += parseFloat(employee_1[row_cnt]["salaryAllowanceAmount"]);
                        _salary_grossamount += parseFloat(employee_1[row_cnt]["salaryGrossAmount"]);
                        _salary_attendanceallowanceamount += parseFloat(employee_1[row_cnt]["attendanceAllowanceAmount"]);
                        _salary_addition += parseFloat(employee_1[row_cnt]["additionAmount"]);
                        _employee_salary_staff_latedays_actual_amount += parseFloat(employee_1[row_cnt]["lateDaysActualAmount"]);
                        _salary_advance += parseFloat(employee_1[row_cnt]["advanceAmount"]);
                        _salary_loan += parseFloat(employee_1[row_cnt]["loanAmount"]);
                        _salary_takaful += parseFloat(employee_1[row_cnt]["takaful"]);
                        _salary_incometaxamount += parseFloat(employee_1[row_cnt]["incomeTaxAmount"]);
                        _salary_deduction += parseFloat(employee_1[row_cnt]["deductionAmount"]);
                        _employee_salary_staff_amount_gross += parseFloat(employee_1[row_cnt]["grossAmount"]);
                        _employee_salary_staff_overtime_actual_amount += parseFloat(employee_1[row_cnt]["overtimeActualAmount"]);
                        _employee_salary_staff_amount_payable += parseFloat(employee_1[row_cnt]["payableAmount"]);


                        rowdata += '<tr style="font-size:8pt;">' +
                            '<td hidden >' + employee_1[row_cnt]["employeeId"] + '</td>' +
                            '<td >' + sno++ + '</td>' +
                            '<td>' + '[' + employee_1[row_cnt]["employeeNo"] + ']-' + employee_1[row_cnt]["employeeName"] + '</td>' +
                            '<td>' + moment(employee_1[row_cnt]["dateOfJoining"]).format("DD-MMM-YYYY") + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["salaryAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["salaryAllowanceAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["salaryGrossAmount"]) + '</td>' +
                            '<td>' + employee_1[row_cnt]["noOfDaysMonth"] + '</td>' +
                            '<td><span style="cursor:pointer;color:blue;"  onclick="viewTimeSheetDetail(\'' + sessidTimeSheetDetail + '\')">' + employee_1[row_cnt]["presentDays"] + '</span>/<span style="cursor:pointer;color:blue;"  onclick="viewAbsentSheetDetail(\'' + sessidTimeSheetDetail + '\')">' + employee_1[row_cnt]["absentDays"] + '</span></td>' +
                            //                            '<td>' + employee_1[row_cnt]["lateHours"] + ' ' + employee_1[row_cnt]["lateDaysTotal"] + '</td>' +
                            '<td>' + employee_1[row_cnt]["presentDays"] + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["attendanceAllowanceAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["additionAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["lateDaysActualAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["advanceAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["loanAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["takaful"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["incomeTaxAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["deductionAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["grossAmount"]) + '</td>' +
                            '<td>' + employee_1[row_cnt]["overtimeActual"] + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["overtimeActualAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employee_1[row_cnt]["payableAmount"]) + '</td>' +

                            '</tr>';
                    }
                    rowdata += '</tbody">';
                    rowdata += '<tfooter">';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<td style="font-weight:bold;text-align:right;" colspan=3 >Total : </td>' +
                        '<td>' + accounting.formatNumber(_salary_amount) + '</td>' +
                        '<td>' + accounting.formatNumber(_salary_allowanceamount) + '</td>' +
                        '<td>' + accounting.formatNumber(_salary_grossamount) + '</td>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td>' + accounting.formatNumber(_salary_attendanceallowanceamount) + ' </td>' +
                        '<td>' + accounting.formatNumber(_salary_addition) + '</td>' +
                        '<td>' + accounting.formatNumber(_employee_salary_staff_latedays_actual_amount) + '</td>' +
                        '<td>' + accounting.formatNumber(_salary_advance) + '</td>' +
                        '<td>' + accounting.formatNumber(_salary_loan) + '</td>' +
                        '<td>' + accounting.formatNumber(_salary_takaful) + '</td>' +

                        '<td>' + accounting.formatNumber(_salary_incometaxamount) + '</td>' +
                        '<td>' + accounting.formatNumber(_salary_deduction) + '</td>' +
                        '<td>' + accounting.formatNumber(_employee_salary_staff_amount_gross) + '</td>' +
                        '<td></td>' +
                        '<td>' + accounting.formatNumber(_employee_salary_staff_overtime_actual_amount) + '</td>' +
                        '<td>' + accounting.formatNumber(_employee_salary_staff_amount_payable) + '</td>';


                    rowdata += '</tfooter">';
                    rowdata += '</table>';
                    detailsTable.append(rowdata);
                    imgload.hide();
                }
            }
            else {
                alert(response[0].Remarks);
                imgload.hide();
                //window.location.href = "@Url.Content("/login")";
            }
        },
        error: function (error) {
            console.log('Error ' + error);
            alert('Error ' + error);
            imgload.hide();
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
function viewTimeSheetDetail(sessidTimeSheetDetail) {
    window.open(apiUrl_View + '/Payroll/Report/TimeSheetDetail?S=' + sessidTimeSheetDetail, '_blank');

}
function viewAbsentSheetDetail(sessidTimeSheetDetail) {
    window.open(apiUrl_View + '/Payroll/Report/Absent?S=' + sessidTimeSheetDetail, '_blank');

}