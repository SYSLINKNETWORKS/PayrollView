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
    detailsTable = $("#div_timesheetworker");
    detailsTable.empty();
    $.ajax({
        // url: apiUrl + '/Payroll/Report/TimeSheetWorker/' + strkey + '/' + _date+'/'+_emppro_id+'/'+_emppro_com_id,
        url: ApiForm + '/v1/PayrollReport/Absent',
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
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:7pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Absent Sheet Detail Report</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Date from : ' + moment(response.data["dateFrom"]).format("DD-MMM-YYYY") + ' to : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY") + ' </th></tr>';

                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '</thead>';



                const employee_1 = response.data["timeSheetViewModels"];
                var employee = [];
                for (i = 0; i < employee_1.length; i++) {
                    if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                        employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                    }
                }
                employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);



                for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                    const employeeFilter = response.data["timeSheetViewModels"].filter(d => d.employeeId == employee[row_cnt]._id);
                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th style="text-align:Center;vertical-align:middle;">SNo.</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Date</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Roster</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Absent</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Adjusted</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Deduction</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Remarks</th>' +
                        '</tr>';

                    rowdata += '<tr>' +
                        '<th style="font-weight:bold;" colspan=1>Employee No</th>' +
                        '<th style="text-align:Left;" colspan=3>' + employeeFilter[0]["employeeNo"] + '</th>' +
                        '<th style="font-weight:bold;text-align:Right;" colspan=2>Designation : </th>' +
                        '<th style="text-align:Left;" colspan=2>' + employeeFilter[0]["designationName"] + '</th>' +
                        '</tr>';
                    rowdata += '<tr>' +
                        '<th style="font-weight:bold;" colspan=1>Employee Name:</th>' +
                        '<th  style="text-align:Left;" colspan=3>' + employeeFilter[0]["employeeName"] + '</th>' +
                        '<th style="font-weight:bold;text-align:Right;" colspan=2>Department : </th>' +
                        '<th style="text-align:Left;" colspan=2>' + employeeFilter[0]["departmentName"] + '</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    var sno = 1;
                    var _absent_cnt_total = 0, _absentAdjustment_cnt_total = 0, _absentDeduction_total = 0;
                    for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {

                        var _absentAdjustment_cnt = 0, _absentDeduction = 0, _absent_style = '';
                        _absent_cnt_total += 1;
                        if (Boolean(employeeFilter[row_cnt_filter]["absentAdjustmentCheck"])) {
                            _absentAdjustment_cnt += 1;
                            _absentAdjustment_cnt_total+=1;
                        }
                        _absentDeduction = 1 - parseFloat(_absentAdjustment_cnt);
                        _absentDeduction_total+=_absentDeduction;

                        if (parseFloat(_absentDeduction) > 0) { _absent_style = 'color:Red;'; } else { _absent_style = ''; }

                        rowdata += '<tbody">';


                        rowdata += '<tr style="font-size:7pt;">' +
                            '<td style="text-align:Center;">' + sno++ + '</td>' +
                            '<td style="text-align:Center;">' + moment(employeeFilter[row_cnt_filter]["dailyDate"]).format("ddd DD-MMM-YYYY") + '</td>' +
                            '<td style="text-align:Center;">' + employeeFilter[row_cnt_filter]["rosterWorkingHours"] + '</td>' +
                            '<td style="text-align:Center;">1</td>' +
                            '<td style="text-align:Center;">' + _absentAdjustment_cnt + '</td>' +
                            '<td style="text-align:Center;' + _absent_style + '">' + _absentDeduction + '</td>' +

                            '<td style="text-align:Center;">' + (employeeFilter[row_cnt_filter]["remarks"] != null ? employeeFilter[row_cnt_filter]["remarks"] : '') + '</td>' +
                            '</tr>';

                    }

                    rowdata += '</tbody">';


                    if (parseFloat(_absentDeduction_total) > 0) { _absent_style = 'color:Red;'; } else { _absent_style = ''; }

                    rowdata += '<tfooter">';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<td style="font-weight:bold;text-align:right;" colspan=3 >Total : </td>' +
                        '<td style="text-align:Center;">' + _absent_cnt_total + '</td>' +
                        '<td style="text-align:Center;">' + _absentAdjustment_cnt_total + '</td>' +
                        '<td style="text-align:Center;'+_absent_style+'">' + _absentDeduction_total + ' </td>' +
                        '<td style="text-align:Center;"></td>'
                    rowdata += '</tfooter">';
                }
                rowdata += '</table>';

                detailsTable.append(rowdata);
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
