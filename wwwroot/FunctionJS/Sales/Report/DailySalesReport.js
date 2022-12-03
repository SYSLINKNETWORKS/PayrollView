var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessidname = sessid_url[2];
var asondate = sessid_url[3];
var reportType = sessid_url[4];

var cre = sessionStorage.getItem(sessid);
var crename = sessionStorage.getItem(sessidname);
$(document).ready(function () {
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {


    detailsTable = $("#detail_table");
    detailsTable.empty();


    divheader = $("#div_header");
    $.ajax({

        url: apiUrl + '/Sales/Report/SaleReport/DSR/' + asondate,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Creteria": cre }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            if (response[0].status == 1) {

                var today = crename + ' Print By : ' + response[0]["Result_Heading"][0]["User_Name"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var rowdata = '';

                //Salesman Start
                const _salesman_1 = response[0]["Result"];
                var _salesman = [];

                for (i = 0; i < _salesman_1.length; i++) {
                    if (_salesman.findIndex(x => x._id == _salesman_1[i].Salesman_ID) == -1) {
                        _salesman.push({ _id: _salesman_1[i].Salesman_ID, _nam: _salesman_1[i].Salesman_Name });
                    }
                }
                _salesman.sort((a, b) => (a._nam > b._nam) ? 1 : -1);

                //Salesman End
                for (var row_saleman_cnt = 0; row_saleman_cnt < _salesman.length; row_saleman_cnt++) {

                    rowdata = '';
                    const _brand_1 = response[0]["Result"].filter(d => d.Salesman_ID == _salesman[row_saleman_cnt]["_id"]);
                    const _Summary_1 = response[0]["Result_Summary"].filter(d => d.Salesman_ID == _salesman[row_saleman_cnt]["_id"]);
                    const _Summary_CBJ = response[0]["Result_CBJ"].filter(d => d.Salesman_ID == _salesman[row_saleman_cnt]["_id"]);
                    const _Summary_CreditSales = response[0]["Result_Credit_Sales"].filter(d => d.Salesman_ID == _salesman[row_saleman_cnt]["_id"]);
                    const _Summary_SalesReturn = response[0]["Result_Sales_Return"].filter(d => d.Salesman_ID == _salesman[row_saleman_cnt]["_id"]);
                    //1st Line   
                    rowdata += '<div style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Branch_Name"] + '</div>'
                    rowdata += '<div style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Daily Sales Report</div>'
                    rowdata += '<br/>';
                    rowdata += '<div style="text-align:left;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Date : ' + asondate + '</div>'
                    rowdata += '<div style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Salesman : ' + _brand_1[0]["Salesman_Name"] + '</div>'
                    //Brand Start
                    var _brand = [];
                    for (i = 0; i < _brand_1.length; i++) {
                        if (_brand.findIndex(x => x._id == _brand_1[i].Brand_ID) == -1) {
                            _brand.push({ _id: _brand_1[i].Brand_ID, _nam: _brand_1[i].Brand });
                        }
                    }
                    _brand.sort((a, b) => (a._id > b._id) ? 1 : -1);

                    //Brand End
                    var netamt = 0;
                    for (var row_cnt = 0; row_cnt < _brand.length; row_cnt++) {
                        const _transaction = response[0]["Result"].filter(d => d.Salesman_ID == _salesman[row_saleman_cnt]["_id"] && d.Brand_ID == _brand[row_cnt]["_id"]);
                        rowdata += '<table class="table table-sm" style="font-size:smaller;">';
                        rowdata += '<thead>' +
                            '<tr style="text-align:center;font-size:smaller;font-weight:bold;">' +
                            '<th style="text-align:center;">Code</th>' +
                            '<th width=1500px style="text-align:center;">Desciption</th>' +
                            '<th style="text-align:right;">Rate</th>' +
                            '<th style="text-align:center;">Issued</th>' +
                            '<th style="text-align:center;">Return</th>' +
                            '<th style="text-align:center;">Bonus</th>' +
                            '<th style="text-align:center;">Sold</th>' +
                            '<th style="text-align:center;">Sold Value</th>' +
                            '</tr>';
                        rowdata += '</thead>';



                        rowdata += '<tbody>';
                        var qty = 0, ret = 0, bon = 0, sqty = 0, amt = 0;
                        for (var row_cnt_1 = 0; row_cnt_1 < _transaction.length; row_cnt_1++) {

                            if (reportType == 1) {
                                rowdata += '<tr style="font-size:smaller;">' +
                                    '<td style="text-align:center;">' + _transaction[row_cnt_1]["Item_No"] + '</td>' +
                                    '<td style="text-align:left;">' + _transaction[row_cnt_1]["Item_Name"] + '</td>' +
                                    '<td style="text-align:center;">' + accounting.formatNumber(_transaction[row_cnt_1]["Rate"], 0) + '</td>' +
                                    '<td style="text-align:center;">' + _transaction[row_cnt_1]["Qty"] + '</td>' +
                                    '<td style="text-align:center;">' + _transaction[row_cnt_1]["Return"] + '</td>' +
                                    '<td style="text-align:center;">' + _transaction[row_cnt_1]["Bonus_Qty"] + '</td>' +
                                    '<td style="text-align:center;">' + _transaction[row_cnt_1]["Sold_Qty"] + '</td>' +
                                    '<td style="text-align:center;">' + accounting.formatNumber(_transaction[row_cnt_1]["Net_Amount"], 0) + '</td>' +
                                    '</tr>';
                            }
                            qty += parseFloat(_transaction[row_cnt_1]["Qty"]);
                            ret += parseFloat(_transaction[row_cnt_1]["Return"]);
                            bon += parseFloat(_transaction[row_cnt_1]["Bonus_Qty"]);
                            sqty += parseFloat(_transaction[row_cnt_1]["Sold_Qty"]);
                            amt += parseFloat(_transaction[row_cnt_1]["Net_Amount"]);
                            netamt += parseFloat(_transaction[row_cnt_1]["Net_Amount"]);

                        }
                        rowdata += '<tr style="font-size:smaller;">' +
                            '<td style="text-align:right;" colspan=3>' + _brand[row_cnt]["_nam"] + ' Brand Value :</td>' +
                            '<td style="text-align:center;">' + qty + '</td>' +
                            '<td style="text-align:center;">' + ret + '</td>' +
                            '<td style="text-align:center;">' + bon + '</td>' +
                            '<td style="text-align:center;">' + sqty + '</td>' +
                            '<td style="text-align:center;">' + accounting.formatNumber(amt, 0) + '</td>' +
                            '</tr>';

                    }
                    if (parseFloat(amt) != parseFloat(netamt)) {
                        rowdata += '<tr style="font-size:smaller;">' +
                            '<td style="text-align:right;" colspan=7> Total Gross Value :</td>' +
                            '<td style="text-align:center;">' + accounting.formatNumber(netamt, 0) + '</td>' +
                            '</tr>';
                    }
                    rowdata += '</tbody>';
                    rowdata += '</table>';

                    //Summary Start                  
                    rowdata += '<div style="width:100%;" class="card-box table-responsive">';
                    rowdata += '<table class="table table-sm" style="font-size:smaller;width:30%;float:right;">';
                    rowdata += '<tbody>';
                    //TODAYS SALES VALUE START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">TODAYS SALES VALUE</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Amount"], 0) + '</td>';
                    '</tr>';
                    //TODAYS SALES VALUE END

                    //LESS SALES RETURN START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">LESS SALES RETURN</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Credit_Amount"], 0) + '</td>';
                    '</tr>';
                    //LESS SALES RETURN END

                    //GROSS SALES START
                    var GrossSale_Amount = parseFloat(_Summary_1[0]["Amount"]) - parseFloat(_Summary_1[0]["Credit_Amount"]);
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">GROSS SALES START</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(GrossSale_Amount, 0) + '</td>';
                    '</tr>';
                    //GROSS SALES END


                    //LESS DISCOUNT START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">LESS DISCOUNT</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Discount_Amount"], 0) + '</td>';
                    '</tr>';
                    //LESS DISCOUNT END

                    //G.S.T START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">G.S.T</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["GST_Amount"], 0) + '</td>';
                    '</tr>';
                    //G.S.T END

                    //Un-Registed Tax START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">Un-Registed Tax</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Unregister_Amount"], 0) + '</td>';
                    '</tr>';
                    //Un-Registed Tax END

                    //NET SALES START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">NET SALES</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Net_Amount"], 0) + '</td>';
                    '</tr>';
                    //NET SALES END

                    //LESS CREDIT SALES START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">LESS CREDIT SALES</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Credit_Sales"], 0) + '</td>';
                    '</tr>';
                    //LESS CREDIT SALES END

                    //TODAYS CASH SALES START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">TODAYS CASH SALES</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Cash_Sales"], 0) + '</td>';
                    '</tr>';
                    //TODAYS CASH SALES END

                    //ADD REALISED CASH START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">ADD REALISED CASH</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Realised"], 0) + '</td>';
                    '</tr>';
                    //ADD REALISED CASH END

                    //PARALLEL RECOVERY CASH START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">PARALLEL RECOVERY CASH</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["OtherSalesmanCash"], 0) + '</td>';
                    '</tr>';
                    //PARALLEL RECOVERY CASH END

                    //GRAND TOTAL CASH START
                    rowdata += '<tr style="font-size:smaller;">' +
                        '<td style="text-align:left;">GRAND TOTAL CASH</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_Summary_1[0]["Grand_Total_Cash"], 0) + '</td>';
                    '</tr>';
                    //GRAND TOTAL CASH END
                    rowdata += '</tbody>';
                    rowdata += '</table>';
                    //Summary End
                    //CBJ Start
                    rowdata += '<table class="table table-sm" style="font-size:smaller;width:40%;float:left;">';
                    if (_Summary_CBJ.length > 0) {
                        const _Summary_CBJ_1 = _Summary_CBJ;
                        var _SummaryCBJ = [];
                        for (i = 0; i < _Summary_CBJ_1.length; i++) {
                            if (_SummaryCBJ.findIndex(x => x._id == _Summary_CBJ_1[i].Received_Type) == -1) {
                                _SummaryCBJ.push({ _id: _Summary_CBJ_1[i].Received_Type, _nam: _Summary_CBJ_1[i].Received_Type_Name });
                            }
                        }
                        _SummaryCBJ.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                        for (var _CBJ_cnt = 0; _CBJ_cnt < _SummaryCBJ.length; _CBJ_cnt++) {
                            const _transaction_CBJ = response[0]["Result_CBJ"].filter(d => d.Salesman_ID == _salesman[row_saleman_cnt]["_id"] && d.Received_Type == _SummaryCBJ[_CBJ_cnt]["_id"]);
                            var row_cnt_1 = 0;
                            rowdata += '<thead>' +
                                '<tr style="font-size:smaller;">' +
                                '<th style="text-align:center;" colspan=4>' + _transaction_CBJ[row_cnt_1]["Received_Type_Name"] + '</th>' +
                                '</tr>'+
                                '<tr style="text-align:center;font-size:smaller;font-weight:bold;">' +
                                '<th style="text-align:center;">Customer Name</th>' +
                                '<th style="text-align:center;">Invoice # & Date</th>';
                            if (_transaction_CBJ[row_cnt_1]["Received_Type"] == 'B') {
                                rowdata += '<th style="text-align:center;">Chq</th>';
                            }
                            rowdata += '<th style="text-align:right;">Amount</th>' +
                                '</tr>';
                            rowdata += '</thead>';
                            rowdata += '<tbody>';
                            var amt_cbj = 0;
                            for (var row_cnt_cbj = 0; row_cnt_cbj < _transaction_CBJ.length; row_cnt_cbj++) {
                                var chqnodat = '';
                                if (_transaction_CBJ[row_cnt_1]["Received_Type"] == 'B') {
                                    chqnodat = _transaction_CBJ[row_cnt_cbj]["Chq_No"] + ' & ' + moment(_transaction_CBJ[row_cnt_cbj]["Chq_Date"]).format("DD-MMM-YYYY")
                                }
                                rowdata += '<tr style="font-size:smaller;">' +
                                    '<td style="text-align:left;">' + _transaction_CBJ[row_cnt_cbj]["Customer"] + '</td>' +
                                    '<td style="text-align:center;">' + _transaction_CBJ[row_cnt_cbj]["Invoice_ID_Master"] + ' & ' + _transaction_CBJ[row_cnt_cbj]["Invoice_Date_Master"] + '</td>';
                                if (_transaction_CBJ[row_cnt_1]["Received_Type"] == 'B') {
                                    rowdata += '<td style="text-align:center;">' + chqnodat + '</td>';
                                }
                                rowdata += '<td style="text-align:right;">' + accounting.formatNumber(_transaction_CBJ[row_cnt_cbj]["Amount_Received"], 0) + '</td>' +
                                    '</tr>';
                                amt_cbj += parseFloat(_transaction_CBJ[row_cnt_cbj]["Amount_Received"]);
                            }
                            rowdata += '<tr style="font-size:smaller;">';
                            if (_transaction_CBJ[row_cnt_1]["Received_Type"] == 'B') {
                                rowdata += '<td style="text-align:right;" colspan=3> Total :</td>';
                            }
                            else {
                                rowdata += '<td style="text-align:right;" colspan=2> Total :</td>';
                            }
                            rowdata += '<td style="text-align:right;">' + accounting.formatNumber(amt_cbj, 0) + '</td>' +
                                '</tr>';
                            rowdata += '</tbody>';


                        }
                    }
                    rowdata += '</table>';
                    //CBJ End

                    //Credit Sales Start
                    //rowdata += '<table class="table table-sm" style="font-size:smaller;width:30%;float:right;">';
                    //rowdata += '</table>';
                    rowdata += '<table class="table table-sm" style="font-size:smaller;width:40%;float:left;">';
                    if (_Summary_CreditSales.length > 0) {
                        rowdata += '<thead>' +
                            '<tr style="font-size:smaller;">' +
                            '<th style="text-align:center;" colspan=3>Credit Sales Detail</th>' +
                            '</tr>' +
                            '<tr style="text-align:center;font-size:smaller;font-weight:bold;">' +
                            '<th style="text-align:center;">Customer</th>' +
                            '<th style="text-align:center;">Invoice # & Date</th>' +
                            '<th style="text-align:right;">Amount</th>' +
                            '</tr>';
                        rowdata += '</thead>';
                        rowdata += '<tbody>';
                        var amt_creditsales = 0;
                        for (var row_cnt_cs = 0; row_cnt_cs < _Summary_CreditSales.length; row_cnt_cs++) {
                            rowdata += '<tr style="font-size:smaller;">' +
                                '<td style="text-align:left;">' + _Summary_CreditSales[row_cnt_cs]["Customer"] + '</td>' +
                                '<td style="text-align:center;">' + _Summary_CreditSales[row_cnt_cs]["ID"] + ' & ' + moment(_Summary_CreditSales[row_cnt_cs]["Date"]).format("DD-MMM-YYYY") + '</td>';
                            rowdata += '<td style="text-align:right;">' + accounting.formatNumber(_Summary_CreditSales[row_cnt_cs]["Credit_Sales_Amount"], 0) + '</td>' +
                                '</tr>';
                            amt_creditsales += parseFloat(_Summary_CreditSales[row_cnt_cs]["Credit_Sales_Amount"]);
                        }
                        rowdata += '<tr style="font-size:smaller;">' +
                            '<td style="text-align:right;" colspan=2> Total :</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(amt_creditsales, 0) + '</td>' +
                            '</tr>';
                        rowdata += '</tbody>';
                    }
                    rowdata += '</table>';
                    //Credit Sales End   

                    //Sales Return Start
                    rowdata += '<table class="table table-sm" style="font-size:smaller;width:30%;float:right;">';
                    //rowdata += '</table>';
                    //rowdata += '<table class="table table-sm" style="font-size:smaller;width:40%;float:left;">';
                    if (_Summary_SalesReturn.length > 0) {
                        rowdata += '<thead>' +
                            '<tr style="font-size:smaller;">' +
                            '<th style="text-align:center;" colspan=4>Sales Return Detail</th>' +
                            '</tr>' +
                            '<tr style="text-align:center;font-size:smaller;font-weight:bold;">' +
                            '<th style="text-align:center;">Customer</th>' +
                            '<th style="text-align:center;">ID</th>' +
                            '<th style="text-align:center;">Invoice</th>' +
                            '<th style="text-align:right;">Amount</th>' +
                            '</tr>';
                        rowdata += '</thead>';
                        rowdata += '<tbody>';
                        var qty_salesreturn = 0, amt_salesreturn = 0;
                        for (var row_cnt_sr = 0; row_cnt_sr < _Summary_SalesReturn.length; row_cnt_sr++) {
                            rowdata += '<tr style="font-size:smaller;">' +
                                '<td style="text-align:left;">' + _Summary_SalesReturn[row_cnt_sr]["Customer"] + '</td>' +
                                '<td style="text-align:center;">' + _Summary_SalesReturn[row_cnt_sr]["ID"] + '</td>' +
                                '<td style="text-align:left;">' + _Summary_SalesReturn[row_cnt_sr]["Invoice_ID"] + ' <br/> ' + moment(_Summary_SalesReturn[row_cnt_sr]["Invoice_Date"]).format("DD-MMM-YYYY") + '</td>' +
                                '<td style="text-align:right;">' + accounting.formatNumber(_Summary_SalesReturn[row_cnt_sr]["Net_Amount"], 0) + '</td>' +
                                '</tr>';
                            //qty_salesreturn += parseFloat(_Summary_SalesReturn[row_cnt_sr]["Qty"]);
                            amt_salesreturn += parseFloat(_Summary_SalesReturn[row_cnt_sr]["Net_Amount"]);
                        }
                        rowdata += '<tr style="font-size:smaller;">' +
                            '<td style="text-align:right;"> Total :</td>' +
                            '<td style="text-align:center;"></td>' +
                            '<td style="text-align:right;"></td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(amt_salesreturn, 0) + '</td>' +
                            '</tr>';
                        rowdata += '</tbody>';
                    }
                    rowdata += '</table>';
                    rowdata += '</div>';
                                        //Sales Return End

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


                    rowdata += '<div style="width:100%;" class="card-box table-responsive">';




                    rowdata += '</div>';

                    rowdata += '<p style="page-break-before: always">';
                    detailsTable.append(rowdata);
                }



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
