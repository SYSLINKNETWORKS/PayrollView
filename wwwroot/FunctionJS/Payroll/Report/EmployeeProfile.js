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
    detailsTable = $("#div_employeeprofile");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/PayrollReport/EmployeeProfile',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
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
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Employee Profile Report</th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>Date from : ' + moment(response.data["dateFrom"]).format("DD-MMM-YYYY") + ' to : ' + moment(response.data["dateTo"]).format("DD-MMM-YYYY") + ' </th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                rowdata += '</thead>';


                const department_1 = response.data["employeeProfileSummaryLists"];
                var department = [];
                for (i = 0; i < department_1.length; i++) {
                    if (department.findIndex(x => x._nam == department_1[i].departmentName) == -1) {
                        department.push({ _nam: department_1[i].departmentName });
                    }
                }
                department.sort((a, b) => (a._nam > b._nam) ? 1 : -1);


                for (var row_cnt = 0; row_cnt < department.length; row_cnt++) {
                    var sno = 1;

                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th style="text-align:Center;vertical-align:middle;">SNo.</th>' +
                        '<th style="text-align:Center;">Employee Name</th>' +
                        '<th style="text-align:Center;">Designation</th>' +
                        '<th style="text-align:Center;">Gender</th>' +
                        '<th style="text-align:Center;">Martial Status</th>' +
                        '<th style="text-align:Center;">Date of Join</th>' +
                        '<th style="text-align:Center;">CNIC</th>' +
                        '<th style="text-align:Center;">CNIC Expiry</th>' +
                        '<th style="text-align:Center;">NTN</th>' +
                        '<th style="text-align:Center;">Documents</th>' +
                        '</tr>';
                    rowdata += '<tr>' +
                        '<th style="text-align:left;" colspan="8">' + department[row_cnt]._nam + '</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    rowdata += '<tbody">';



                    const DepartmentFilter = response.data["employeeProfileSummaryLists"].filter(d => d.departmentName == department[row_cnt]._nam);
                    var employeeArray = [];
                    for (i = 0; i < DepartmentFilter.length; i++) {
                        if (employeeArray.findIndex(x => x._id == DepartmentFilter[i].employeeId) == -1) {
                            employeeArray.push({ _id: DepartmentFilter[i].employeeId, _nam: DepartmentFilter[i].employeeName });
                        }
                    }
                    employeeArray.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                    for (var row_cnt_Array = 0; row_cnt_Array < employeeArray.length; row_cnt_Array++) {

                        const employeeFilter = response.data["employeeProfileSummaryLists"].filter(d => d.employeeId == employeeArray[row_cnt_Array]._id);
                        for (var row_cnt_filter = 0; row_cnt_filter < employeeFilter.length; row_cnt_filter++) {

                            //Employee Profile Details
                            var sessidEmployeeProfileDetail = "E"+employeeFilter[0]["employeeId"];//  sno+ moment(new Date()).format("DDMMYYYYHHMMSS");

                            var creEmployeeProfileDetail = '{"employeeId":"' + employeeFilter[0]["employeeId"] + '"}';

                            sessionStorage.setItem(sessidEmployeeProfileDetail, creEmployeeProfileDetail);
                            var style = employeeFilter[row_cnt_filter]["cnicExpireDays"] > 0 ? "" : "style='color:red;'";

                            //Document View
                            var sessidDocumentDetail = "D"+employeeFilter[0]["employeeId"];//  sno+ moment(new Date()).format("DDMMYYYYHHMMSS");

                            var creDocumentDetail = employeeFilter[0]["employeeId"];

                            sessionStorage.setItem(sessidDocumentDetail, creDocumentDetail);

                            var _AttachmentLink = '';
                            if (parseInt(employeeFilter[0]["attachDocuments"]) > 0) {
                                _AttachmentLink = '<span style="cursor:pointer;color:blue;"  onclick="viewDocuments(\'' + sessidDocumentDetail + '\')">Attachment</span>';
                            }

                            rowdata += '<tr>' +
                                '<td style="text-align:Center;">' + sno++ + '</td>' +
                                '<td style="text-align:left;"><span style="cursor:pointer;color:blue;"  onclick="viewEmployeeDetail(\'' + sessidEmployeeProfileDetail + '\')">' + '[' + employeeFilter[row_cnt_filter]["employeeNo"] + ']' + ' - ' + employeeFilter[row_cnt_filter]["employeeName"] + ' ' + employeeFilter[row_cnt_filter]["fatherName"] + '</span></td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["designationName"] + '</td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["gender"] + '</td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["married"] + '</td>' +
                                '<td>' + moment(employeeFilter[row_cnt_filter]["dateofJoin"]).format("DD-MMM-YYYY") + '</td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["cnic"] + '</td>' +
                                '<td ' + style + '>' + moment(employeeFilter[row_cnt_filter]["cnicExpire"]).format("DD-MMM-YYYY") + '</td>' +
                                '<td>' + employeeFilter[row_cnt_filter]["ntn"] + '</td>' +
                                '<td>' + _AttachmentLink + '</td>' +
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