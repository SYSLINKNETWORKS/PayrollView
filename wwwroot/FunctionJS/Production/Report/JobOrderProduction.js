var imgload = $("#img_load");
//var currentURL = document.URL;
var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);

var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Production';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {

    detailsTable = $("#div_joborderProduction");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/ProductionReport/GetJobProduction',
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

                var rowdata = '';
                // rowdata = '<table id="detail_table" class="table" style="font-size:10pt;">';
                // rowdata += '<thead>';
                // rowdata += '<tr><td  colspan="5"><h2 style="text-align:center">JobOrder Report<h2></td></tr>'
                // rowdata += '</thead>';
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';
                var today = 'Print By : ' + response.data["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");

                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=11>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=11>' + response.data["headingName"] + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=11>' + today + '</th></tr>';
                rowdata += '</thead>';

                rowdata += '<thead>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<th>S.No</th>' +
                    '<th>Job#</th>' +
                    '<th>SO#</th>' +
                    '<th>Date</th>' +
                    '<th>Customer</th>' +
                    '<th>Item</th>' +
                   // '<th>Description</th>' +
                    '<th>Paper</th>' +
                    '<th>Order Qty</th>' +
                    '<th>Sheet Qty</th>' +
                    '<th>UPS</th>' +
                    '<th>Status</th>' +
                    '</tr>';
                rowdata += '</thead>';

                const productiondepartment = response.data["jobOrderProductionDetails"];
                var count = 1;
                rowdata += '<tbody>';
                for (row_cnt_filter = 0; row_cnt_filter < productiondepartment.length; row_cnt_filter++) {
                    rowdata += '<tr>' +
                        '<td>' + count + '</td>' +
                        '<td>' + productiondepartment[row_cnt_filter]["jobNo"] + '</td>' +
                        '<td>' + productiondepartment[row_cnt_filter]["saleOrderNo"] + '</td>' +
                        '<td>' + moment(productiondepartment[row_cnt_filter]["date"]).format('DD-MM-YYYY') + '</td>' +
                        '<td>' + productiondepartment[row_cnt_filter]["customerName"] + '</td>' +
                        '<td>' + productiondepartment[row_cnt_filter]["itemName"] + '</td>' +
                       // '<td style="Font-wight:bold;">' + productiondepartment[row_cnt_filter]["description"] + '</td>' +
                        '<td>' + productiondepartment[row_cnt_filter]["itemNamePaper"] + '</td>' +
                        '<td>' + (productiondepartment[row_cnt_filter]["orderQty"] != '' ? accounting.format(productiondepartment[row_cnt_filter]["orderQty"], 0) : '') + '</td>' +
                        '<td>' + (productiondepartment[row_cnt_filter]["sheetQty"] != '' ? accounting.format(productiondepartment[row_cnt_filter]["sheetQty"], 0) : '') + '</td>' +
                        '<td>' + productiondepartment[row_cnt_filter]["ups"] + '</td>' +
                        '<td>' + (!Boolean(productiondepartment[row_cnt_filter]["status"]) ? 'Open' : 'Close <br/>' + moment(productiondepartment[row_cnt_filter]["dateClose"]).format('DD-MM-YYYY')) + '</td>'//(Boolean(productiondepartment[row_cnt_filter]["status"]) ? 'Open' : 'Close <br/>' + moment(productiondepartment[row_cnt_filter]["dateClose"]).format('DD-MM-YYYY')) + '</td>' +
                    '</tr>';

                    // rowdata += ' <tr><td><b>So#:</b></td><td>' + count + '</td><td> ' + productiondepartment[row_cnt_filter]["customerName"] + ' </td><td>Item:</td><td >' + productiondepartment[row_cnt_filter]["itemName"] + '</td></tr>';
                    // rowdata += ' <tr><td><b>Description:</b></td><td style="width:400px"> ' + productiondepartment[row_cnt_filter]["description"] + ' </td><td></td><td></td></tr>';
                    // rowdata += ' <tr><td><b>Delivery Date</b></td><td> ' + moment(productiondepartment[row_cnt_filter]["deliveryDate"]).format("MM-DD-YYYY") + ' </td><td>Order Qty</td><td>' + productiondepartment[row_cnt_filter]["orderQty"] + '</td><td>Qty</td><td>' + productiondepartment[row_cnt_filter]["qty"] + '</td></tr>';

                    count = count + 1;

                }
                rowdata += '</tbody">';
                rowdata += '</table>';
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

function viewEmployeeDetail(sessidEmployeeProfileDetail) {

    window.open(apiUrl_View + '/Payroll/Report/EmployeeProfileDetail?S=' + sessidEmployeeProfileDetail, '_blank');

}
function viewDocuments(sessidDocumentDetail) {
    window.open(apiUrl_View + '/Payroll/Report/EmployeeProfileDocument?S=' + sessidDocumentDetail, '_blank');

}