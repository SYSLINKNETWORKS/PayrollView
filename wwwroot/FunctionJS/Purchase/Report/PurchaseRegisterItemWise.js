var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessidname = sessid_url[2];
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

        url: apiUrl + '/Purchase/Report/PurchaseReport/PurchaseRegisterItemWise',
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
                //$('#lbl_company_name').html(response[0]["Result_Heading"][0]["Company_Name"]);
                //$("#br_nam").html(response[0]["Result_Heading"][0]["Branch_Name"]);
                //$('#lbl_head').html("Voucher");
                //$('#lbl_usrprt').html(today);

                var rowdata = '';
                //1st Line     
                rowdata += '<table id="detail_table" class="table table-sm" style="font-size:smaller;">';
                rowdata += '<thead>' +
                    '<tr>' +
                    '<th colspan="16" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Company_Name"] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="16" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Purchase Register Item Wise</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="16" style="text-align:right;font-variant-caps:all-petite-caps;font-size:7pt;font-weight:bold;">' + today + '</th>' +
                    '</tr>';
                //Brand Start
                const _Brand_1 = response[0]["Result"];
                var _Brand = [];
                for (i = 0; i < _Brand_1.length; i++) {
                    if (_Brand.findIndex(x => x._id == _Brand_1[i].Brand_ID) == -1) {
                        _Brand.push({ _id: _Brand_1[i].Brand_ID, _nam: _Brand_1[i].Brand });
                    }
                }
                _Brand.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                //Brand End
                // rowdata += '<table id="detail_table" class="table table-sm" style="font-size:smaller;">';
                for (var row_cnt_brand = 0; row_cnt_brand < _Brand.length; row_cnt_brand++) {

                   // rowdata += '<thead>';
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;" colspan=11>Brand : ' + _Brand[0]["_nam"] +'</th>' +
                        '</tr>';


                    //Item Start
                    const _Item_1 = response[0]["Result"].filter(d => d.Brand_ID = _Brand[row_cnt_brand]["_id"]);
                    var _Item = [];
                    for (i = 0; i < _Item_1.length; i++) {
                        if (_Item.findIndex(x => x._id == _Item_1[i].Item_ID) == -1) {
                            _Item.push({ _id: _Item_1[i].Item_ID, _nam: _Item_1[i].Item_Name });
                        }
                    }
                    _Item.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                    //Item End
                    for (var row_cnt_item = 0; row_cnt_item < _Item.length; row_cnt_item++) {
                        const _transaction = response[0]["Result"].filter(d => d.Item_ID == _Item[row_cnt_item]["_id"]);
                        rowdata += '<tr>' +
                            '<th width=100px style="font-weight:bold;" colspan=11>Product :' + '[' + _transaction[0]["Item_No"] + ']-' + _transaction[0]["Item_Name"] + '</th>' +
                            '</tr>';
                        rowdata += '<tr style="text-align:center;">' +
                            '<th>S.No</th>' +
                            '<th>ID</th>' +
                            '<th>Date</th>' +
                            '<th>Supplier Bill#</th>' +
                            '<th >Supplier</th>' +
                            '<th>Qty</th>' +
                            '<th>Rate</th>' +
                            '<th>Gross Amount</th>' +
                            '<th>Discount</th>' +
                            '<th>GST</th>' +
                            '<th>Net Amount</th>' +
                            '</tr>';
                        rowdata += '</thead>';

                        rowdata += '<tbody>';
                        var sno = 1; qty = 0, amt = 0, dis = 0, gst = 0, namt = 0;
                        for (var row_cnt_1 = 0; row_cnt_1 < _transaction.length; row_cnt_1++) {
                            var namt_dis_gst = parseFloat(_transaction[row_cnt_1]["Amount"]) - parseFloat(_transaction[row_cnt_1]["Discount_Amount"]) + parseFloat(_transaction[row_cnt_1]["GST_Amount"])
                            rowdata += '<tr>' +
                                '<td style="text-align:center;">' + sno++ + '</td>' +
                                '<td style="text-align:center;">' + _transaction[row_cnt_1]["ID"] + '</td>' +
                                '<td style="text-align:center;">' + moment(_transaction[row_cnt_1]["Date"]).format("DD-MMM-YYYY") + '</td>' +
                                '<td style="text-align:center;">' + _transaction[row_cnt_1]["Supplier_Bill"] + '</td>' +
                                '<td width=2000px>' + _transaction[row_cnt_1]["Supplier"] + '</td>' +
                                '<td style="text-align:center;">' + accounting.formatNumber(_transaction[row_cnt_1]["Qty"], 0) + '</td>' +
                                '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_1]["Rate"], 4) + '</td>' +
                                '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_1]["Amount"], 0) + '</td>' +
                                '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_1]["Discount_Amount"], 0) + '</td>' +
                                '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_1]["GST_Amount"], 0) + '</td>' +
                                '<td style="text-align:right;">' + accounting.formatNumber(namt_dis_gst, 0) + '</td>' +
                                '</tr>';
                            qty += parseFloat(_transaction[row_cnt_1]["Qty"]);
                            amt += parseFloat(_transaction[row_cnt_1]["Amount"]);
                            dis += parseFloat(_transaction[row_cnt_1]["Discount_Amount"]);
                            gst += parseFloat(_transaction[row_cnt_1]["GST_Amount"]);
                            namt += parseFloat(namt_dis_gst);
                        }

                        var avgrat = parseFloat(amt) / parseFloat(qty);
                        rowdata += '<tr  style="color:red;">' +
                            '<td style="text-align:right;" colspan=5>Total</td>' +
                            '<td style="text-align:center;">' + accounting.formatNumber(qty, 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(avgrat, 4) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(amt, 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(dis, 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(gst, 0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(namt, 0) + '</td>' +
                            '</tr>';
                        rowdata += '</tbody>';

                    }
                    rowdata += '</table>';

                    rowdata += '</div>';
                    rowdata += '<p style="page-break-before: always">';

                }
                detailsTable.append(rowdata);



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

function number2text(value) {
    var fraction = Math.round(frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
        f_text = "AND " + convert_number(fraction) + " PAISE";
    }

    return " RUPEE " + convert_number(value) + f_text + " ONLY";
}

function frac(f) {
    return f % 1;
}

function convert_number(number) {
    if ((number < 0) || (number > 999999999)) {
        return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
        res += (convert_number(Gn) + " CRORE");
    }
    if (kn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(kn) + " LAKH");
    }
    if (Hn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(Hn) + " THOUSAND");
    }

    if (Dn) {
        res += (((res == "") ? "" : " ") +
            convert_number(Dn) + " HUNDRED");
    }


    var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN");
    var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY");

    if (tn > 0 || one > 0) {
        if (!(res == "")) {
            res += " AND ";
        }
        if (tn < 2) {
            res += ones[tn * 10 + one];
        }
        else {

            res += tens[tn];
            if (one > 0) {
                res += ("-" + ones[one]);
            }
        }
    }

    if (res == "") {
        res = "zero";
    }
    return res;
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
