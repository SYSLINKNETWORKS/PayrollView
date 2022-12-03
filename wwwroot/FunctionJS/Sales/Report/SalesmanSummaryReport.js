var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessid_name = sessid_url[2];
var cre = sessionStorage.getItem(sessid);
var cre_name = sessionStorage.getItem(sessid_name);
$(document).ready(function () {
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();
});
function printReport() {
    detailsTableBody = $("#detail_table");
    detailsTableBody.empty();

    $.ajax({

        url: apiUrl + '/Sales/Report/SaleReport/SalesmanSummaryReport',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Creteria": cre }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            if (response[0].status == 1) {
                var rowdata = '';
                var today = cre_name + ' Print By : ' + response[0]["Result_Heading"][0]["User_Name"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                rowdata += '<table class="table table-sm" style = "font-size:smaller;">' +
                    '<thead>' +
                    '<tr>' +
                    '<th colspan="8" style="text-align:center;font-size:14pt;font-weight:bold;">' + response[0]["Result_Heading"][0]["Branch_Name"] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="8" style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">Salesman Summary Report</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th colspan="8" id="lbl_usrprt" style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                    '</tr>';
                    '<tr>' +
                    '<th style="text-align:center;">S.No.</th>' +
                    '<th style="text-align:center;">Invoice #</th>' +
                    '<th style="text-align:center;">Customer</th>' +
                    '<th style="text-align:right;">Amount</th>' +
                    '</tr>';
                rowdata += '</thead>';
                //Date Start
                const _Date_1 = response[0]["Result"];
                var _Date = [];
                for (i = 0; i < _Date_1.length; i++) {
                    if (_Date.findIndex(x => x._id == _Date_1[i].Date) == -1) {
                        _Date.push({ _id: _Date_1[i].Date });
                    }
                }
                _Date.sort((a, b) => (a._id > b._id) ? 1 : -1);
                //Date End
                //Salesman Start
                for (var row_cnt = 0; row_cnt < _Date.length; row_cnt++) {
                    rowdata += '<thead>';
                    rowdata += '<tr>' +
                        '<th colspan=4>For The Date : ' + moment(_Date[row_cnt]["_id"]).format("DD-MMM-YYYY") + '</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    const _Salesman_1 = response[0]["Result"].filter(d => d.Date == _Date[row_cnt]["_id"]);
                    var _Salesman = [];
                    for (i = 0; i < _Salesman_1.length; i++) {
                        if (_Salesman.findIndex(x => x._id == _Salesman_1[i].Salesman_ID) == -1) {
                            _Salesman.push({ _id: _Salesman_1[i].Salesman_ID, _nam: _Salesman_1[i].Salesman_Name });
                        }
                    }
                    _Salesman.sort((a, b) => (a._id > b._id) ? 1 : -1);
                    var _date_amt = 0;
                    //Brand Start

                    for (var row_cnt_sal = 0; row_cnt_sal < _Salesman.length; row_cnt_sal++) {
                        rowdata += '<thead>';
                        rowdata += '<tr>' +
                            '<th colspan=4 style="text-align:center;">Salesman : ' + _Salesman[row_cnt_sal]["_nam"] + '</th>' +
                            '</tr>';
                        rowdata += '</thead>';
                        const _Brand_1 = response[0]["Result"].filter(d => d.Date == _Date[row_cnt]["_id"] && d.Salesman_ID == _Salesman[row_cnt_sal]["_id"]);
                        var _Brand = [];
                        for (i = 0; i < _Brand_1.length; i++) {
                            if (_Brand.findIndex(x => x._id == _Brand_1[i].Brand_ID) == -1) {
                                _Brand.push({ _id: _Brand_1[i].Brand_ID, _nam: _Brand_1[i].Brand_Name });
                            }
                        }
                        _Brand.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                        var _salesman_amt = 0;

                        for (var row_cnt_bd = 0; row_cnt_bd < _Brand.length; row_cnt_bd++) {
                            rowdata += '<thead>';
                            rowdata += '<tr>' +
                                '<th colspan=4 style="text-align:center;">Brand : ' + _Brand[row_cnt_bd]["_nam"] + '</th>' +
                                '</tr>';
                            rowdata += '</thead>';

                            const _transaction = response[0]["Result"].filter(d => d.Date == _Date[row_cnt]["_id"] && d.Salesman_ID == _Salesman[row_cnt_sal]["_id"] && d.Brand_ID == _Brand[row_cnt_bd]["_id"]);
                            var sno = 1;
                            rowdata += '<tbody>';
                            var _brand_amt = 0;
                            for (var row_cnt_t = 0; row_cnt_t < _transaction.length; row_cnt_t++) {
                                rowdata += '<tr>' +
                                    '<td style="text-align:center;">' + sno++ + '</td>' +
                                    '<td style="text-align:center;">' + _transaction[row_cnt_t]["ID"] + '</td>' +
                                    '<td>' + _transaction[row_cnt_t]["Customer"] + '</td>' +
                                    '<td style="text-align:right;">' + accounting.formatNumber(_transaction[row_cnt_t]["Net_Amount"], 0) + '</td>' +
                                    '</tr>';
                                _brand_amt += parseFloat(_transaction[row_cnt_t]["Net_Amount"]);
                                _salesman_amt += parseFloat(_transaction[row_cnt_t]["Net_Amount"]);
                                _date_amt += parseFloat(_transaction[row_cnt_t]["Net_Amount"]);
                            }
                            rowdata += '<tr style="color:red;">' +
                                '<td colspan=3 style="text-align:right;">' + _Brand[row_cnt_bd]["_nam"] + ' Total : </td>' +
                                '<td style="text-align:right;">' + accounting.formatNumber(_brand_amt, 0) + '</td>' +
                                '</tr>';
                           


                        }
                        rowdata += '<tr style="color:red;">' +
                            '<td colspan=3 style="text-align:right;">' + _Salesman[row_cnt_sal]["_nam"] + ' Total : </td>' +
                            '<td style="text-align:right;">' + accounting.formatNumber(_salesman_amt, 0) + '</td>' +
                            '</tr>';
                        

                    }
                    //Brand End
                    rowdata += '<tr style="color:red;">' +
                        '<td colspan=3 style="text-align:right;">' + moment(_Date[row_cnt]["_id"]).format("DD-MMM-YYYY") + ' Total : </td>' +
                        '<td style="text-align:right;">' + accounting.formatNumber(_date_amt, 0) + '</td>' +
                        '</tr>';

                    rowdata += '</tbody>';
                }
                //Salesman End


                rowdata += '</table>';
                rowdata += '<p style="page-break-before: always">';
                detailsTableBody.append(rowdata);
                imgload.hide();
            }
            else {
                alert(response[0].Remarks);
                imgload.hide();
                //window.location.href = "@Url.Content("/login")";
            }
        },
        error: function (error) {
            console.log('Error ' + error);
            alert('Error ' + error);
            imgload.hide();
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
