var creheading = $("#creheading");
var imgload = $("#img_load");
var reportid = $("#reportid");

var divrpttyp = $("#div_rpttyp");
var divid = $("#div_id");
var divdatfrmto = $("#div_datfrmto");
var divdatason = $("#div_datason");
var divdated = $("#div_dated");

var divso = $("#div_so");
var divcus = $("#div_cus");
var divitem = $("#div_item");
var divsalesman = $("#div_salesman");
var divsalesmanby = $("#div_salesmanby");
var divBroker = $("#div_Broker");
var divcustomerbank = $("#div_customerbank");




var txtdatason = $("#txt_datason");
var txtdatfrm = $("#txt_dat_frm");
var txtdatto = $("#txt_dat_to");
var txtdated = $("#txt_dated");
var ddlrpttyp = document.getElementById("ddl_rpttyp");

$(function () {
    txtdatason.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatfrm.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatto.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdated.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    reportpermission();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdatason.find("input").val(CurrentDate);
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);
    txtdated.find("input").val(CurrentDate);
    discon(0);
    ComponentsDropdowns.init();
});

function reportpermission() {

    var _ReportCustomer = $("#ReportCustomer");
    var _ReportItemRate = $("#ReportItemRate");
    var _ReportItemDiscount = $("#ReportItemDiscount");
    var _ReportSaleOrder = $("#ReportSaleOrder");
    var _ReportDeliveryChallan = $("#ReportDeliveryChallan");
    var _ReportInvoice = $("#ReportInvoice");
    var _ReportReceipt = $("#ReportReceipt");
    var _ReportCreditNote = $("#ReportCreditNote");
    var _ReportOutstanding = $("#ReportOutstanding");
    var _ReportSaleRegisterItemWise = $("#ReportSaleRegisterItemWise");
    var _ReportDailySalesReport = $("#ReportDailySalesReport");
    var _ReportCreditSales = $("#ReportCreditSales");
    var _ReportSalesmanSummary = $("#ReportSalesmanSummary");
    var _ReportCustomerItemSalesSummary = $("#ReportCustomerItemSalesSummary");
    var _ReportCustomerSalesSummary = $("#ReportCustomerSalesSummary");
    var _ReportItemSalesSummary = $("#ReportItemSalesSummary");
    var _ReportItemSalesSummarySOWise = $("#ReportItemSalesSummarySOWise");


    _ReportCustomer.hide();
    _ReportItemRate.hide();
    _ReportItemDiscount.hide();
    _ReportSaleOrder.hide();
    _ReportDeliveryChallan.hide();
    _ReportInvoice.hide();
    _ReportReceipt.hide();
    _ReportCreditNote.hide();
    _ReportOutstanding.hide();
    _ReportSaleRegisterItemWise.hide();
    _ReportDailySalesReport.hide();
    _ReportCreditSales.hide();
    _ReportSalesmanSummary.hide();
    _ReportCustomerItemSalesSummary.hide();
    _ReportCustomerSalesSummary.hide();
    _ReportItemSalesSummary.hide();
    _ReportItemSalesSummarySOWise.hide();

    $.ajax({
        url: apiUrl + '/Menu/FetchSaleReportMenu',
        type: "Post",
        data: JSON.stringify({ "Token": strkey }),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response[0].status == 1) {
                txtdatfrm.find("input").val(moment(response[0]["Result_Information"][0]["Start_Date"]).format("DD-MMM-YYYY"));
                txtdatto.find("input").val(moment(response[0]["Result_Information"][0]["End_Date"]).format("DD-MMM-YYYY"));

                for (var men_cnt = 0; men_cnt < response[0]["Result"].length; men_cnt++) {
                    //Customer
                    if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportcustomerprofile') {
                        _ReportCustomer.show();
                    }
                    //Item Rate
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportitemrate') {
                        _ReportItemRate.show();
                    }
                    //Item Discount Rate
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportitemdiscount') {
                        _ReportItemDiscount.show();
                    }
                    //Sales Order
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportsaleorder') {
                        _ReportSaleOrder.show();
                    }
                    //Invoice
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportinvoice') {
                        _ReportDeliveryChallan.show();
                        _ReportInvoice.show();
                    }

                    //Receipt
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportreceipt') {
                        _ReportReceipt.show();
                    }

                    //Credit Note
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportcreditnote') {
                        _ReportCreditNote.show();
                    }

                    //Customer Outstanding
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportcustomeroutstanding') {
                        _ReportOutstanding.show();
                    }

                    //Sale Register Item Wise
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportsalesregisteritemwise') {
                        _ReportSaleRegisterItemWise.show();
                    }

                    // Daily Sales Report
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportdailysalesreport') {
                        _ReportDailySalesReport.show();
                    }


                    //Receipt
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportreceipt') {
                        _ReportReceipt.show();
                    }

                    //Credit Sales
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportcreditsalesreport') {
                        _ReportCreditSales.show();
                    }

                    //Salesman Summary
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportsalesmansummary') {
                        _ReportSalesmanSummary.show();
                    }

                    //Customer Item Sales Summary
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'rb_customeritemsales') {
                        _ReportCustomerItemSalesSummary.show();
                    }

                    //Customer Sales Summary
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'rb_customersalessummary') {
                        _ReportCustomerSalesSummary.show();
                    }

                    //Item Sales Summary
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'rb_customersalesreturnsummary') {
                        _ReportItemSalesSummary.show();
                    }

                    //Item Sales Summary SO Wise
                    else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'rb_itemsalessummarysowise') {
                        _ReportItemSalesSummarySOWise.show();
                    }
                }

            }
            else {
                console.log("invalid key");
                localStorage.clear();
                window.location.href = '/login';
            }
        },
        error: function (error) {
            alert('Error ' + error)
        }
    })

}

