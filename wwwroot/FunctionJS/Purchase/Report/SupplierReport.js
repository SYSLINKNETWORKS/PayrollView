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
    ApiForm = apiUrl + '/api/Procurement';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {

    detailsTable = $("#div_supplier");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PurchaseReport/SupplierReport',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                console.log(response["data"][0], response["data"].length);
                var _TotalQty = 0, _TotalAmount = 0;
                var rowdata = '';
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';

                rowdata += '<thead>';

                var today = 'Print By : ' + response["data"][0]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");

                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=20>Teamwork Packages (Pvt) Ltd </th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=20>' + response["data"][0]["headingName"] + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=20>' + today + '</th></tr>';


                rowdata += '</thead>';

                rowdata += '<thead>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<th>Sr#</th>' +
                    // '<th>Supplier Code</th>' +
                    '<th>Supplier Name</th>' +
                    '<th >Contact Person</th>' +
                    '<th>Mobile</th>' +
                    '<th>Telephone#</th>' +
                    '<th>Email</th>' +
                    '<th colspan="2" >Category</th>' +
                    '<th>Address</th>' +
                    '</tr>';
                rowdata += '</thead>';
                rowdata += '<body>';

                for (var row_cnt = 0; row_cnt < response["data"].length; row_cnt++) {
                    var _styleBalance = parseFloat(response["data"][row_cnt]["balanceQty"]) < 0 ? "style='color:red'" : parseFloat(response["data"][row_cnt]["balanceQty"]) > 0 ? "style='color:orange'" : "";
                    var _styleStatus = response["data"][row_cnt]["status"] == "InProcess" ? "style='color:red'" : response["data"][row_cnt]["status"] == "Complete" ? "style='color:green'" : "";
                    rowdata += '<tr>' +
                        '<td >' + (row_cnt + 1) + '</td>' +
                        '<td >' + response["data"][row_cnt]["supplierName"] + '</td>' +
                        '<td >' + response["data"][row_cnt]["contactPerson"] + '</td>' +
                        '<td >' + response["data"][row_cnt]["mobile"] + '</td>' +
                        '<td >' + response["data"][row_cnt]["telephoneNo"] + '</td>' +
                        '<td >' + response["data"][row_cnt]["email"] + '</td>' +
                        '<td colspan="2" >' + response["data"][row_cnt]["category"] + '</td>' +
                        '<td >' + response["data"][row_cnt]["address"] + '</td>' +
                        '</tr>';
                }
                rowdata += '</body>';


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