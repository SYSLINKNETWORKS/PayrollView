var imgload = $("#img_load");
// var currentURL = document.URL;
// var sessid_url = currentURL.split("&");
// var sessid = sessid_url[1];
// var sessid_name = sessid_url[2];
// var cre = sessionStorage.getItem(sessid);
// var cre_date_frm = sessid_url[2];
// var cre_date_to = sessid_url[3];
// var cash_bank_text = sessid_url[4];
var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);

var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);

var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {


    // detailsTable = $("#detail_table");
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();
    //detailsTableFooter.empty();
    $.ajax({

        url: ApiForm + '/Reports/GetGeneralLedger',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
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
                $('#lbl_head').html(_JsonValue.CashBank + " Book <br/> Date from " + moment(_JsonValue.dateFrom).format("DD-MMM-YYYY") + " to " + moment(_JsonValue.dateTo).format("DD-MMM-YYYY") + "<br/>" + response["data"]["accountName"]);
                $('#lbl_usrprt').html(today);
                var sno = 1, bal = 0;
                var _DrAmt = 0, _CrAmt = 0
                var rowdata = '';
                //Opening Start

                const _open = response["data"]["generalLedgerDetailReportViewModel"].filter(d => d.tag == 'O');


                rowdata += '<tr style="font-weight:bold;">' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td style="text-align:right;">Opening</td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td>' + accounting.formatNumber(_open[0]["opening"], 2) + '</td>' +
                    '</tr>';
                //Opening End
                var _opening = accounting.unformat(_open[0]["opening"]);
                //Transaction Start
                const _transactionTable = response["data"]["generalLedgerDetailReportViewModel"].filter(d => d.tag != 'O');
                const _uniqueDate = [...new Set(_transactionTable.map(item => item.date))];
                _uniqueDate.sort((a, b) => (a > b) ? 1 : -1)

                for (var row_cnt_date = 0; row_cnt_date < _uniqueDate.length; row_cnt_date++) {
                    const _transaction = response["data"]["generalLedgerDetailReportViewModel"].filter(d => d.tag != 'O' && d.date == _uniqueDate[row_cnt_date]);


                    for (var row_cnt = 0; row_cnt < _transaction.length; row_cnt++) {

                        // bal = bal + parseFloat(_transaction[row_cnt]["debit"], 2) - parseFloat(_transaction[row_cnt]["credit"], 2);
                        bal = bal + _opening + parseFloat(_transaction[row_cnt]["debit"], 2) - parseFloat(_transaction[row_cnt]["credit"], 2);
                        var chqrow = '', chqno = '';


                        if (_transaction[row_cnt]["chqDate"] == _transaction[row_cnt]["date"]) {
                            chqrow = moment(_transaction[row_cnt]["chqDate"]).format("DD-MMM-YYYY");
                        }
                        else {
                            chqrow = moment(_transaction[row_cnt]["chqDate"]).format("DD-MMM-YYYY") + '<br/>' + moment(_transaction[row_cnt]["Date"]).format("DD-MMM-YYYY");
                            //chqrow = moment(_transaction[row_cnt]["transactionDate"]).format("DD-MMM-YYYY");
                        }
                        if (['03', '04'].includes(_transaction[row_cnt]["voucherTypeNo"])) {
                            chqno = _transaction[row_cnt]["chqNo"];
                        }

                        var sessid_vch = _transaction[row_cnt]["voucherNo"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");

                        var _cre_vch = JSON.stringify({
                            "VoucherNo": _transaction[row_cnt]["voucherNo"],
                            "dateFrom": response["data"]["dateFrom"],
                            "dateTo": response["data"]["dateTo"],
                        });
                        sessionStorage.setItem(sessid_vch, _cre_vch);
                        rowdata += '<tr >' +
                            '<td>' + sno++ + '</td>' +
                            '<td>' + chqrow + '</td>' +
                            '<td><a href="#" onclick=window.open("' + apiUrl_View + '/GL/Report/Voucher?S=' + sessid_vch + '","_blank")>' + _transaction[row_cnt]["voucherId"] + '</a></td>' +
                            '<td>' + chqno + '</td>' +
                            '<td>' + _transaction[row_cnt]["narration"] + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt]["debit"], 2) + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt]["credit"], 2) + '</td>' +
                            '<td>' + accounting.formatNumber(bal, 2) + '</td>' +
                            //'<td>' + accounting.formatNumber(bal, 2) + '</td>' +
                            '</tr>';
                        _opening = 0;
                        _DrAmt = parseFloat(_DrAmt) + parseFloat(_transaction[row_cnt]["debit"]);
                        _CrAmt = parseFloat(_CrAmt) + parseFloat(_transaction[row_cnt]["credit"]);



                    }
                }
                detailsTableBody.append(rowdata);
                //Grand Total Start
                var rowdata = '<tr  style="font-weight:bold">' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td style="text-align:right;">Grand Total : </td>' +
                    '<td>' + accounting.formatNumber(_DrAmt, 2) + '</td>' +
                    '<td>' + accounting.formatNumber(_CrAmt, 2) + '</td>' +
                    '<td></td>' +
                    '</tr>';
                detailsTableBody.append(rowdata);
                //Transaction End
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
