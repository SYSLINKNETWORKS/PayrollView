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
        url: ApiForm + '/v1/Sales/AgingReport',
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
                var _columnno = 13;
                var _AmountTotal = 0, _BalanceAmountTotal = 0, _Column0Total = 0, _Column15Total = 0, _Column30Total = 0, _Column45Total = 0, _Column60Total = 0, _ColumnAboveTotal = 0, _AgingAmountTotal = 0;
                var today = 'Print By : ' + response["data"][0]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var rowdata = '';
                rowdata = '<table id="detail_table_master" class="table table-responsive " style="font-size:7pt;" >';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=' + _columnno + ' >' + response["data"][0]["companyName"] + ' </th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=' + _columnno + ' >' + response["data"][0]["headingName"] + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=' + _columnno + ' >' + today + '</th></tr>';
                rowdata += '</thead>';
                rowdata += '</table>';



                const _customerRecord = response["data"];
                var _customerArray = [];
                for (i = 0; i < _customerRecord.length; i++) {

                    if (_customerArray.findIndex(x => x._customerName == _customerRecord[i].customerName) == -1) {
                        _customerArray.push({ _customerName: _customerRecord[i].customerName, _creditDays: _customerRecord[i].creditDays });
                    }
                }
                _customerArray.sort((a, b) => (a._customerName > b._customerName) ? 1 : -1);
                for (var row_cnt = 0; row_cnt < _customerArray.length; row_cnt++) {
                    var _Amount = 0, _BalanceAmount = 0, _Column0 = 0, _Column15 = 0, _Column30 = 0, _Column45 = 0, _Column60 = 0, _ColumnAbove = 0, _AgingAmount = 0;
                    var _sno = 0;
                    rowdata += '<table id="detail_table_custmer" class="table table-responsive table-bordered" style="font-size:7pt;" >';
                    rowdata += '<thead>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=' + _columnno + ' >' + _customerArray[row_cnt]["_customerName"] + ' </th></tr>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:right;" colspan=' + _columnno + ' >' + ' Credit Days : ' + _customerArray[row_cnt]["_creditDays"] + ' </th></tr>';
                  //  rowdata += '</thead>';
                    //     rowdata += '</table>';


                    //    rowdata += '<table id="detail_table" class="table table-responsive table-bordered" style="font-size:7pt;" >';
                   // rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th >S.No</th>' +
                        '<th>Invoice No.</th>' +
                        '<th>Date</th>' +
                        '<th>Due Date</th>' +
                        '<th>Amount</th>' +
                        '<th>Balance</th>' +
                        '<th>Days</th>' +
                        '<th>1-15</th>' +
                        '<th>16-30</th>' +
                        '<th>31-45</th>' +
                        '<th>46-60</th>' +
                        '<th>Above 60</th>' +
                        '<th>Balance</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    rowdata += '<body>';

                    const _customerTransaction = response["data"].filter(d => d.customerName == _customerArray[row_cnt]["_customerName"]);

                    const _dateRecord = _customerTransaction;
                    var _dateArray = [];
                    for (i = 0; i < _dateRecord.length; i++) {

                        if (_dateArray.findIndex(x => x._date == _dateRecord[i].date) == -1) {
                            _dateArray.push({ _date: _dateRecord[i].date });
                        }
                    }
                    _dateArray.sort((a, b) => (a._date > b._date) ? 1 : -1);
                    for (var row_cnt_date = 0; row_cnt_date < _dateArray.length; row_cnt_date++) {


                        const _transaction = response["data"].filter(d => d.customerName == _customerArray[row_cnt]["_customerName"] && d.date == _dateArray[row_cnt_date]["_date"]);


                        for (var row_cnt_detail = 0; row_cnt_detail < _transaction.length; row_cnt_detail++) {
                            _sno += 1;
                            var _NotDue = _transaction[row_cnt_detail]["column0"];
                            var _Balance = parseFloat(_transaction[row_cnt_detail]["balance"]) - parseFloat(_transaction[row_cnt_detail]["column0"])


                            rowdata += '<tr>' +
                                '<td>' + _sno + '</td>' +
                                '<td>' + _transaction[row_cnt_detail]["no"] + '</td>' +
                                '<td>' + moment(_transaction[row_cnt_detail]["date"]).format('DD-MMMM-YYYY') + '</td>' +
                                '<td>' + moment(_transaction[row_cnt_detail]["dueDate"]).format('DD-MMMM-YYYY') + '</td>' +
                                '<td>' + accounting.format(_transaction[row_cnt_detail]["amount"], 0) + '</td>' +
                                '<td>' + accounting.format(_transaction[row_cnt_detail]["balance"], 0) + '</td>' +
                                '<td>' + _transaction[row_cnt_detail]["days"] + '</td>' +
                                '<td>' + accounting.format(_transaction[row_cnt_detail]["column15"], 0) + '</td>' +
                                '<td>' + accounting.format(_transaction[row_cnt_detail]["column30"], 0) + '</td>' +
                                '<td>' + accounting.format(_transaction[row_cnt_detail]["column45"], 0) + '</td>' +
                                '<td>' + accounting.format(_transaction[row_cnt_detail]["column60"], 0) + '</td>' +
                                '<td>' + accounting.format(_transaction[row_cnt_detail]["columnAbove"], 0) + '</td>' +

                                '<td>' + accounting.format(_Balance, 0) + '</td>' +
                                '</tr>';
                            _Amount += parseFloat(_transaction[row_cnt_detail]["amount"]);
                            _BalanceAmount += parseFloat(_transaction[row_cnt_detail]["balance"]);
                            _Column0 += parseFloat(_NotDue);
                            _Column15 += parseFloat(_transaction[row_cnt_detail]["column15"]);
                            _Column30 += parseFloat(_transaction[row_cnt_detail]["column30"]);
                            _Column45 += parseFloat(_transaction[row_cnt_detail]["column45"]);
                            _Column60 += parseFloat(_transaction[row_cnt_detail]["column60"]);
                            _ColumnAbove += parseFloat(_transaction[row_cnt_detail]["columnAbove"]);
                            _AgingAmount = (parseFloat(_Column15) + parseFloat(_Column30) + parseFloat(_Column45) + parseFloat(_Column60) + parseFloat(_ColumnAbove));

                        }
                        rowdata += '</body>';


                    }

                    rowdata += '<tfooter>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th style="font-weight:bold;text-align:right;" colspan=' + (_columnno - 9) + '>Total</th>' +
                        '<th>' + accounting.format(_Amount, 0) + ' </th>' +
                        '<th>' + accounting.format(_BalanceAmount, 0) + ' </th>' +
                        '<th> </th>' +
                        '<th>' + accounting.format(_Column15, 0) + ' </th>' +
                        '<th>' + accounting.format(_Column30, 0) + ' </th>' +
                        '<th>' + accounting.format(_Column45, 0) + ' </th>' +
                        '<th>' + accounting.format(_Column60, 0) + ' </th>' +
                        '<th>' + accounting.format(_ColumnAbove, 0) + ' </th>' +
                        '<th>' + accounting.format(_AgingAmount, 0) + ' </th>' +
                        '</tr>';
                    rowdata += '</tfooter>';

                    _AmountTotal += parseFloat(_Amount);
                    _BalanceAmountTotal += parseFloat(_BalanceAmount);
                    _Column0Total += parseFloat(_Column0);
                    _Column15Total += parseFloat(_Column15);
                    _Column30Total += parseFloat(_Column30);
                    _Column45Total += parseFloat(_Column45);
                    _Column60Total += parseFloat(_Column60);
                    _ColumnAboveTotal += parseFloat(_ColumnAbove);
                    _AgingAmountTotal += parseFloat(_AgingAmount);

                    _Amount = 0, _BalanceAmount = 0, _Column0 = 0, _Column15 = 0, _Column30 = 0, _Column45 = 0, _Column60 = 0, _ColumnAbove = 0, _AgingAmount = 0;

                    //   rowdata += '</table>';
                }
                // rowdata += '<table id="detail_table_footer" class="table table-responsive table-bordered" style="font-size:7pt;" >';
                rowdata += '<tfooter>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<tr style="font-weight:bold;">' +
                    '<th style="font-weight:bold;text-align:right;" colspan=' + (_columnno - 9) + '>Grand Total</th>' +
                    '<th>' + accounting.format(_AmountTotal, 0) + ' </th>' +
                    '<th>' + accounting.format(_BalanceAmountTotal, 0) + ' </th>' +
                    '<th></th>' +
                    '<th>' + accounting.format(_Column15Total, 0) + ' </th>' +
                    '<th>' + accounting.format(_Column30Total, 0) + ' </th>' +
                    '<th>' + accounting.format(_Column45Total, 0) + ' </th>' +
                    '<th>' + accounting.format(_Column60Total, 0) + ' </th>' +
                    '<th>' + accounting.format(_ColumnAboveTotal, 0) + ' </th>' +
                    '<th>' + accounting.format(_AgingAmountTotal, 0) + ' </th>' +
                    '</tr>';
                rowdata += '</tfooter>';
                rowdata += '</table>';

                // rowdata += '</div>';
                // rowdata += '<p style="page-break-before: always">';

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