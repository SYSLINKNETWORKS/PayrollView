var imgload = $("#img_load");
var cre = "";


$(document).ready(function () {

    imgload.hide();
    window.resizeTo(960, 600);
    printmaster();

});


function printmaster() {


    var currentURL = document.URL;
    var sessid = currentURL.split("&");
    var cre = sessionStorage.getItem(sessid[1]);

    TableBody_Heading = $("#tr_heading");
    detailsTableBody = $("#detail_table tbody");
    detailsTableBody.empty();
    $.ajax({

        url: apiUrl + '/Sales/Report/GetQuotationSummaryReport',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Creteria": cre }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            if (response[0].status == 1) {
                var username = response[0]["Result"][0]["User_Name"];
                var companyname = response[0]["Result"][0]["Company_Name"];
                var branchname = response[0]["Result"][0]["Branch_Name"];
                var today = 'Print By : ' + username + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                $('#lbl_company_name').html(branchname);
                $("#br_nam").html(branchname);

                $('#lbl_usrprt').html(today);
                var subtotalqty = 0;
                const MRPK_1 = response[0]["Result"];
                var MRPKID = [];
                for (i = 0; i < MRPK_1.length; i++) {
                    if (MRPKID.findIndex(x => x._id == MRPK_1[i].ID) == -1) {
                        MRPKID.push({ _id: MRPK_1[i].ID });
                    }
                }
                MRPKID.sort((a, b) => (a._id > b._id) ? 1 : -1);
                for (var MRPKID_cnt = 0; MRPKID_cnt < MRPKID.length; MRPKID_cnt++) {
                    //$("#lbl_mrpk_id").html(MRPKID[MRPKID_cnt].ID);
                    //$("#lbl_mrpk_dt").html(moment(MRPKID[MRPKID_cnt].Date).format('DD-MMM-YYYY'));
                    //$("#lbl_mrpk_rmk").html(MRPKID[MRPKID_cnt].Remarks);
                    const DRPK_1 = response[0]["Result"].filter(d => d.ID == MRPKID[MRPKID_cnt]["_id"]);
                    //var status = "";
                    
                    if (DRPK_1[0].Status == true) {
                        status = "Completed";
                    } else {
                        status = "In Process";
                    }
                    var _heading =
                       
                        '<tr>' +
                        '<td style="font-weight:bold">S.No.</td>' +
                        '<td style="font-weight:bold">Quotation#</td>' +
                        '<td style="font-weight:bold">Date</td>' +

                        '<td style="font-weight:bold">Customer</td>' +
                        '<td style="font-weight:bold">Item</td>' +
                        '<td style="font-weight:bold">Conversation</td>' +
                        '<td style="font-weight:bold">Status</td>' +
                        '</tr>';

                    detailsTableBody.append(_heading);


                    var _Subheading =

                        '<tr>' +
                        '<td style="font-weight:bold" colspan="7">' + DRPK_1[0]["Salesman"]+'</td>' +
                        '</tr>';

                    detailsTableBody.append(_Subheading);

                    var sno = 1;
                    for (var i = 0; i < DRPK_1.length; i++) {
                        var goodfinish = '<tr><td>' + sno++ +
                            '</td><td>' + DRPK_1[i]["No"] +
                            '</td><td>' + moment(DRPK_1[i]["Date"]).format('DD-MMM-YYYY') +
                            '</td><td>' + DRPK_1[i]["Customer"] +
                            '</td><td>' + DRPK_1[i]["Item"] +
                            '</td><td>' + DRPK_1[i]["Conversation"] +
                            '</td><td>' + DRPK_1[i]["Status"] + '</td></tr>';
                        detailsTableBody.append(goodfinish);
                    }
                    
                    var pag = '<tr style="page-break-after: always"></tr>'
                    detailsTableBody.append(pag);
                }




                imgload.hide();
            }
            else {
                alert(response[0].Remarks);
                imgload.hide();
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