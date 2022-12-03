var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var cre = sessionStorage.getItem(sessid);


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

        url: apiUrl + '/Sales/Report/GetQuotationReport',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Creteria": cre }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            if (response[0].status == 1) {

                var today = 'Print By : ' + response[0]["Result_Heading"][0]["User_Name"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");

                //Voucher No Start
                const vchno_1 = response[0]["Result"];
                var vchno = [];
                for (i = 0; i < vchno_1.length; i++) {
                    if (vchno.findIndex(x => x._id == vchno_1[i].mpso_id) == -1) {
                        vchno.push({ _id: vchno_1[i].mpso_id });
                    }
                }
                vchno.sort((a, b) => (a._id > b._id) ? 1 : -1);
                //Voucher No End
                for (var row_cnt = 0; row_cnt < vchno.length; row_cnt++) {
                    var rowdata = '';
                    const _transaction = response[0]["Result"].filter(d => d.mpso_id == vchno[row_cnt]["_id"]);
                    //var app = '';
                    //if (_transaction[0]["Cancelled"]) {
                    //    app = '<th colspan=4 style="color:red;text-align:center;">Cancelled</th>';
                    //}
                    //else if (_transaction[0]["Approved"]) {
                    //    app = '<th colspan=4 style="color:green;text-align:center;">Approved</th>';
                    //}
                    //1st Line     
                    rowdata += '<table id="detail_table" class="table table-sm" style="font-size:smaller;">';
                    rowdata += '<thead>' +
                        '<tr>' +
                        '<th colspan="12" style="text-align:center;font-size:14pt;font-weight:bold;">' + _transaction[0]["br_nam"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="12" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Quotation</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="12" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                        '</tr>';
                    //1st Line
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;" colspan="2">To  </th>' +
                        '<th width=100px colspan="4">' + _transaction[0]["cus_nam_rpt"] + '</th>' +
                        //app +
                        '<th width=100px style="font-weight:bold;" colspan="2">Quotation # : </th>' +
                        '<th width=100px colspan="4">' + _transaction[0]["mpso_no"] + '</th>' +
                        '</tr>';

                    //2nd Line 
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;" colspan="2" rowspan="2">Address </th>' +
                        '<th width=100px colspan="4" rowspan="2">' + _transaction[0]["cus_add"] + '</th>' +
                        '<th width=100px style="font-weight:bold;" colspan="2">Date </th>' +
                        '<th width=100px colspan="4">' + moment(_transaction[0]["minv_dat"]).format("DD-MMM-YYYY") + '</th>' +
                        '</tr>';
                    //3rd Line 
                    rowdata += '<tr>' +
                        //'<th width=100px style="font-weight:bold;" colspan="2"> </th>' +
                        '<th width=100px style="font-weight:bold;" colspan="2">Customer S.Tax </th>' +
                        '<th width=100px colspan="4">' + _transaction[0]["cus_stn"] + '</th>' +
                        '</tr>';
                    //4th Line
                    rowdata += '<tr>' +
                        '<th width=100px style="font-weight:bold;" colspan="2">Remarks</th>' +
                        '<th width=100px colspan="4">' + _transaction[0]["mpso_rmk"] + '</th>' +
                        '<th width=100px style="font-weight:bold;" colspan="2">Salesman </th>' +
                        '<th width=100px colspan="4">' + _transaction[0]["emppro_nam"] + '</th>' +
                        '</tr>';
                    //rowdata += '<tr>' +
                    //    '<th width=100px style="font-weight:bold;" colspan="5">' + 'Remarks : ' + _transaction[0]["minv_rmk"] + '</th></tr>';
                    rowdata += '</thead>';

                    rowdata += '<tbody>';
                    rowdata += '<tr style="text-align:center;"><td>S.No.</td><td>Qty</td><td>Description of Goods</td><td>Unit Price in PKR</td><td>Value Excluding Sale Tax</td><td>Sale Tax %</td></td><td>Sale Tax</td></td><td>Further Tax %</td></td><td>Further Tax</td></td><td>Value Excluding Sale Tax in PKR</td></tr>';
                    var sno = 1, qty = 0, amt = 0, othamt = 0, tamt = 0, gstamt = 0,furamt=0, transamt = 0, othamt = 0, loadingamt = 0, unloadingamt = 0, bardanaamt = 0, weightamt = 0;
                    for (var row_cnt_1 = 0; row_cnt_1 < _transaction.length; row_cnt_1++) {

                        rowdata += '<tr style="text-align:center;">' +
                            '<td>' + sno++ + '</td>' +
                            '<td style="text-align:center;">' + _transaction[row_cnt_1]["dpso_qty"] + '</td>' +
                            '<td style="text-align:left;">' + _transaction[row_cnt_1]["titm_nam_rpt"] + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt_1]["dpso_rat"], 2) + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt_1]["dpso_amt"], 0) + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt_1]["dpso_gstper"], 0) + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt_1]["dpso_gstamt"], 0) + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt_1]["dpso_furper"], 0) + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt_1]["dpso_furamt"], 0) + '</td>' +
                            '<td>' + accounting.formatNumber(_transaction[row_cnt_1]["dpso_namt"], 0) + '</td>' +
                            '</tr>';
                        amt += parseFloat(_transaction[row_cnt_1]["dpso_amt"]);
                        gstamt += parseFloat(_transaction[row_cnt_1]["dpso_gstamt"]);
                        furamt += parseFloat(_transaction[row_cnt_1]["dpso_furamt"]);
                        tamt += parseFloat(_transaction[row_cnt_1]["dpso_namt"]);
                    }

                    rowdata += '</tbody>';
                    rowdata += '<tfoot>';
                    rowdata += '<tr>' +
                        '<td style="text-align:center;" colspan=3>Total:</td>' +
                        '<td style="text-align:center;" colspan=1>' + accounting.formatNumber(amt, 0) + '</td>' +
                        '<td style="text-align:right;" colspan=1></td>' +
                        '<td style="text-align:right;" colspan=1></td>' +
                        '<td style="text-align:center;"colspan=1>' + accounting.formatNumber(gstamt, 0) + '</td>' +
                        '<td style="text-align:right;" colspan=1></td>' +
                        '<td style="text-align:center;"colspan=1>' + accounting.formatNumber(furamt, 0) + '</td>' +
                        '<td style="text-align:center;"colspan=1>' + accounting.formatNumber(tamt, 0) + '</td>' +
                        '</tr>';
                    rowdata += ' <tr>' +
                        '<td style="text-align:right;" colspan=8> Gross Total:</td>' +
                        '<td style="text-align:right;" colspan=2>' + parseFloat(_transaction[0]["mpso_amt"])+'</td>' +
                        '</tr>';
                    rowdata += ' <tr>' +
                        '<td style="text-align:right;" colspan=8> Less Discount:</td>' +
                        '<td style="text-align:right;" colspan=2>' + parseFloat(_transaction[0]["mpso_disamt"]) + '</td>' +
                        '</tr>';
                    rowdata += ' <tr>' +
                        '<td style="text-align:right;" colspan=8> Add Sales Tax:</td>' +
                        '<td style="text-align:right;" colspan=2>' + parseFloat(_transaction[0]["mpso_gstamt"]) + '</td>' +
                        '</tr>';
                    rowdata += ' <tr>' +
                        '<td style="text-align:right;" colspan=8> Net Amount:</td>' +
                        '<td style="text-align:right;" colspan=2>' + parseFloat(_transaction[0]["mpso_namt"]) + '</td>' +
                        '</tr>';
                    rowdata += '</tfoot>';
                    rowdata += '</table>';

                    rowdata += '<div class="col-md-12">' +
                        '<div class="col-md-6" style="text-align:right;">Received Signature &</div>' +
                        '<div class="col-md-6" style="text-align:right; border-bottom:1px solid black">&nbsp'+
                        '</div > ' +
                        '</div> ';
                    rowdata += '<div class="col-md-12">' +
                        '<div class="col-md-6" style="text-align:right;">Name</div>' +
                        '<div class="col-md-6" style="text-align:right; border-bottom:1px solid black">&nbsp' +
                        '</div > ' +
                        '</div> ';
                    rowdata += '<div class="col-md-12">' +
                        '<div class="col-md-6" style="text-align:right;">Title</div>' +
                        '<div class="col-md-6" style="text-align:right; border-bottom:1px solid black">&nbsp' +
                        '</div > ' +
                        '</div> ';
                    rowdata += '<div class="col-md-12">' +
                        '<div class="col-md-6" style="text-align:right;">Date</div>' +
                        '<div class="col-md-6" style="text-align:right; border-bottom:1px solid black">&nbsp' +
                        '</div > ' +
                        '</div> ';
                    rowdata += '<div class="col-md-12">&nbsp' +
                        '</div> ';
                    rowdata += '<div class="col-md-12">&nbsp' +
                        '</div> ';
                    rowdata += '<div class="col-md-12">&nbsp' +
                        '</div> ';
                    rowdata += '<div class="table-responsive col-md-12" style="text-align:center;">' +
                        '<div style="float:left; text-align:center; " class="col-md-3">' +
                        '<label>' + _transaction[0]["usr_nam"] + '</label>' +
                        '<hr style="border-style: none none solid none; border-width: thin; margin-top:13px;" />' +
                        '<p style="text-align: center;">Prepared by</p>' +
                        '</div>' +
                        '<div class="col-md-1"></div>'+
                        '<div style="float:left; text-align:center;" class="col-md-3">' +
                        '<label></label>' +
                        '<hr style="border-style: none none solid none; border-width: thin;" />' +
                        '<p style="text-align: center;">Finance</p>' +
                        '</div>' +
                        '<div class="col-md-1"></div>' +
                        '<div style="float:left; text-align:center;" class="col-md-3">' +
                        '<label></label>' +
                        '<hr style="border-style: none none solid none; border-width: thin;" />' +
                        '<p style="text-align: center;">Management</p>' +
                        '</div>';
                    rowdata += '</div>';
                    rowdata += '<p style="page-break-before: always">';

                    detailsTable.append(rowdata);

                }

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