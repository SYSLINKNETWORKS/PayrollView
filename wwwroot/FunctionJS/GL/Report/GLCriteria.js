var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var creheading = $("#creheading");
var imgload = $("#img_load");
var reportid = $("#reportid");

var divdatfrmto = $("#div_datfrmto");
var divdatason = $("#div_datason");
var divvch = $("#div_vch");
var divcb = $("#div_cb");
var divbankrecon = $("#div_bankrecon");
var divacc = $("#div_acc");
var divtb = $("#div_tb");

var txtdatason = $("#txt_datason");
var txtdatfrm = $("#txt_dat_frm");
var txtdatto = $("#txt_dat_to");

var ApiForm = '';

var _Voucher_Id = '0';
var _Voucher_Name = '';


$(function () {
    txtdatason.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatfrm.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatto.datetimepicker({ format: 'DD/MMM/YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Auth/v1';
    reportpermission();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdatason.find("input").val(CurrentDate);
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);
    discon(0);
    ComponentsDropdowns.init();
});

function reportpermission() {
    var _ReportChartofAccounts = $("#ReportChartofAccounts");
    var _ReportVoucher = $("#ReportVoucher");
    var _ReportCashBank = $("#ReportCashBank");
    var _ReportBankReconciliation = $("#ReportBankReconciliation");

    var _ReportGeneralLedger = $("#ReportGeneralLedger");
    var _ReportTrialBalance = $("#ReportTrialBalance");
    var _ReportTrialBalanceSixColumn = $("#ReportTrialBalanceSixColumn");
    var _ReportProfitLoss = $("#ReportProfitLoss");
    var _ReportBalanceSheet = $("#ReportBalanceSheet");


    _ReportChartofAccounts.hide();
    _ReportVoucher.hide();
    _ReportCashBank.hide();
    _ReportBankReconciliation.hide();
    _ReportGeneralLedger.hide();
    _ReportTrialBalance.hide();
    _ReportTrialBalanceSixColumn.hide();
    _ReportProfitLoss.hide();
    _ReportBalanceSheet.hide();

    $.ajax({
        url: ApiForm + '/GetMenu/GetReportMenu',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                for (var men_cnt = 0; men_cnt < response["data"].length; men_cnt++) {
                    //Chart of Accounts
                    if (response["data"][men_cnt]["menuName"] == 'reportchartofaccount') {
                        _ReportChartofAccounts.show();
                    }
                    //Voucher
                    else if (response["data"][men_cnt]["menuName"] == 'reportvoucher') {
                        _ReportVoucher.show();
                    }
                    //Cash Bank Book
                    else if (response["data"][men_cnt]["menuName"] == 'reportcashbankbook') {
                        _ReportCashBank.show();
                    }
                    //Bank Reconcialition
                    else if (response["data"][men_cnt]["menuName"] == 'reportbankreconciliation') {
                        _ReportBankReconciliation.show();
                    }

                    //General Ledger
                    else if (response["data"][men_cnt]["menuName"] == 'reportgeneralledger') {
                        _ReportGeneralLedger.show();
                    }

                    //Trial Balance
                    else if (response["data"][men_cnt]["menuName"] == 'reporttrialbalance') {
                        _ReportTrialBalance.show();
                    }

                    //Trial Balance Six Column
                    else if (response["data"][men_cnt]["menuName"] == 'reporttrialbalancesixcolumns') {
                        _ReportTrialBalanceSixColumn.show();
                    }

                    //Profit & Loss
                    else if (response["data"][men_cnt]["menuName"] == 'reportprofitloss') {
                        _ReportProfitLoss.show();
                    }

                    //Balance Sheet
                    else if (response["data"][men_cnt]["menuName"] == 'reportbalancesheet') {
                        _ReportBalanceSheet.show();
                    }

                }

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

function discon(_reportid) {
    imgload.hide();
    creheading.html('');
    reportid.value = '';
    divdatfrmto.hide();
    divdatason.hide();
    divvch.hide();
    divcb.hide();
    divbankrecon.hide();
    divacc.hide();
    divtb.hide();
    reportid.value = _reportid;



    //Chart of Accounts Start
    if (reportid.value == '1') {
        creheading.html($('#ReportChartofAccounts').html().toUpperCase());
    }
    //Chart of Accounts End
    //Voucher Start
    else if (reportid.value == '2') {
        divdatfrmto.show();
        divvch.show();
        creheading.html($('#ReportVoucher').html().toUpperCase());
    }
    //Voucher End
    //Cash Bank Book Start
    else if (reportid.value == '3') {
        divdatfrmto.show();
        divcb.show();
        divacc.show();
        creheading.html($('#ReportCashBank').html().toUpperCase());
    }
    //Cash Bank Book End

    //Bank Reconciliation Start
    else if (reportid.value == '4') {
        divdatason.show();
        divbankrecon.show();
        creheading.html($('#ReportBankReconciliation').html().toUpperCase());
    }
    // Bank Reconciliation End

    //General Ledger Start
    else if (reportid.value == '5') {
        divdatfrmto.show();
        divacc.show();

        creheading.html($('#ReportGeneralLedger').html().toUpperCase());
    }
    //General Ledger End

    //Trial Balanace Start
    else if (reportid.value == '6') {
        divdatason.show();
        divtb.show();
        creheading.html($('#ReportTrialBalance').html().toUpperCase());
    }
    //Trial Balanace End

    //Trial Balanace Six Column Start
    else if (reportid.value == '7') {
        divdatfrmto.show();
        creheading.html($('#ReportTrialBalanceSixColumn').html().toUpperCase());
    }
    //Trial Balanace  Six Column End

    //Profit & Loss Start
    else if (reportid.value == '8') {
        divdatason.show();
        creheading.html($('#ReportProfitLoss').html().toUpperCase());
    }
    //Profit & Loss End

    //Balance Sheet Start
    else if (reportid.value == '9') {
        divdatason.show();
        creheading.html($('#ReportBalanceSheet').html().toUpperCase());
    }
    //Balance Sheet End
}


//View Start
$(document).on("click", '#btn_view', function () {

    var dateason = txtdatason.find("input").val();
    var datfrm = txtdatfrm.find("input").val();
    var datto = txtdatto.find("input").val();

    if (reportid.value == '') {
        alert('Report not selected');
        return;
    }
    var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_date = "D" + moment(new Date()).format("DDMMYYYYHHmmss");
    var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");

    var cre = "";
    var cre_name = "";

    sessionStorage.setItem(sessid_name, cre_name);

    var viewreport_url = '';
    //Click Chart of Accounts Start
    if (reportid.value == '1') {
        cre = "";
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/GL/Report/ChartofAccount?1&' + sessid;
    }
    //Click Chart of Accounts End

    //Click Voucher Start
    else if (reportid.value == '2') {
        var ddlvchstatus = $("#ddl_vch_status :selected");
        var _cre = JSON.stringify({
            "VoucherNo": "",
            "dateFrom": datfrm,
            "dateTo": datto,
            "status": ddlvchstatus.val(),
            "voucherTypeId": $("#txt_vch_type").val(),
            "chqNo": $("#txt_chqno").val()

        });

        sessionStorage.setItem(sessid, _cre);
        viewreport_url = apiUrl_View + '/GL/Report/Voucher?S=' + sessid;
    }
    //Click Voucher End

    //Click Cash Bank Book Start
    else if (reportid.value == '3') {
        //alert($("#ddl_vch_cb").options[e.selectedIndex].value);
        //Account Start
        if ($("#txt_acc_cb").val() == "") {
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
        // alert($("#txt_acc").val())
        if ($("#txt_acc").val() == "") {
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
        var e = document.getElementById("ddl_vch_cb");
        var cb_text = e.options[e.selectedIndex].text;

        var _criteriaCB = JSON.stringify({

            "dateFrom": datfrm,
            "dateTo": datto,
            "accountNo": $("#txt_acc").select2('data').id,
            "CashBank": cb_text,
        });


        sessionStorage.setItem(sessid, _criteriaCB);
        viewreport_url = apiUrl_View + '/GL/Report/CashBankBook?S=' + sessid;
    }
    //Click Cash Bank Book End

    //Click Bank Reconciliation Start
    else if (reportid.value == '4') {
        //Bank Amount
        if ($("#txt_bk_amt").val() == '') {
            Swal.fire({
                icon: 'error',
                title: "Please write bank amount",
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
            return
        }

        //Account Start
        if ($("#txt_acc_bk").val() == '') {
            Swal.fire({
                icon: 'error',
                title: "Please select bank account",
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
            return
        }

        sessionStorage.setItem('D' + sessid, dateason);
        sessionStorage.setItem('A' + sessid, $("#txt_acc_bk").select2('data').id);
        sessionStorage.setItem('M' + sessid, $("#txt_bk_amt").val());
        //        viewreport_url = apiUrl_View + '/GL/Report/BankReconciliation?1&' + sessid + '&' + dateason + '&' + $("#txt_acc_bk").select2('data').id + '&' + $("#txt_bk_amt").val();
        viewreport_url = apiUrl_View + '/GL/Report/BankReconciliation?S=' + sessid;

    }
    //Click Bank Reconciliation End

    //Click General Ledger Start
    else if (reportid.value == '5') {
        //Account Start
        if ($("#txt_acc").val() == '') {
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

        var _criteriaGL = JSON.stringify({

            "dateFrom": datfrm,
            "dateTo": datto,
            "accountNo": $("#txt_acc").select2('data').id,
        });

        sessionStorage.setItem(sessid, _criteriaGL);
        viewreport_url = apiUrl_View + '/GL/Report/GeneralLedger?S=' + sessid;
    }
    //Click General Ledger End

    //Click Trial Balance Start
    else if (reportid.value == '6') {
        var e = document.getElementById("ddl_tb");
        var tb_val = e.options[e.selectedIndex].value;
        var _criteriaT = JSON.stringify({

            "dateAsOn": dateason,
            "status": tb_val,
        });

        sessionStorage.setItem(sessid, _criteriaT);
        viewreport_url = apiUrl_View + '/GL/Report/TrialBalance?S=' + sessid;
    }
    //Click Trial Balance End

    //Click Trial Balance Six Column Start
    else if (reportid.value == '7') {
        var _criteriaTB6 = JSON.stringify({
            "dateFrom": datfrm,
            "dateTo": datto,
        });
        sessid_name = "";

        sessionStorage.setItem(sessid, _criteriaTB6);
        viewreport_url = apiUrl_View + '/GL/Report/TrialBalanceSixColumn?S=' + sessid;
    }
    //Click Trial Balance Six Column End


    //Click Profit & Loss Start
    else if (reportid.value == '8') {


        //Date Start
        cre = "Voucher_Date between '" + datfrm + "' and '" + datto + "'";
        sessid_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End

        sessionStorage.setItem(sessid, cre);
        //viewreport_url = apiUrl_View + '/GL/Report/Voucher_Report?1&' + sessid + '&' + sessid_name + '&' + dateason;
    }
    //Click Profit & Loss End

    //Click Balance Sheet Start
    else if (reportid.value == '9') {


        //Date Start
        cre = "Voucher_Date between '" + datfrm + "' and '" + datto + "'";
        sessid_name = " Date from '" + datfrm + "' to '" + datto + "'";
        //Date End

        sessionStorage.setItem(sessid, cre);
        //viewreport_url = apiUrl_View + '/GL/Report/Voucher_Report?1&' + sessid + '&' + sessid_name + '&' + dateason;
    }
    //Click Balance Sheet End


    window.open(viewreport_url, '_blank');

});
//View End

//Comment Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {
        //Voucher Type Start
        fillVoucherType();
        //Voucher Type Start

        // //Cash Bank Account Start
        // fillCashBankAccount('C');
        // //Cash Bank Account End

        //Only Bank Account Start
        fillBankAccount();
        //Only Bank Account End

        //Account Start
        fillAccount();
        //Account End
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Comment End

//Voucher Type Start

function fillVoucherType() {
    $("#txt_vch_type").select2({
        placeholder: "Search Voucher Type",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetVoucherType',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {

                        myResults.push({
                            id: item.id,
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

        initSelection: function (element, callback) {
            var data = { "id": _Voucher_Id, "text": _Voucher_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

//Voucher Status End

//Cash Bank Account Start
function fillCashBankAccount(CBJ) {
    $("#txt_acc").select2({
        placeholder: "Search Account",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetChartOfAccountCBJ',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CBJ", CBJ);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {

                        myResults.push({
                            id: item.id,
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
//Cash Bank Account End

////Only Bank Account Start
function fillBankAccount() {
    $("#txt_acc_bk").select2({
        placeholder: "Search Account",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetChartOfAccountCBJ',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CBJ", 'B');
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {

                        myResults.push({
                            id: item.id,
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
//Only Bank Account End


////Only Bank Account Start
function fillAccount() {
    $("#txt_acc").select2({
        placeholder: "Search Account",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetChartOfAccount',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {

                        myResults.push({
                            id: item.id,
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
//Only Bank Account End
