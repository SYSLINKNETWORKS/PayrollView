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
    detailsTableHead = $("#detail_table thead");
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();
    $.ajax({
        url: ApiForm + '/v1/Report/GetOpeningStock',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        success: function (response) {
            if (response.statusCode == 200) {

                var obj = response.data.stockReportDetailViewModel;
                var today = 'Print By : ' + response.data.userName + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                $('#lbl_company_name').html(response.data.companyName);
                $("#br_nam").html(response.data.branchName);
                $('#lbl_head').html("Opening Inventory");
                $('#lbl_usrprt').html(today);



                const uniqueCategory = [...new Set(obj.map(item => item.itemCategoryName))];

                for (var row_cnt_cat = 0; row_cnt_cat < uniqueCategory.length; row_cnt_cat++) {
                    const _CategoryFilter = obj.filter(d => d.itemCategoryName == uniqueCategory[row_cnt_cat]);
                    var rowdata_1 = '<tr>' +
                        '<td colspan=8 style="font-weight:bold;text-align:center">' + _CategoryFilter[0]["itemCategoryName"] + '</td></tr>';
                    detailsTableBody.append(rowdata_1);
                    const uniqueSubCategory = [...new Set(obj.filter(d => d.itemCategoryName == uniqueCategory[row_cnt_cat]).map(item => item.itemSubCategoryName))];

                    for (var row_cnt_subcat = 0; row_cnt_subcat < uniqueSubCategory.length; row_cnt_subcat++) {
                        const _SubCategoryFilter = obj.filter(d => d.itemSubCategoryName == uniqueSubCategory[row_cnt_subcat]);
                        var rowdata_1 = '<tr>' +
                            '<td colspan=8 style="font-weight:bold;text-align:center">' + _SubCategoryFilter[0]["itemSubCategoryName"] + '</td></tr>';
                        detailsTableBody.append(rowdata_1);


                        const uniqueBrand = [...new Set(obj.filter(d => d.itemSubCategoryName == uniqueSubCategory[row_cnt_cat]).map(item => item.itemBrandName))];


                        var rowdata = '', qty = 0, amt = 0;
                        for (var row_cnt = 0; row_cnt < uniqueBrand.length; row_cnt++) {
                            const _transaction = obj.filter(d => d.itemBrandName == uniqueBrand[row_cnt]);
                            rowdata += '<tr>' +
                                '<th width=100px colspan=12 style="text-align:center;">' + _transaction[0]["itemBrandName"] + '</th>' +
                                '</tr>';
                            var _sno = 0;
                            for (var row_cnt_1 = 0; row_cnt_1 < _transaction.length; row_cnt_1++) {
                                _sno += 1;
                                const Quantity = _transaction[row_cnt_1]["quantity"];
                                const Rate = _transaction[row_cnt_1]["rate"];
                                const Amount = _transaction[row_cnt_1]["amount"];
                                rowdata += '<tr>' +
                                    '<td style="text-align:center;">' + _sno + '</td>' +
                                    '<td style="text-align:left;">' + _transaction[row_cnt_1]["itemName"] + '</td>' +
                                    '<td style="text-align:center;">' + _transaction[row_cnt_1]["scaleName"] + '</td>' +
                                    '<td style="text-align:center;">' + accounting.format(Quantity, 0) + '</td>' +
                                    '<td style="text-align:center;">' + accounting.format(Rate, 2) + '</td>' +
                                    '<td style="text-align:center;">' + accounting.format(Amount, 2) + '</td>' +
                                    '</tr>';
                                qty += Number(Quantity);
                                amt += Number(Amount);
                            }
                        }

                        detailsTableBody.append(rowdata);
                        var subtotal = '';

                        subtotal = '<tr style="text-align:right; font-weight:bold"><td colspan=2>Total : </td><td></td><td style="text-align:center;">' + accounting.format(qty, 0) + '</td><td></td><td style="text-align:center;">' + accounting.format(amt, 2) + '</td></tr>';
                        detailsTableBody.append(subtotal);
                        bd_qty = 0;
                        bd_amt = 0;
                    }

                }

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
