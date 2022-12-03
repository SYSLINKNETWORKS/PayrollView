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

        url: apiUrl + '/Sales/Report/SaleReport/Receipt',
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
                        '<th colspan="8" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Branch_Name"] + '</th>' +
                        '</tr>' +
                        '<th colspan="8" style="text-align:center;font-size:8pt;">' + response[0]["Result_Heading"][0]["Branch_Address"] + '<br/>' + response[0]["Result_Heading"][0]["Branch_Phone"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Receipt</th>' +
                        '</tr>';

                    //1st Line
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;">ID #</th>' +
                        '<th width=100px>' + _transaction[0]["ID"] + '</th>' +
                        '<th colspan=4></th>' +
                        '<th width=100px style="font-weight:bold;">Date : </th>' +
                        '<th width=100px>' + moment(_transaction[0]["Date"]).format("DD-MMM-YYYY") + '</th>' +
                        '</tr>';
                    //2nd Line 

                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;">Messers</th>' +
                        '<th width=100px colspan=7>' + _transaction[0]["Customer"] + '</th>' +
                        '</tr>';

                    //3rd Line
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;">Salesman</th>' +
                        '<th width=100px>' + _transaction[0]["Salesman_Name"] + '</th>' +
                        '<th colspan=2>Mode of Payment</th>' +
                        '<th colspan=2>' + _transaction[0]["CBJ"] + '</th>' +
                        '<th width=100px style="font-weight:bold;">Salesman By</th>' +
                        '<th width=100px colspan=3>' + _transaction[0]["Salesman_Name_By"] + '</th>' +
                        '</tr>';

                    //4th Line
                    if (_transaction[0]["MOP"] == 'B') {
                        rowdata += '<tr>' +
                            '<th width=100px style="font-weight:bold;">Chq #</th>' +
                            '<th width=100px>' + _transaction[0]["Chq_No"] + '</th>' +
                            '<th colspan=2>Chq Date</th>' +
                            '<th colspan=4>' + moment(_transaction[0]["Chq_Date"]).format("DD-MMM-YYYY") + '</th>' +
                            '</tr>';
                    }
                    rowdata += '</thead>';

                    rowdata += '<tbody>';
                    rowdata += '<tr style="text-align:center;"><td>S.No</td><td>Invoice #</td><td>Invoice Date</td><td colspan=4>Customer</td><td>Amount</td></tr>';
                    var sno = 1; qty = 0, amt = 0;
                    for (var row_cnt_1 = 0; row_cnt_1 < _transaction.length; row_cnt_1++) {
                        rowdata += '<tr>' +
                            '<td style="text-align:center;">' + sno++ + '</td>' +
                            '<td style="text-align:center;">' + _transaction[row_cnt_1]["Invoice_ID"] + '</td>' +
                            '<td style="text-align:center;">' + moment(_transaction[row_cnt_1]["Invoice_Date"]).format("DD-MMM-YYYY") + '</td>' +
                            '<td colspan=4 width=2000px>' + _transaction[row_cnt_1]["Customer"] + '</td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_1]["Receive_Amount"], 0) + '</td>' +
                            '</tr>';
                        amt += Number(_transaction[row_cnt_1]["Receive_Amount"]);

                    }

                    rowdata += '<tr>' +
                        '<td style="text-align:right;" colspan=7>Total</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(amt, 0) + '</td>' +
                        '</tr>';
                    rowdata += '</tbody>';
                    rowdata += '</table>';
                    rowdata += '<div class="card-box table-responsive" style="text-align:left;font-size:smaller; ">Remarks <u>' + _transaction[0]["Remarks"] + '</u></div>';
                    rowdata += '<br/>';
                    rowdata += '<div class="card-box table-responsive" style="text-align:right;font-size:smaller; ">For ' + response[0]["Result_Heading"][0]["Branch_Name"] + ' </div>';
                    rowdata += '<br/>';
                    rowdata += '<div class="card-box table-responsive" style="text-align:center;font-size:smaller; ">This is computer generated document, it does not require initials</div>';


                    rowdata += '<p style="page-break-before: always">';



                    // }
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

//function convertNumberToWords(amount) {
//    var words = new Array();
//    words[0] = '';
//    words[1] = 'One';
//    words[2] = 'Two';
//    words[3] = 'Three';
//    words[4] = 'Four';
//    words[5] = 'Five';
//    words[6] = 'Six';
//    words[7] = 'Seven';
//    words[8] = 'Eight';
//    words[9] = 'Nine';
//    words[10] = 'Ten';
//    words[11] = 'Eleven';
//    words[12] = 'Twelve';
//    words[13] = 'Thirteen';
//    words[14] = 'Fourteen';
//    words[15] = 'Fifteen';
//    words[16] = 'Sixteen';
//    words[17] = 'Seventeen';
//    words[18] = 'Eighteen';
//    words[19] = 'Nineteen';
//    words[20] = 'Twenty';
//    words[30] = 'Thirty';
//    words[40] = 'Forty';
//    words[50] = 'Fifty';
//    words[60] = 'Sixty';
//    words[70] = 'Seventy';
//    words[80] = 'Eighty';
//    words[90] = 'Ninety';
//    amount = amount.toString();
//    var atemp = amount.split(".");
//    var number = atemp[0].split(",").join("");
//    var n_length = number.length;
//    var words_string = "";
//    if (n_length <= 9) {
//        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//        var received_n_array = new Array();
//        for (var i = 0; i < n_length; i++) {
//            received_n_array[i] = number.substr(i, 1);
//        }
//        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
//            n_array[i] = received_n_array[j];
//        }
//        for (var i = 0, j = 1; i < 9; i++, j++) {
//            if (i == 0 || i == 2 || i == 4 || i == 7) {
//                if (n_array[i] == 1) {
//                    n_array[j] = 10 + parseInt(n_array[j]);
//                    n_array[i] = 0;
//                }
//            }
//        }
//        value = "";
//        for (var i = 0; i < 9; i++) {
//            if (i == 0 || i == 2 || i == 4 || i == 7) {
//                value = n_array[i] * 10;
//            } else {
//                value = n_array[i];
//            }
//            if (value != 0) {
//                words_string += words[value] + " ";
//            }
//            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
//                words_string += "Crores ";
//            }
//            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
//                words_string += "Lakhs ";
//            }
//            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
//                words_string += "Thousand ";
//            }
//            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
//                words_string += "Hundred and ";
//            } else if (i == 6 && value != 0) {
//                words_string += "Hundred ";
//            }
//        }
//        words_string = words_string.split("  ").join(" ");
//    }
//    return words_string;
//}