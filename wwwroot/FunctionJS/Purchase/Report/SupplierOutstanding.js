var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessidname = sessid_url[2];
var credat = sessid_url[3];
var cre = sessionStorage.getItem(sessid);
var crename = sessionStorage.getItem(sessidname);
//var credat = sessionStorage.getItem(sessiddate);

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

        url: apiUrl + '/Purchase/Report/PurchaseReport/SupplierOutstanding/' + credat,
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

                //Voucher No Start
                const vchno_1 = response[0]["Result"];
                var vchno = [];
                for (i = 0; i < vchno_1.length; i++) {
                    if (vchno.findIndex(x => x._id == vchno_1[i].ID) == -1) {
                        vchno.push({ _id: vchno_1[i].ID });
                    }
                }
                vchno.sort((a, b) => (a._id > b._id) ? 1 : -1);
                //Voucher No End
                var rowdata = '';
                for (var row_cnt = 0; row_cnt < vchno.length; row_cnt++) {
                    const _transaction = response[0]["Result"].filter(d => d.ID == vchno[row_cnt]["_id"]);
                    //1st Line     
                    rowdata += '<table id="detail_table" class="table table-sm" style="font-size:smaller;">';
                    rowdata += '<thead>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Company_Name"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Supplier Outstanding</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:right;font-variant-caps:all-petite-caps;font-size:7pt;font-weight:bold;">' + today + '</th>' +
                        '</tr>';

                    rowdata += '<tr style="text-align:center;"><th>S.No</th><th>Supplier</th><th>Amount</th></tr>';
                    rowdata += '</thead>';

                    rowdata += '<tbody>';
                    var sno = 1; qty = 0, amt = 0;
                    for (var row_cnt_1 = 0; row_cnt_1 < _transaction.length; row_cnt_1++) {
                        var cre_gl = "";
                        var sessid_gl = _transaction[row_cnt_1]["Account_No"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");
                        //Date Start
                        var datfrm = moment(response[0]["Result_Heading"][0]["Date_Start"]).format("DD-MMM-YYYY");
                        var datto = credat;
                        cre_gl = "mvch_dt between '" + datfrm + "' and '" + datto + "'";
                        //Date End
                        //Account Start
                        cre_gl += " and t_dvch.acc_no=" + _transaction[row_cnt_1]["Account_No"];
                        //Account End
                        sessionStorage.setItem(sessid_gl, cre_gl);

                        rowdata += '<tr>' +
                            '<td style="text-align:center;">' + sno++ + '</td>' +
                            '<td width=2000px><a href="#" onclick=window.open("' + apiUrl_View + '/GL_Report/GeneralLedger?1&' + sessid_gl + '&' + datfrm + '&' + datto + '","_blank")>' + _transaction[row_cnt_1]["Supplier"] + '</a></td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_1]["balance"], 2) + '</td>' +
                            '</tr>';
                        amt += parseFloat(_transaction[row_cnt_1]["balance"]);

                    }

                    rowdata += '</tbody>';
                    rowdata += '<tfoot>';
                    rowdata += '<tr>' +
                        '<td style="text-align:right;" colspan=2>Total : </td>' +

                        '<td style="text-align:right;">' + accounting.formatNumber(amt, 0) + '</td>' +
                        '</tr>';
                    //Discount Start
                    //if (parseFloat(_transaction[0]["Discount_Amount"]) > 0) {
                    //    rowdata += '<tr>' +
                    //        '<td style="text-align:right;" colspan=5>Discount</td>' +
                    //        '<td>' + accounting.formatNumber(_transaction[0]["Discount_Per"], 0) + '%</td>' +
                    //        '<td></td>' +
                    //        '<td style="text-align:right;">' + accounting.formatNumber(_transaction[0]["Discount_Amount"], 0) + '</td>' +
                    //        '</tr>';
                    //}
                    //Discount End
                    //GST Start
                    //if (parseFloat(_transaction[0]["GST_Amount"]) > 0) {
                    //    rowdata += '<tr>' +
                    //        '<td style="text-align:right;" colspan=5>GST</td>' +
                    //        '<td>' + accounting.formatNumber(_transaction[0]["GST_Per"], 0) + '%</td>' +
                    //        '<td></td>' +
                    //        '<td style="text-align:right;">' + accounting.formatNumber(_transaction[0]["GST_Amount"], 0) + '</td>' +
                    //        '</tr>';
                    //}
                    //GST End
                    //Net Amount Start
                    //if (parseFloat(_transaction[0]["Amount_Master"]) != parseFloat(_transaction[0]["Net_Amount_Master"])) {
                    //    rowdata += '<tr>' +
                    //        '<td style="text-align:right;" colspan=5>Net Amount</td>' +
                    //        '<td></td>' +
                    //        '<td></td>' +
                    //        '<td style="text-align:right;">' + accounting.formatNumber(_transaction[0]["Net_Amount_Master"], 0) + '</td>' +
                    //        '</tr>';
                    //}
                    //Net Amount End
                    rowdata += '</tfoot>';
                    rowdata += '</table>';
                    //rowdata += '<div class="card-box table-responsive" style="text-align:center;">' +
                    //    '<div style="float:left; width:150px; text-align:center; ">' +
                    //    '<label>' + _transaction[0]["Prepared_By"] + '</label>' +
                    //    '<hr style="border-style: none none solid none; border-width: thin; width: 75%; margin-top:13px;" />' +
                    //    '<p style="text-align: center;">Prepared by</p>' +
                    //    '</div>' +
                    //    '<div style="float:left; width:150px; text-align:center;">' +
                    //    '<label>' + _transaction[0]["Prepared_By"] + '</label>' +
                    //    '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                    //    '<p style="text-align: center;">Checked by</p>' +
                    //    '</div>' +
                    //    '<div style="float:left; width:150px; text-align:center;">' +
                    //    '<label>' + _transaction[0]["Prepared_By"] + '</label>' +
                    //    '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                    //    '<p style="text-align: center;">Approved by</p>' +
                    //    '</div>';

                    rowdata += '</div>';
                    rowdata += '<p style="page-break-before: always">';



                    // }
                }
                detailsTable.append(rowdata);



                imgload.hide();
            }
            else {
                alert(response[0].Remarks);
                imgload.hide();
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
