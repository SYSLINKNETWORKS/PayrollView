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
    ApiForm = apiUrl + '/api/Sales';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {
    detailsTable = $("#div_Quotation");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/Sales/QuotationReport',
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
                const blobUrl = response.data.printUrl;
                window.location.replace(blobUrl);
                imgload.hide();


                // var MasterData = response.data;

                // const qoutno_1 = response["data"];
                // var qouno = [];
                // for (i = 0; i < qoutno_1.length; i++) {

                //     if (qouno.findIndex(x => x._id == qoutno_1[i].id) == -1) {
                //         qouno.push({ _id: qoutno_1[i].id, _no: qoutno_1[i].no });
                //     }
                // }
                // qouno.sort((a, b) => (a._no > b._no) ? 1 : -1);
                // for (var row_cnt = 0; row_cnt < qouno.length; row_cnt++) {
                //     const _transaction = response["data"].filter(d => d.id == qouno[row_cnt]["_id"]);

                //     var _TotalQty = 0, _TotalAmount = 0;
                //     var rowdata = '';
                //     rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';

                //     rowdata += '<thead>';
                //     var category = (_transaction[0]["category"] = 'N') ? "New" : "Revised";
                //     var today = 'Print By : ' + _transaction[0]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");

                //     rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=9>Teamwork Packages (Pvt) Ltd </th></tr>';
                //     rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=9>' + _transaction[0]["headingName"] + '</th></tr>';
                //     rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=9>' + today + '</th></tr>';

                //     rowdata += ' <tr><td style="font-weight:bold;text-align:left;">No #</td><td style="text-align:left;"> ' + _transaction[0]["no"] + ' </td><td></td><td></td><td></td><td></td><td style="font-weight:bold;text-align:left;" colspan=2>Date:</td><td >' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + '</td></tr>';
                //     rowdata += ' <tr><td style="font-weight:bold;text-align:left;">Customer : </td><td style="text-align:left;" colspan=4> ' + _transaction[0]["customerName"] + ' </td><td></td><td style="font-weight:bold;text-align:left;" colspan=2>Salesman : </td><td style="text-align:left;" colspan=4> ' + _transaction[0]["salesMan"] + ' </td></tr>';
                //     rowdata += ' <tr><td style="font-weight:bold;text-align:left;">Remarks : </td><td style="text-align:left;" colspan=8> ' + _transaction[0]["remarks"] + ' </td><td></td></tr>';
                //     rowdata += '</thead>';
                //     var Detailsrecord = _transaction[0]["quotationDetailList"];
                //     rowdata += '<thead>';
                //     rowdata += '<tr style="font-weight:bold;">' +
                //         '<th>Item</th>' +
                //         '<th>Description</th>' +
                //         '<th>Qty</th>' +
                //         '<th>Rate</th>' +
                //         '<th>Amount</th>' +
                //         '<th>Location</th>' +
                //         '<th>Days</th>' +
                //         '<th>Approved</th>' +
                //         '<th>Remarks</th>' +
                //         '</tr>';
                //     rowdata += '</thead>';

                //     rowdata += '<body>';

                //     for (var row_cnt_detail = 0; row_cnt_detail < Detailsrecord.length; row_cnt_detail++) {
                //         var approved = (Detailsrecord[row_cnt_detail]["approved"] == true) ? "Approved" : "Not Apprved";
                //         rowdata += '<tr>' +
                //             '<td>' + Detailsrecord[row_cnt_detail]["itemName"] + '</td>' +
                //             '<td>' + Detailsrecord[row_cnt_detail]["description"] + '</td>' +
                //             '<td>' + accounting.format(Detailsrecord[row_cnt_detail]["quantity"], 0) + '</td>' +
                //             '<td> ' + accounting.format(Detailsrecord[row_cnt_detail]["rate"], 4) + '</td>' +
                //             '<td> ' + accounting.format(Detailsrecord[row_cnt_detail]["amount"]) + '</td>' +
                //             '<td> ' + Detailsrecord[row_cnt_detail]["customerLocationName"] + '</td>' +
                //             '<td> ' + Detailsrecord[row_cnt_detail]["deliveryDay"] + '</td>' +
                //             '<td> ' + approved + '</td>' +
                //             '<td> ' + Detailsrecord[row_cnt_detail]["remarks"] + ' </td>' +
                //             '</tr>';
                //         _TotalQty += parseFloat(Detailsrecord[row_cnt_detail]["quantity"]);
                //         _TotalAmount += parseFloat(Detailsrecord[row_cnt_detail]["amount"]);

                //     }
                //     rowdata += '</body>';

                //     rowdata += '<tfooter>';
                //     rowdata += '<tr style="font-weight:bold;">' +
                //         '<th style="font-weight:bold;text-align:right;" colspan=2>Total</th>' +
                //         '<th>' + accounting.format(_TotalQty, 0) + '</th>' +
                //         '<th></th>' +
                //         '<th>' + accounting.format(_TotalAmount) + '</th>' +
                //         '<th></th>' +
                //         '<th></th>' +
                //         '<th></th>' +
                //         '<th></th>' +
                //         '</tr>';
                //     rowdata += '</tfooter>';
                //     rowdata += '</table>';


                //     rowdata += '<div class="card-box table-responsive" style="text-align:center;">' +
                //         '<div style="float:left; width:150px; text-align:center; ">' +
                //         '<label>' + _transaction[0]["userNamePrepared"] + '</label>' +
                //         '<hr style="border-style: none none solid none; border-width: thin; width: 75%; margin-top:13px;" />' +
                //         '<p style="text-align: center;">Prepared by</p>' +
                //         '</div>' +
                //         '<div style="float:left; width:150px; text-align:center;">' +
                //         '<label>' + _transaction[0]["userNameCheck"] + '</label>' +
                //         '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                //         '<p style="text-align: center;">Checked by</p>' +
                //         '</div>' +
                //         '<div style="float:left; width:150px; text-align:center;">' +
                //         '<label>' + _transaction[0]["userNameApproved"] + '</label>' +
                //         '<hr style="border-style: none none solid none; border-width: thin; width: 75%" />' +
                //         '<p style="text-align: center;">Approved by</p>' +
                //         '</div>';

                //     rowdata += '</div>';
                //     rowdata += '<p style="page-break-before: always">';

                //     detailsTable.append(rowdata);
                // }

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