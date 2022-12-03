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
    //printReport();


});
function printReport() {
    detailsTable = $("#div_loanrecieve");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/LoanRecieve',
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
                var Dates = 'Date From  : ' + moment(response.data["dateFrom"]).format("DD-MMM-YYYY") + ' To : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY");
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:7pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Loan Recieve Summary</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + Dates + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '</thead>';

                const employee_1 = response.data["loanReceiveSummaryLists"];

                var employee = [];
                for (i = 0; i < employee_1.length; i++) {
                    if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                        employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                    }
                }
                employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                    var sno = 1;
                    const employeeFilter = response.data["loanReceiveSummaryLists"].filter(d => d.employeeId == employee[row_cnt]._id);
                    var _amount = 0, _receivingAmount = 0, _balanceAmount = 0, _status = 'InProcess';

                    for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                        _receivingAmount += parseFloat(employeeFilter[row_cnt_filter]["receiving"]);
                    }
                    _amount = employeeFilter[0]["amount"];
                    _balanceAmount = parseFloat(_amount) - parseFloat(_receivingAmount);
                    if (parseFloat(_balanceAmount) == 0) { _status = 'Complete'; }

                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th colspan=3>Employee : ' + '[' + employeeFilter[0]["employeeNo"] + ']' + ' - ' + employeeFilter[0]["employeeName"] + ' Department : ' + employeeFilter[0]["departmentName"] + ' Designation : ' + employeeFilter[0]["designationName"] + '</th>' +
                        '</tr>' +
                        '<tr style="font-weight:bold;">' +
                        '<th colspan=3>Category : ' + employeeFilter[0]["loanCatgoryName"] + '<br/> Amount : ' + accounting.format(_amount) + '<br/> Received Amount : ' + accounting.format(_receivingAmount) + '<br/> Balance Amount : ' + accounting.format(_balanceAmount) + ' Status ' + _status + '</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th>S.No.</th>' +
                        '<th>Date</th>' +
                        '<th>Amount Received</th>' +
                        '</tr>';
                    rowdata += '</thead>';


                    const Date_1 = response.data["loanReceiveSummaryLists"].filter(d => d.employeeId == employee[row_cnt]._id);
                    var _Date = [];
                    for (i = 0; i < Date_1.length; i++) {
                        if (_Date.findIndex(x => x._dt == Date_1[i].date) == -1) {
                            _Date.push({ _dt: Date_1[i].date });
                        }
                    }
                    _Date.sort((a, b) => (a._dt > b._dt) ? 1 : -1);
                    for (var dt_cnt = 0; dt_cnt < _Date.length; dt_cnt++) {
                        const employeeFilterDate = response.data["loanReceiveSummaryLists"].filter(d => d.employeeId == employee[row_cnt]._id && d.date == _Date[dt_cnt]._dt);

                        rowdata += '<tbody">';
                        for (var row_cnt_filter = 0; row_cnt_filter < employeeFilterDate.length; row_cnt_filter++) {
                            rowdata += '<tr style="font-size:7pt;">' +
                                '<td>' + sno++ + '</td>' +
                                '<td>' + moment(employeeFilterDate[row_cnt_filter]["date"]).format("DD-MMM-YYYY") + '</td>' +
                                '<td>' + accounting.format(employeeFilterDate[row_cnt_filter]["receiving"]) + '</td>' +
                                '</tr>';
                        }
                    }
                    rowdata += '</tbody">';
                }
                rowdata += '</table>';
                // var _recamt = 0;

                // const employee_1 = response.data["loanReceiveSummaryLists"];

                // var employee = [];
                // for (i = 0; i < employee_1.length; i++) {
                //     if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                //         employee.push({
                //             _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName, _catid: employee_1[i].loanCatgoryId, _catname: employee_1[i].loanCatgoryName
                //             , _amount: employee_1[i].amount
                //         });
                //     }
                // }
                // employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

                // for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                //     _recamt = parseFloat(employee_1[row_cnt]["receiving"]);
                //     var sno = 1;
                //     rowdata += '<tr><th style="font-size:7pt;border:none;    "colspan=7 ><b>Name :' + employee[row_cnt]._nam + '</b></th></tr>';
                //     rowdata += '<tr><th style="font-size:7pt; "colspan=7 ><b>Category : </b>' + employee[row_cnt]._catname + '</th></tr>';
                //     rowdata += '<tr><th style="font-size:7pt; "colspan=2 ><b>Amount : </b>' + employee[row_cnt]._amount + '</th></tr>';


                //     const employeeFilter = response.data["loanReceiveSummaryLists"].filter(d => d.employeeId == employee[row_cnt]._id && d.dailyDate == employee[row_cnt]._dat);
                //     for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                //         rowdata += '<tr style="font-size:7pt;">' +
                //             '<th>ID#</th>' +
                //             '<th>Date</th>' +
                //             '<th>Recieve Amount</th>' +
                //             '<th>Balance</th>' +
                //             '<th>Cash/Bank</th>' +
                //             '<th>Cheque</th>' +
                //             '<th>Account</th>' +
                //             '<th>Vorcher</th>' +
                //             '</tr>';
                //         rowdata += '<tbody">';
                //         rowdata += '<tr style="font-size:7pt;">' +
                //             '<td>' + sno++ + '</td>' +
                //             //'<td>' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["date"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["receiving"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["balance"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["cashBank"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["check"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["account"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["voucher"] + '</td>' +
                //             '</tr>';
                //         rowdata += '</tbody">';
                //         rowdata += '<tfooter">';
                //         rowdata += '<tr style="font-weight:bold;">' +
                //             '<td style="font-weight:bold;text-align:right;" colspan=2 > </td>' +
                //             '<td  colspan=7>' + accounting.formatNumber(_recamt) + '</td>';
                //         rowdata += '</tfooter">';
                //     }
                //     rowdata += '</table>';



                // '<th>Sr.No</th>' +
                //     '<th>Date</th>' +
                //     '<th>Recieve Amount</th>' +
                //     '<th>Balance</th>' +
                //     '<th>Cash/Bank</th>' +
                //     '<th>Cheque</th>' +
                //     '<th>Account</th>' +
                //     '<th>Vorcher</th>' +
                //     '</tr>';
                // rowdata += '</thead>';

                // const employee_1 = response.data["loanReceiveSummaryLists"];

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
                //    const employeeFilter = response.data["loanReceiveSummaryLists"].filter(d => d.employeeId == employee[row_cnt]._id);
                //     for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                //         rowdata += '<tr style="font-size:7pt;">' +
                //             '<td>' + sno++ + '</td>' +
                //             '<td>' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["date"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["receiving"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["balance"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["cashBank"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["check"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["account"] + '</td>' +
                //             '<td>' + employeeFilter[row_cnt_filter]["voucher"] + '</td>' +
                //             '</tr>';
                //     }
                // }
                // rowdata += '</tbody">';
                // rowdata += '</table>';

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
