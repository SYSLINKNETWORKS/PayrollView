var imgload = $("#img_load");
var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);
var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Inventory';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();
});


function printReport() {
    imgload.show();
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();
    $.ajax({
        url: ApiForm + '/v1/Report/GetStockLedger',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var obj = response.data.stockLedgerReportDetailViewModels;
                var today = 'Print By : ' + response.data.userName + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                $('#lbl_company_name').html(response.data.companyName);
                $("#br_nam").html(response.data.branchName);
                $('#lbl_head').html("Stock Ledger <br/> Date from " + moment(response.data.dateFrom).format("DD-MMM-YYYY") + " to " + moment(response.data.dateTo).format("DD-MMM-YYYY"));
                $('#lbl_usrprt').html(today);



                const uniqueItem = [...new Set(obj.map(item => item.itemId))];
                for (var row_cnt_item = 0; row_cnt_item < uniqueItem.length; row_cnt_item++) {

                    const _transaction = obj.filter(d => d.itemId == uniqueItem[row_cnt_item]);
                    var rowdata_1 = '<tr>' +
                        '<td colspan=6 style="font-weight:bold;text-align:center;">Item : ' + _transaction[0]["itemBrandName"] + ' - ' + _transaction[0]["itemName"] + '</td></tr>';
                    detailsTableBody.append(rowdata_1);


                    //Opening Start
                    var bal = 0, receive_subtotal = 0, issue_subtotal = 0;
                    const StockLedger_O = obj.filter(d => d.tag == 'O' && d.itemId == _transaction[0]["itemId"]);
                    const StockLedger_T = obj.filter(d => d.tag == 'T' && d.itemId == _transaction[0]["itemId"]);

                    for (var titmid_cnt = 0; titmid_cnt < StockLedger_O.length; titmid_cnt++) {
                        bal += Number(StockLedger_O[titmid_cnt]["balance"]);
                    }

                    var rowdata = '<tr>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td style="text-align:right;"></td>' +
                        '<td style="text-align:right;"></td>' +
                        '<td style="font-weight:bold;text-align:right;">Opening</td>' +
                        '<td style="text-align:right;">' + accounting.format(bal, 0) + '</td>' +
                        '</tr>';

                    detailsTableBody.append(rowdata);
                    //Opening End

                    StockLedger_T.sort((a, b) => (a.date > b.date) ? 1 : -1);
                    var sno = 0;
                    for (var titmid_cnt = 0; titmid_cnt < StockLedger_T.length; titmid_cnt++) {
                        sno += 1;
                        receive_subtotal += Number(StockLedger_T[titmid_cnt]["received"]);
                        issue_subtotal += Number(StockLedger_T[titmid_cnt]["issued"]);
                        bal += Number(StockLedger_T[titmid_cnt]["balance"]);

                        if (bal < 0) {
                            styleformat = 'style="background-color:peachpuff;"';
                        }
                        else {
                            styleformat = 'style="background-color:white;"';
                        }

                        var rowdata = '<tr ' + styleformat + '>' +
                            '<td>' + sno + '</td>' +
                            '<td>' + moment(StockLedger_T[titmid_cnt]["date"]).format("DD-MMM-YYYY") + '</td>' +
                            '<td>' + StockLedger_T[titmid_cnt]["description"] + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(StockLedger_T[titmid_cnt]["received"], 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(StockLedger_T[titmid_cnt]["issued"], 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(bal, 0) + '</td>' +
                            '</tr>';
                        detailsTableBody.append(rowdata);

                    }


                    var rowdata_subtotal = '<tr style="font-weight:bold;text-align:right;"><td  colspan=3>Total :</td><td>' + accounting.format(receive_subtotal, 0) + '</td><td>' + accounting.format(issue_subtotal, 0) + '</td><td></td></tr>';
                    rowdata_subtotal += '<p style="page-break-before: always">';
                    detailsTableBody.append(rowdata_subtotal);
                }
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
    a.download = 'BankReconciliation' + moment(new Date()).format('DDMMYYYYHHmmss') + '.xls';
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
