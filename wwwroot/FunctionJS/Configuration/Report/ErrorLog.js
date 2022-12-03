var imgload = $("#img_load");
var _id = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('I')) {
    _id = url.get('I');
}

var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/log/v1';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {
    detailsTable = $("#div_ErrorLog");
    detailsTable.empty();
    $.ajax({
        // url: apiUrl + '/Payroll/Report/TimeSheetWorker/' + strkey + '/' + _date+'/'+_emppro_id+'/'+_emppro_com_id,
        url: ApiForm+'/Log/GetLogById',//ApiForm +'/GetLogById',
        type: "Get",
        contentType: "application/json",
        dataType: "json",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Id", _id);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                
                    var today = 'Print By : ' + response.data["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                    var rowdata = '';
                    rowdata = '<table id="detail_table" class="table table-responsive" style="font-size:10pt;">';
                    rowdata += '<thead>';
                    rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=21>' + response.data["companyName"] + '</th></tr>';
                    rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=21>' + today + '</th></tr>';
                    rowdata += '</thead>';



                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th style="text-align:Center;vertical-align:middle;">ID</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Description</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Details</th>' +
                        '<th style="text-align:Center;vertical-align:middle;">Type</th>' +
                        '</tr>';
                    rowdata += '</thead>';

                    rowdata += '<tbody">';

                    rowdata += '<tr>' +
                        '<td>' + response.data["id"] + '</td>' +
                        '<td >' + response.data["description"] + '</td>' +
                        '<td >' + response.data["stackTrace"] + '</td>' +
                        '<td style="text-align:Center;color:Red;">' + response.data["type"] + '</td>' +
                        '</tr>';


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

function viewAbsentDetail(sessidAbsentDetail) {
    window.open(apiUrl_View + '/Payroll/Report/AbsentDetail?S=' + sessidAbsentDetail, '_blank');

}