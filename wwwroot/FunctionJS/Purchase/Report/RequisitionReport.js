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

    detailsTable = $("#div_requisition");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PurchaseReport/PurchaseRequisitionReport',
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
                    var _columnno = 19;
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
                        '<th colspan="2">Requisition : ' + _transaction[0]["no"] + '</th>' +
                        '<th colspan="4"></th>' +
                        '<th  colspan="2" style="text-align:right;" >Date : ' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + ' </th>' +
                        '</tr>' +
                        '</thead>';

                    rowdata += '</table>';


                    // rowdata += '<table id="detail_table" class="table" style="font-size:8pt;color:black">';
                    // rowdata += '<thead>';
                    // rowdata += '  <tr ><th rowspan="2" style="width:100px;border:1px solid black"><div style="text-align:center;"><img src="/images/twpp.png" style="width: 100px; text-align:center ;" alt="twp"></dev></th><th rowspan="2" style="width:60%;border:1px solid black;"><div style="text-align:center;margin-bottom: 15px;"">PURCHASE REQUSITION</div></th><th colspan="2" style="border:1px solid black;text-align:center">Purchase Department</th></tr>';
                    // rowdata += ' <tr style="border:1px solid black"><th style="border:1px solid black">Date: ' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + '</th><th style="border:1px solid black"><div style="text-align:center;">Page 1 of 1</div></th></tr>';

                    // //line
                    // rowdata += '<tr><td colspan=20"><hr  style="border-style: none none solid none; border-width:2px;margin-top:1px"/></td></tr>';
                    // rowdata += '</thead>';
                    // rowdata += '</table>';

                    // //Master reocrd
                    // rowdata += '<table class="table"  style="font-size:8pt;color:black;margin-top:-40px">';
                    // rowdata += '<thead>';
                    //rowdata += ' <tr><td style="font-weight:bold;text-align:left;" >Comp Ref. #</td><td> ' + _transaction[0]["no"] + ' </td><td style="font-weight:bold;text-align:left;">Applied Date:</td><td style="text-align:left;">' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + '</td></tr>';
                    // rowdata += '<tr style="border:none;" >' +
                    //     '<th  style="width:170px;font-size:8pt">Comp Ref. #</th>' +
                    //     '<th  style="width:150px"><u>' + _transaction[0]["no"] + '</u></th>' +
                    //     '<th   ></th>' +
                    //     '<th   ></th>' +
                    //     '<th   style="width:150px;font-size:8pt">Department :</th>' +
                    //     '<th   style="width:250px;">STORE DEPARTMENT</th>' +
                    //     '<th   ></th>' +
                    //     '<th   ></th>' +
                    //     '<th   ></th>' +
                    //     '<th   ></th>' +
                    //     '<th   ></th>' +
                    //     '<th   ></th>' +
                    //     '<th   ></th>' +
                    //     '<th   style="width:150px;font-size:8pt">Applied Date:</th>' +
                    //     '<th   ><u>' + moment(_transaction[0]["date"]).format("DD-MMM-YYYY") + '</u></th>' +
                    //     '</tr>';

                    // rowdata += '</thead>';
                    // rowdata += '</table>';

                    rowdata += '<table id="detail_table" class="table" style="font-size:8pt;;color:black;margin-top:-20px">';
                    rowdata += '<thead >';
                    rowdata += '<tr >' +
                        '<th rowspan=2 style="border:1px solid black;text-align:center;">S.No</th>' +
                        '<th  rowspan=2 colspan="2"  style="border:1px solid black">Description</th>' +
                        '<th colspan=2   style="border:1px solid black;text-align:center">Last</th>' +
                        '<th rowspan=2  style="border:1px solid black">Stock in Hand</th>' +
                        '<th rowspan=2  style="border:1px solid black">MSL</th>' +
                        '<th rowspan=2  style="border:1px solid black">Avg. Cons</th>' +
                        '<th rowspan=2  style="border:1px solid black">Req Qty</th>' +
                        '<th rowspan=2  style="border:1px solid black">Unit</th>' +
                        '<th rowspan=2  style="border:1px solid black">Purpose</th>' +
                        '<th rowspan=2  style="border:1px solid black">Priority</th>' +
                        '</tr>';

                    rowdata += '<tr>' +
                        '<th  style="border:1px solid black">Date</th>' +
                        '<th  style="border:1px solid black">Qty</th>' +
                        '</tr>';

                    rowdata += '</thead>';
                    var Detailsrecord = _transaction[0]["requisitionDetailReportViewModel"];

                    rowdata += '<body>';
                    var _sono = 0;
                    for (var row_cnt_detail = 0; row_cnt_detail < Detailsrecord.length; row_cnt_detail++) {
                        _sono += 1;
                        rowdata += '<tr>' +
                            '<td style="border:1px solid black">' + _sono + '</td>' +
                            '<td style="border:1px solid black" colspan="2">' + Detailsrecord[row_cnt_detail]["itemName"] + '</td>' +
                            '<td style="border:1px solid black">' + moment(_transaction[0]["deliveryDate"]).format("DD-MMM-YYYY") + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["quantity"] + '</td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["stockinHand"] + ' </td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["msl"] + ' </td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["avgCons"] + ' </td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["requiredQuantity"] + ' </td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["uom"] + ' </td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["remarks"] + ' </td>' +
                            '<td style="border:1px solid black"> ' + Detailsrecord[row_cnt_detail]["priority"] + ' ' + moment(_transaction[0]["deliveryDate"]).format("DD-MMM-YYYY") + ' </td>' +
                            '</tr>';
                        //_TotalQty += parseFloat(Detailsrecord[row_cnt_detail]["quantity"]);


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

