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

    detailsTable = $("#div_requisition");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/ProductionReport/GetIssuanceProduction',
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


                const qoutno_1 = response["data"]["issuanceProductionMasters"];

                var qouno = [];
                for (i = 0; i < qoutno_1.length; i++) {

                    if (qouno.findIndex(x => x._id == qoutno_1[i].id) == -1) {

                        qouno.push({ _id: qoutno_1[i].id, _no: qoutno_1[i].no });
                    }
                }
                qouno.sort((a, b) => (a._no > b._no) ? 1 : -1);
                var rowdata = '';

                for (var row_cnt = 0; row_cnt < qouno.length; row_cnt++) {
                    const _transaction = response["data"]["issuanceProductionMasters"].filter(d => d.id == qouno[row_cnt]["_id"]);
                    var _columnno = 11;
                    var today = 'Print By : ' + response["data"]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");

                    rowdata += '<table id="detail_table" class="table table-sm" style="font-size:smaller;">';
                    rowdata += '<thead>' +
                        '<tr>' +
                        '<th colspan="11" style="text-align:center;font-size:14pt;font-weight:bold;">' + response["data"]["companyName"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="11" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">' + response["data"]["headingName"] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th colspan="11" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                        '</tr>' +
                        '</thead>';
                    rowdata += '<thead>' +
                        '<tr>' +
                        '<th colspan="2">Requisition : ' + _transaction[0]["no"] + '</th>' +
                        '<th colspan="7"></th>' +
                        '<th  colspan="2" style="text-align:right;" >Date : ' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + ' </th>' +
                        '</tr>' +
                        '</thead>';

                    rowdata += '</table>';



                    rowdata += '<table id="detail_table" class="table" style="font-size:8pt;;color:black;margin-top:-20px">';
                    rowdata += '<thead >';
                    rowdata += '<tr >' +
                        '<th style="border:1px solid black;text-align:center;">S.No</th>' +
                        '<th style="border:1px solid black">Job #</th>' +
                        '<th style="border:1px solid black">SO #</th>' +
                        '<th colspan=2 style="border:1px solid black">Customer</th>' +
                        '<th colspan =2 style="border:1px solid black">Item</th>' +
                        '<th style="border:1px solid black">Qty</th>' +
                        '<th style="border:1px solid black">Requisition</th>' +
                        '<th style="border:1px solid black">Issue</th>' +
                        '<th style="border:1px solid black">Balance Qty</th>' +
                        '</tr>';


                    rowdata += '</thead>';
                    var Detailsrecord = _transaction[0]["issuanceProductionDetails"];

                    rowdata += '<body>';
                    var _sono = 0;
                    for (var row_cnt_detail = 0; row_cnt_detail < Detailsrecord.length; row_cnt_detail++) {
                        _sono += 1;



                        rowdata += '<tr>' +
                            '<td style="border:1px solid black">' + _sono + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["jobNo"] + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["saleOrderNo"] + '</td>' +
                            '<td style="border:1px solid black" colspan="2">' + Detailsrecord[row_cnt_detail]["customerName"] + '</td>' +
                            '<td style="border:1px solid black" colspan="2">' +  Detailsrecord[row_cnt_detail]["item"] + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["qty"] + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["requisitionQty"] + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["issueQty"] + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["balanceQty"] + '</td>' +
                            '</tr>';


                    }
                    rowdata += '</body>';

                    // rowdata += '<tr>' +
                    //     '<td colspan=19"><hr   style="border-style: none none solid none; border-width: thin;"/></td>' +
                    //     '</tr>';

                    rowdata += '</table>';


                    rowdata += '<div class="card-box table-responsive" style="text-align:center;color:black;">' +
                        '<div style="float:left; width:150px; text-align:center; ">' +
                        '<label>' + _transaction[0]["userNamePrepared"] + '</label>' +
                        '<hr style="border-style: none none solid none; border-width: thin; width: 75%; margin-top:13px;" />' +
                        '<p style="text-align: center;">Prepared by</p>' +
                        '</div>' +
                        
                        '</div>';

                    rowdata += '</div>';

                    // //footer line 
                    // rowdata += '<table style="width:95%;color:black">';
                    // rowdata += '<tr>' +
                    //     '<td colspan=19"><hr  style="border-style: none none solid none; border-width:2px;color:#D3D3D3"/></td>' +
                    //     '</tr>';

                    // rowdata += '<tr">' +
                    //     '<th style="font-weight:bold;color:black" >Teamwork Packages (SMC-PVT) Ltd. </th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th></th>' +
                    //     '<th style="text-align:right;font-weight:bold">Issue Date: ec 16, Rev. "3"</th>' +

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
