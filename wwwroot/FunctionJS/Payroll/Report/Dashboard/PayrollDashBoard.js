var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var imgboxtotalstrength = $("#img_box_total_strength");
var imgboxtotalpresent = $("#img_box_total_present");
var imgboxtotalabsent = $("#img_box_total_absent");
var imgboxtotallate = $("#img_box_total_late");
var imgpresentgraph = $("#img_present_graph");
var imgabsentgraph = $("#img_absent_graph");
var imglategraph = $("#img_late_graph");

var txtDate = $("#txt_Date");
var txtDataUnApproval = $("#txt_DataUnApproval");
var txtDataApproval = $("#txt_DataApproval");
var imgtotalinout = $("#img_totalinout");
var imgtotalinOutAppoved = $("#img_total_inOut_Appoved");
var imgtotalinOutPending = $("#img_total_inOut_Pending")


var ApiForm = '';


$(function () {
    txtDate.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtDataUnApproval.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtDataApproval.datetimepicker({ format: 'DD/MMM/YYYY' });
});


$(document).ready(function () {
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtDate.find("input").val(CurrentDate);
    txtDataUnApproval.find("input").val(CurrentDate);
    txtDataApproval.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Payroll/v1/PayrollDashboard';

    CallNotification('Attendance');
    CallNotificationAttendanceMachine('AttendanceMachine');


    imgboxtotalstrength.hide();

    imgboxtotalpresent.hide();
    imgboxtotalabsent.hide();
    imgboxtotallate.hide();

    imgpresentgraph.hide();
    imgabsentgraph.hide();
    imglategraph.hide();

    imgtotalinout.hide();
    imgtotalinOutAppoved.hide();
    imgtotalinOutPending.hide();

    GetRecord();
});


