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
    detailsTable = $("#div_goodsreceiveingNote");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PurchaseReport/GoodsReceivingNoteReport',
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

                const qoutno_1 = response["data"];

                var qouno = [];
                for (i = 0; i < qoutno_1.length; i++) {

                    if (qouno.findIndex(x => x._id == qoutno_1[i].id) == -1) {

                        qouno.push({ _id: qoutno_1[i].id, _no: qoutno_1[i].no });
                    }
                }
                qouno.sort((a, b) => (a._no > b._no) ? 1 : -1);

                var rowdata = '';
                for (var row_cnt = 0; row_cnt < qouno.length; row_cnt++) {
                    const _transaction = response["data"].filter(d => d.id == qouno[row_cnt]["_id"]);

                    var today = 'Print By : ' + response["data"][0]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");

                    rowdata += '<table id="detail_table" class="table table-sm" style="font-size:smaller;">';
                    rowdata += '<thead>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:center;font-size:14pt;font-weight:bold;">' + _transaction[0]["companyName"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">' + _transaction[0]["headingName"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="8" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                        '</tr>' +
                        '</thead>';
                    rowdata += '<thead>' +
                        '<tr>' +
                        '<th colspan="6">GRN : ' + _transaction[0]["no"] + '</th>' +
                        '<th  colspan="2" style="text-align:left;" >Date : ' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + ' </th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="4">PO : ' + _transaction[0]["purchaseOrderNo"] + '</th>' +
                        '<th  colspan="4" style="text-align:left;" >PO Date : ' + moment(_transaction[0]["purchaseOrderDate"]).format("DD-MMM-YYYY") + ' </th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="4">Supplier : ' + _transaction[0]["supplierName"] + '</th>' +
                        '<th  colspan="4" style="text-align:left;" >DC# : ' + _transaction[0]["supplierDCNo"] + ' </th>' +
                        '</tr>' +
                        '</thead>';

                    rowdata += '</table>';

                    rowdata += '<table id="detail_table" class="table" style="font-size:8pt;;color:black;margin-top:-20px;">';
                    rowdata += '<thead >';
                    rowdata += '<tr >' +
                        '<th style="border:1px solid black;text-align:center;">S.No</th>' +
                        '<th  colspan="2"  style="border:1px solid black;text-align:center;">Description</th>' +
                        //                        '<th  style="border:1px solid black;text-align:center;">P.O</th>' +
                        '<th  style="border:1px solid black;text-align:center;">Qty Received</th>' +
                        '<th  style="border:1px solid black;text-align:center;">P.O Qty</th>' +
                        '<th  style="border:1px solid black;text-align:center;">Total Received</th>' +
                        '<th  style="border:1px solid black;text-align:center;">Balance</th>' +
                        '<th  style="border:1px solid black;text-align:center;">Remarks</th>' +
                        '</tr>';

                    rowdata += '</thead>';

                    var Detailsrecord = _transaction[0]["goodsReceivingNoteDetailReportViewModel"];


                    rowdata += '<body>';
                    // console.log(Detailsrecord);
                    var _sono = 0, _totalQty = 0, _qtyBalance = 0;
                    for (var row_cnt_detail = 0; row_cnt_detail < Detailsrecord.length; row_cnt_detail++) {
                        _sono += 1;
                        var _qtyBalance = _transaction[0]["purchaseOrderQty"] - Detailsrecord[row_cnt_detail]["quantity"];
                        rowdata += '<tr>' +
                            '<td >' + _sono + '</td>' +
                            '<td colspan=2> ' + Detailsrecord[row_cnt_detail]["itemName"] + ' </td>' +
                            //'<td style="text-align:center;"> ' + _transaction[0]["purchaseOrderNo"] + ' ' + moment(_transaction[0]["purchaseOrderDate"]).format("DD-MMM-YYYY") + '</td>' +
                            //                            '<td style="text-align:center;">' + moment(_transaction[0]["purchaseOrderDate"]).format("DD-MMM-YYYY") + '</td>' +
                            '<td style="text-align:center;" > ' + accounting.format(Detailsrecord[row_cnt_detail]["quantity"], 0) + '</td>' +
                            '<td style="text-align:center;" > ' + accounting.format(Detailsrecord[row_cnt_detail]["orderQty"], 0) + '</td>' +
                            '<td style="text-align:center;" > ' + accounting.format(Detailsrecord[row_cnt_detail]["totalReceivedQty"], 0) + '</td>' +
                            '<td style="text-align:center;" > ' + accounting.format(Detailsrecord[row_cnt_detail]["balanceQty"], 0) + '</td>' +
                            '<td style="text-align:center;" > ' + Detailsrecord[row_cnt_detail]["remarks"] + '</td>' +
                            '</tr>';
                        _totalQty += parseFloat(Detailsrecord[row_cnt_detail]["quantity"]);

                        // rowdata += '<tr>' +
                        //     '<td colspan=20"><hr  style="border-style: none none solid none; border-width:2px;"/></td>' +
                        //     '</tr>';


                        // rowdata += '<tr>' +
                        //     '<td colspan=4"></td>' +
                        //     '<td style="font-weight:bold">Total:</td>' +
                        //     '<td style="font-weight:bold;text-align:center;">' + _qtyRecieve + '</td>' + //amount
                        //     '</tr>';

                        // rowdata += '<tr>' +
                        //     '<td colspan=4"></td>' +
                        //     '<td colspan=2"><hr  style="border-style: none none solid none; border-width:2px;"/></td>' +
                        //     '</tr>';
                        // _TotalQty += parseFloat(Detailsrecord[row_cnt_detail]["quantity"]);


                    }
                    rowdata += '</body>';

                    rowdata += '<tfooter>';
                    rowdata += '<tr>' +
                        '<td colspan="5" style="text-align:right;" >Total : </td>' +
                        '<td style="text-align:center;" > ' + parseFloat(_totalQty, 0) + '</td>' +
                        '<td colspan="3" style="text-align:right;" ></td>' +
                        '</tr>';
                    rowdata += '</tfooter>';


                    rowdata += '</table>';

                    rowdata += '<div class="card-box table-responsive" style="text-align:center;color:black;">' +
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

                    rowdata += '</div>';


                    // //footer line 
                    // rowdata += '<table style="width:95%;color:black">';
                    // rowdata += '<tr>' +
                    //     '<td colspan=20"><hr  style="border-style: none none solid none; border-width:2px;color:#D3D3D3"/></td>' +
                    //     '</tr>';

                    // rowdata += '<tr">' +
                    //     '<th style="font-weight:bold;color:black" >Teamwork Packages (SMC-PVT) Ltd. </th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th style="text-align:right;font-weight:bold">Issue Date: : Dec 16, Rev. "2"</th>' +

                    //     '</tr>';
                    // rowdata += '</table>';

                    rowdata += '<p style="page-break-before: always">';



                    detailsTable.append(rowdata);
                }

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