var imgload = $("#img_load");
//var currentURL = document.URL;
var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);
;
var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {
    detailsTable = $("#div_employeeprofiledetail");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/EmployeeProfile',
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
                //var rowdata = '';
                var rowhead = '', rowdata = '';
                var Dates = 'Date From  : ' + moment(response.data["dateFrom"]).format("DD-MMM-YYYY") + ' To : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY");
                const employee_1 = response.data["employeeProfileSummaryLists"];

                for (var row_cnt = 0; row_cnt < employee_1.length; row_cnt++) {

                    var rowhead = '', rowdata = '';
                    rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';
                    rowdata += '<thead>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                    //rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Employee Profile Summary</th></tr>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Employee Data Form</th></tr>';
                    rowdata += '</thead>';
                    rowdata += '</table>';

                    //                    rowdata += '<div style="width: 100%; border: 1px solid black; text-align: center;">Employee Data Form</div>';
                    rowdata += ' <div style="width: 49%; float: left; border: 1px solid black; height: 650px;">' +
                        '<table style="width: 100%">' +
                        '<tr><td colspan="2" style="font-weight: bold; font-size: 20px; text-align: center">Personal</td>' +
                        '</tr>' +
                        '<tr><td class="col-md-3"><b>Employee Code</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["employeeNo"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Employee Name</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["employeeName"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Father Name</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["fatherName"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Parmanent Address</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["addressPermanent"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Present Address</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["presentAddress"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Contact Number</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["phone"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Mobile Number</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["mobile"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Date of Birth</b></td>' +
                        '<td class="col-md-9">' + moment(employee_1[row_cnt]["dateofBirth"]).format("DD-MMM-YYYY") + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>CNIC</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["cnic"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>CNIC Exp</b></td>' +
                        '<td class="col-md-9">' + moment(employee_1[row_cnt]["cnicExpire"]).format("DD-MMM-YYYY") + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Gender</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["gender"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Martial Status</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["married"] + '</td></tr>' +
                        
                        '<tr><td class="col-md-3"><b>Remarks</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["remarks"] + '</td></tr>' +



                        '<tr><td class="col-md-6"></td>' +
                        // '<td class="col-md-1" >  <img src="~/Image/a.jpg" Height="100px;" Width="150px"> </td></tr>'+

                        '<tr><td class="col-md-3">Other Detail</td>' +
                        //'<td ><div style="border:1px solid black"></div></td></tr>'+

                        '<tr><td class="col-md-3"><h6>Reference 1</h6></td>' +
                        //'<td ><div style="border:1px solid black"></div></td></tr>'+

                        '<tr><td class="col-md-3"><b>Name</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceOneName"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>CNIC</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceOneCNIC"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Address</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceOneAddress"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Contact</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceOneContact"] + '</td></tr>' +

                        '</table></div>' +




                        '<div style="width: 49%; float: left; border: 1px solid black; height: 650px;">' +
                        '<table style="width: 100%">' +
                        '<tr>' +
                        '<td colspan="3" style="font-weight: bold; font-size: 20px; text-align: center">Employment Detail</td>' +

                        '<tr><td class="col-md-3"><b>Job Title</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["designationName"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Department</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["departmentName"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Shift Name</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["rosterName"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Date Of Join</b></td>' +
                        '<td class="col-md-9">' + moment(employee_1[row_cnt]["dateofJoin"]).format("DD-MMM-YYYY") + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Date of Parmanent</b></td>' +
                        '<td class="col-md-9">' + moment(employee_1[row_cnt]["DateOfPermanent"]).format("DD-MMM-YYYY") + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Basic Salary</b></td>' +
                        '<td class="col-md-9">' +  accounting.format(employee_1[row_cnt]["basicSalary"],0) + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Allowance</b></td>' +
                        '<td class="col-md-9">' + accounting.format(employee_1[row_cnt]["allowance"],0) + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Gross Salary</b></td>' +
                        '<td class="col-md-9">' +  accounting.format(employee_1[row_cnt]["grossSalary"],0) + '</td></tr>' +

                        '<tr><td class="col-md-3"><h4>Leaves</h4></td>' +
                        //'<td class="col-md-3"><div style="border:1px solid black"></div></td></tr>'+

                        '<tr><td class="col-md-3"><b>Sick Leave</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["sickLeave"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Casual Leave</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["casualLeave"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Annual Leave</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["annualLeave"] + '</td></tr>' +
                        // '<br><br>'+


                        // //'<tr><td class="col-md-6"></td>' +
                        //  '<td class="col-md-6" ><b>CNIC Front<b>  <img src="~/Image/a.jpg" Height="100px;" Width="200px"> </td>'+
                        //  '<td class="col-md-6" ><b>CNIC Back<b>  <img src="~/Image/a.jpg" Height="100px;" Width="200px"> </td></tr>'+


                        '<tr><td class="col-md-3">Reference 2</td>' +
                        //'<td class="col-md-3"><div style="border:1px solid black"></div></td></tr>'+

                        '<tr><td class="col-md-3"><b>Name</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceTwoName"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>CNIC</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceTwoCNIC"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Address</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceTwoAddress"] + '</td></tr>' +

                        '<tr><td class="col-md-3"><b>Contact</b></td>' +
                        '<td class="col-md-9">' + employee_1[row_cnt]["referenceTwoContact"] + '</td></tr>' +

                        '</table></div>' +
                        '</div>';





                }

                // var employee = [];
                // for (i = 0; i < employee_1.length; i++) {
                //     if (employee.findIndex(x => x._id == employee_1[i].employeeId && x._dat == employee_1[i].dailyDate) == -1) {
                //         employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName, _dat: employee_1[i].dailyDate });
                //     }
                // }
                // employee.sort((a, b) => (a._nam > b._nam && a._dat > b._dat) ? 1 : -1);

                // var employee = [];
                // for (i = 0; i < employee_1.length; i++) {
                //     if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                //         employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                //     }
                // }
                // employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                // rowdata += '<tbody">';
                // for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                //     var sno = 1;
                //     const employeeFilter = response.data["absentReportList"].filter(d => d.employeeId == employee[row_cnt]._id);
                //     for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                //     rowdata += '<tr style="font-size:8pt;">' +
                //         '<td>' + sno++ + '</td>' +
                //         '<td>' + employeeFilter[row_cnt_filter]["employeeCategory"] + '</td>' +
                //         '<td>'+'[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']'+' - '+employeeFilter[row_cnt_filter]["employeeName"] +'</td>' +
                //         //'<td>' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                //         '<td>' + moment(employeeFilter[row_cnt_filter]["date"]).format("dddd DD-MMM-YYYY") + '</td>' +
                //         '<td>' + employeeFilter[row_cnt_filter]["remarks"] + '</td>' +
                //          '</tr>';
                // }


                rowdata += '</tbody">';
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

