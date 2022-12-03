var imgload = $("#img_load");
var ApiForm = '';

var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);

var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);
$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();
});
function printReport() {
    detailsTable = $("#detail_table");
    detailsTable.empty();

    divheader = $("#div_header");
    $.ajax({

        url: ApiForm + '/Reports/GetVoucher',
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
                var today = 'Print By : ' + response["data"]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");


                //Voucher No Start
                const vchno_1 = response["data"];

                var vchno = [];
                for (i = 0; i < vchno_1.length; i++) {

                    if (vchno.findIndex(x => x._id == vchno_1[i].voucherNo) == -1) {
                        vchno.push({ _id: vchno_1[i].voucherNo });
                    }
                }
                vchno.sort((a, b) => (a._id > b._id) ? 1 : -1);

                //Voucher No End
                var rowdata = '';
                for (var row_cnt = 0; row_cnt < vchno.length; row_cnt++) {
                    const _transaction = response["data"].filter(d => d.voucherNo == vchno[row_cnt]["_id"]);
                    var app = '<th colspan=4 style="color:red;text-align:center;"></th>';;

                    if (_transaction[0]["checked"] == false) {
                        app = '<th colspan=4 style="color:red;text-align:center;">Un-check</th>';
                    }
                    else if (_transaction[0]["approved"] == false) {
                        app = '<th colspan=4 style="color:red;text-align:center;">Un-approved</th>';
                    }
                    if (_transaction[0]["approved"] == true) {

                        if (['03', '04'].includes(_transaction[0]["voucherTypeNo"])) {
                            if (_transaction[0]["chqClear"] == false) {
                                app = '<th colspan=4 style="color:green;text-align:center;">Approved / chq Un-cleared</th>';
                            }
                            else if (_transaction[0]["chqClear"] == true) {
                                app = '<th colspan=4 style="color:green;text-align:center;">Approved / chq cleared</th>';
                            }

                        }
                        else {
                            app = '<th colspan=4 style="color:green;text-align:center;">Approved</th>';
                        }
                    }

                    //1st Line     
                    rowdata += '<table id="detail_table" class="table table-sm" style="font-size:smaller;">';
                    rowdata += '<thead>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:center;font-size:14pt;font-weight:bold;">' + _transaction[0]["companyName"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Voucher</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                        '</tr>';
                    //1st Line
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;">Voucher #</th>' +
                        '<th width=100px>' + _transaction[0]["voucherId"] + '</th>' +
                        app +
                        '<th width=100px style="font-weight:bold;">Date : </th>' +
                        '<th width=100px>' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + '</th>' +
                        '</tr>';
                    //2nd Line 
                    if (['01', '03'].includes(_transaction[0]["voucherTypeNo"])) {
                        rowdata += '<tr>' +
                            '<th width=100px style="font-weight:bold;">Receive from</th>' +
                            '<th colspan=7>' + _transaction[0]["paidFrom"] + '</th>' +
                            '</tr>';
                    }
                    else if (['02', '04'].includes(_transaction[0]["voucherTypeNo"])) {
                        rowdata += '<tr>' +
                            '<th width=100px style="font-weight:bold;">Paid to</th>' +
                            '<th colspan=7>' + _transaction[0]["paidFrom"] + '</th>' +
                            '</tr>';
                    }
                    //3nd Line 
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;">Remarks</th>' +
                        '<th colspan=7>' + _transaction[0]["remarks"] + '</th>' +
                        '</tr>';
                    //4nd Line 

                    if (['03', '04'].includes(_transaction[0]["voucherTypeNo"])) {

                        rowdata += '<tr>' +
                            '<th width=100px style="font-weight:bold;">Chq # </th>' +
                            '<th width=100px colspan=2>' + _transaction[0]["chqNo"] + '</th>' +
                            '<th width=100px style="font-weight:bold;">Chq Date </th>' +
                            '<th width=100px colspan=2>' + moment(_transaction[0]["chqDate"]).format("DD-MMM-YYYY") + '</th>' +
                            '<th colspan=2></th>' +
                            '</tr>';
                    }
                    rowdata += '</thead>';

                    rowdata += '<tbody>';
                    rowdata += '<tr style="text-align:center;"><td>Account ID</td><td>Account Name</td><td colspan=4>Narration</td><td>Debit</td><td>Credit</td></tr>';
                    const _transaction_detail = _transaction[0]["voucherReportDetailViewModel"];
                    var dramt = 0, cramt = 0;
                    for (var row_cnt_1 = 0; row_cnt_1 < _transaction_detail.length; row_cnt_1++) {

                        rowdata += '<tr>' +
                            '<td>' + _transaction_detail[row_cnt_1]["accountId"] + '</td>' +
                            '<td>' + _transaction_detail[row_cnt_1]["accountName"] + '</td>' +
                            '<td colspan=4 width=2000px>' + _transaction_detail[row_cnt_1]["narration"] + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction_detail[row_cnt_1]["debit"], 2) + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction_detail[row_cnt_1]["credit"], 2) + '</td>' +
                            '</tr>';
                        dramt = parseFloat(dramt) + parseFloat(_transaction_detail[row_cnt_1]["debit"]);
                        cramt = parseFloat(cramt) + parseFloat(_transaction_detail[row_cnt_1]["credit"]);

                    }

                    rowdata += '</tbody>';
                    rowdata += '<tfoot>';
                    rowdata += '<tr>' +
                        '<td style="text-align:left;" colspan=6>' + numberToWords(dramt).toUpperCase() + ' </td>' +
                        '<td style="text-align:right;">' +  accounting.formatNumber(dramt, 2) + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(cramt, 2) + '</td>' +
                        '</tr>';
                    rowdata += '</tfoot>';
                    rowdata += '</table>';
                    rowdata += '<div class="card-box table-responsive" style="text-align:center;color:black">' +
                        '<div style="float:left; width:150px; text-align:center; ">' +
                        '<label>' + _transaction[0]["userNamePrepared"] + '</label>' +
                        '<hr style="border-style: none none solid none; border-width: thin; width: 75%; margin-top:13px;" />' +
                        '<p style="text-align: center;">Prepared by</p>' +
                        '</div>' +
                        '<div style="float:left; width:150px; text-align:center;">' +
                        '<label>' + _transaction[0]["userNameCheck"] + '</label>' +
                        '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                        '<p style="text-align: center;">Checked by</p>' +
                        '</div>' +
                        '<div style="float:left; width:150px; text-align:center;">' +
                        '<label>' + _transaction[0]["userNameApproved"] + '</label>' +
                        '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                        '<p style="text-align: center;">Approved by</p>' +
                        '</div>';
                    if (_transaction[0]["voucherTypeNo"] != '05') {
                        rowdata += '<div style="float:left; width:200px; border:2px solid black; height:100px; text-align:center;">' +
                            '<label></label>' +
                            '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />';
                        if (['01', '03'].includes(_transaction[0]["voucherTypeNo"])) {
                            rowdata += '<p style="text-align: center;">Received by</p>';
                        }
                        else if (['02', '04'].includes(_transaction[0]["voucherTypeNo"])) {
                            rowdata += '<p style="text-align: center;">Paid to</p>';
                        }
                        rowdata += '</div>';
                        //  }
                    }
                    rowdata += '</div>';
                    rowdata += '<p style="page-break-before: always">';



                    //}
                }
                detailsTable.append(rowdata);



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


function numberToWords(number) {

    var digit = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var elevenSeries = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var countingByTens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    var shortScale = ['', 'thousand', 'million', 'billion', 'trillion'];
    number = number.toString(); number = number.replace(/[\, ]/g, '');
    if (number != parseFloat(number)) return 'not a number';
    var x = number.indexOf('.');
    if (x == -1) x = number.length;
    if (x > 15) return 'too big';
    var n = number.split('');
    var str = ''; var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') { str += elevenSeries[Number(n[i + 1])] + ' '; i++; sk = 1; }
            else if (n[i] != 0) { str += countingByTens[n[i] - 2] + ' '; sk = 1; }
        }
        else if (n[i] != 0) {
            str += digit[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        } if ((x - i) % 3 == 1) {
            if (sk) str += shortScale[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    } if (x != number.length) {
        var y = number.length; str += 'point ';
        for (var i = x + 1; i < y; i++) str += digit[n[i]] + ' ';
    } str = str.replace(/\number+/g, ' ');
    return str.trim() + " Only";

}
// function number2text(value) {

//     var fraction = Math.round(frac(value) * 100);
//     var f_text = "";

//     if (fraction > 0) {
//         f_text = "AND " + convert_number(fraction) + " PAISE";
//     }

//     return " RUPEE " + convert_number(value) + f_text + " ONLY";
// }

// function frac(f) {
//     return f % 1;
// }

// function convert_number(number) {

//     if ((number < 0) || (number > 999999999)) {
//         return "NUMBER OUT OF RANGE!";
//     }


//     var Gn = Math.floor(number / 10000000);  /* Crore */
//     number -= Gn * 10000000;
//     // var Mn = (number / 1000000).toFixed(1);   /* Million */
//     // number -= Mn * 1000000;
//     var kn = Math.floor(number / 100000);     /* lakhs */
//     number -= kn * 100000;
//     var Hn = Math.floor(number / 1000);      /* thousand */
//     number -= Hn * 1000;
//     var Dn = Math.floor(number / 100);       /* Tens (deca) */
//     number = number % 100;               /* Ones */
//     var tn = Math.floor(number / 10);
//     var one = Math.floor(number % 10);
//     var res = "";


//     if (Gn > 0) {
//         res += (convert_number(Gn) + " CRORE");
//     }

//     // if(Mn > 0 )
//     // {
//     //     res += convert_number(Mn) + " MILLION";

//     // }
//     if (kn > 0) {
//         res += (((res == "") ? "" : " ") +
//             convert_number(kn) + " LAKH");
//     }
//     if (Hn > 0) {
//         res += (((res == "") ? "" : " ") +
//             convert_number(Hn) + " THOUSAND");
//     }

//     if (Dn) {
//         res += (((res == "") ? "" : " ") +
//             convert_number(Dn) + " HUNDRED");
//     }


//     var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN");
//     var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY");

//     if (tn > 0 || one > 0) {
//         if (!(res == "")) {
//             res += " AND ";
//         }
//         if (tn < 2) {
//             res += ones[tn * 10 + one];
//         }
//         else {

//             res += tens[tn];
//             if (one > 0) {
//                 res += ("-" + ones[one]);
//             }
//         }
//     }

//     if (res == "" ) {
//         res = "zero";
//     }
//     return res;
// }
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