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
    detailsTable = $("#div_leave");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/Leave',
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
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Leave Summary</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>As on ' + moment(response.data["dailyDate"]).format('DD-MMM-YYYY') + ' </th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<th>SNo.</th>' +
                    '<th>Name</th>' +
                    '<th>Annual Leave</th>' +
                    '<th>Annual Leave Avail</th>' +
                    '<th>Bal Annual Leave</th>' +
                    '<th>Sick Leave</th>' +
                    '<th>Sick Leave Avail</th>' +
                    '<th>Bal Sick Leave</th>' +
                    '<th>Casual Leave</th>' +
                    '<th>Casual Leave Avail</th>' +
                    '<th>Bal Casual Leave</th>' +
                    '</tr>';
                rowdata += '</thead>';

                const employee_1 = response.data["leaveSummaryList"];
                var employee = [];
                for (i = 0; i < employee_1.length; i++) {
                    if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                        employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                    }
                }
                employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                var sno = 1;
                rowdata += '<tbody">';
                for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                    //  const employeeFilter = response.data["singleDayAttandances"].filter(d => d.employeeId == employee[row_cnt]._id && d.dailyDate == employee[row_cnt]._dat);
                    const employeeFilter = response.data["leaveSummaryList"].filter(d => d.employeeId == employee[row_cnt]._id);
                    for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                        rowdata += '<tr style="font-size:8pt;">' +
                            '<td>' + sno++ + '</td>' +
                            '<td>' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["annualLeave"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["annualLeaveAvail"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["balAnnualLeave"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["sickLeave"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["sickLeaveAvail"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["balSickLeave"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["casualLeave"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["casualLeaveAvail"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["balCasualLeave"] + '</td>' +
                            '</tr>';
                    }

                }

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