function discon(_reportid) {
    imgload.hide();
    creheading.html('');
    reportid.value = '';
    divid.hide();
    divrpttyp.hide();
    divdatfrmto.hide();
    divdatason.hide();
    divdated.hide();
    divso.hide();
    divcus.hide();
    divitem.hide();
    divsalesman.hide();
    divsalesmanby.hide();
    divBroker.hide();
    divcustomerbank.hide();
    ddlrpttyp.options.length = 0;

    reportid.value = _reportid;



    //Customer Start
    if (reportid.value == '1') {
        divcus.show();
        creheading.html($('#ReportCustomer').html().toUpperCase());
    }
    //Customer End

    //Item Rate Start
    else if (reportid.value == '2') {
        divdatfrmto.show();
        divcus.show();
        divitem.show();
        creheading.html($('#ReportItemRate').html().toUpperCase());
    }
    //Item Rate End

    //Item Discount Start
    else if (reportid.value == '3') {
        divdatfrmto.show();
        divcus.show();
        divitem.show();

        creheading.html($('#ReportItemDiscount').html().toUpperCase());
    }
    //Item Discount End


    //Sale Order Start
    else if (reportid.value == '4') {
        divdatfrmto.show();
        divcus.show();
        divitem.show();
        divBroker.show();

        creheading.html($('#ReportSaleOrder').html().toUpperCase());
    }
    //Sale Order End

    //Delivery Challan Start
    else if (reportid.value == '16') {
        divdatfrmto.show();
        divcus.show();
        divsalesman.show();
        divitem.show();
        divBroker.show();

        creheading.html($('#ReportDeliveryChallan').html().toUpperCase());
    }
    //Invoice Start
    else if (reportid.value == '5') {
        divdatfrmto.show();
        divcus.show();
        divsalesman.show();
        divitem.show();
        divBroker.show();

        creheading.html($('#ReportInvoice').html().toUpperCase());
    }
    //Invoice End
    //Receipt Start
    else if (reportid.value == '6') {
        divdatfrmto.show();
        divcus.show();
        divsalesman.show();
        divsalesmanby.show();
        divcustomerbank.show();
        creheading.html($('#ReportReceipt').html().toUpperCase());

    }
    //Receipt End

    //Credit Note Start
    else if (reportid.value == '7') {
        divdatfrmto.show();
        divcus.show();
        divsalesman.show();
        divitem.show();
        divBroker.show();
        creheading.html($('#ReportCreditNote').html().toUpperCase());

    }
    //Credit Note End


    //Outstanding Start
    else if (reportid.value == '8') {
        divdatason.show();
        divcus.show();

        creheading.html($('#ReportOutstanding').html().toUpperCase());

    }
    //Outstanding End

    //Sale Register Item Wise Start
    else if (reportid.value == '9') {
        divdatfrmto.show();
        divcus.show();
        divitem.show();

        creheading.html($('#ReportSaleRegisterItemWise').html().toUpperCase());

    }
    //Daily Sales Report Start
    else if (reportid.value == '10') {
        ddlrpttyp.add(new Option('Report', '0'));
        ddlrpttyp.add(new Option('Item Wise', '1'));
        ddlrpttyp.add(new Option('Summary', '2'));

        divrpttyp.show();
        divdated.show();
        divsalesman.show();
        divBroker.show();
        creheading.html($('#ReportDailySalesReport').html().toUpperCase());

    }
    //Credit Sales Report Start
    else if (reportid.value == '11') {
        divdatfrmto.show();
        divcus.show();
        divsalesman.show();
        divBroker.show();
        creheading.html($('#ReportCreditSales').html().toUpperCase());
    }
    //Salesman Summary Report Start
    else if (reportid.value == '12') {
        divdatfrmto.show();
        divcus.show();
        divsalesman.show();
        divBroker.show();
        creheading.html($('#ReportSalesmanSummary').html().toUpperCase());
    }
    //Customer Item Sales Summary Report Start
    else if (reportid.value == '13') {
        divdatfrmto.show();
        divcus.show();
        divitem.show();
        divsalesman.show();
        divBroker.show();
        creheading.html($('#ReportCustomerItemSalesSummary').html().toUpperCase());
    }

    //Customer Sales Summary Report Start
    else if (reportid.value == '14') {
        divdatfrmto.show();
        divcus.show();
        divitem.show();
        divsalesman.show();
        divBroker.show();
        creheading.html($('#ReportCustomerSalesSummary').html().toUpperCase());
    }
    //Item Sales Summary Report Start
    else if (reportid.value == '15') {
        divdatfrmto.show();
        divitem.show();
        divsalesman.show();
        divBroker.show();
        creheading.html($('#ReportItemSalesSummary').html().toUpperCase());
    }

   
}



