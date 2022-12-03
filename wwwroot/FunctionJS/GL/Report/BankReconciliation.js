
var imgload = $("#img_load");
var currentURL = window.location.search;

var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);
var sessid = "";
var url = params = new URLSearchParams(window.location.search);
if (url.has('S')) {
    sessid = url.get('S');
}


var creA = sessionStorage.getItem('A' + sessid);
var creD = sessionStorage.getItem('D' + sessid);
var creM = sessionStorage.getItem('M' + sessid);
var cre_date = creD;
var acc_no = creA;
var bk_amt = creM;
$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {
    var _cre = JSON.stringify({
        "BankId": acc_no,
        "DateAsOn": cre_date,
        "BankAmount": bk_amt,
    });
    // detailsTable = $("#detail_table");
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();
    SummaryTableBody = $("#Summary_table tbody");
    SummaryTableBody.empty();
    //detailsTableFooter.empty();
    $.ajax({

        url: ApiForm + '/Reports/GetBankReconciliation',
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
                var _JsonValue = JSON.parse(_cre);
                var today = 'Print By : ' + response["data"]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                $('#lbl_company_name').html(response["data"]["companyName"]);
                $("#br_nam").html(response["data"]["branchName"]);
                $('#lbl_head').html("Bank Reconciliation <br/> As on " + moment(_JsonValue.DateAsOn).format("DD-MMM-YYYY") + "<br/>" + response["data"]["bankName"]);
                $('#lbl_usrprt').html(today);




                var sno = 1, _UnpresentedPaymentsAmt = 0, _UnpresentedDepositsAmt = 0, bal = accounting.unformat(bk_amt);
                var _transaction = response["data"]["bankReconciliationDetailReportViewModel"];

                var rowdata = '<tr><td colspan=8 style="text-align:right;">' + accounting.formatNumber(bal, 2) + ' </td></tr>';
                for (var row_cnt = 0; row_cnt < _transaction.length; row_cnt++) {


                    bal = parseFloat(bal) - (parseFloat(_transaction[row_cnt]["outstandingPayment"]) + parseFloat(_transaction[row_cnt]["outstandingDeposit"]));
                    // var sessid_vch = _transaction[row_cnt]["No"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");
                    // sessionStorage.setItem(sessid_vch, cre);
                    var sessid_vch = _transaction[row_cnt]["voucherNo"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");

                    var _cre_vch = JSON.stringify({

                        "VoucherNo": _transaction[row_cnt]["voucherNo"],
                        "dateFrom": response["data"]["dateFrom"],
                        "dateTo": response["data"]["dateTo"],
                    });
                    sessionStorage.setItem(sessid_vch, _cre_vch);

                    rowdata += '<tr>' +
                        '<td>' + sno++ + '</td>' +
                        //                        '<td><a href="#" onclick=window.open("' + apiUrl_View + '/GL/Report/Voucher?S=' + sessid_vch + '","_blank")>' + _transaction[row_cnt]["vourcherNo"] + '</a></td>' +
                        '<td><a href="#" onclick=window.open("' + apiUrl_View + '/GL/Report/Voucher?S=' + sessid_vch + '","_blank")>' + _transaction[row_cnt]["voucherId"] + '</a></td>' +

                        '<td>' + moment(_transaction[row_cnt]["chqDate"]).format("DD-MMM-YYYY") + '</td>' +
                        '<td>' + _transaction[row_cnt]["chqNo"] + '</td>' +
                        '<td>' + _transaction[row_cnt]["accountName"] + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt]["outstandingDeposit"], 2) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt]["outstandingPayment"], 2) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(bal, 2) + '</td>' +
                        '</tr>';

                    _UnpresentedPaymentsAmt = parseFloat(_UnpresentedPaymentsAmt) + parseFloat(_transaction[row_cnt]["outstandingPayment"]);
                    _UnpresentedDepositsAmt = parseFloat(_UnpresentedDepositsAmt) + parseFloat(_transaction[row_cnt]["outstandingDeposit"]);


                }
                //Grand Total Start
                rowdata += '<tr  style="font-weight:bold;text-align:right;">' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td>Total : </td>' +
                    '<td>' + accounting.formatNumber(_UnpresentedDepositsAmt, 2) + '</td>' +
                    '<td>' + accounting.formatNumber(_UnpresentedPaymentsAmt, 2) + '</td>' +
                    '<td></td>' +
                    '</tr>';
                detailsTableBody.append(rowdata);
                //Transaction End

                var _summary = response["data"]["bankReconciliationSummaryReportViewModel"];
                var summarydata = '<tr>' +
                    '<td>BALANCE AS PER BANK STATEMENT</td>' +
                    '<td>' + accounting.formatNumber(bk_amt) + '</td>' +
                    '<td>OPENING BALANCE</td>' +
                    '<td>' + accounting.formatNumber(_summary["openingLedger"], 2) + '</td>' +
                    '</tr>';
                summarydata += '<tr>' +
                    '<td>ADD:  CHQ DEPOSIT BUT NOT CLEARED</td>' +
                    '<td>' + accounting.formatNumber(_UnpresentedDepositsAmt, 2) + '</td>' +
                    '<td>ADD: RECEIPT</td>' +
                    '<td>' + accounting.formatNumber(_summary["paymentLedger"], 2) + '</td>' +
                    '</tr>';
                summarydata += '<tr>' +
                    '<td>LEES: CHQ ISSUED BUT NOT PRESENTED</td>' +
                    '<td>' + accounting.formatNumber(_UnpresentedPaymentsAmt, 2) + '</td>' +
                    '<td>LESS: PAYMENT </td>' +
                    '<td>' + accounting.formatNumber(_summary["receiptLedger"], 2) + '</td>' +
                    '</tr>';
                summarydata += '<tr>' +
                    '<td>BALANCE AS PER BANK BOOK</td>' +
                    '<td>' + accounting.formatNumber(bal) + '</td>' +
                    '<td>CLOSING BALANCE</td>' +
                    '<td>' + accounting.formatNumber(_summary["closingLedger"], 2) + '</td>' +
                    '</tr>';
                SummaryTableBody.append(summarydata);
                //Difference
                var diff = parseFloat(bal).toFixed(2) - parseFloat(_summary["closingLedger"]).toFixed(2);
                if (diff != 0) {
                    summarydata = '<tr style="font-weight:bold;color:Red;">' +
                        '<td colspan=2 style="text-align:right;">Difference</td>' +
                        '<td style="text-align:left;">' + accounting.formatNumber(diff, 2) + '</td>' +
                        '</tr>';
                    SummaryTableBody.append(summarydata);
                }
                imgload.hide();
            }
            else {
                imgload.hide();
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
