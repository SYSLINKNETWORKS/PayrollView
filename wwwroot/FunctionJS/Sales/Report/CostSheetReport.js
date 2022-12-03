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

    detailsTable = $("#div_CostSheet");
    detailsTable.empty();
    $.ajax({
        url: apiUrl + '/api/Sales/v1/Sales/CostSheetReport',
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
                var MasterData = response.data;

                const costsheet_1 = response["data"];

                var costsheet = [];
                for (i = 0; i < costsheet_1.length; i++) {

                    if (costsheet.findIndex(x => x._id == costsheet_1[i].id) == -1) {
                        costsheet.push({ _id: costsheet_1[i].id, _rowIdDetail: costsheet_1[i].rowIdDetail });
                    }
                }
                costsheet.sort((a, b) => (a._rowIdDetail > b._rowIdDetail) ? 1 : -1);


                for (var row_cnt = 0; row_cnt < costsheet.length; row_cnt++) {
                    const _transaction = response["data"].filter(d => d.id == costsheet[row_cnt]["_id"]);


                    var _TotalQty = 0, _TotalAmount = 0;
                    var today = 'Print By : ' + _transaction[0]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                    var rowdata = '';
                    rowdata = '<table id="detail_table" class="table table-responsive table-condensed" style="font-size:7pt;">';
                    rowdata += '<thead>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=9>Teamwork Packages (Pvt) Ltd </th></tr>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=9>' + _transaction[0]["headingName"] + '</th></tr>';
                    rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=9>' + today + '</th></tr>';
                    rowdata += '</thead>';

                    rowdata += '<body>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">Date :</td><td style="text-align:left;"> ' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + ' </td><td colspan=3></td><td style="font-weight:bold;text-align:left;" >Quotation:</td><td colspan=3 >' + _transaction[0]["quotationName"] + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">Item : </td><td style="text-align:left;" colspan=8> ' + _transaction[0]["itemName"] + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">Customer : </td><td style="text-align:left;" colspan=4> ' + _transaction[0]["customerName"] + ' </td><td style="font-weight:bold;text-align:left;">Location : </td><td style="text-align:left;" colspan=3> ' + _transaction[0]["customerLocation"] + ' </td></tr>';

                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">BOARD SIZE(mm) : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["boardWidth"], 0) + ' </td><td>Height : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["boardHeight"], 0) + ' </td><td style="font-weight:bold;text-align:left;" >Ups : </td><td style="text-align:left;" > ' + accounting.format(_transaction[0]["boardUPS"], 0) + ' </td><td style="font-weight:bold;text-align:left;">BOARD SIZE(inch) : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["boardSizeInch"], 0) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["boardSizePercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">LAYOUT SIZE(mm) : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["layoutWidth"], 0) + ' </td><td>Height : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["layoutHeight"], 0) + '</td><td style="font-weight:bold;text-align:left;" >Ups : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["layoutUPS"], 0) + ' </td><td style="font-weight:bold;text-align:left;">LAYOUT SIZE(inch) : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["layoutSizeInch"], 0) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["layoutSizePercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">CUTTING MODE : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["cuttingMode"], 0) + ' </td><td style="font-weight:bold;text-align:left;">AFTER WASTAGE QUANTITY : </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["afterWasteQuantity"], 0) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">GSM  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["gsm"], 0) + ' </td><td style="font-weight:bold;text-align:left;">WEIGHT(PACKET): </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["weightPacket"], 2) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">BOARD RATE(PER KG)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["boardRate"], 2) + ' </td><td style="font-weight:bold;text-align:left;">PACKET COST: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["packetCost"], 2) + ' </td></tr>';

                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">QUANTITY  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["quantity"], 0) + ' </td><td style="font-weight:bold;text-align:left;">REQUIRED PACKETS: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["requirdPackets"], 0) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">WASTAGE %  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["wastage"], 0) + ' </td><td style="font-weight:bold;text-align:left;">LAYOUT SHEET: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["layoutSheet"], 0) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">COLOR  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["color"], 0) + ' </td><td style="font-weight:bold;text-align:left;">BOARD TOTAL WEIGHT(KGS): </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["boardTotalWaste"], 0) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">PLATE RATE(UNIT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["plateRate"], 2) + ' </td><td style="font-weight:bold;text-align:left;">BOARD : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["boardCal"], 2) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["boardPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">PRINTING RATE(1000)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["printingRate"], 2) + ' </td><td style="font-weight:bold;text-align:left;">PLATES : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["platesCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["platesPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">UV(SQ.FT) : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["uv"], 2) + ' </td><td style="font-weight:bold;text-align:left;">PRINTING : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["printingCal"], 2) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["printingPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">LAMINATION(SQ.FT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["lamination"], 2) + ' </td><td style="font-weight:bold;text-align:left;">UV : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["uvCal"], 2) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["uvPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">DIE-CUTTING(1000)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["dieCutting"], 2) + ' </td><td style="font-weight:bold;text-align:left;">LAMINATION : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["laminationCal"], 2) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["laminationPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">FOILING(UNIT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["foiling"], 2) + ' </td><td style="font-weight:bold;text-align:left;">DIE-CUTTING : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["dieCuttingCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["dieCuttingPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">WINDOW PACTHING(UNIT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["windowPacthing"], 2) + ' </td><td style="font-weight:bold;text-align:left;">FOILING : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["foilingCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["foilingPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">PASTING(UNIT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["pasting"], 2) + ' </td><td style="font-weight:bold;text-align:left;">WINDOW PACTHING : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["windowPatchingCal"], 2) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["windowPatchingPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">BAG MAKING(UNIT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["bagMaking"], 2) + ' </td><td style="font-weight:bold;text-align:left;">PASTING : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["pastingCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["pastingPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">EYELET(UNIT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["eyelet"], 2) + ' </td><td style="font-weight:bold;text-align:left;">BAG MAKING : </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["bagMakingCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["bagMakingPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">HANGING WIRE(UNIT)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["hangingWire"], 2) + ' </td><td style="font-weight:bold;text-align:left;">EYELET: </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["eyeletCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["eyletePercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">PACKING(1000)  : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["packing"], 2) + ' </td><td style="font-weight:bold;text-align:left;">HANGING WIRE: </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["hangingWireCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["hangingWirePercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">TRANSPORT(1000) : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["transport"], 2) + ' </td><td style="font-weight:bold;text-align:left;">PACKING: </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["packingCal"], 2) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["packingPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">INCOME TAX(%) : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["incomeTax"], 2) + ' </td><td style="font-weight:bold;text-align:left;">TRANSPORT: </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["transportCal"], 2) + ' </td><td style="text-align:left;">' + accounting.format(_transaction[0]["transportPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;">MARGIN(%) : </td><td style="text-align:left;" colspan=5> ' + accounting.format(_transaction[0]["margin"], 2) + ' </td><td style="font-weight:bold;text-align:left;">TOTAL: </td><td style="text-align:left;"> ' + accounting.format(_transaction[0]["totalCal"], 2) + ' </td><td style="text-align:left;" >' + accounting.format(_transaction[0]["totalPercent"], 2) + '</td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;"> </td><td style="text-align:left;" colspan=5>  </td><td style="font-weight:bold;text-align:left;">INCOME TAX: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["incomeTaxCal"], 2) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;"> </td><td style="text-align:left;" colspan=5>  </td><td style="font-weight:bold;text-align:left;">SUB TOTAL: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["subTotalCal"], 2) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;"> </td><td style="text-align:left;" colspan=5>  </td><td style="font-weight:bold;text-align:left;">MARGIN: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["marginCal"], 2) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;"> </td><td style="text-align:left;" colspan=5>  </td><td style="font-weight:bold;text-align:left;">GRAND TOTAL: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["grandTotalCal"], 2) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;"> </td><td style="text-align:left;" colspan=5>  </td><td style="font-weight:bold;text-align:left;">UNIT COST: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["unitCostCal"], 2) + ' </td></tr>';
                    rowdata += ' <tr><td style="font-weight:bold;text-align:left;"> </td><td style="text-align:left;" colspan=5>  </td><td style="font-weight:bold;text-align:left;">QUOTED RATE: </td><td style="text-align:left;" colspan=2> ' + accounting.format(_transaction[0]["quotedRate"], 2) + ' </td></tr>';
                    rowdata += '</body>';
                    rowdata += '</table>';
                    // rowdata += '<div>';
                    // rowdata += '</div>';
                    // rowdata += '<p style="page-break-before: always">';
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

// function viewEmployeeDetail(sessidEmployeeProfileDetail) {

//     window.open(apiUrl_View + '/Payroll/Report/EmployeeProfileDetail?S=' + sessidEmployeeProfileDetail, '_blank');

// }
// function viewDocuments(sessidDocumentDetail) {
//     window.open(apiUrl_View + '/Payroll/Report/EmployeeProfileDocument?S=' + sessidDocumentDetail, '_blank');

// }