//View Start
$(document).on("click", '#btn_view', function () {
    var txtid = $("#txt_id").val();
    var txtcuscat = $("#txt_cuscat");
    var txtcussubcat = $("#txt_cussubcat");
    var txtcus = $("#txt_cus");
    var txtBroker = $("#txt_Broker");
    var txtsalesman = $("#txt_salesman");
    var txtsalesmanby = $("#txt_salesman_by");
    var txtcustomerbank = $("#txt_customerbank");
    var txtBrand = $("#txt_brand");
    var txtItem = $("#txt_itm");

    var dateason = txtdatason.find("input").val();
    var datfrm = txtdatfrm.find("input").val();
    var datto = txtdatto.find("input").val();
    var dated = txtdated.find("input").val();

    if (reportid.value == '') {
        console.log('Report not selected');
        alert('Report not selected');
        return;
    }
    var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");

    var cre = "";
    var cre_name = "";

    var viewreport_url = '';

    //Customer Start
    if (reportid.value == '1') {
        console.log('Report');

        divcus.show();
        divitem.show();

        ////Date Start
        //cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        //cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        ////Date End
        ////ID Start
        //if (txtid != '') {
        //    cre += " and v_rpt_so_pg.ID = " + txtid + "";
        //    cre_name += " ID # " + txtid + "";
        //}
        ////ID End


        ////Customer Category Start
        //if (txtcuscat.val() != '') {
        //    cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
        //    cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        //}
        ////Customer Category End

        ////Customer Sub-Category Start
        //if (txtcussubcat.val() != '') {
        //    cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
        //    cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        //}
        ////Customer Sub-Category End

        ////Customer  Start
        //if (txtcus.val() != '') {
        //    cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
        //    cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        //}
        ////Customer  End

        ////Brooker Start
        //if (txtBroker.val() != '') {
        //    cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
        //    cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        //}
        ////Brooker End
        ////Brand  Start
        //if (txtBrand.val() != '') {
        //    cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
        //    cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        //}
        ////Brand  End

        ////Item Start
        //if (txtItem.val() != '') {
        //    cre += " and Item_ID = " + txtItem.select2('data').id + " ";
        //    cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        //}
        ////Item End
        //sessionStorage.setItem(sessid, cre);
        //sessionStorage.setItem(sessid_name, cre_name);
        //viewreport_url = apiUrl_View + '/Sale_Report/SaleOrderReport?1&' + sessid + '&' + sessid_name;
    }
    //Customer End

    //Item Rate Start
    else if (reportid.value == '2') {
        var ddlvchstatus = $("#ddl_vch_status :selected");
        var txtchqno = $("#txt_chqno").val();
        //Date Start
        cre = "Transaction_Date between '" + datfrm + "' and '" + datto + "'";
        sessid_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End
        //Voucher Status Start
        if (ddlvchstatus.val() == 1) {
            cre += " and Approved ='Y'";
            sessid_name = ddlvchstatus.text();
        }
        else if (ddlvchstatus.val() == 2) {
            cre += " and Approved ='N' and Cancelled =0";
            sessid_name = ddlvchstatus.text();
        }
        else if (ddlvchstatus.val() == 3) {
            cre += " and Cancelled =1";
            sessid_name = ddlvchstatus.text();
        }
        else if (ddlvchstatus.val() == 4) {
            cre += " and Cancelled =0 and Cheque_status=0 and Type_ID in ('03','04')";
            sessid_name = ddlvchstatus.text();
        }
        else if (ddlvchstatus.val() == 5) {
            cre += " and Cancelled =0 and Cheque_status=1 and Type_ID in ('03','04')";
            sessid_name = ddlvchstatus.text();
        }
        //Voucher Status End

        //Voucher Type Start
        if ($("#txt_vch_type").val() != '') {
            cre += " and Type_ID ='" + $("#txt_vch_type").select2('data').id + "'";
            sessid_name = " Voucher Type : " + $("#txt_vch_type").select2('data').text;
        }
        //Voucher Type End

        //Chq Start
        if (txtchqno != '') {
            cre += " and Cheque_No =" + txtchqno + "";
            sessid_name = " Chq # " + txtchqno;
        }
        //Chq End
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/GL_Report/Voucher_Report?1&' + sessid + '&' + sessid_name + '&' + dateason;
    }
    //Item Rate End

    //Item Discount Start
    else if (reportid.value == '3') {
        //Account Start
        if ($("#txt_acc_cb").val() == '') {
            Swal.fire({
                icon: 'error',
                title: "Please select account",
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
            return
        }
        alert($("#txt_acc_cb").select2('data').id)

        //Date Start
        cre = "Transaction_Date between '" + datfrm + "' and '" + datto + "'";
        sessid_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End

        sessionStorage.setItem(sessid, cre);
        //viewreport_url = apiUrl_View + '/GL_Report/Voucher_Report?1&' + sessid + '&' + sessid_name + '&' + dateason;
    }
    //Item Discount End

    //Sale Order Start
    else if (reportid.value == '4') {
        //Date Start
        cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End
        //ID Start
        if (txtid != '') {
            cre += " and v_rpt_so_pg.ID = " + txtid + "";
            cre_name += " ID # " + txtid + "";
        }
        //ID End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Brooker End
        //Brand  Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        //Brand  End

        //Item Start
        if (txtItem.val() != '') {
            cre += " and Item_ID = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }
        //Item End
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/SaleOrderReport?1&' + sessid + '&' + sessid_name;
    }
    //Sale Order End

    //Delivery Challan Start
    else if (reportid.value == '16') {
        //Date Start
        cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End
        //ID Start
        if (txtid != '') {
            cre += " and v_rpt_so_pg.ID = " + txtid + "";
            cre_name += " ID # " + txtid + "";
        }
        //ID End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Brooker End
        //Brand  Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        //Brand  End

        //Item Start
        if (txtItem.val() != '') {
            cre += " and Item_ID = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }
        //Item End
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/DeliveryChallanReport?1&' + sessid + '&' + sessid_name;
    }
    //Delivery Challan End
    //Invoice Start
    else if (reportid.value == '5') {
        //Date Start
        cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End
        //ID Start
        if (txtid != '') {
            cre += " and v_rpt_so_pg.ID = " + txtid + "";
            cre_name += " ID # " + txtid + "";
        }
        //ID End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Brooker End
        //Brand  Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        //Brand  End

        //Item Start
        if (txtItem.val() != '') {
            cre += " and Item_ID = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }
        //Item End
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/InvoiceReport?1&' + sessid + '&' + sessid_name;
    }
    //Invoice End

    //Receipt Start
    else if (reportid.value == '6') {
        //Date Start
        cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End
        //ID Start
        if (txtid != '') {
            cre += " and v_rpt_cn_pg.ID = " + txtid + "";
            cre_name += " ID # " + txtid + "";
        }
        //ID End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End


        //Salesman by Start
        if (txtsalesmanby.val() != '') {
            cre += " and Salesman_ID_By = " + txtsalesmanby.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesmanby.select2('data').text + "'";
        }
        //Salesman by End


        //Salesman by Start
        if (txtcustomerbank.val() != '') {
            cre += " and Customer_Bank_ID = " + txtcustomerbank.select2('data').id + " ";
            cre_name += " Customer Bank  : '" + txtcustomerbank.select2('data').text + "'";
        }
        //Salesman by End


        //Item End
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/ReceivingReport?1&' + sessid + '&' + sessid_name;      }
    //Receipt End

    //Credit Note Start
    else if (reportid.value == '7') {
        //Date Start
        cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End
        //ID Start
        if (txtid != '') {
            cre += " and v_rpt_cn_pg.ID = " + txtid + "";
            cre_name += " ID # " + txtid + "";
        }
        //ID End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Brooker End

        //Brand  Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        //Brand  End

        //Item Start
        if (txtItem.val() != '') {
            cre += " and Item_ID = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }
        //Item End
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/CreditNoteReport?1&' + sessid + '&' + sessid_name;
    }
    //Credit Note End


    //Outstanding Start
    else if (reportid.value == '8') {


        var txtcus = $("#txt_cus")

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/CustomerOutstandingReport?1&' + sessid + '&' + sessid_name + '&' + dateason;
    }
    //Outstanding End

    //Sale Register Item Wise Start
    else if (reportid.value == '9') {

        //Date Start
        cre = "minv_dat between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date as on '" + datfrm + "' to '" + datto + "'";
        //Date End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

      
        //Brand  Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        //Brand  End

        //Item Start
        if (txtItem.val() != '') {
            cre += " and Item_ID = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }
        //Item End
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/SalesRegisterItemWiseReport?1&' + sessid + '&' + sessid_name;
    }
    //Sale Register Item Wise End

    //Daily Sales Report Start
    else if (reportid.value == '10') {

        //Date Start
        cre = "DATE ='" + dated + "'";
        cre_name = " Date as on '" + dateason + "'";
        //Date End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Brooker End

        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        var ddlrpttypselected = $("#ddl_rpttyp :selected");
        if (ddlrpttypselected.val() == 2) {
            viewreport_url = apiUrl_View + '/Sales_Report/DailySalesReportSummary?1&' + sessid + '&' + sessid_name + '&' + dated ;
        }
        else {
            viewreport_url = apiUrl_View + '/Sales_Report/DailySalesReport?1&' + sessid + '&' + sessid_name + '&' + dated + '&' + ddlrpttypselected.val();
        }
    }
    //Daily Sales Report End

    //Credit Sales Report Start
    else if (reportid.value == '11') {

        //Date Start
        cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Brooker End


        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/CreditSalesReport?1&' + sessid + '&' + sessid_name;
    }
    //Credit Sales Report End

    //Salesman Summary Report Start
    else if (reportid.value == '12') {

        //Date Start
        cre = "DATE between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Brooker End
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/SalesmanSummaryReport?1&' + sessid + '&' + sessid_name;
    }
    //Salesman Summary Report End

    //Customer Item Sales Summary Report Start
    else if (reportid.value == '13') {

        //Date Start
        cre = "minv_dat between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and t_minv.emppro_id = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and t_mso.emppro_id = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }

        //Brand Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        //Item Start
        if (txtItem.val() != '') {
            cre += " and Item_ID = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/CustomerItemSalesSummaryReport?1&' + sessid + '&' + sessid_name;
    }
    //Customer Item Sales Summary Report End

    //Customer Sales Summary Report Start
    else if (reportid.value == '14') {

        //Date Start
        cre = "minv_dat between '" + datfrm + "' and '" + datto + "'";
        cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End


        //Customer Category Start
        if (txtcuscat.val() != '') {
            cre += " and Customer_Category_ID = " + txtcuscat.select2('data').id + " ";
            cre_name += " Customer Category  : '" + txtcuscat.select2('data').text + "'";
        }
        //Customer Category End

        //Customer Sub-Category Start
        if (txtcussubcat.val() != '') {
            cre += " and Customer_SubCategory_ID = " + txtcussubcat.select2('data').id + " ";
            cre_name += " Customer Sub-Category  : '" + txtcussubcat.select2('data').text + "'";
        }
        //Customer Sub-Category End

        //Customer  Start
        if (txtcus.val() != '') {
            cre += " and Customer_ID = " + txtcus.select2('data').id + " ";
            cre_name += " Customer  : '" + txtcus.select2('data').text + "'";
        }
        //Customer  End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and t_minv.emppro_id = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and t_mso.emppro_id = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        //Item Start
        if (txtItem.val() != '') {
            cre += " and t_dinv_titm_id = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }

        //Brand Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/CustomerSalesSummaryReport?1&' + sessid + '&' + sessid_name;
    }
    //Customer Sales Summary Report End


    //Item Sales Summary Report Start
    else if (reportid.value == '15') {

        ////Date Start
        //cre = "Date between '" + datfrm + "' and '" + datto + "'";
        //cre_name = " Date from '" + datfrm + "' to '" + datto + "'";
        ////Date End

        //Salesman Start
        if (txtsalesman.val() != '') {
            cre += " and Salesman_ID = " + txtsalesman.select2('data').id + " ";
            cre_name += " Salesman  : '" + txtsalesman.select2('data').text + "'";
        }
        //Salesman End

        //Brooker Start
        if (txtBroker.val() != '') {
            cre += " and Broker_ID = " + txtBroker.select2('data').id + " ";
            cre_name += " Broker  : '" + txtBroker.select2('data').text + "'";
        }
        
        //Brand Start
        if (txtBrand.val() != '') {
            cre += " and Brand_ID = " + txtBrand.select2('data').id + " ";
            cre_name += " Brand  : '" + txtBrand.select2('data').text + "'";
        }
        //Item Start
        if (txtItem.val() != '') {
            cre += " and Item_ID = " + txtItem.select2('data').id + " ";
            cre_name += " Item  : '" + txtItem.select2('data').text + "'";
        }

     
        sessionStorage.setItem(sessid, cre);
        sessionStorage.setItem(sessid_name, cre_name);
        viewreport_url = apiUrl_View + '/Sales_Report/ItemSalesSummaryReport?1&' + sessid + '&' + sessid_name + '&' + datfrm + '&' + datto;
    }
    //Item Sales Summary Report End

    if (viewreport_url != '') {
        window.open(viewreport_url, '_blank');
    }

});
//View End

//Comment Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        //Category Customer Start
        FillCategoryCustomer();
        //Category Customer End

        //Sub-Category Customer Start
        FillCustomerSubCategory();
        //Sub-Category Customer End

        //Customer Start
        FillCustomer();
        //Customer End

        //Salesman Start
        FillSalesman();
        //Salesman End

        //Salesman By Start
        FillSalesmanBy();
        //Salesman By End

        //Broker Start
        FillBroker();
        //Broker End

        //Brand Start
        FillBrand();
        //Brand End

        //Item Start
        FillItem();
        //Item End

        //Customer Bank Start
        FillCustomerBank();
        //Customer Bank End

    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Comment End
//Fill Brand Start
function FillBrand() {
    $("#txt_brand").select2({
        placeholder: "Search for a Brand",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillItemBrand',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    ///Token: strkey ,
                    _key: strkey,
                    _CBJ: 'B',
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Brand
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },


            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Brand End


//Detail Item Start
function FillItem() {
    $("#txt_itm").select2({
        placeholder: "Search for Item",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillItemBrandWise',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    _bd_id: $("#txt_brand").select2('data').id,
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks,
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {
                        myResults.push({
                            id: item.ID,
                            text: item.Item,
                            Scale: item.Scale

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Detail Item End
//Customer Start
function FillCustomer() {
    $("#txt_cus").select2({
        placeholder: "Search for Customer",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillCustomer',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Customer

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Customer End

//Customer Category Start
function FillCategoryCustomer() {
    $("#txt_cuscat").select2({
        placeholder: "Search for Category Customer",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillCustomerCategory',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Name

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Customer Category End

//Customer Sub-Category Start
function FillCustomerSubCategory() {
    $("#txt_cussubcat").select2({
        placeholder: "Search for Sub-Category Customer",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillCustomerSubCategory',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Name

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Customer Sub-Category End

//Salesman Start
function FillSalesman() {
    $("#txt_salesman").select2({
        placeholder: "Search for Salesman",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillSalesMan',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.SalesMan_Name

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Salesman End

//Salesman By Start
function FillSalesmanBy() {
    $("#txt_salesman_by").select2({
        placeholder: "Search for Salesman By",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillSalesMan',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.SalesMan_Name

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Salesman By End

//Broker Start
function FillBroker() {
    $("#txt_Broker").select2({
        placeholder: "Search for Broker",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillBroker',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.name

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Broker End

//Customer Bank Start
function FillCustomerBank() {
    $("#txt_customerbank").select2({
        placeholder: "Search for Customer Bank",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillCustomerBank',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Customer_Bank

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Customer Bank End
