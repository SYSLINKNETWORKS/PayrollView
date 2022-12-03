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
        url: ApiForm + '/v1/PayrollReport/OverTime',
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
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>OverTime Sheet Report</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Date from : ' + moment(response.data["dateFrom"]).format("DD-MMM-YYYY") + ' to : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY") + ' </th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '</thead>';


                const department_1 = response.data["timeSheetViewModels"];
                var department = [];
                for (i = 0; i < department_1.length; i++) {
                    if (department.findIndex(x => x._nam == department_1[i].departmentName) == -1) {
                        department.push({ _nam: department_1[i].departmentName });
                    }
                }
                department.sort((a, b) => (a._nam > b._nam) ? 1 : -1);


                for (var row_cnt = 0; row_cnt < department.length; row_cnt++) {
                    var sno = 1;

                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th style="text-align:Center;vertical-align:middle;">SNo.</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Employee</th>' +
                        '<th style="text-align:Center;">Late Coming Min</th>' +
                        '<th style="text-align:Center;">Late Coming Hrs</th>' +
                        '<th style="text-align:Center;">Early Going Min</th>' +
                        '<th style="text-align:Center;">Early Going Hrs</th>' +
                        '<th style="text-align:Center;">Over Time Min</th>' +
                        '<th style="text-align:Center;">Over Time Hrs</th>' +
                        '<th style="text-align:Center;">Night Over Time Min</th>' +
                        '<th style="text-align:Center;">Night Over Time Hrs</th>' +
                        '<th style="text-align:Center;">Early O.T Min</th>' +
                        '<th style="text-align:Center;">Early O.T Hrs</th>' +
                        '<th style="text-align:Center;">Total O.T Hrs</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Working Hours</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Worked Hours</th>' +
                        '</tr>';
                    rowdata += '<tr>' +
                        '<th style="text-align:left;" colspan="8">' + department[row_cnt]._nam + '</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    rowdata += '<tbody">';



                    const DepartmentFilter = response.data["timeSheetViewModels"].filter(d => d.departmentName == department[row_cnt]._nam);
                    var employeeArray = [];
                    for (i = 0; i < DepartmentFilter.length; i++) {
                        if (employeeArray.findIndex(x => x._id == DepartmentFilter[i].employeeId) == -1) {
                            employeeArray.push({ _id: DepartmentFilter[i].employeeId, _nam: DepartmentFilter[i].employeeName });
                        }
                    }
                    employeeArray.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

                    var _late_coming = 0, _late_coming_total = 0, _Late_style = '',
                        _early_going = 0, _early_going_total = 0, _early_going_style = '',
                        _over_time = 0, _over_time_total = 0, _over_time_style = '',
                        _nightover_time = 0, _nightover_time_total = 0,
                        _early_ot = 0, _early_ot_total = 0, _early_ot_style = '',
                        _totalOverTime = 0, _totalOverTime_total = 0, _totalOverTime_style = '',
                        _working_hrs = 0, _working_hrs_total = 0, _work_hrs_style = '',
                        _roster_hrs = 0, _roster_hrs_total = 0;

                    for (var row_cnt_Array = 0; row_cnt_Array < employeeArray.length; row_cnt_Array++) {
                        const employeeFilter = response.data["timeSheetViewModels"].filter(d => d.employeeId == employeeArray[row_cnt_Array]._id);

                        _late_coming = 0;
                        _early_going = 0;
                        _over_time = 0;
                        _nightover_time = 0;
                        _early_ot = 0;
                        _totalOverTime = 0;
                        _working_hrs = 0;
                        _roster_hrs = 0;

                        for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                            _late_coming += parseFloat(employeeFilter[row_cnt_filter]["lateComing"]);
                            _late_coming_total += parseFloat(employeeFilter[row_cnt_filter]["lateComing"]);

                            _early_going += parseFloat(employeeFilter[row_cnt_filter]["earlyGoing"]);
                            _early_going_total += parseFloat(employeeFilter[row_cnt_filter]["earlyGoing"]);

                            _over_time += parseFloat(employeeFilter[row_cnt_filter]["overTime"]);
                            _over_time_total += parseFloat(employeeFilter[row_cnt_filter]["overTime"]);

                            _nightover_time += parseFloat(employeeFilter[row_cnt_filter]["overTimeNight"]);
                            _nightover_time_total += parseFloat(employeeFilter[row_cnt_filter]["overTimeNight"]);

                            _early_ot += parseFloat(employeeFilter[row_cnt_filter]["earlyOverTime"]);
                            _early_ot_total += parseFloat(employeeFilter[row_cnt_filter]["earlyOverTime"]);

                            _totalOverTime += parseFloat(employeeFilter[row_cnt_filter]["totalOverTime"]);
                            _totalOverTime_total += parseFloat(employeeFilter[row_cnt_filter]["totalOverTime"]);

                            _working_hrs += parseFloat(employeeFilter[row_cnt_filter]["workingHours"]);
                            _working_hrs_total += parseFloat(employeeFilter[row_cnt_filter]["workingHours"]);

                            _roster_hrs += parseFloat(employeeFilter[row_cnt_filter]["rosterWorkingHours"]);
                            _roster_hrs_total += parseFloat(employeeFilter[row_cnt_filter]["rosterWorkingHours"]);
                        }
                        var sessidTimeSheetDetail = employeeFilter[0]["employeeId"];//  sno+ moment(new Date()).format("DDMMYYYYHHMMSS");

                        var creTimeSheetDetail = '{"dateFrom": "' + response.data["dateFrom"] + '","dateTo":"' + response.data["dateTo"] + '","employeeId":"' + employeeFilter[0]["employeeId"] + '","branchId":"","officeWorker":"","TemporaryPermanent":"","designationId":"","departmentId":"","gender":""}';

                        sessionStorage.setItem(sessidTimeSheetDetail, creTimeSheetDetail);

                        if (parseFloat(_late_coming) > 0) { _Late_style = 'color:red;'; }
                        else { _Late_style = ''; }

                        if (parseFloat(_early_going) > 0) { _early_going_style = 'color:fuchsia;'; }
                        else { _early_going_style = ''; }

                        if (parseFloat(_over_time) > 0) { _over_time_style = 'color:blue;'; }
                        else { _over_time_style = ''; }

                        if (parseFloat(_early_ot) > 0) { _early_ot_style = 'color:chocolate;'; }
                        else { _early_ot_style = ''; }


                        if (parseFloat(_totalOverTime) > 0) { _totalOverTime_style = 'color:blue;'; } else if (parseFloat(_totalOverTime) < 0) { _totalOverTime_style = 'color:Red;'; } else { _totalOverTime_style = ''; }

                        if (parseFloat(_roster_hrs - _working_hrs) > 0) { _work_hrs_style = 'color:red;'; }
                        else if (parseFloat(_roster_hrs - _working_hrs) < 0) { _work_hrs_style = 'color:blue;'; }
                        else { _work_hrs_style = ''; }

                        rowdata += '<tr>' +

                            '<td style="text-align:Center;">' + sno++ + '</td>' +
                            '<td style="text-align:left;"><span style="cursor:pointer;color:blue;"  onclick="viewTimeSheetDetail(\'' + sessidTimeSheetDetail + '\')">' + employeeFilter[0]["employeeName"] + '</span></td>' +
                            '<td style="text-align:Center;' + _Late_style + '">' + _late_coming + '</td>' +
                            '<td style="text-align:Center;' + _Late_style + '">' + parseFloat(_late_coming / 60).toFixed(2) + '</td>' +
                            '<td style="text-align:Center;' + _early_going_style + '">' + _early_going + '</td>' +
                            '<td style="text-align:Center;' + _early_going_style + '">' + parseFloat(_early_going / 60).toFixed(2) + '</td>' +
                            '<td style="text-align:Center;' + _over_time_style + '">' + _over_time + ' </td>' +
                            '<td style="text-align:Center;' + _over_time_style + '">' + parseFloat(_over_time / 60).toFixed(2) + ' </td>' +
                            '<td style="text-align:Center;' + _over_time_style + '">' + _nightover_time + ' </td>' +
                            '<td style="text-align:Center;' + _over_time_style + '">' + parseFloat(_nightover_time / 60).toFixed(2) + ' </td>' +
                            '<td style="text-align:Center;' + _early_ot_style + '">' + _early_ot + '</td>' +
                            '<td style="text-align:Center;' + _early_ot_style + '">' + parseFloat(_early_ot / 60).toFixed(2) + '</td>' +
                            '<td style="text-align:Center;' + _totalOverTime_style + '">' + parseFloat(_totalOverTime / 60).toFixed(2) + '</td>' +
                            '<td style="text-align:Center;">' + parseFloat(_roster_hrs) + '</td>' +
                            '<td style="text-align:Center;' + _work_hrs_style + '">' + parseFloat(_working_hrs).toFixed(2) + '</td>' +
                            '</tr>';
                    }
                    rowdata += '<tfooter">';
                    if (parseFloat(_late_coming_total) > 0) { _Late_style = 'color:red;'; } else { _Late_style = ''; }
                    if (parseFloat(_early_going_total) > 0) { _early_going_style = 'color:fuchsia;'; } else { _early_going_style = ''; }
                    if (parseFloat(_over_time_total) > 0) { _over_time_style = 'color:blue;'; } else { _over_time_style = ''; }
                    if (parseFloat(_early_ot_total) > 0) { _early_ot_style = 'color:chocolate;'; } else { _early_ot_style = ''; }

                    if (parseFloat(_totalOverTime_total) > 0) { _totalOverTime_style = 'color:blue;'; } else if (parseFloat(_totalOverTime_total) < 0) { _totalOverTime_style = 'color:Red;'; } else { _totalOverTime_style = ''; }

                    if (parseFloat(_roster_hrs_total - _working_hrs_total) > 0) { _work_hrs_style = 'color:red;'; }
                    else if (parseFloat(_roster_hrs_total - _working_hrs_total) < 0) { _work_hrs_style = 'color:blue;'; }
                    else { _work_hrs_style = ''; }

                    rowdata += '<tr style="font-weight:bold;">' +
                        '<td style="font-weight:bold;text-align:right;" colspan=2 >Total : </td>' +
                        '<td style="text-align:Center;' + _Late_style + '">' + _late_coming_total + '</td>' +
                        '<td style="text-align:Center;' + _Late_style + '">' + parseFloat(_late_coming_total / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;' + _early_going_style + '">' + _early_going_total + '</td>' +
                        '<td style="text-align:Center;' + _early_going_style + '">' + parseFloat(_early_going_total / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;' + _over_time_style + '">' + _over_time_total + ' </td>' +
                        '<td style="text-align:Center;' + _over_time_style + '">' + parseFloat(_over_time_total / 60).toFixed(2) + ' </td>' +
                        '<td style="text-align:Center;' + _over_time_style + '">' + _nightover_time_total + ' </td>' +
                        '<td style="text-align:Center;' + _over_time_style + '">' + parseFloat(_nightover_time_total / 60).toFixed(2) + ' </td>' +
                        '<td style="text-align:Center;' + _early_ot_style + '">' + _early_ot_total + '</td>' +
                        '<td style="text-align:Center;' + _early_ot_style + '">' + parseFloat(_early_ot_total / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;' + _totalOverTime_style + '">' + parseFloat(_totalOverTime_total / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;">' + parseFloat(_roster_hrs_total) + '</td>' +
                        '<td style="text-align:Center;' + _work_hrs_style + '">' + parseFloat(_working_hrs_total).toFixed(2) + '</td>' +
                        '</tr>';
                    rowdata += '</tfooter">';
                }
                rowdata += '</tbody">';
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

function viewTimeSheetDetail(sessidTimeSheetDetail) {
    window.open(apiUrl_View + '/Payroll/Report/OverTimeDetail?S=' + sessidTimeSheetDetail, '_blank');

}