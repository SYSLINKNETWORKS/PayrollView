var imgload = $("#img_load");
var ApiForm = '';
var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);

var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});
function printReport() {

    // var ck = ckvalidation();
    // var ckval = ck.ckval;
    // if (ckval == 1) { return; }
    // var _cre = ck.creteria;

    // detailsTable = $("#detail_table");
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();
    //detailsTableFooter.empty();

    $.ajax({

        url: ApiForm + '/Reports/GetTrailBalance',
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
                var _JsonValue = JSON.parse(_cre);

                var today = 'Print By : ' + response["data"]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                $('#lbl_company_name').html(response["data"]["companyName"]);
                $("#br_nam").html(response["data"]["branchName"]);
                $('#lbl_head').html("Trial Balance <br/> As on " + _JsonValue.dateAsOn);
                $('#lbl_usrprt').html(today);
                // var cre_datfrm = moment(response[0]["Result_Heading"][0]["Year_Start"]).format("DD-MMM-YYYY");
                var _DrAmt = 0, _CrAmt = 0

                //Control Account Start
                const cid_1 = response["data"]["trailBalanceDetailReportViewModel"];

                var cid = [];
                for (i = 0; i < cid_1.length; i++) {

                    if (cid.findIndex(x => x._no == cid_1[i].accountControlNo) == -1) {
                        cid.push({ _no: cid_1[i].accountControlNo, _id: cid_1[i].accountControlId, _nam: cid_1[i].accountControlName });
                    }
                }
                cid.sort((a, b) => (a._id > b._id) ? 1 : -1);



                for (var cid_cnt = 0; cid_cnt < cid.length; cid_cnt++) {
                    var rowdata_cid = '<tr>' +
                        '<td colspan=4 style="font-weight:bold;text-align:center;">' + '[' + cid[cid_cnt]._id + ']-' + cid[cid_cnt]._nam + '</td>' +
                        '</tr>';
                    detailsTableBody.append(rowdata_cid);


                    // const cid_2 = response["data"]["trailBalanceDetailReportViewModel"].filter(d => d.accountId == cid[cid_cnt].accountId);
                    const cid_2 = response["data"]["trailBalanceDetailReportViewModel"].filter(d => d.accountControlNo == cid[cid_cnt]._no);


                    var _DrAmt_Sub = 0, _CrAmt_Sub = 0
                    for (var row_cnt = 0; row_cnt < cid_2.length; row_cnt++) {

                        var cre_gl = "";
                        var sessid_gl = "T" + cid_2[row_cnt]["accountNo"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");
                        var sessid_name_gl = cid_2[row_cnt]["accountNo"] + "N" + moment(new Date()).format("DDMMYYYYHHmmss");

                        var _criteriaGL = JSON.stringify({
                            "dateFrom": response["data"]["Date_Start"],
                            "dateTo": _JsonValue.dateAsOn,
                            "accountNo": cid_2[row_cnt]["accountNo"],
                        });

                        // var datfrm = moment(response["data"]["Date_Start"]).format("DD-MMM-YYYY");// response[0]["Result_Heading"][0]["Date_Start"];//'2020-01-01';// response[0]["Result_Heading"][0]["Date_Start"];
                        // var datto = cre_date;
                        // cre_gl = "mvch_dt between '" + datfrm + "' and '" + datto + "'";
                        // sessid_name_gl = '_';
                        // //Date End
                        // //Account Start
                        // cre_gl += " and t_dvch.acc_no=" + cid_2[row_cnt]["accountNo"];
                        // //Account End
                        sessionStorage.setItem(sessid_gl, _criteriaGL);

                        var rowdata = '<tr >' +
                            '<td><a href="#" onclick=window.open("' + apiUrl_View + '/GL/Report/GeneralLedger?S=' + sessid_gl + '","_blank") > ' + cid_2[row_cnt]["accountId"] + '</a ></td > ' +
                            '<td>' + cid_2[row_cnt]["accountName"] + '</td>' +
                            '<td>' + accounting.formatNumber(cid_2[row_cnt]["debit"], 2) + '</td>' +
                            '<td>' + accounting.formatNumber(cid_2[row_cnt]["credit"], 2) + '</td>' +
                            '</tr>';

                        _DrAmt_Sub = parseFloat(_DrAmt_Sub) + parseFloat(cid_2[row_cnt]["debit"]);
                        _CrAmt_Sub = parseFloat(_CrAmt_Sub) + parseFloat(cid_2[row_cnt]["credit"]);
                        detailsTableBody.append(rowdata);

                    }

                    var _DrAmt_Sub_print = 0, _CrAmt_Sub_print = 0;
                    if ((parseFloat(_DrAmt_Sub) - parseFloat(_CrAmt_Sub)) > 0) {
                        _DrAmt_Sub_print = parseFloat(_DrAmt_Sub) - parseFloat(_CrAmt_Sub);
                        _CrAmt_Sub_print = 0;
                    }
                    else {
                        _DrAmt_Sub_print = 0;
                        _CrAmt_Sub_print = -(parseFloat(_DrAmt_Sub) - parseFloat(_CrAmt_Sub));
                    }

                    _DrAmt = parseFloat(_DrAmt) + parseFloat(_DrAmt_Sub_print);
                    _CrAmt = parseFloat(_CrAmt) + parseFloat(_CrAmt_Sub_print);

                    //Sub Grand Total Start                    
                    var rowdata = '<tr  style="font-weight:bold">' +
                        '<td></td>' +
                        '<td style="text-align:right;">Sub-Total : </td>' +
                        '<td>' + accounting.formatNumber(_DrAmt_Sub_print, 2) + '</td>' +
                        '<td>' + accounting.formatNumber(_CrAmt_Sub_print, 2) + '</td>' +
                        '</tr>';
                    detailsTableBody.append(rowdata);
                }
                var diffamt = parseFloat(_DrAmt).toFixed(2) - parseFloat(_CrAmt).toFixed(2);

                //Grand Total Start
                var rowdata = '<tr  style="font-weight:bold">' +
                    '<td></td>' +
                    '<td style="text-align:right;">Grand Total : </td>' +
                    '<td>' + accounting.formatNumber(_DrAmt, 2) + '</td>' +
                    '<td>' + accounting.formatNumber(_CrAmt, 2) + '</td>' +
                    '</tr>';
                if (parseFloat(diffamt) != 0) {
                    rowdata += '<tr  style="font-weight:bold; color:Red;">' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td style="text-align:right;">Difference : </td>' +
                        '<td>' + accounting.formatNumber(diffamt, 2) + '</td>' +
                        '</tr>';

                }
                detailsTableBody.append(rowdata);
                //Grand Total End
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


// function ckvalidation() {
//     var ck = 0, _Error = '', _cre = '';

//     // if (txtbktyp.val() == '') {
//     //     ck = 1;
//     //     _Error = 'Please Select BankType';

//     // }
//     // if (txtcurrency.val() == '') {
//     //     ck = 1;
//     //     _Error = 'Please Select Currency';

//     // }
//     // if (Boolean(ck)) {
//     //     Swal.fire({
//     //         title: _Error,
//     //         icon: 'error'
//     //     })
//     //     return;
//     // }

//     _cre = JSON.stringify({

//         "dateAsOn": "2022-01-05T11:09:10.746Z",
//         "status": "string",


//     });
//     return { ckval: ck, creteria: _cre };
// }