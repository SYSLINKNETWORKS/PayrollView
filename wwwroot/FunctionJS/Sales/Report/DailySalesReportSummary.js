var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessid_name = sessid_url[2];
var asondate = sessid_url[3];
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

        url: apiUrl + '/Sales/Report/SaleReport/DSRSummary',
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
                    '<th colspan="13" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Branch_Name"] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="13" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Daily Sales Report ' + asondate + ' Summary</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="13" id="lbl_usrprt" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                    '</tr>' +
                    '<tr style="text-align:center;font-size:smaller;">' +
                    '<th style="text-align:center;width:200px;">Salesman</th>' +
                    '<th style="text-align:center;">Sale</th>' +
                    '<th style="text-align:center;">S.Return</th>' +
                    '<th style="text-align:center;">Gross<br/> Sales</th>' +
                    '<th style="text-align:center;">Discount</th>' +
                    '<th style="text-align:center;">G.S.T</th>' +
                    '<th style="text-align:center;">Un-Register<br/>Tax</th>' +
                    '<th style="text-align:center;">Net Sales</th>' +
                    '<th style="text-align:center;">Credit</th>' +
                    '<th style="text-align:center;">Cash</th>' +
                    '<th style="text-align:center;">Realized</th>' +
                    '<th style="text-align:center;">Parallel<br/>Recovery</th>' +
                    '<th style="text-align:center;">Amount</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
                const Brand_1 = response[0]["Result"];
                var bid = [];
                for (i = 0; i < Brand_1.length; i++) {
                    if (bid.findIndex(x => x._id == Brand_1[i].Brand_ID) == -1) {
                        bid.push({ _id: Brand_1[i].Brand_ID, _nam: Brand_1[i].Brand_Name });
                    }
                }
                bid.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                var _amt_master = 0, _credit_amt_master = 0, _gross_amt_master = 0, _discount_amt_master = 0, _gst_amt_master = 0, _unreg_amt_master = 0, _netsales_amt_master = 0, _creditsales_amt_master = 0, _cash_amt_master = 0, _realised_amt_master = 0, _parallel_amt_master = 0 ,_GrandTotal_amt_master=0;
                for (var bid_cnt = 0; bid_cnt < bid.length; bid_cnt++) {
                    rowdata += '<tr >' +
                        '<td colspan=13 style="text-align:center;font-weight:bold;">' + bid[bid_cnt]._nam + '</td>' +
                        '</tr>';
                    const Salesman_1 = response[0]["Result"].filter(d => d.Brand_ID == bid[bid_cnt]._id);
                    var _amt = 0, _credit_amt = 0, _gross_amt = 0, _discount_amt = 0, _gst_amt = 0, _unreg_amt = 0, _netsales_amt = 0, _creditsales_amt = 0, _cash_amt = 0, _realised_amt = 0, _parallel_amt = 0, _GrandTotal_amt=0;
                    for (var sal_cnt = 0; sal_cnt < Salesman_1.length; sal_cnt++) {
                        var gamt = parseFloat(Salesman_1[sal_cnt]["Amount"]) - parseFloat(Salesman_1[sal_cnt]["Credit_Amount"]);
                        rowdata += '<tr >' +
                            '<td style="text-align:left;width:200px;">' + Salesman_1[sal_cnt]["Salesman_Name"] + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Amount"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Credit_Amount"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(gamt, 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Discount_Amount"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["GST_Amount"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Unregister_Amount"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Net_Amount"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Credit_Sales"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Cash_Sales"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Realised"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["OtherSalesmanCash"], 0) + '</td>' +
                            '<td style="text-align:right">' + accounting.formatNumber(Salesman_1[sal_cnt]["Grand_Total_Cash"], 0) + '</td>' +
                            '</tr>';

                        _amt += parseFloat(Salesman_1[sal_cnt]["Amount"]);
                        _credit_amt += parseFloat(Salesman_1[sal_cnt]["Credit_Amount"]);
                        _gross_amt += gamt;
                        _discount_amt += Salesman_1[sal_cnt]["Discount_Amount"];
                        _gst_amt += Salesman_1[sal_cnt]["GST_Amount"];
                        _unreg_amt += Salesman_1[sal_cnt]["Unregister_Amount"];
                        _netsales_amt += parseFloat(Salesman_1[sal_cnt]["Net_Amount"]);
                        _creditsales_amt += parseFloat(Salesman_1[sal_cnt]["Credit_Sales"]);
                        _cash_amt += parseFloat(Salesman_1[sal_cnt]["Cash_Sales"]);
                        _realised_amt += parseFloat(Salesman_1[sal_cnt]["Realised"]);
                        _parallel_amt += parseFloat(Salesman_1[sal_cnt]["OtherSalesmanCash"]);
                        _GrandTotal_amt += parseFloat(Salesman_1[sal_cnt]["Grand_Total_Cash"]);

                        _amt_master += parseFloat(Salesman_1[sal_cnt]["Amount"]);
                        _credit_amt_master += parseFloat(Salesman_1[sal_cnt]["Credit_Amount"]);
                        _gross_amt_master += gamt;
                        _discount_amt_master += parseFloat(Salesman_1[sal_cnt]["Discount_Amount"]);;
                        _gst_amt_master += parseFloat(Salesman_1[sal_cnt]["GST_Amount"]);
                        _unreg_amt_master += parseFloat(Salesman_1[sal_cnt]["Unregister_Amount"]);
                        _netsales_amt_master += parseFloat(Salesman_1[sal_cnt]["Net_Amount"]);
                        _creditsales_amt_master += parseFloat(Salesman_1[sal_cnt]["Credit_Sales"]);
                        _cash_amt_master += parseFloat(Salesman_1[sal_cnt]["Cash_Sales"]);
                        _realised_amt_master += parseFloat(Salesman_1[sal_cnt]["Realised"]);
                        _parallel_amt_master += parseFloat(Salesman_1[sal_cnt]["OtherSalesmanCash"]);
                        _GrandTotal_amt_master += parseFloat(Salesman_1[sal_cnt]["Grand_Total_Cash"]);
                    }
                    //Sub Total Start
                    rowdata += '<tr >' +
                        '<td style="text-align:right;width:200px;">Sub Total : </td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_credit_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_gross_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_discount_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_gst_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_unreg_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_netsales_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_creditsales_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_cash_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_realised_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_parallel_amt, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_GrandTotal_amt, 0) + '</td>' +
                        '</tr>';
                    //Sub Total End

                }
                rowdata += '</tbody>';

                    //Grand Total Start
                    rowdata += '<tfoot><tr >' +
                        '<td style="text-align:right;width:200px;">Grand Total : </td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_credit_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_gross_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_discount_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_gst_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_unreg_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_netsales_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_creditsales_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_cash_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_realised_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_parallel_amt_master, 0) + '</td>' +
                        '<td style="text-align:right">' + accounting.formatNumber(_GrandTotal_amt_master, 0) + '</td>' +
                        '</tr></tfoot>';
                rowdata += '</table>';
                rowdata += '<div class="card-box table-responsive" style="text-align:center;">' +
                    '<div style="float:left; width:150px; text-align:center; ">' +
                    '<label>' + (response[0]["Result_Heading"][0]["User_Name"]).toUpperCase() + '</label>' +
                    '<hr style="border-style: none none solid none; border-width: thin; width: 75%; margin-top:13px;" />' +
                    '<p style="text-align: center;">Prepared by</p>' +
                    '</div>' +
                    '<div style="float:left; width:150px; text-align:center;">' +
                    '<label></label>' +
                    '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                    '<p style="text-align: center;">Checked by</p>' +
                    '</div>' +
                    '<div style="float:left; width:150px; text-align:center;">' +
                    '<label></label>' +
                    '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                    '<p style="text-align: center;">Approved by</p>' +
                    '</div></div>';
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
