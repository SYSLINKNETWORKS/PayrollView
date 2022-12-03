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

        url: apiUrl + '/Sales/Report/SaleReport/CreditSalesReport',
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
                var today = cre_name+ ' Print By : ' + response[0]["Result_Heading"][0]["User_Name"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                rowdata += '<table class="table table-sm" style = "font-size:smaller;">' +
                    '<thead>' +
                    '<tr>' +
                    '<th colspan="8" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Branch_Name"] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="8" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Credit Sales Report</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="8" id="lbl_usrprt" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th style="text-align:center;">S.No.</th>' +
                    '<th>Salesman</th>' +
                    '<th>Customer</th>' +
                    '<th style="text-align:right;">Credit Sales Detail</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
                //$('#lbl_company_name').html(response[0]["Result_Heading"][0]["Company_Name"]);
                //$("#br_nam").html(response[0]["Result_Heading"][0]["Branch_Name"]);
                //$('#lbl_head').html("Credit Sales Report ");
                //$('#lbl_usrprt').html(today);
                var _amt = 0; sno = 1;
                for (var row_cnt = 0; row_cnt < response[0]["Result"].length; row_cnt++) {
                    rowdata += '<tr >' +
                        '<td style="text-align:center;">' + sno++ + '</td>' +
                        '<td>' + response[0]["Result"][row_cnt]["Salesman_Name"] + '</td>' +
                        '<td>' + response[0]["Result"][row_cnt]["Customer"] + '</td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(response[0]["Result"][row_cnt]["Amount"], 2) + '</td>' +
                        '</tr>';

                    _amt += parseFloat(response[0]["Result"][row_cnt]["Amount"]);


                }
                rowdata += '</tbody>' +
                    '<tfoot>' +
                    '<tr>' +
                    '<td colspan=3 style="text-align:right;">Total : </td>' +
                    '<td style="text-align:right;">' + accounting.formatNumber(_amt, 2) + '</td>' +
                    '</tr>'
                    '</foot>' +
                    '</table>';
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
