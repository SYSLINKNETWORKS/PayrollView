//import { ProductionDetail as d } from "./ProductionReportDetail.js";

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

    detailsTable = $("#div_PrintingProduction");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/ProductionReport/GetPrintingHourlyProduction',
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
                $.getScript("/FunctionJS/Production/Report/ProductionReportDetail.js", function () {
                    detailsTable.append(ProductionDetail(response));
                });
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
// function printReport() {

//     detailsTable = $("#div_PrintingProduction");
//     detailsTable.empty();
//     $.ajax({
//         url: ApiForm + '/v1/ProductionReport/GetPrintingHourlyProduction',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         infoEmpty: "No records available - Got it?",

//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             imgload.show();
//         },
//         success: function (response) {
//             if (response.statusCode == 200) {





//                 //var today = 'Print By : ' + response.data["id"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
//                 var rowdata = '';
//                 rowdata = '<table id="detail_table" class="table" style="font-size:8pt;">';
//                 rowdata += '<thead>';
//                 rowdata += '  <tr style="border:1px solid black"><th rowspan="2" style="border:1px solid black"><div style="text-align:center;"><img src="/images/twpp.png" style="width: 100px; text-align:center ;" alt="twp"></dev></th><th rowspan="2" style="border:1px solid black"><div style="text-align:center;margin-bottom: 15px;">Printing Hourly Production Report</div></th><th colspan="2" style="border:1px solid black"><div style="text-align:center">Bindind Department</div></th>';
//                 rowdata += ' <tr style="border:1px solid black"><th style="border:1px solid black">$ssa</th><th style="border:1px solid black"><div style="text-align:center;">Page 1 of 1</div></th></tr>';
//                 rowdata += '<tr><td><b>Machine:</b></td><td style=" border-bottom: 1px solid black">115</td><td>Operator:</td><td class="hline" style=" border-bottom: 1px solid black">Amir Ali</td></tr>';
//                 rowdata += ' <tr><td><b>1st Asst:</b></td><td style="border-bottom: 1px solid black">12122</td><td>1st Asst:</td><td style="border-bottom: 1px solid black">3434</td></tr>';
//                 rowdata +='<tr><td></td></tr>';

//                 rowdata += '</thead>';

//                 rowdata +='<thead>';
//                 rowdata +='<tr style="font-weight:bold;background-color: #757575;color:black">'+
//                 '<th>Time</th>'+
//                 '<th>Job Description</th>'+
//                 '<th>Size</th>'+
//                 '<th>Cut Mode</th>'+
//                 '<th>Sheets</th>'+
//                 '<th>Board/Paper/GMS</th>' +
//                 '</tr>';
//                 rowdata += '</thead>';

//                 const productiondepartment=response.data["printingProductionLists"];
//                 rowdata +='<tbody>';

//                 for(row_cnt_filter=0; row_cnt_filter < productiondepartment.length; row_cnt_filter++)
//                 {

//                     rowdata +='<tr style="font-size:7pt;">';
//                     if(row_cnt_filter == productiondepartment.length-1)
//                     {
//                         rowdata += '<td>' + 'From ' + moment(productiondepartment[row_cnt_filter]["time"]).format("hh:mm A")+ '<br>' + 'To ' +  moment(productiondepartment[0]["time"]).format("hh:mm A")+'</td>';
//                     }
//                     if (row_cnt_filter != productiondepartment.length-1 ) {
//                         rowdata += '<td>' + 'From ' + moment(productiondepartment[row_cnt_filter]["time"]).format("hh:mm A")+ '<br>' + 'To ' +  moment(productiondepartment[row_cnt_filter+1]["time"]).format("hh:mm A")+'</td>';
//                     }
//                     rowdata += '<td style="Font-wight:bold;">' + productiondepartment[row_cnt_filter]["jobDescription"] + '</td>' +
//                     '<td>' + productiondepartment[row_cnt_filter]["size"] + '</td>' +
//                     '<td>' + productiondepartment[row_cnt_filter]["cutMode"] + '</td>' + 
//                     '<td>' + productiondepartment[row_cnt_filter]["sheet"] +  '</td>' +
//                     '<td>' + productiondepartment[row_cnt_filter]["board"] + '</td>' +
//                     '</tr>';
//             }
//             rowdata += '</tbody">';
//             rowdata += '</table>';

//                 rowdata += '</tbody">';
//                 rowdata += '</table>';

//                 detailsTable.append(rowdata);
//                 imgload.hide();
//             }
//             else {
//                 imgload.hide();
//                 Swal.fire({
//                     title: response.message,

//                     icon: 'warning',
//                     showConfirmButton: true,

//                     showClass: {
//                         popup: 'animated fadeInDown faster'
//                     },
//                     hideClass: {
//                         popup: 'animated fadeOutUp faster'
//                     }

//                 })
//             }
//         },
//         error: function (xhr, status, err) {
//             imgload.hide();
//             Swal.fire({
//                 title: xhr.status.toString() + ' ' + err.toString(),
//                 icon: 'warning',
//                 showConfirmButton: true,

//                 showClass: {
//                     popup: 'animated fadeInDown faster'
//                 },
//                 hideClass: {
//                     popup: 'animated fadeOutUp faster'
//                 }

//             })
//         }
//     })
// }
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