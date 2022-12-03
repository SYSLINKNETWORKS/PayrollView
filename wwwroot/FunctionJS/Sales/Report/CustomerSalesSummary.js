var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessid_name = sessid_url[2];
var cre = sessionStorage.getItem(sessid);
var cre_name = sessionStorage.getItem(sessid_name);
$(document).ready(function () {
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();
});
function printReport() {
    detailsTableBody = $("#detail_table");
    detailsTableBody.empty();

    $.ajax({

        url: apiUrl + '/Sales/Report/SaleReport/CustomerSalesSummaryReport',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Creteria": cre }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            if (response[0].status == 1) {
                var rowdata = '';
                var today = cre_name + ' Print By : ' + response[0]["Result_Heading"][0]["User_Name"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                rowdata += '<table class="table table-sm" style = "font-size:smaller;">' +
                    '<thead>' +
                    '<tr>' +
                    '<th colspan="8" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Branch_Name"] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="8" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Customer Sales Summary Report</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="8" id="lbl_usrprt" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                    '</tr>';
            
                rowdata += '</thead>';
                //Customer Start
                const _Brand_1 = response[0]["Result"];
                var _Brand = [];
                for (i = 0; i < _Brand_1.length; i++) {
                    if (_Brand.findIndex(x => x._id == _Brand_1[i].Brand_ID) == -1) {
                        _Brand.push({ _id: _Brand_1[i].Brand_ID, _nam: _Brand_1[i].Brand });
                    }
                }
                _Brand.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                //Customer End
                for (var row_cnt_bd = 0; row_cnt_bd < _Brand.length; row_cnt_bd++) {
                    rowdata += '<thead>';
                    rowdata += '<tr>' +
                        '<th colspan=7 style="text-align:center;">' + _Brand[row_cnt_bd]["_nam"] + '</th>' +
                        '</tr>';
                    rowdata += '<tr>' +
                        '<th style="text-align:center;">S.No.</th>' +
                        '<th style="text-align:center;">Customer</th>' +
                        '<th style="text-align:right;">Amount</th>' +
                        '<th style="text-align:right;">Discount</th>' +
                        '<th style="text-align:right;">G.S.T Amt</th>' +
                        '<th style="text-align:right;">Tax</th>' +
                        '<th style="text-align:right;">Net Amount</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    const _transaction = response[0]["Result"].filter(d => d.Brand_ID == _Brand[row_cnt_bd]["_id"]);
                    var sno = 1, _amt = 0,_disamt=0,_gstamt=0,_taxamt=0,_namt=0;
                    rowdata += '<tbody>';
                    for (var row_cnt_t = 0; row_cnt_t < _transaction.length; row_cnt_t++) {
                        rowdata += '<tr>' +
                            '<td style="text-align:center;">' + sno++ + '</td>' +
                            '<td>' + _transaction[row_cnt_t]["Customer"] + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["Amount"], 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["Discount"], 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["GST_Amount"], 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["UnRegister_Amount"], 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["Net_Amount"], 0) + '</td>' +
                            '</tr>';
                        _amt += parseFloat(_transaction[row_cnt_t]["Amount"]);
                        _disamt += parseFloat(_transaction[row_cnt_t]["Discount"]);
                        _gstamt += parseFloat(_transaction[row_cnt_t]["GST_Amount"]);
                        _taxamt += parseFloat(_transaction[row_cnt_t]["UnRegister_Amount"]);
                        _namt += parseFloat(_transaction[row_cnt_t]["Net_Amount"]);
                    }
                    rowdata += '<tr style="color:red;">' +
                        '<td colspan=2 style="text-align:right;">Total : </td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_amt, 0) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_disamt, 0) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_gstamt, 0) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_taxamt, 0) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_namt, 0) + '</td>' +
                        '</tr>';

                    rowdata += '</tbody>';
                }

                rowdata += '</table>';
                rowdata += '<p style="page-break-before: always">';
                detailsTableBody.append(rowdata);
                imgload.hide();
            }
            else {
                alert(response[0].Remarks);
                imgload.hide();
                //window.location.href = "@Url.Content("/login")";
            }
        },
        error: function (error) {
            console.log('Error ' + error);
            alert('Error ' + error);
            imgload.hide();
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
