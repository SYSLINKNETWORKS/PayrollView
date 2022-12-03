

var imgload = $("#img_load");
var currentURL = document.URL;
var sessid_url = currentURL.split("&");
var sessid = sessid_url[1];
var sessid_name = sessid_url[2];
var cre = sessionStorage.getItem(sessid);
var cre_name = sessionStorage.getItem(sessid_name);

var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});

function printReport() {
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();

    $.ajax({

        url: ApiForm + '/Reports/GetChartofAccount',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {

                var today = 'Print By : ' + response["data"]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                $('#lbl_company_name').html(response["data"]["companyName"]);
                $("#br_nam").html(response["data"]["branchName"]);
                $('#lbl_head').html("Chart of Account".toUpperCase());
                $('#lbl_usrprt').html(today);

                var rowdata = '';
                var _DetailRecord = response["data"]["chartOfAccountReportDetailViewModels"];
                for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {

                    var sessid_cof = _DetailRecord[row_cnt]["no"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");
                    var datfrm = moment(response["data"]["dateStart"]).format("DD-MMM-YYYY");
                    var datto = moment(new Date()).format("DD-MMM-YYYY");
                    var cre_det = " t_dvch.acc_no=" + _DetailRecord[row_cnt]["no"] + " and mvch_dt <= '" + datto + "'";
                    sessionStorage.setItem(sessid_cof, cre_det);

                    var style_row = '', _link = '';

                    if (_DetailRecord[row_cnt]["masterDetail"] == "M") {
                        style_row = 'style="font-weight:bold;"';
                    }
                    else if (_DetailRecord[row_cnt]["masterDetail"] == "D") {
                        _link = 'onclick=window.open("' + apiUrl_View + '/GL/Report/GeneralLedger?1&' + sessid_cof + '&' + datfrm + '&' + datto + '","_blank")';
                    }
                    rowdata += '<tr  ' + style_row + _link + ' >';
                    rowdata += '<td style="text-indent:' + (_DetailRecord[row_cnt]["level"] - 1) * 5 + '%;">' + _DetailRecord[row_cnt]["id"] + '</td>' +
                        '<td><a href="#">' + _DetailRecord[row_cnt]["name"] + '</a></td>' +
                        '</tr>';
                }

                detailsTableBody.append(rowdata);

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
