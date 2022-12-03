var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];

var key = sessid_url[1];
var dateFrom = sessid_url[2];
var dateTo = sessid_url[3];
var workerStaff = sessid_url[4];

$(document).ready(function () {
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {

    detailsTable = $("#div_salary_slip");
    detailsTable.empty();

    $.ajax({

        url: apiUrl + '/PayrollReport/PaySlip/' + key + '/' + dateFrom + '/' + dateTo + '/' + workerStaff,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            if (response[0].status == 1) {

                var today = 'Print By : ' + response[0]["Result_Heading"][0]["User_Name"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var rowhead = '', rowdata = '';
                const employee_1 = response[0]["Result"];
                var employee = [];
                for (i = 0; i < employee_1.length; i++) {
                    if (employee.findIndex(x => x._id == employee_1[i].emppro_id) == -1) {
                        employee.push({ _id: employee_1[i].emppro_id, _macid: employee_1[i].emppro_macid, _nam: employee_1[i].emppro_nam_rpt, _department: employee_1[i].dpt_nam, _des: employee_1[i].memp_sub_nam,_doj: employee_1[i].emppro_doj });
                    }
                }
                employee.sort((a, b) => (a._department > b._department) ? 1 : -1);

                for (var employee_cnt = 0; employee_cnt < employee.length; employee_cnt++) {
                    rowdata += '<table id="detail_table" class="table table-responsive table-condensed" style="font-size:7pt;">';
                    rowdata += '<thead>';
                    //rowhead="<div>";

                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=8>' + response[0]["Result_Heading"][0]["Company_Name"] + '</th></tr>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=8>Salary slip for the month of ' + response[0]["Result_Heading"][0]["Date"] + '</th></tr>';



                    // rowdata += '<tr><th style="font-weight:bold;">Employee No.</th><th colspan=5>' + employee[employee_cnt]._macid + '</th><th style="font-weight:bold;">Department</th><th>' + employee[employee_cnt]._department + '</th></tr>';
                    // rowdata += '<tr><th style="font-weight:bold;">EmployeeName</th><th colspan=5>' + employee[employee_cnt]._nam + '</th><th style="font-weight:bold;">Designation</th><th>' + employee[employee_cnt]._des + '</th></tr>';

                    rowdata += '<tr><th style="font-weight:bold;">Employee </th><th colspan=2>[' + employee[employee_cnt]._macid + ']-' + employee[employee_cnt]._nam + '</th><th style="font-weight:bold;">Date Of Join</th><th>' + moment(employee[employee_cnt]._doj).format("DD-MMM-YYYY") + '</th><th style="font-weight:bold;">Department</th><th colspan=2>' + employee[employee_cnt]._department + '</th></tr>';

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

                    // detailsTable.append(rowdata);


                    const employee_2 = response[0]["Result"].filter(d => d.emppro_id == employee[employee_cnt]._id);
                    const employee_2_worker = response[0]["Result_Salary_Worker"].filter(d => d.emppro_id == employee[employee_cnt]._id);
                    const employee_2_staff = response[0]["Result_Salary_Staff"].filter(d => d.emppro_id == employee[employee_cnt]._id);

                    rowdata += '<tbody">';
                    for (var employee_2_cnt = 0; employee_2_cnt < employee_2.length; employee_2_cnt++) {
                        var _rosgpin = '', _rosgpout = '';
                        var _TimeInn = '', _TimeOut = '';
                        var _Remarks = '';
                        //Roster Start
                        if (employee_2[employee_2_cnt]["rosgp_in"] != null) {
                            _rosgpin = moment(employee_2[employee_2_cnt]["rosgp_in"]).format("HH:mm")
                        }
                        if (employee_2[employee_2_cnt]["rosgp_out"] != null) {
                            _rosgpout = moment(employee_2[employee_2_cnt]["rosgp_out"]).format("HH:mm")
                        }
                        //Roster End
                        //Time Start
                        if (employee_2[employee_2_cnt]["intime"] != null) {
                            _TimeInn = moment(employee_2[employee_2_cnt]["intime"]).format("HH:mm");
                        }
                        if (employee_2[employee_2_cnt]["outtime"] != null) {
                            _TimeOut = moment(employee_2[employee_2_cnt]["outtime"]).format("HH:mm");
                        }
                        //Time End

                        //Remarks Start
                        if (employee_2[employee_2_cnt]["remarks"] != null) {
                            _Remarks = employee_2[employee_2_cnt]["remarks"];
                        }
                        //Remarks End
                        rowdata += '<tr">' +
                            '<td width=150px>' + moment(employee_2[employee_2_cnt]["tbldat_dat"]).format("DD-MMM-YYYY ddd") + '</td>' +
                            '<td>' + _rosgpin + '-' + _rosgpout + '</td>' +
                            '<td>' + _TimeInn + '-' + _TimeOut + '</td>' +
                            '<td>' + employee_2[employee_2_cnt]["Late_inn"] + '</td>' +
                            '<td>' + employee_2[employee_2_cnt]["Early_Going"] + '</td>' +
                            '<td>' + employee_2[employee_2_cnt]["OT"] + '</td>' +
                            '<td>' + employee_2[employee_2_cnt]["Early_Overtime"] + '</td>' +
                            '<td>' + employee_2[employee_2_cnt]["Total_Hours"] + '</td>' +
                            '<td>' + _Remarks + '</td>' +
                            '</tr>';
                    }
                    rowdata += '</tbody">';
                    rowdata += '<tfooter">';
                    if (employee_2_worker.length > 0) {
                        rowdata += '<tr><td style="font-weight:bold;">&nbsp Salary Detail </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Basic Salary </td><td>' + accounting.formatNumber(employee_2_worker[0]["salary_amount"]) + '</td><td style="font-weight:bold;">Allowance </td><td>' + accounting.formatNumber(employee_2_worker[0]["salary_allowanceamount"]) + '</td><td style="font-weight:bold;">Gross Salary </td><td>' + accounting.formatNumber(employee_2_worker[0]["salary_grossamount"]) + '</td><td style="font-weight:bold;">Month Days </td><td>' + employee_2_worker[0]["salary_noofdaysmonth"] + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">P/A Days </td><td>' + employee_2_worker[0]["salary_presentdays"]+'/'+ employee_2_worker[0]["salary_absentdays"] + '</td><td style="font-weight:bold;">L.D/L.D.D </td><td>'+ employee_2_worker[0]["employee_salary_worker_late_days_Total"]+'/'+ employee_2_worker[0]["employee_salary_worker_late_days"] + '</td><td style="font-weight:bold;">Payable Days </td><td>'+ employee_2_worker[0]["salary_WorkingDays"] + '</td><td style="font-weight:bold;">Att. Allow </td><td>'+ employee_2_worker[0]["salary_attendanceallowanceamount"].toFixed(2) + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Others Addition </td><td>'+ employee_2_worker[0]["salary_addition"] + '</td><td style="font-weight:bold;">Late Deduction </td><td>'+employee_2_worker[0]["employee_salary_worker_latedays_actual_amount"].toFixed(2)+'</td><td style="font-weight:bold;">Advance </td><td>'+ employee_2_worker[0]["salary_advance"] + '</td><td style="font-weight:bold;">Loan </td><td>'+ employee_2_worker[0]["salary_loan"] + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Takaful </td><td>' + employee_2_worker[0]["salary_takaful"]+'</td><td style="font-weight:bold;">Income Tax </td><td>' + employee_2_worker[0]["salary_incometaxamount"]+'</td><td style="font-weight:bold;">Others Deduction </td><td>' + employee_2_worker[0]["salary_deduction"]+'</td><td style="font-weight:bold;">T.Gross Salary </td><td>' + accounting.formatNumber(employee_2_worker[0]["employee_salary_worker_amount_gross"])+'</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">OT Hrs </td><td>' + employee_2_worker[0]["employee_salary_worker_overtime_actual"]+'</td><td style="font-weight:bold;">OT Amount </td><td>' + employee_2_worker[0]["employee_salary_worker_overtime_actual_amount"].toFixed(2)+'</td><td style="font-weight:bold;">Net Salary </td><td>' + accounting.formatNumber(employee_2_worker[0]["employee_salary_worker_amount_payable"])+'</td></tr>'
                    }
                    else if (employee_2_staff.length > 0) {
                        rowdata += '<tr><td style="font-weight:bold;">&nbsp Salary Detail </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td><td style="font-weight:bold;">&nbsp </td><td>&nbsp</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Basic Salary </td><td>' + accounting.formatNumber(employee_2_staff[0]["salary_amount"]) + '</td><td style="font-weight:bold;">Allowance </td><td>' + accounting.formatNumber(employee_2_staff[0]["salary_allowanceamount"]) + '</td><td style="font-weight:bold;">Gross Salary </td><td>' + accounting.formatNumber(employee_2_staff[0]["salary_grossamount"]) + '</td><td style="font-weight:bold;">Month Days </td><td>' + employee_2_staff[0]["salary_noofdaysmonth"] + '</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">P/A Days </td><td>'+employee_2_staff[0]["salary_presentdays"]+'/'+employee_2_staff[0]["salary_absentdays"]+'</td><td style="font-weight:bold;">Payable Days </td><td>'+employee_2_staff[0]["salary_WorkingDays"]+'</td><td style="font-weight:bold;">Att. Allow </td><td>'+employee_2_staff[0]["salary_attendanceallowanceamount"].toFixed(2)+'</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Others Addition </td><td>'+accounting.formatNumber(employee_2_staff[0]["salary_addition"])+'</td><td style="font-weight:bold;">Late Deduction </td><td>'+employee_2_staff[0]["employee_salary_staff_latedays_actual_amount"].toFixed(2)+'</td><td style="font-weight:bold;">Advance </td><td>'+employee_2_staff[0]["salary_advance"]+'</td><td style="font-weight:bold;">Loan </td><td>'+accounting.formatNumber(employee_2_staff[0]["salary_loan"])+'</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">Takaful </td><td>'+accounting.formatNumber(employee_2_staff[0]["salary_takaful"])+'</td><td style="font-weight:bold;">Income Tax </td><td>'+employee_2_staff[0]["salary_incometaxamount"]+'</td><td style="font-weight:bold;">Others Deduction </td><td>'+employee_2_staff[0]["salary_deduction"]+'</td><td style="font-weight:bold;">T.Gross Salary </td><td>'+accounting.formatNumber(employee_2_staff[0]["employee_salary_staff_amount_gross"])+'</td></tr>'
                        rowdata += '<tr><td style="font-weight:bold;">OT Hrs </td><td>'+employee_2_staff[0]["employee_salary_staff_overtime_actual"]+'</td><td style="font-weight:bold;">OT Amount </td><td>'+accounting.formatNumber(employee_2_staff[0]["employee_salary_staff_overtime_actual_amount"])+'</td><td style="font-weight:bold;">Net Salary </td><td>'+accounting.formatNumber(employee_2_staff[0]["employee_salary_staff_amount_payable"])+'</td></tr>'
                    }

                    rowdata += '</tfooter">';
                    rowdata += '</table>';
                    rowdata += '<p style="page-break-before: always">';
                }


                // rowdata += '<tfooter">';
                // rowdata += '</tfooter">';


                //rowdata += '</tbody">';
                detailsTable.append(rowdata);
                imgload.hide();
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
