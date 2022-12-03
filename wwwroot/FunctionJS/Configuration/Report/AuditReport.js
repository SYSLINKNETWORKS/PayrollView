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
    ApiForm = apiUrl + '/api/Log';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {
    detailsTable = $("#div_Audit");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/Report/GetAuditReport',
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
                const _creObj = JSON.parse(_cre);
                var _MenuID = _creObj.menuId;


                var _columnno = 13;
                var today = 'Print By : ' + response["data"]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var rowdata = '';
                rowdata = '<table id="detail_table_master" class="table table-responsive" style="font-size:8pt;" >';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=' + _columnno + ' >' + response["data"]["companyName"] + ' </th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=' + _columnno + ' >' + response["data"]["headingName"] + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=' + _columnno + ' >' + today + '</th></tr>';
                rowdata += '</thead>';
                rowdata += '</table>';



                var _sno = 0;
                rowdata += '<table id="detail_table" class="table table-responsive table-bordered" style="font-size:7pt;" >';
                rowdata += '<thead>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<th style="font-weight:bold;text-align:center;">S.No</th>' +
                    '<th style="font-weight:bold;text-align:center;">Date</th>' +
                    '<th style="font-weight:bold;text-align:center;">Time</th>' +
                    '<th style="font-weight:bold;text-align:center;">User Name</th>' +
                    '<th style="font-weight:bold;text-align:center;">Menu</th>' +
                    '<th style="font-weight:bold;text-align:center;">Action</th>' +
                    '<th style="font-weight:bold;text-align:center;">History</th>' +
                    '</tr>';
                rowdata += '</thead>';
                rowdata += '<body>';
                const _transaction = response["data"]["auditReportServicesViewModels"];
                for (var row_cnt = 0; row_cnt < _transaction.length; row_cnt++) {


                    var cre_audit = '{ "id": "' + _transaction[row_cnt]["id"] + '","menuId": "' + _MenuID + '"} ';

                    var sessid_audit = "T" + _transaction[row_cnt]["id"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");


                    sessionStorage.setItem(sessid_audit, cre_audit)

                    _sno = parseFloat(_sno) + 1;
                    rowdata += '<tr>' +
                        '<td>' + _sno + '</td>' +
                        '<td>' + moment(_transaction[row_cnt]["date"]).format('DD-MMMM-YYYY') + '</td>' +
                        '<td>' + moment(_transaction[row_cnt]["date"]).format('hh-mm A') + '</td>' +
                        '<td>' + _transaction[row_cnt]["userName"] + '</td>' +
                        '<td>' + _transaction[row_cnt]["menuAlias"] + '</td>' +
                        '<td>' + _transaction[row_cnt]["action"] + '</td>' +
                        //                        '<td>' + _transaction[row_cnt]["id"] + '</td>' +
                        '<td><a href="#" onclick=window.open("' + apiUrl_View + '/Configuration/Report/AuditHistoryReport?S=' + sessid_audit + '","_blank") > History</a ></td > ' +
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
