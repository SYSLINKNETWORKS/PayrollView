var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessid_name = sessid_url[2];
var dat_frm = sessid_url[3];
var dat_to = sessid_url[4];
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

        url: apiUrl + '/Sales/Report/SaleReport/ItemSalesSummaryReport/' + dat_frm + '/' + dat_to,
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
                    '<th colspan="9" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Branch_Name"] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="9" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Item Sales Summary Report</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="9" id="lbl_usrprt" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
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
                var _qty_master = 0, _amt_master = 0, _bqty_master = 0, _retqty_master = 0, _retamt_master = 0, _netamt_master = 0;
                for (var row_cnt_bd = 0; row_cnt_bd < _Brand.length; row_cnt_bd++) {
                    rowdata += '<thead>';
                    rowdata += '<tr>' +
                        '<th colspan=9 style="text-align:center;">' + _Brand[row_cnt_bd]["_nam"] + '</th>' +
                        '</tr>';
                    rowdata += '<tr>' +
                        '<th style="text-align:center;">S.No.</th>' +
                        '<th style="text-align:center;">Item No</th>' +
                        '<th style="text-align:center;">Item</th>' +
                        '<th style="text-align:right;">Sale Qty</th>' +
                        '<th style="text-align:right;">Sale Amount</th>' +
                        '<th style="text-align:right;">Bonus</th>' +
                        '<th style="text-align:right;">Ret. Qty</th>' +
                        '<th style="text-align:right;">Ret. Amount</th>' +
                        '<th style="text-align:right;">Net Amount</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    const _transaction = response[0]["Result"].filter(d => d.Brand_ID == _Brand[row_cnt_bd]["_id"]);
                    _transaction.sort((a, b) => (a.Item_No > b.Item_No) ? 1 : -1);
                    var sno = 1, _qty = 0, _amt = 0, _bqty = 0, _retqty = 0, _retamt = 0, _netamt = 0;
                    rowdata += '<tbody>';
                    for (var row_cnt_t = 0; row_cnt_t < _transaction.length; row_cnt_t++) {
                        var _namt = parseFloat(_transaction[row_cnt_t]["Sales_Amount"]) - parseFloat(_transaction[row_cnt_t]["Return_Amount"])
                        rowdata += '<tr>' +
                            '<td style="text-align:center;">' + sno++ + '</td>' +
                            '<td>' + _transaction[row_cnt_t]["Item_No"] + '</td>' +
                            '<td>' + _transaction[row_cnt_t]["Item_Name"] + '</td>' +
                            '<td style="text-align:center;">' + _transaction[row_cnt_t]["Sales_Qty"] + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["Sales_Amount"], 2) + '</td>' +
                            '<td style="text-align:center;">' + accounting.formatNumber(_transaction[row_cnt_t]["Sales_BonusQty"], 0) + '</td>' +
                            '<td style="text-align:center;">' + accounting.formatNumber(_transaction[row_cnt_t]["Return_Qty"], 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["Return_Amount"], 2) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_namt, 2) + '</td>' +
                            '</tr>';
                        _qty += parseFloat(_transaction[row_cnt_t]["Sales_Qty"]);
                        _amt += parseFloat(_transaction[row_cnt_t]["Sales_Amount"]);
                        _bqty += parseFloat(_transaction[row_cnt_t]["Sales_BonusQty"]);
                        _retqty += parseFloat(_transaction[row_cnt_t]["Return_Qty"]);
                        _retamt += parseFloat(_transaction[row_cnt_t]["Return_Amount"]);
                        _netamt += parseFloat(_namt);


                        _qty_master += parseFloat(_transaction[row_cnt_t]["Sales_Qty"]);
                        _amt_master += parseFloat(_transaction[row_cnt_t]["Sales_Amount"]);
                        _bqty_master += parseFloat(_transaction[row_cnt_t]["Sales_BonusQty"]);
                        _retqty_master += parseFloat(_transaction[row_cnt_t]["Return_Qty"]);
                        _retamt_master += parseFloat(_transaction[row_cnt_t]["Return_Amount"]);
                        _netamt_master += parseFloat(_namt);

                    }
                    rowdata += '<tr style="color:red;">' +
                        '<td colspan=3 style="text-align:right;">' + _Brand[row_cnt_bd]["_nam"] + ' Total : </td>' +
                        '<td style="text-align:center;">' + _qty + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_amt, 2) + '</td>' +
                        '<td style="text-align:center;">' + _bqty + '</td>' +
                        '<td style="text-align:center;">' + _retqty + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_retamt, 2) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_netamt, 2) + '</td>' +
                        '</tr>';

                }

                rowdata += '<tr style="color:red;">' +
                    '<td colspan=3 style="text-align:right;">Grand Total : </td>' +
                    '<td style="text-align:center;">' + _qty_master + '</td>' +
                    '<td style="text-align:right;">' + accounting.formatNumber(_amt_master, 2) + '</td>' +
                    '<td style="text-align:center;">' + _bqty_master + '</td>' +
                    '<td style="text-align:center;">' + _retqty_master + '</td>' +
                    '<td style="text-align:right;">' + accounting.formatNumber(_retamt_master, 2) + '</td>' +
                    '<td style="text-align:right;">' + accounting.formatNumber(_netamt_master, 2) + '</td>' +
                    '</tr>';
                rowdata += '</tbody>';

                rowdata += '</table>';
                //Summary Start
                rowdata += '<div class="card-box table-responsive">';
                rowdata += '<div class="form-group">';
                rowdata += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style = "font-size:smaller;text-align:center;color:red;">Summary';
                rowdata += '</div>';
                rowdata += '</div>';

                //First Line
                rowdata += '<div class="form-group">';
                rowdata += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">Total Gross Sales:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10" style = "font-size:smaller;">' + accounting.formatNumber(response[0]["Result_Summary"][0]["Sale_Amount"], 0);
                rowdata += '</div>';
                rowdata += '</div>';


                //Second Line
                rowdata += '<div class="form-group">';
                rowdata += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">Total Return:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Net_Amount"], 0);
                rowdata += '</div>';

                rowdata += '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style = "font-size:smaller;">Discount:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Discount"], 0);
                rowdata += '</div>';

                rowdata += '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style = "font-size:smaller;">Tax:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Tax"], 0);
                rowdata += '</div>';

                rowdata += '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style = "font-size:smaller;">Return:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style = "font-size:smaller;">' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Amount"], 0);
                rowdata += '</div>';

                rowdata += '</div>';

                //Third Line
                var grosssales = parseFloat(response[0]["Result_Summary"][0]["Sale_Amount"]) - parseFloat(response[0]["Result_Summary"][0]["Return_Net_Amount"]);
                rowdata += '<div class="form-group">';
                rowdata += '<div  class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">Total Gross Sales:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10" style = "font-size:smaller;">' + accounting.formatNumber(grosssales, 0);
                rowdata += '</div>';
                rowdata += '</div>';

                //Fourth Line
                rowdata += '<div class="form-group">';
                rowdata += '<div  class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">Total Discount:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10" style = "font-size:smaller;">' + accounting.formatNumber(response[0]["Result_Summary"][0]["Sale_Discount"], 0);
                rowdata += '</div>';
                rowdata += '</div>';

                //Fifth Line
                rowdata += '<div class="form-group">';
                rowdata += '<div  class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">Total Sales Tax:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10" style = "font-size:smaller;">' + accounting.formatNumber(response[0]["Result_Summary"][0]["Sale_Tax"], 0);
                rowdata += '</div>';
                rowdata += '</div>';

                //Sixth Line
                var netsales = parseFloat(grosssales) - parseFloat(response[0]["Result_Summary"][0]["Sale_Discount"]) + parseFloat(response[0]["Result_Summary"][0]["Sale_Tax"]);
                rowdata += '<div class="form-group">';
                rowdata += '<div  class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style = "font-size:smaller;">Total Net Sales:';
                rowdata += '</div>';
                rowdata += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10" style = "font-size:smaller;">' + accounting.formatNumber(netsales, 0);
                rowdata += '</div>';
                rowdata += '</div>';


                rowdata += '</div>';
                //rowdata += '<table class="table table-sm" style = "font-size:smaller;">';
                //rowdata += '<tbody>';
                //rowdata += '<tr style="color:red;">' +
                //    '<td colspan=8 style="text-align:center;">Summary </td>' +
                //    '</tr>';

                ////First Line
                //rowdata += '<tr>' +
                //    '<td>Total Gross Sales:  </td>' +
                //    '<td>' + accounting.formatNumber(response[0]["Result_Summary"][0]["Sale_Amount"], 0) + '</td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '</tr>';

                ////Second Line
                //rowdata += '<tr>' +
                //    '<td>Total Return </td>' +
                //    '<td>' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Net_Amount"], 0) + '</td>' +
                //    '<td>Return Discount</td>' +
                //    '<td>' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Discount"], 0) + '</td>' +
                //    '<td>Return Tax</td>' +
                //    '<td>' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Tax"], 0) + '</td>' +
                //    '<td>Return</td>' +
                //    '<td>' + accounting.formatNumber(response[0]["Result_Summary"][0]["Return_Amount"], 0) + '</td>' +
                //    '</tr>';

                ////Third Line
                //var grosssales = parseFloat(response[0]["Result_Summary"][0]["Sale_Amount"]) - parseFloat(response[0]["Result_Summary"][0]["Return_Net_Amount"]);
                //rowdata += '<tr>' +
                //    '<td>Total Gross Sales </td>' +
                //    '<td>' + accounting.formatNumber(grosssales, 0) + '</td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '</tr>';

                ////Fourth Line
                //rowdata += '<tr>' +
                //    '<td>Total Discount </td>' +
                //    '<td>' + accounting.formatNumber(response[0]["Result_Summary"][0]["Sale_Discount"], 0) + '</td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '</tr>';

                ////Fifth Line
                //rowdata += '<tr>' +
                //    '<td>Total Sales Tax </td>' +
                //    '<td>' + accounting.formatNumber(response[0]["Result_Summary"][0]["Sale_Tax"], 0) + '</td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '</tr>';

                ////Sixth Line
                //var netsales = parseFloat(grosssales) - parseFloat(response[0]["Result_Summary"][0]["Sale_Discount"]) + parseFloat(response[0]["Result_Summary"][0]["Sale_Tax"]);

                //rowdata += '<tr>' +
                //    '<td>Total Net Sales </td>' +
                //    '<td>' + accounting.formatNumber(netsales, 0) + '</td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '<td></td>' +
                //    '</tr>';

                //rowdata += '</tbody>';
                //rowdata += '</table>';
                //Summary End

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
