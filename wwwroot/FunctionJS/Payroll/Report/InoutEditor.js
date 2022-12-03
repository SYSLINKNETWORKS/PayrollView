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
    ApiForm = apiUrl + '/api/Payroll';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {
    detailsTable = $("#div_inoutEditor");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/InOutEditor',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "dateFrom": "2021-06-01", "dateTo": "2021-06-01", "employeeId": "", "branchId": "", "officeWorker": "", "TemporaryPermanent": "", "designationId": "", "departmentId": "", "gender": "" }),
        // data:_creJson,// JSON.stringify(_cre ),
        data: _cre,

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var today = 'Print By : ' + response.data["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var Dates = 'Date From  : ' + moment(response.data["dateFrom"]).format("DD-MMM-YYYY") + ' To : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY");
                var rowdata = '';
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>In-Out Editor</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + Dates + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<th>Sr.No</th>' +
                    '<th>Name</th>' +
                    '<th>Department</th>' +
                    '<th>Designation</th>' +
                    '<th>Category</th>' +
                    '<th>Check Type</th>' +
                    '<th>Time</th>' +
                    '<th>Approved</th>' +
                    '</tr>';


                rowdata += '</thead>';
                rowdata += '<tbody">';
                const Date_1 = response.data["inOutEditorSummaryLists"];
                var _Date = [];
                for (i = 0; i < Date_1.length; i++) {
                    if (_Date.findIndex(x => x._dt == Date_1[i].date) == -1) {
                        _Date.push({ _dt: Date_1[i].date });
                    }
                }
                _Date.sort((a, b) => (a._dt > b._dt) ? 1 : -1);

                for (var dt_cnt = 0; dt_cnt < _Date.length; dt_cnt++) {
                    rowdata += '<tr style="font-size:8pt;font-weight:bold;">' +
                        '<td>Date</td>' +
                        '<td colspan=5>' + moment(_Date[dt_cnt]["_dt"]).format("DD-MMM-YYYY") + '</td>' +
                        '</tr>';

                    const employee_1 = response.data["inOutEditorSummaryLists"].filter(d => d.date == _Date[dt_cnt]._dt);
                    var employee = [];
                    for (i = 0; i < employee_1.length; i++) {
                        if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                            employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                        }
                    }
                    employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                    var sno = 1;
                    for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                        const employeeFilter = response.data["inOutEditorSummaryLists"].filter(d => d.date == _Date[dt_cnt]._dt && d.employeeId == employee[row_cnt]._id);
                        for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {
                            var style = employeeFilter[row_cnt_filter]["approved"] == true ? "" : "style='color:red;'";
                            rowdata += '<tr style="font-size:8pt;">' +
                                '<td>' + sno++ + '</td>' +
                                '<td>' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["departmentName"] + '</td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["designationName"] + '</td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["inoutCategoryName"] + '</td>' +
                                '<td>' + (employeeFilter[row_cnt_filter]["checkType"] == "I" ? "Inn" : employeeFilter[row_cnt_filter]["checkType"] == "O" ? "Out" : " ") + '</td>' +
                                '<td>' + moment(employeeFilter[row_cnt_filter]["checkTime"]).format('HH:mm') + '</td>' +
                                '<td ' + style + ' >' + (employeeFilter[row_cnt_filter]["approved"] == true ? "Yes" : "No") + '</td>' +
                                '</tr>';
                        }
                    }
                }
                rowdata += '</tbody">';
                rowdata += '</table>';

                detailsTable.append(rowdata);
                imgload.hide();
            }
            else {
                imgload.hide();
                //                alert(response.message);
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

                //window.location.href = "@Url.Content("/login")";
            }
        },
        error: function (error) {
            imgload.hide();

            Swal.fire({
                title: 'Error ' + error,

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
