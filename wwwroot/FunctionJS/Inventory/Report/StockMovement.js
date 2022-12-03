var imgload = $("#img_load");
var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);
var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Inventory';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();
});

function printReport() {
    imgload.show();
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();
    $.ajax({
        url: ApiForm + '/v1/Report/GetStockMovement',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        success: function (response) {
            if (response.statusCode == 200) {

                var obj = response.data.stockMovementReportDetailViewModel;
                var today = 'Print By : ' + response.data.userName + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                $('#lbl_company_name').html(response.data.companyName);
                $("#br_nam").html(response.data.branchName);
                $('#lbl_head').html("Stock Movement <br/> Date from " + moment(response.data.dateFrom).format("DD-MMM-YYYY") + " to " + moment(response.data.dateTo).format("DD-MMM-YYYY"));
                $('#lbl_usrprt').html(today);

                const uniqueBrand = [...new Set(obj.map(item => item.itemBrandName))];
                for (var row_cnt = 0; row_cnt < uniqueBrand.length; row_cnt++) {
                    const _BrandFilter = obj.filter(d => d.itemBrandName == uniqueBrand[row_cnt]);
                    var rowdata_1 = '<tr>' +
                        '<td colspan=13 style="font-weight:bold;text-align:center;">Brand : ' + _BrandFilter[0]["itemBrandName"] + '</td></tr>';

                    detailsTableBody.append(rowdata_1);

                    const uniqueItem = [...new Set(_BrandFilter.map(item => item.itemId))];

                    var sno = 0, total_opening = 0, total_purchases = 0, total_debitnote = 0, total_productionreceived = 0, total_productionissue = 0, total_stockadjustmentreceived = 0, total_stockadjustmentissue = 0, total_creditnote = 0, total_dc = 0, total_bal = 0;
                    var opening = 0, grn = 0, dn = 0, dc = 0, cn = 0, productionReceived = 0, productionIssue = 0, stockAdjustmentReceived = 0, stockAdjustmentIssue = 0, closing = 0;
                    for (var row_cnt_1 = 0; row_cnt_1 < uniqueItem.length; row_cnt_1++) {
                        const _ItemFilter = obj.filter(d => d.itemId == uniqueItem[row_cnt_1]);
                        var styleformat = '';

                        for (var titmid_cnt = 0; titmid_cnt < _ItemFilter.length; titmid_cnt++) {
                            opening += Number(_ItemFilter[titmid_cnt]["opening"]);
                            grn += Number(_ItemFilter[titmid_cnt]["grn"]);
                            dn += Number(_ItemFilter[titmid_cnt]["dn"]);
                            dc += Number(_ItemFilter[titmid_cnt]["dc"]);
                            cn += Number(_ItemFilter[titmid_cnt]["cn"]);
                            productionReceived += Number(_ItemFilter[titmid_cnt]["productionReceived"]);
                            productionIssue += Number(_ItemFilter[titmid_cnt]["productionIssue"]);
                            stockAdjustmentReceived += Number(_ItemFilter[titmid_cnt]["stockAdjustmentReceived"]);
                            stockAdjustmentIssue += Number(_ItemFilter[titmid_cnt]["stockAdjustmentIssue"]);
                            closing += Number(_ItemFilter[titmid_cnt]["closing"]);
                        }

                        if (closing < 0) {
                            styleformat = 'style="background-color:peachpuff;"';
                        }

                        var sessid_Item = _ItemFilter[row_cnt_1]["itemId"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");
                        var sessid_name_Item = _ItemFilter[row_cnt_1]["itemId"] + "N" + moment(new Date()).format("DDMMYYYYHHmmss");
                        sessid_name_Item = '_';
                        var cre_Item = JSON.stringify({
                            "itemCategoryId": _ItemFilter[row_cnt_1]["itemCategoryId"],
                            "itemSubCategoryMasterId": _ItemFilter[row_cnt_1]["itemSubCategoryMasterId"],
                            "itemSubCategoryId": _ItemFilter[row_cnt_1]["itemSubCategoryId"],
                            "itemBrandId": _ItemFilter[row_cnt_1]["itemBrandId"],
                            "itemId": _ItemFilter[row_cnt_1]["itemId"],
                            "warehouseID": _ItemFilter[row_cnt_1]["warehouseID"],
                            "dateFrom": response.data.dateFrom,
                            "dateTo": response.data.dateTo
                        });

                        sessionStorage.setItem(sessid_Item, cre_Item);
                        sno += 1;

                        var rowdata = '<tr ' + styleformat + '>' +
                            '<td style="text-align:center;">' + sno + '</td>' +
                            '<td style="text-align:left;"><a href="javascript:void(0)" onclick=window.open("' + apiUrl_View + '/Inventory/Report/StockLedger?S=' + sessid_Item + '","_blank")>' + _ItemFilter[row_cnt_1]["itemName"] + '</a></td>' +
                            '<td style="text-align:center;">' + _ItemFilter[row_cnt_1]["scaleName"] + '</td>' +
                            '<td style="text-align:right;">' + accounting.format( opening,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(grn,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(dn,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(productionReceived,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(productionIssue,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(stockAdjustmentReceived,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(stockAdjustmentIssue,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(dc,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(cn,0) + '</td>' +
                            '<td style="text-align:right;">' + accounting.format(closing,0) + '</td>' +
                            '</tr>';
                        detailsTableBody.append(rowdata);
                        total_opening += opening;

                        total_purchases += grn;
                        total_debitnote += dn;

                        total_productionreceived += productionReceived;
                        total_productionissue += productionIssue;

                        total_stockadjustmentreceived += stockAdjustmentReceived;
                        total_stockadjustmentissue += stockAdjustmentIssue;

                        total_dc += dc;
                        total_creditnote += cn;
                        total_bal += closing;
                    }
                    var rowdata_subtotal = '<tr style="font-weight:bold;text-align:right;"><td colspan="3"> Total :</td><td>' + accounting.format(total_opening,0) + '</td><td>' + accounting.format(total_purchases,0) + '</td><td>' + accounting.format(total_debitnote,0) + '</td><td>' + accounting.format(total_productionreceived,0) + '</td> <td>' + accounting.format(total_productionissue,0) + '</td><td>' + accounting.format(total_stockadjustmentreceived,0) + '</td><td>' + accounting.format(total_stockadjustmentissue,0) + '</td><td>' + accounting.format(total_dc,0) + '</td><td>' + accounting.format(total_creditnote,0) + '</td><td>' + accounting.format(total_bal,0) + '</td></tr>';
                    detailsTableBody.append(rowdata_subtotal);
                }
                // Item End
                imgload.hide();

            }
            else {
                imgload.hide();
                Swal.fire({
                    title: response.message,

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
    a.download = 'BankReconciliation' + moment(new Date()).format('DDMMYYYYHHmmss') + '.xls';
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
