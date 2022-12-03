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
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>OverTime Sheet Detail Report</th></tr>';
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
                        '<th style="text-align:Center;vertical-align:middle;">Attandance Date</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Roster</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Late</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Early</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">OT</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Inn Time</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Out Time</th>' +
                        '<th style="text-align:Center;">Late Coming<br/>Min/Hrs</th>' +
                        '<th style="text-align:Center;">Early Going<br/>Min/Hrs</th>' +
                        '<th style="text-align:Center;">Over Time<br/>Min/Hrs</th>' +
                        '<th style="text-align:Center;">Night Over Time<br/>Min/Hrs</th>' +
                        '<th style="text-align:Center;">Early O.T<br/>Min/Hrs</th>' +
                        '<th style="text-align:Center;">Total O.T<br/>Min/Hrs</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Working Hours</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Remarks</th>' +
                        '</tr>';

                    rowdata += '<tr>' +
                        '<th style="font-weight:bold;" colspan=1>Employee No</th>' +
                        '<th style="text-align:Left;" colspan=12>' + employeeFilter[0]["employeeNo"] + '</th>' +
                        '<th style="font-weight:bold;text-align:Right;" colspan=2>Designation : </th>' +
                        '<th style="text-align:Left;" colspan=5>' + employeeFilter[0]["designationName"] + '</th>' +
                        '</tr>';
                    rowdata += '<tr>' +
                        '<th style="font-weight:bold;" colspan=1>Employee Name:</th>' +
                        '<th  style="text-align:Left;" colspan=12>' + employeeFilter[0]["employeeName"] + '</th>' +
                        '<th style="font-weight:bold;text-align:Right;" colspan=2>Department : </th>' +
                        '<th style="text-align:Left;" colspan=5>' + employeeFilter[0]["departmentName"] + '</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    var sno = 1;
                    var _late_coming = 0, _late_coming_total = 0, _Late_style = '',
                        _early_going = 0, _early_going_total = 0, _early_going_style = '',
                        _over_time = 0, _over_time_total = 0, _over_time_style = '',
                        _nightover_time = 0, _nightover_time_total = 0,
                        _early_ot = 0, _early_ot_total = 0, _early_ot_style = '',
                        _totalOverTime = 0, _totalOverTime_total = 0, _totalOverTime_style = '',
                        _totalOverTimeNight = 0, _totalOverTimeNight_total = 0,
                        _working_hrs = 0, _working_hrs_total = 0, _work_hrs_style = '',
                        _roster_hrs = 0, _roster_hrs_total = 0, _remarks_style = '';

                    for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                        _late_coming = parseFloat(employeeFilter[row_cnt_filter]["lateComing"]);
                        _late_coming_hrs = parseFloat(_late_coming / 60).toFixed(2);
                        _late_coming_total += parseFloat(_late_coming);

                        _early_going = parseFloat(employeeFilter[row_cnt_filter]["earlyGoing"]);
                        _early_going_hrs = parseFloat(_early_going / 60).toFixed(2);
                        _early_going_total += parseFloat(_early_going);

                        _over_time = parseFloat(employeeFilter[row_cnt_filter]["overTime"]);
                        _over_time_hrs = parseFloat(_over_time / 60).toFixed(2);
                        _over_time_total += parseFloat(_over_time);

                        _nightover_time = parseFloat(employeeFilter[row_cnt_filter]["overTimeNight"]);
                        _nightover_time_hrs = parseFloat(_nightover_time / 60).toFixed(2);
                        _nightover_time_total += parseFloat(_nightover_time);

                        
                        _early_ot = parseFloat(employeeFilter[row_cnt_filter]["earlyOverTime"]);
                        _early_ot_hrs = parseFloat(_early_ot / 60).toFixed(2);
                        _early_ot_total += parseFloat(_early_ot);

                        _totalOverTime += parseFloat(employeeFilter[row_cnt_filter]["totalOverTime"]);
                        _working_hrs += parseFloat(employeeFilter[row_cnt_filter]["workingHours"]);
                        _roster_hrs += parseFloat(employeeFilter[row_cnt_filter]["rosterWorkingHours"]);


                        if (parseFloat(_late_coming) > 0) { _Late_style = 'color:red;'; }
                        else { _Late_style = ''; }

                        if (parseFloat(_early_going) > 0) { _early_going_style = 'color:fuchsia;'; }
                        else { _early_going_style = ''; }

                        if (parseFloat(_over_time) > 0) { _over_time_style = 'color:blue;'; }
                        else { _over_time_style = ''; }

                        if (parseFloat(_early_ot) > 0) { _early_ot_style = 'color:chocolate;'; }
                        else { _early_ot_style = ''; }


                        if (parseFloat(_totalOverTime) > 0) { _totalOverTime_style = 'color:blue;'; } else if (parseFloat(_totalOverTime) < 0) { _totalOverTime_style = 'color:Red;'; } else { _totalOverTime_style = ''; }

                        if (parseFloat(employeeFilter[row_cnt_filter]["rosterWorkingHours"] - employeeFilter[row_cnt_filter]["workingHours"]) > 0) { _work_hrs_style = 'color:red;'; }
                        else if (parseFloat(employeeFilter[row_cnt_filter]["rosterWorkingHours"] - employeeFilter[row_cnt_filter]["workingHours"]) < 0) { _work_hrs_style = 'color:blue;'; }
                        else { _work_hrs_style = ''; }

                        if (Boolean( employeeFilter[row_cnt_filter]["absentCheck"])) { _remarks_style = 'color:red;'; } else { _remarks_style = '' }
                        rowdata += '<tbody">';


                        rowdata += '<tr style="font-size:7pt;">' +
                            '<td style="text-align:Center;">' + sno++ + '</td>' +
                            '<td style="text-align:Center;">' + moment(employeeFilter[row_cnt_filter]["dailyDate"]).format("ddd DD-MMM-YYYY") + '</td>' +
                            '<td style="text-align:Center;">' + (employeeFilter[row_cnt_filter]["rosterInn"] != null ? moment(employeeFilter[row_cnt_filter]["rosterInn"]).format("LT") + '-' + moment(employeeFilter[row_cnt_filter]["rosterOut"]).format("LT") : '-') + '</td>' +
                            ///                            '<td>' + (employeeFilter[row_cnt_filter]["rosterInn"] != null ? moment(employeeFilter[row_cnt_filter]["rosterInn"]).format("DD-MMM-YYYY HH:MM") + '-' + moment(employeeFilter[row_cnt_filter]["rosterOut"]).format("DD-MMM-YYYY HH:MM") : '-') + '</td>' +

                            '<td style="text-align:Center;">' + employeeFilter[row_cnt_filter]["rosterLate"] + '</td>' +
                            '<td style="text-align:Center;">' + employeeFilter[row_cnt_filter]["rosterEarly"] + '</td>' +
                            '<td style="text-align:Center;">' + employeeFilter[row_cnt_filter]["rosterOverTime"] + '</td>' +
                            '<td style="text-align:Center;">' + (employeeFilter[row_cnt_filter]["innTime"] != null ? moment(employeeFilter[row_cnt_filter]["innTime"]).format("LT") : '') + '</td>' +
                            '<td style="text-align:Center;">' + (employeeFilter[row_cnt_filter]["outTime"] != null ? moment(employeeFilter[row_cnt_filter]["outTime"]).format("LT") : '') + '</td>' +
                            '<td style="text-align:Center;' + _Late_style + '">' + _late_coming + '/' + _late_coming_hrs + '</td>' +
                            '<td style="text-align:Center;' + _early_going_style + '">' + _early_going + '/' + _early_going_hrs + '</td>' +
                            '<td style="text-align:Center;' + _over_time_style + '">' + _over_time + '/' + _over_time_hrs + '</td>' +
                            '<td style="text-align:Center;' + _over_time_style + '">' + _nightover_time + '/' + _nightover_time_hrs + '</td>' +
                            '<td style="text-align:Center;' + _early_ot_style + '">' + employeeFilter[row_cnt_filter]["earlyOverTime"] + '</td>' +
                            '<td style="text-align:Center;' + _totalOverTime_style + '">' + employeeFilter[row_cnt_filter]["totalOverTime"] + '</td>' +
                            '<td style="text-align:Center;' + _work_hrs_style + '">' + employeeFilter[row_cnt_filter]["workingHours"] + '/' + employeeFilter[row_cnt_filter]["rosterWorkingHours"] + '</td>' +
                            '<td style="text-align:Center;'+_remarks_style+'">' + (employeeFilter[row_cnt_filter]["remarks"] != null ? employeeFilter[row_cnt_filter]["remarks"] : '') + '</td>' +
                            '</tr>';

                    }

                    rowdata += '</tbody">';

                    if (parseFloat(_late_coming_total) > 0) { _Late_style = 'color:red;'; } else { _Late_style = ''; }
                    if (parseFloat(_early_going_total) > 0) { _early_going_style = 'color:fuchsia;'; } else { _early_going_style = ''; }
                    if (parseFloat(_over_time_total) > 0) { _over_time_style = 'color:blue;'; } else { _over_time_style = ''; }
                    if (parseFloat(_early_ot_total) > 0) { _early_ot_style = 'color:chocolate;'; } else { _early_ot_style = ''; }

                    if (parseFloat(_totalOverTime_total) > 0) { _totalOverTime_style = 'color:blue;'; } else if (parseFloat(_totalOverTime_total) < 0) { _totalOverTime_style = 'color:Red;'; } else { _totalOverTime_style = ''; }

                    if (parseFloat(_roster_hrs - _working_hrs) > 0) { _work_hrs_style = 'color:red;'; }
                    else if (parseFloat(_roster_hrs - _working_hrs) < 0) { _work_hrs_style = 'color:blue;'; }
                    else { _work_hrs_style = ''; }


                    rowdata += '<tfooter">';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<td style="font-weight:bold;text-align:right;" colspan=8 >Total : </td>' +
                        '<td style="text-align:Center;' + _Late_style + '">' + _late_coming_total + '/' + parseFloat(_late_coming_total / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;' + _early_going_style + '">' + _early_going_total + '/' + parseFloat(_early_going_total / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;' + _over_time_style + '">' + _over_time_total + '/' + parseFloat(_over_time_total / 60).toFixed(2) + ' </td>' +
                        '<td style="text-align:Center;' + _over_time_style + '">' + _nightover_time_total + '/' + parseFloat(_nightover_time_total / 60).toFixed(2) + ' </td>' +
                        '<td style="text-align:Center;' + _early_ot_style + '">' + _early_ot_total + '/' + + parseFloat(_early_ot_total / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;' + _totalOverTime_style + '">' + _totalOverTime + '/' + + parseFloat(_totalOverTime / 60).toFixed(2) + '</td>' +
                        '<td style="text-align:Center;' + _work_hrs_style + '">' + parseFloat(_working_hrs).toFixed(2) + '/' + parseFloat(_roster_hrs) + '</td>' +
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