function GetRecord() {
    GetAttendance();
    TotalInOut();
    TotalInOutMap();
}
// Fill Total Strength Start 
function TotalStrength() {
    var txtbox_total_strength = $("#box_total_strength");

    $.ajax({

        url: ApiForm + '/TotalStrength/',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + strkey
        },
        beforeSend: function () {
            imgboxtotalstrength.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                txtbox_total_strength.html(response["data"]);
                imgboxtotalstrength.hide();
                return true;
            }
            else {
                imgboxtotalstrength.hide();
            }

        },
        error: function (xhr, status, err) {
            imgboxtotalstrength.hide();
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
// Fill Total Strength  End 

//Get Attendance Start
function GetAttendance() {
    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
    var txtbox_total_strength = $("#box_total_strength");
    $.ajax({
        url: ApiForm + '/GetAttendance',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: '{"date": "' + txtDate1 + '"}',
        headers: {
            'Authorization': 'Bearer ' + strkey
        },
        beforeSend: function () {
            imgboxtotalstrength.show();
            imgboxtotalpresent.show();
            imgboxtotalabsent.show();
            imgboxtotallate.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                txtbox_total_strength.html(response["data"]["totalStrength"]);


                Machineinfo(response["data"]["attendanceMachineInfos"]);
                TotalPresent(response["data"]["present"]);
                TotalAbsent(response["data"]["absent"]);
                TotalLate(response["data"]["late"]);

                imgboxtotalstrength.hide();
                imgboxtotalpresent.hide();
                imgboxtotalabsent.hide();
                imgboxtotallate.hide();
            }
            else {
                imgboxtotalstrength.hide();
                imgboxtotalpresent.hide();
                imgboxtotalabsent.hide();
                imgboxtotallate.hide();
            }
        },
        error: function (xhr, status, err) {
            imgboxtotalstrength.hide();
            imgboxtotalpresent.hide();
            imgboxtotalabsent.hide();
            imgboxtotallate.hide();
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
// Get Attendance End

// Fill Total Present Start 
function TotalPresent(presentResponse) {

    var _xDepartmentPresent = [[,], [,]];
    var _yEmployeePresent = [[,], [,]];

    //var imgtotalpresent = $("#img_totalpresent");
    var tbltotalpresent = $("#tbl_totalpresent");
    var spntotalpresent = $("#spn_totalpresent");
    var boxtotalpresent = $("#box_total_present");
    var _employeecnt = 0, _departmentcnt = 0;


    tbltotalpresent.empty();

    boxtotalpresent.html(presentResponse.length);
    spntotalpresent.text(presentResponse.length);
    imgboxtotalpresent.hide();
    const vchno_1 = presentResponse;
    var vchno = [];
    for (i = 0; i < vchno_1.length; i++) {
        if (vchno.findIndex(x => x._id == vchno_1[i].departmentId) == -1) {
            vchno.push({ _id: vchno_1[i].departmentId, _nam: vchno_1[i].departmentName });
        }
    }

    vchno.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

    var Row_totalpresent = '';
    Row_totalpresent = '<thead style="color: rgb(128, 128, 128);">';
    Row_totalpresent += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Name</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Category</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Machine</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Time INN</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Time Out</th></tr>';
    Row_totalpresent += '</thead>';
    Row_totalpresent += '<tbody>';

    if (vchno.length > 0) {
        for (var row_cnt = 0; row_cnt < vchno.length; row_cnt++) {
            const _transaction = presentResponse.filter(d => d.departmentId == vchno[row_cnt]["_id"]);

            Row_totalpresent += '<tr><td colspan="5" style="font-weight: bold;">' + _transaction[0]["departmentName"] + '</td></tr>';
            _employeecnt = 0;
            for (var i = 0; i < _transaction.length; i++) {
                var outtime = '', style = '';
                if (_transaction[i]["outTime"] != null) {
                    outtime = moment(_transaction[i]["outTime"]).format("LT");
                }
                else { style = "background-color:Gray"; }
                Row_totalpresent += '<tr>' +
                    '<td>' + _transaction[i]["employeeName"] + '</td>' +
                    '<td>' + _transaction[i]["designationName"] + '</td>' +
                    '<td>' + _transaction[i]["attendanceMachineName"] + '</td>' +
                    '<td>' + moment(_transaction[i]["innTime"]).format("LT") + '</td>' +
                    '<td style=' + style + '>' + outtime + '</td>' +
                    '</tr>';

            }
            _xDepartmentPresent[row_cnt] = [row_cnt, _transaction[0]["departmentName"]];
            _yEmployeePresent[row_cnt] = [row_cnt, _transaction.length];

        }
        Row_totalpresent += '</tbody>';
        tbltotalpresent.append(Row_totalpresent);

        PresentDepartWiseGraph(_xDepartmentPresent, _yEmployeePresent);
    }
    imgboxtotalpresent.hide();


}
// Fill Total Present End

// Fill Total Late Start 
function TotalLate(LateResponse) {

    var _xDepartmentLate = [[,], [,]];
    var _yEmployeeLate = [[,], [,]];


    var tbltotallate = $("#tbl_totallate");
    var boxtotallate = $("#box_total_late");
    var spntotallate = $("#spn_totallate");

    tbltotallate.empty();

    boxtotallate.html(LateResponse.length);
    spntotallate.text(LateResponse.length);
    const vchno_1 = LateResponse;
    var vchno = [];
    for (i = 0; i < vchno_1.length; i++) {
        if (vchno.findIndex(x => x._id == vchno_1[i].departmentId) == -1) {
            vchno.push({ _id: vchno_1[i].departmentId, _nam: vchno_1[i].departmentName });
        }
    }

    vchno.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
    var Row_totallate = '';
    Row_totallate = '<thead style="color: rgb(128, 128, 128);">';
    Row_totallate += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Name</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Time IN</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Mins</th></tr>';
    Row_totallate += '</thead>';
    Row_totallate += '<tbody>';
    if (vchno.length > 0) {
        for (var row_cnt = 0; row_cnt < vchno.length; row_cnt++) {
            const _transaction = LateResponse.filter(d => d.departmentId == vchno[row_cnt]["_id"]);
            Row_totallate += '<tr><td colspan="4" style="font-weight: bold;">' + _transaction[0]["departmentName"] + '</td></tr>';


            for (var i = 0; i < _transaction.length; i++) {

                Row_totallate += '<tr>' +
                    '<td>' + _transaction[i]["employeeName"] + '</td>' +
                    '<td>' + moment(_transaction[i]["innTime"]).format("LT") + '</td>' +
                    '<td>' + _transaction[i]["lateMinutes"] + '</td>' +
                    '</tr>';
            }
            _xDepartmentLate[row_cnt] = [row_cnt, _transaction[0]["departmentName"]];
            _yEmployeeLate[row_cnt] = [row_cnt, _transaction.length];

        }
        Row_totallate += '</tbody>';
        tbltotallate.append(Row_totallate);
        LateDepartWiseGraph(_xDepartmentLate, _yEmployeeLate);
    }
    imgboxtotallate.hide();

}
// Fill Total Late End


// Fill Total Absent Start 
function TotalAbsent(AbsentResponse) {

    var _yEmployeeabsent = [[,], [,]];
    var _xDepartmentabsent = [[,], [,]];


    var tbltotalabsent = $("#tbl_totalabsent");
    var spntotalabsent = $("#spn_totalabsent");
    var boxtotalabsent = $("#box_total_absent");
    var tblabsentgraph = $("#tbl_absent_graph");
    var txtspnlatetbl = $("#spn_absent_tbl");

    tbltotalabsent.empty();
    tblabsentgraph.empty();


    boxtotalabsent.html(AbsentResponse.length);
    spntotalabsent.text(AbsentResponse.length);
    const vchno_1 = AbsentResponse;
    var vchno = [];
    for (i = 0; i < vchno_1.length; i++) {
        if (vchno.findIndex(x => x._id == vchno_1[i].departmentId) == -1) {
            vchno.push({ _id: vchno_1[i].departmentId, _nam: vchno_1[i].departmentName });
        }
    }

    vchno.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

    var Row_totalabsent = '';
    Row_totalabsent = '<thead style="color: rgb(128, 128, 128);">';
    Row_totalabsent += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Name</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Remarks</th></tr>';
    Row_totalabsent += '</thead>';
    Row_totalabsent += '<tbody>';

    if (vchno.length > 0) {
        var sno = 0;
        for (var row_cnt = 0; row_cnt < vchno.length; row_cnt++) {
            const _transaction = AbsentResponse.filter(d => d.departmentId == vchno[row_cnt]["_id"]);

            Row_totalabsent += '<tr><td colspan="4" style="font-weight: bold;">' + _transaction[0]["departmentName"] + '</td></tr>';

            for (var i = 0; i < _transaction.length; i++) {
                sno += 1;
                Row_totalabsent += '<tr>' +
                    '<td>' + _transaction[i]["employeeName"] + '</td>' +
                    '<td>' + _transaction[i]["remarks"] + '</td>' +
                    '</tr>';

            }
            _yEmployeeabsent[row_cnt] = [row_cnt, _transaction.length];
            _xDepartmentabsent[row_cnt] = [row_cnt, _transaction[0]["departmentName"]];

        }
        Row_totalabsent += '</tbody>';
        tbltotalabsent.append(Row_totalabsent);

        AbsentDepartWiseGraph(_xDepartmentabsent, _yEmployeeabsent);
    }
    imgboxtotalabsent.hide();

}
// Fill Total Absent  End 

//Present Department Wise Start
function PresentDepartWiseGraph(_xDepartmentPresent, _yEmployeePresent) {

    var tblpresentgraph = $("#tbl_present_graph");
    var txtspnpresenttbl = $("#spn_present_tbl");
    // var txtspntotalpresentchart = $("#spn_totalpresent_chart");
    tblpresentgraph.empty();

    imgpresentgraph.hide();
    var total = 0;
    // txtspntotalpresentchart.text(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));

    var Row_tblpresentgraph = '';

    //Heading
    Row_tblpresentgraph = '<thead style="color: rgb(128, 128, 128);">';
    Row_tblpresentgraph += '<tr>';
    Row_tblpresentgraph += '<th scope="col" style="width:30%;padding-top: 4%;text-align:left">Department</th>';
    Row_tblpresentgraph += '<th scope="col" style="width:30%;padding-top: 4%;text-align:left">Total</th>';
    Row_tblpresentgraph += '</tr>';
    Row_tblpresentgraph += '</thead>';
    Row_tblpresentgraph += '<tbody>';

    for (var i = 0; i < _xDepartmentPresent.length; i++) {

        Row_tblpresentgraph += '<tr>' +
            '<td>' + _xDepartmentPresent[i][1] + '</td>' +
            '<td>' + _yEmployeePresent[i][1] + '</td>' +
            '</tr>';

    }

    Row_tblpresentgraph += '</tbody>';
    txtspnpresenttbl.text(_xDepartmentPresent.length);
    tblpresentgraph.append(Row_tblpresentgraph);
    Presentchart(_xDepartmentPresent, _yEmployeePresent);
    // ChartsFlotcharts.initCharts();

    //Chart End
    imgpresentgraph.hide();

}
//Present Department Wise End

//Late Department Wise Start
function LateDepartWiseGraph(_xDepartmentLate, _yEmployeeLate) {
    var tbllategraph = $("#tbl_late_graph");
    var txtspnlatetbl = $("#spn_late_tbl");
    //var txtspntotallatechart = $("#spn_totallate_chart");
    tbllategraph.empty();


    imglategraph.hide();

    var total = 0;


    var Row_tbllategraph = '';

    //Heading
    Row_tbllategraph = '<thead style="color: rgb(128, 128, 128);">';
    Row_tbllategraph += '<tr>';
    Row_tbllategraph += '<th scope="col" style="width:30%;padding-top: 4%;text-align:left">Department</th>';
    Row_tbllategraph += '<th scope="col" style="width:30%;padding-top: 4%;text-align:left">Total</th>';
    Row_tbllategraph += '</tr>';
    Row_tbllategraph += '</thead>';
    Row_tbllategraph += '<tbody>';

    for (var i = 0; i < _xDepartmentLate.length; i++) {
        Row_tbllategraph += '<tr>' +
            '<td>' + _xDepartmentLate[i][1] + '</td>' +
            '<td>' + _yEmployeeLate[i][1] + '</td>' +
            '</tr>';
    }
    Row_tbllategraph += '</tbody>';
    txtspnlatetbl.text(_xDepartmentLate.length);
    tbllategraph.append(Row_tbllategraph);
    Latechart(_xDepartmentLate, _yEmployeeLate);
    //Chart End
    imglategraph.hide();

}
//Late Department Wise End

//Absent Department Wise Start
function AbsentDepartWiseGraph(_xDepartmentabsent, _yEmployeeabsent) {

    var tblabsentgraph = $("#tbl_absent_graph");
    var txtspnlatetbl = $("#spn_absent_tbl");
    //var txtspntotallatechart = $("#spn_totalabsent_chart");
    tblabsentgraph.empty();


    imgabsentgraph.hide();
    // var yaxisdata = [[,], [,]];
    // var xaxisdata = [[,], [,]];
    var total = 0;
    // txtspntotallatechart.text(moment(response[0]["Result"][0]["Date"]).format("MMM-YYYY"));

    var Row_tblabsentgraph = '';

    //Heading
    Row_tblabsentgraph = '<thead style="color: rgb(128, 128, 128);">';
    Row_tblabsentgraph += '<tr>';
    Row_tblabsentgraph += '<th scope="col" style="width:30%;padding-top: 4%;text-align:left">Department</th>';
    Row_tblabsentgraph += '<th scope="col" style="width:30%;padding-top: 4%;text-align:left">Total</th>';
    Row_tblabsentgraph += '</tr>';
    Row_tblabsentgraph += '</thead>';
    Row_tblabsentgraph += '<tbody>';

    for (var i = 0; i < _xDepartmentabsent.length; i++) {
        Row_tblabsentgraph += '<tr>' +
            '<td>' + _xDepartmentabsent[i][1] + '</td>' +
            '<td>' + _yEmployeeabsent[i][1] + '</td>' +
            '</tr>';

    }
    Row_tblabsentgraph += '</tbody>';
    txtspnlatetbl.text(_xDepartmentabsent.length);
    tblabsentgraph.append(Row_tblabsentgraph);
    Absentchart(_xDepartmentabsent, _yEmployeeabsent);
    //Chart End
    imgabsentgraph.hide();





}
//Absent Department Wise End

//Present Chart Start
function Presentchart(_xDepartmentPresent, _yEmployeePresent) {
    var tbltotalpresentchart = $("#tbl_totalpresent_chart");

    $.plot(tbltotalpresentchart, [{
        data: _yEmployeePresent
    }

    ], {
        series: {
            bars: {
                show: true,
                barWidth: 0.5,
                align: "center",
                order: 1
            }
        },
        xaxis: {
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10,
            ticks: _xDepartmentPresent,
            tickLength: 1
        },
        grid: {
            hoverable: true,
        },
        tooltip: true,
        tooltipOpts: {
            cssClass: "flotTip",
            content: getTooltip,
            shifts: {
                x: 20,
                y: 0
            }
        },
        yaxis: {
            tickDecimals: 0
        }
    });
    function getTooltip(label, x, y) {
        return "" + _xDepartmentPresent[x][1];
    }
}
//Present Chart End

//Absent Chart Start
function Absentchart(_xDepartmentabsent, _yEmployeeabsent) {
    var tbltotalabsentchart = $("#tbl_totalabsent_chart");

    $.plot(tbltotalabsentchart, [{
        data: _yEmployeeabsent
    }

    ], {
        series: {
            bars: {
                show: true,
                barWidth: 0.5,
                align: "center",
                order: 1
            }
        },
        xaxis: {
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10,
            ticks: _xDepartmentabsent,
            tickLength: 1
        },
        grid: {
            hoverable: true,
        },
        tooltip: true,
        tooltipOpts: {
            cssClass: "flotTip",
            content: getTooltip,
            shifts: {
                x: 20,
                y: 0
            }
        },
        yaxis: {
            tickDecimals: 0
        }
    });
    function getTooltip(label, x, y) {
        return "" + _xDepartmentabsent[x][1];
    }
}
//Absent Chart End

//Late Chart Start
function Latechart(_xDepartmentLate, _yEmployeeLate) {
    var tbltotallatechart = $("#tbl_totallate_chart");

    $.plot(tbltotallatechart, [{
        data: _yEmployeeLate
    }

    ], {
        series: {
            bars: {
                show: true,
                barWidth: 0.5,
                align: "center",
                order: 1
            }
        },
        xaxis: {
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10,
            ticks: _xDepartmentLate,
            tickLength: 1
        },
        grid: {
            hoverable: true,
        },
        tooltip: true,
        tooltipOpts: {
            cssClass: "flotTip",
            content: getTooltip,
            shifts: {
                x: 20,
                y: 0
            }
        },
        yaxis: {
            tickDecimals: 0
        }
    });
    function getTooltip(label, x, y) {
        return "" + _xDepartmentLate[x][1];
    }
}
//Late Chart End

// Fill Total In-Out Start 
function TotalInOutMap() {
    var tbltotalinoutmap = $("#tbl_totalinoutmap");
    var spntotalinoutmap = $("#spn_totalinoutmap");
    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
    tbltotalinoutmap.empty();

    $.ajax({
        url: ApiForm + '/TotalInOutMap',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: '{"date": "' + txtDate1 + '"}',
        headers: {
            'Authorization': 'Bearer ' + strkey
        },
        beforeSend: function () {
            imgtotalinout.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                spntotalinoutmap.text(response["data"].length);
                // imgboxtotalpresent.hide();
                const vchno_1 = response["data"];
                var vchno = [];
                for (i = 0; i < vchno_1.length; i++) {
                    if (vchno.findIndex(x => x._id == vchno_1[i].departmentId) == -1) {
                        vchno.push({ _id: vchno_1[i].departmentId, _nam: vchno_1[i].departmentName });
                    }
                }

                vchno.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

                var Row_totalpresent = '';
                //<th scope="col" style="width:30%;padding-top: 4%;text-align:left">Date</th>
                Row_totalpresent = '<thead style="color: rgb(128, 128, 128);">';
                Row_totalpresent += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Name</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Category</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Map</th></tr>';
                Row_totalpresent += '</thead>';
                Row_totalpresent += '<tbody>';

                for (var row_cnt = 0; row_cnt < vchno.length; row_cnt++) {

                    const _transaction = response["data"].filter(d => d.departmentId == vchno[row_cnt]["_id"]);
                    Row_totalpresent += '<tr><td colspan="4" style="font-weight: bold;">' + _transaction[0]["departmentName"] + '</td></tr>';

                    for (var i = 0; i < _transaction.length; i++) {
                        var _employeeId = _transaction[i]["employeeId"];
                        var sessidInOutMap = _employeeId + moment(new Date()).format("DDMMYYYYHHMMSS");

                        cre = '{"date":"' + txtDate1 + '","machineId":"' + _transaction[i]["employeeNo"] + '"}';
                        sessionStorage.setItem(sessidInOutMap, cre);


                        var _date = moment(_transaction[i]["checkTime"]).format('YYYY-MM-DD');
                        Row_totalpresent += '<tr>' +
                            '<td>' + _transaction[i]["employeeName"] + '</td>' +
                            '<td>' + _transaction[i]["designationName"] + '</td>' +
                            // '<td>' + _date + '</td>' +
                            '<td><span style="cursor:pointer;color:blue;"  onclick="viewMapDetail(\'' + sessidInOutMap + '\')">Map</a></td>' +
                            '</tr>';
                    }
                }
                Row_totalpresent += '</tbody>';
                tbltotalinoutmap.append(Row_totalpresent);
                imgtotalinout.hide();
            } else {
                imgtotalinout.hide();
            }
        },
        error: function (xhr, status, err) {
            imgtotalinout.hide();
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
// Fill Total In-Out End
// Fill TotalInOut Start 
function TotalInOut() {
    //    var txtDataInout = $("#txt_DataInout").val();
    //    var txtDataInout = moment($("#txt_DataInout").val()).format("YYYY-MM-DD");
    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");

    $.ajax({
        url: apiUrl + '/api/Payroll/v1/InOutEditorApproval',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Menuid", _menuid);
            xhr.setRequestHeader("_DateFrom", txtDate1);
            xhr.setRequestHeader("_DateTo", txtDate1);
            imgtotalinOutAppoved.show();
        },

        success: function (response) {

            if (response.statusCode == 200) {
                $("#spn_totalinoutapp").text(response["data"]["inOutEditorGetApprovalDetailModels"].length);

                var action_button = "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";

                $('#tbl_totalinoutapp').DataTable().clear().destroy();
                detailsTableBody = $("#tbl_totalinoutapp").dataTable({
                    data: response["data"]["inOutEditorGetApprovalDetailModels"],
                    destroy: true,
                    retrieve: true,
                    paging: false,
                    columns: [
                        {
                            data: 'approved',
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return "<select id=ddl_approved class='ddl-approved'>" +
                                        "<option value=0>Unapproved</option>" +
                                        "<option value=1 selected>Approved</option>" +
                                        "</select>" + action_button;
                                }
                                else {
                                    return "<select id=ddl_approved class='ddl-approved'>" +
                                        "<option value=0 selected>Unapproved</option>" +
                                        "<option value=1>Approved</option>" +
                                        "</select>" + action_button;
                                }
                            }
                        },
                        {
                            data: 'employeeName',
                        },
                        {
                            data: 'checkTime',
                            type: 'date',
                            render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY HH:mm:ss') }
                        }


                    ],
                    "order": [[1, "asc"]],
                    //                        "pageLength": 10,

                });
                // //Approved Start
                // spntotalinoutapproved.text(response["data"].filter(d => d.approved == true).length);
                // spntotalinoutUnapproved.text(response["data"].filter(d => d.approved == false).length);

                // //Approved Start
                // var Row_inoutapproved = '';
                // Row_inoutapproved = '<thead style="color: rgb(128, 128, 128);">';
                // Row_inoutapproved += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Name</th><th style="display:none;" scope="col" style="width:30%;padding-top: 4%;text-align:left">hide time</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Type</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Date</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Time</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Approval</th></tr>';
                // Row_inoutapproved += '</thead>';
                // Row_inoutapproved += '<tbody>';
                // //Approved End

                // //UnApprove Start
                // var Row_inoutUnapproved = '';
                // Row_inoutUnapproved = '<thead style="color: rgb(128, 128, 128);">';
                // Row_inoutUnapproved += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Name</th><th style="display:none;" scope="col" style="width:30%;padding-top: 4%;text-align:left">hide time</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Type</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Date</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Time</th><th scope="col" style="width:30%;padding-top: 4%;text-align:left">UnApproval</th></tr>';
                // Row_inoutUnapproved += '</thead>';
                // Row_inoutUnapproved += '<tbody>';
                // //UnApproved End

                // for (var row_cnt = 0; row_cnt < response["data"].length; row_cnt++) {
                //     var _date = moment(response["data"][row_cnt]["checkTime"]).format('YYYY-MM-DD');
                //     var userid = response["data"][row_cnt]["employeeNo"];
                //     var usertype = response["data"][row_cnt]["checkType"];
                //     var inouttime = moment(response["data"][row_cnt]["checkTime"]).format('LT');
                //     var username = response["data"][row_cnt]["employeeName"];
                //     var CHECKTIME = response["data"][row_cnt]["checkTime"];

                //     //Approved Start
                //     if (Boolean(response["data"][row_cnt]["approved"])) {
                //         Row_inoutapproved += '<tr>' +
                //             '<td>' + username + '</td>' +
                //             '<td style="display:none;">' + CHECKTIME + '</td>' +
                //             '<td>' + usertype + '</td>' +
                //             '<td >' + _date + '</td>' +
                //             '<td>' + inouttime + '</td>' +
                //             '<td>  <input type="checkbox" checked="true" id="selectCheckrecord" value=' + userid + '|' + _date + '|' + CHECKTIME + '></td>' +
                //             '</tr>';
                //     }
                //     //Approved End

                //     //Un Approved Start
                //     if (!Boolean(response["data"][row_cnt]["approved"])) {
                //         Row_inoutUnapproved += '<tr>' +
                //             '<td>' + username + '</td>' +
                //             '<td style="display:none;">' + CHECKTIME + '</td>' +
                //             '<td>' + usertype + '</td>' +
                //             '<td >' + _date + '</td>' +
                //             '<td>' + inouttime + '</td>' +
                //             '<td>  <input type="checkbox" id="getdatecheckbox" value=' + userid + '|' + _date + '|' + CHECKTIME + '></td>' +
                //             '</tr>';
                //     }
                //     //Un Approved End


                // }
                // Row_inoutapproved += '</tbody>';
                // tbltotalinoutapproved.append(Row_inoutapproved);

                // Row_inoutUnapproved += '</tbody>';
                // tbltotalinoutUnapproved.append(Row_inoutUnapproved);


                imgtotalinOutAppoved.hide();

            } else {

                $("#tbl_totalinoutAtt").text('No record found');
                imgtotalinOutAppoved.hide();
            }
        },
        error: function (xhr, status, err) {
            imgtotalinOutAppoved.hide();
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
// Fill TotalInOutApproval End

//unApproved
function UnapprovedRecord() {
    var Unapprovedbtn = "Unapprovedbtn";
    var record = [];

    $("#selectCheckrecord:not(:checked)").each(function (i) {
        record[i] = $(this).val();

    })
    if (record.length == 0) {
        alert('Atleast unApproved one record');
    }
    else {
        $.ajax({
            url: ApiForm + '/UpdateApproval/' + strkey + '/' + record + '/' + Unapprovedbtn + '/' + '0',
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                TotalInOut();
            }
        })
    }

    // [Route("~/DashBoard/UpdateApproval/{_key?}/{Details?}/{Unapprovedbtn?}")]


}
// Approved
function ApprovedRecord() {
    var approvedbtn = "approvedbtn";
    var record = [];
    $("#getdatecheckbox:checked").each(function (i) {
        record[i] = $(this).val();

    })
    if (record.length == 0) {
        alert('Atleast Approved one record');
    }

    $.ajax({
        url: ApiForm + '/UpdateApproval/' + strkey + '/' + record + '/' + '0' + '/' + approvedbtn,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            TotalInOut();
        }
    })
}


function serachbyinout() {
    TotalInOutMap();
    TotalInOut();
}
function Machineinfo(MachineResponse) {
    var spnMachineInformation_cnt = 0;
    var tblMachineInformation = $("#tbl_MachineInformation");
    var spnMachineInformation = $("#spn_MachineInformation");
    tblMachineInformation.empty();
    //Information Start   

    var Row_Machine_Header = '';
    Row_Machine_Header = '<thead style="color: rgb(128, 128, 128);">';
    Row_Machine_Header += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Description</th></tr>';
    Row_Machine_Header += '</thead>';
    tblMachineInformation.append(Row_Machine_Header);

    var Row_Machine = '';
    Row_Machine += '<tbody>';
    for (var row_cnt = 0; row_cnt < MachineResponse.length; row_cnt++) {
        Row_Machine += '<tr>' +
            '<td>' + MachineResponse[row_cnt]["name"] + '</td>' +
            '</tr>';
        spnMachineInformation_cnt += 1;
    }
    Row_Machine += '</tbody>';
    tblMachineInformation.append(Row_Machine);
    spnMachineInformation.html(spnMachineInformation_cnt);

    //Information End
}
// Fill MachineInformation Start 
async function MachineSocket(_errorcat, _SocketMsg) {

    var spnMachineWE_cnt = 0;
    var tblMachineWE = $("#tbl_MachineError");
    var spnMachineWE = $("#spn_MachineError");
    var tblMachineWE_old = $("#tbl_MachineError tbody").html();
    //var spnMachineWE_old = spnMachineInformation.html();
    tblMachineWE.empty();
    var Row_Machine_WE_Header = '';
    Row_Machine_WE_Header = '<thead style="color: rgb(128, 128, 128);">';
    Row_Machine_WE_Header += '<tr><th scope="col" style="width:30%;padding-top: 4%;text-align:left">Description</th></tr>';
    Row_Machine_WE_Header += '</thead>';
    tblMachineWE.append(Row_Machine_WE_Header);
    var Row_Machine_WE = '';


    // var _msgcat = _calltype.substring(0, 17);
    // var _errorcat = _calltype.substring(18, 19);

    // if (_msgcat == "AttendanceMachine") {
    if (_errorcat == 'I') { style = " style=color:Green"; }
    else if (_errorcat == 'E') { style = " style=color:Red"; }
    else if (_errorcat == 'W') { style = " style=color:Orange"; }

    Row_Machine_WE = '<tbody>';
    Row_Machine_WE += '<tr>' +
        '<td ' + style + '>' + _SocketMsg + '</td>' +
        '</tr>';
    Row_Machine_WE += tblMachineWE_old;
    Row_Machine_WE += '</tbody>';
    tblMachineWE.append(Row_Machine_WE);

    spnMachineWE_cnt = parseInt(spnMachineWE.html()) + 1;
    spnMachineWE.html(spnMachineWE_cnt);
    //}

}
// Fill MachineInformation End

//Restart Device Start
function RestartDevice(_BranchId) {
    alert(_BranchId);
}
//Restart Device End

$('table').on('click', '.btn-edit', function (e) {

    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#tbl_totalinoutapp').DataTable().row(currentRow).data();
    var _approved = $(this).closest('tr').find('.ddl-approved option:selected').val();
    var _date = moment(data['checkTime']).format('YYYY-MM-DD HH:mm:ss');
    var _MachineId = data['machineId'];
    updrec(_MachineId, _date, _approved);
});

function updrec(_MachineId, _date, _approved) {



    Swal.fire({
        title: 'Are you sure you want to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: apiUrl + '/api/Payroll/v1/InOutEditorApproval',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data:
                    JSON.stringify({
                        "MachineId": _MachineId,
                        "checkTime": _date,
                        "approved": _approved,
                        "menuId": _menuid
                    }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgtotalinOutAppoved.show();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgtotalinOutAppoved.hide();
                        TotalInOut();
                        $('#data_Modal').modal('hide');
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
                        imgtotalinOutAppoved.hide();
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
                    imgtotalinOutAppoved.hide();
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

function viewMapDetail(sessidInoutMapDetail) {
    window.open(apiUrl_View + '/Payroll/Report/PayrollMap?S=' + sessidInoutMapDetail, '_blank');

}
