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
    detailsTable = $("#div_loansum");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/Loan',
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
                //var Dates = 'Date From  : ' + moment(response.data["date"]).format("DD-MMM-YYYY") + ' To : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY");
                var Dates = 'DateAsOn  : ' + moment(response.data["dateAsOn"]).format("DD-MMM-YYYY") ;//+ ' To : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY");

                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Loan Summary</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' +  Dates+ '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<th>S.No.</th>' +
                    '<th>Date</th>' +
                    '<th>Name</th>' +
                    '<th>Department</th>' +
                    '<th>Designation</th>' +
                    '<th>Category</th>' +
                    '<th>Amount</th>' +
                    '<th>No of Installation</th>' +
                    '<th>Installation Amount</th>' +
                    '<th>Receiving</th>' +
                    '<th>Balance</th>' +
                    '<th>Status</th>' +
                    '</tr>';
                rowdata += '</thead>';




                const employee_1 = response.data["loanSummaryLists"];
                var employee = [];
                for (i = 0; i < employee_1.length; i++) {
                    if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                        employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                    }
                }
                employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                var sno = 1, _amount = 0, _receivedAmount = 0, _balanceAmount = 0;
                rowdata += '<tbody">';
                for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                    const employeeFilter = response.data["loanSummaryLists"].filter(d => d.employeeId == employee[row_cnt]._id);
                    for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {

                        _amount += parseFloat(employeeFilter[row_cnt_filter]["amount"]);
                        _receivedAmount += parseFloat(employeeFilter[row_cnt_filter]["receiving"]);
                        _balanceAmount += parseFloat(employeeFilter[row_cnt_filter]["balance"]);

                        var style = employeeFilter[row_cnt_filter]["status"] != 'InProcess' ? "" : "style='color:red;'";

                        rowdata += '<tr style="font-size:8pt;">' +
                            '<td>' + sno++ + '</td>' +
                            '<td>' + moment(employeeFilter[row_cnt_filter]["date"]).format("DD-MMM-YYYY") + '</td>' +
                            '<td>' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["departmentName"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["designationName"] + '</td>' +
                            '<td>' + employeeFilter[row_cnt_filter]["loanCatgoryName"] + '</td>' +
                            '<td>' + accounting.formatNumber(employeeFilter[row_cnt_filter]["amount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employeeFilter[row_cnt_filter]["noofInstalment"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employeeFilter[row_cnt_filter]["instalmentAmount"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employeeFilter[row_cnt_filter]["receiving"]) + '</td>' +
                            '<td>' + accounting.formatNumber(employeeFilter[row_cnt_filter]["balance"]) + '</td>' +
                            '<td ' + style + '>' + employeeFilter[row_cnt_filter]["status"] + '</td>' +
                            '</tr>';
                    }
                }
                rowdata += '</tbody">';
                rowdata += '<tfooter">';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<td style="font-weight:bold;text-align:right;" colspan=6 >Total : </td>' +
                    '<td style="font-weight:bold;">' + accounting.formatNumber(_amount) + ' </td>' +
                    '<td style="font-weight:bold;"> </td>' +
                    '<td style="font-weight:bold;"> </td>' +
                    '<td style="font-weight:bold;">' + accounting.formatNumber(_receivedAmount) + ' </td>' +
                    '<td style="font-weight:bold;">' + accounting.formatNumber(_balanceAmount) + ' </td>' +
                    '<td style="font-weight:bold;"> </td>' +
                    '</tr>';

                rowdata += '</tfooter">';

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
