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
    detailsTable = $("#div_advancesum");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/Advance',
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
                var rowdata = '';
                rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:8pt;">';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Advance</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '</thead>';

                const department_1 = response.data["advancesList"];
                var department = [];
                for (i = 0; i < department_1.length; i++) {
                    if (department.findIndex(x => x._nam == department_1[i].departmentName) == -1) {
                        department.push({ _nam: department_1[i].departmentName });
                    }
                }
                department.sort((a, b) => (a._nam > b._nam) ? 1 : -1);


                for (var department_cnt = 0; department_cnt < department.length; department_cnt++) {
                    var _departmentAmount = 0;
                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th>S.No.</th>' +
                        '<th>Name</th>' +
                        '<th>Designation</th>' +
                        '<th>Cash/Bank</th>' +
                        '<th>Amount</th>' +
                        '</tr>';

                    rowdata += '</thead>';



                    const Date_1 = response.data["advancesList"].filter(d => d.departmentName == department[department_cnt]._nam);
                    var _Date = [];
                    for (i = 0; i < Date_1.length; i++) {
                        if (_Date.findIndex(x => x._dt == Date_1[i].date) == -1) {
                            _Date.push({ _dt: Date_1[i].date });
                        }
                    }
                    _Date.sort((a, b) => (a._dt > b._dt) ? 1 : -1);

                    for (var dt_cnt = 0; dt_cnt < _Date.length; dt_cnt++) {
                        var sno = 1,  _dateAmount = 0;
                        const employee_1 = response.data["advancesList"].filter(d => d.departmentName == department[department_cnt]._nam && d.date == _Date[dt_cnt]._dt);

                        var employee = [];
                        for (i = 0; i < employee_1.length; i++) {
                            if (employee.findIndex(x => x._id == employee_1[i].employeeId) == -1) {
                                employee.push({ _id: employee_1[i].employeeId, _nam: employee_1[i].employeeName });
                            }
                        }
                        employee.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                        rowdata += '<thead>';
                        rowdata += '<tr>' +
                            '<th style="text-align:left;" colspan="5">Department :' + department[department_cnt]._nam + ' <br/>Date : ' + moment(_Date[dt_cnt]._dt).format("DD-MMM-YYYY") + '</th>' +
                            '</tr>';

                        rowdata += '</thead>';

                        rowdata += '<tbody>';
                        for (var row_cnt = 0; row_cnt < employee.length; row_cnt++) {
                            const employeeFilter = response.data["advancesList"].filter(d => d.departmentName == department[department_cnt]._nam && d.date == _Date[dt_cnt]._dt && d.employeeId == employee[row_cnt]._id);
                            for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {

                                _departmentAmount += parseFloat(employeeFilter[row_cnt_filter]["amount"]);
                                _dateAmount += parseFloat(employeeFilter[row_cnt_filter]["amount"]);

                                rowdata += '<tr style="font-size:8pt;">' +
                                    '<td>' + sno++ + '</td>' +
                                    '<td>' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + '</td>' +
                                    '<td>' + employeeFilter[row_cnt_filter]["designationName"] + '</td>' +
                                    '<td>' + (employeeFilter[row_cnt_filter]["cashBank"] == "C" ? "Cash" : "Bank") + '</td>' +
                                    '<td>' + accounting.formatNumber(employeeFilter[row_cnt_filter]["amount"]) + '</td>' +
                                    '</tr>';
                            }
                        }

                        rowdata += '</tbody>';
                        rowdata += '<tfooter">';
                        rowdata += '<tr style="font-weight:bold;">' +
                            '<td style="font-weight:bold;text-align:right;" colspan=4 >Date Total : </td>' +
                            '<td style="font-weight:bold;">' + accounting.formatNumber(_dateAmount) + ' </td>' +
                            '</tr>';

                        rowdata += '</tfooter">';


                    }
                    rowdata += '<tfooter">';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<td style="font-weight:bold;text-align:right;" colspan=4 >Department Total : </td>' +
                        '<td style="font-weight:bold;">' + accounting.formatNumber(_departmentAmount) + ' </td>' +
                        '</tr>';

                    rowdata += '</tfooter">';

                }



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
