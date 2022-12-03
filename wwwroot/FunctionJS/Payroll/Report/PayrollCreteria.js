var currentURL = window.location.search;
const urlParams = new URLSearchParams(currentURL);
var _MenuID = urlParams.get('M');
var ApiForm = '';


var div_dateason = $("#div_dateason");
var div_common = $("#div_common");
var div_datefromto = $("#div_datefromto");

var txtdatfrom = $("#txt_dat_frm");
var txtdateto = $("#txtdate_to");
var txtdatason = $("#txt_dat_ason");

var div_absent = $("#div_absent");
var div_employeeProfile = $("#div_employeeProfile");
var div_employeeJoin = $("#div_employeeJoin");
var div_advance = $("#div_advance");
var div_loan = $("#div_loan");
var div_loanRecieved = $("#loanRecieve");
var txt_cksummary = $("#ck_summary");
var txt_ckeobiList = $("#ck_eobi");
var div_ReportType = $("#ReportType");
var div_salaryincrement = $("#div_salary_inrement");

var txt_branch = $("#txtbranch");
var txt_designaion = $("#txtdesignation");
var txt_department = $("#txtdepartment");
var txt_employee = $("#txtemployee");
var creheading = $("#creheading");
var imgload = $("#img_load");
var reportid = $("#reportid");

$(function () {
    txtdatason.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdateto.datetimepicker({ format: 'DD/MMM/YYYY' });

});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1/';

    reportpermission();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdatason.find("input").val(CurrentDate);
    txtdatfrom.find("input").val(CurrentDate);
    txtdateto.find("input").val(CurrentDate);
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
        url: apiUrl + '/api/Auth/v1/GetMenu/GetReportMenu?_MenuId=' + _MenuID,
        type: "Get",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        },
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            // ;
            if (response.statusCode == 200) {
                //;
                // for (var men_cnt = 0; men_cnt < response.data.length; men_cnt++) {
                //     //Chart of Accounts
                //     if (response.data[men_cnt]["menuName"] == 'reportchartofaccount') {

                //     }
                //     //Voucher
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportvoucher') {

                //     }
                //     //Cash Bank Book
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportcashbankbook') {

                //     }
                //     //Bank Reconcialition
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportbankreconciliation') {

                //     }

                //     //General Ledger
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportgeneralledger') {
                //         _ReportGeneralLedger.show();
                //     }

                //     //Trial Balance
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reporttrialbalance') {
                //         _ReportTrialBalance.show();
                //     }

                //     //Trial Balance Six Column
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reporttrialbalancesixcolumns') {
                //         _ReportTrialBalanceSixColumn.show();
                //     }

                //     //Profit & Loss
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportprofitloss') {
                //         _ReportProfitLoss.show();
                //     }

                //     //Balance Sheet
                //     else if (response[0]["Result"][men_cnt]["Menu_Name"] == 'reportbalancesheet') {
                //         _ReportBalanceSheet.show();
                //     }

                // }

            }
            else {
                console.log(response.statusCode + ' ' + response.message);
            }
        },
        error: function (error) {
            alert('Error ' + error)
        }
    })

}

function discon(_reportid) {
    div_datefromto.hide();
    div_dateason.hide();
    div_absent.hide();
    div_employeeProfile.hide();
    div_employeeJoin.hide();
    txt_cksummary.hide();
    txt_ckeobiList.hide();
    div_ReportType.hide();
    div_salaryincrement.hide();
    div_loan.hide();
    div_loanRecieved.hide();
    div_advance.hide();
    txt_branch.val('');
    txt_designaion.val('');
    txt_department.val('');
    txt_employee.val('');
    var ddlreportType = document.getElementById("ddl_reportType");



    imgload.hide();
    creheading.html('');
    reportid.value = '';


    reportid.value = _reportid;

    //single day of attandance Start
    if (reportid.value == '1') {
        div_datefromto.show();
        creheading.html($('#singleDayofAttandance').html().toUpperCase());

    }
    //single day of attandance End

    //Month of Attandance Start
    else if (reportid.value == '2') {
        div_datefromto.show();
        creheading.html($('#MonthofAttandance').html().toUpperCase());

    }
    //Month of Attandance End

    //Time Sheet Start
    else if (reportid.value == '3') {
        div_datefromto.show();
        div_ReportType.show();
        creheading.html($('#TimeSheet').html().toUpperCase());

        var option1 = document.createElement('OPTION');
        option1.innerHTML = "Summary";
        option1.value = "S";
        ddlreportType.add(option1);

        var option2 = document.createElement('OPTION');
        option2.innerHTML = "Detail";
        option2.value = "D";
        ddlreportType.add(option2);
    }
    //Time Sheet End

    //Inn-Out-Editor Start
    else if (reportid.value == '4') {
        div_datefromto.show();
        creheading.html($('#Inn_out_editor').html().toUpperCase());


    }
    // Inn-Out-Editor  End

    //Absent Start
    else if (reportid.value == '5') {
        div_datefromto.show();
        div_absent.show();
        creheading.html($('#absent').html().toUpperCase());

    }
    //Absent End

    //Daily Attandance Start
    else if (reportid.value == '6') {
        div_datefromto.show();
        creheading.html($('#dailyattandance').html().toUpperCase());

    }
    //Daily Attandance End

    //Over Time Start
    else if (reportid.value == '7') {
        div_datefromto.show();
        creheading.html($('#overTime').html().toUpperCase());

    }
    //Over Time End

    //Employee Profile Start
    else if (reportid.value == '8') {
        //        div_datefromto.show();
        div_employeeProfile.show();
        creheading.html($('#EmployeProfile').html().toUpperCase());

    }
    //Employee Profile End

    //Employee Date of Join Start
    else if (reportid.value == '9') {
        div_employeeJoin.show();
        div_datefromto.show();
        creheading.html($('#DateofJoin').html().toUpperCase());

    }
    //Employee Date of Join End

    //Advance Start
    else if (reportid.value == '10') {
        div_advance.show();
        div_datefromto.show();
        creheading.html($('#Advance').html().toUpperCase());


    }
    //Advance End

    //Loan Start
    else if (reportid.value == '11') {
        div_loan.show();
        div_datefromto.hide();
        div_dateason.show();
        creheading.html($('#Loan').html().toUpperCase());

    }
    //Loan End

    //Loan Recieve Start
    else if (reportid.value == '12') {
        div_loan.show();
        div_datefromto.show();
        div_loanRecieved.show();
        txt_cksummary.show();
        creheading.html($('#LoanRecive').html().toUpperCase());

    }
    //Loan Recieve End

    //Salary sheet Start
    else if (reportid.value == '13') {
        div_ReportType.show();
        txt_cksummary.show();
        div_datefromto.show();
        $("#ddl_reportType").html("")
        creheading.html($('#Salary').html().toUpperCase());

        var option1 = document.createElement('OPTION');
        option1.innerHTML = "Summary";
        option1.value = "S";
        ddlreportType.add(option1);

        var option2 = document.createElement('OPTION');
        option2.innerHTML = "Pay Slip";
        option2.value = "P";
        ddlreportType.add(option2);

    }
    //Salary sheetEnd

    //Salary increment Start
    else if (reportid.value == '14') {

        div_ReportType.show();
        div_datefromto.show();
        div_salaryincrement.show();
        creheading.html($('#SalaryIncrement').html().toUpperCase());

        $("#ddl_reportType").html("")
        var option1 = document.createElement('OPTION');
        option1.innerHTML = "Current Salary";
        option1.value = "C";
        ddlreportType.add(option1);

        var option2 = document.createElement('OPTION');
        option2.innerHTML = "Salary Increament";
        option2.value = "S";
        ddlreportType.add(option2);



    }
    //Salary increment End

    //EOBI List Start
    else if (reportid.value == '15') {

        txt_ckeobiList.show();
        div_dateason.show();
        div_datefromto.hide();
        creheading.html($('#Eobi').html().toUpperCase());
    }
    //EOBI List End

    //SESSI Start
    else if (reportid.value == '16') {
        div_dateason.show();
        creheading.html($('#Sessi').html().toUpperCase());
    }
    //SESSI End

    //Leave Start
    else if (reportid.value == '17') {
        div_dateason.show();
        div_datefromto.hide();
        creheading.html($('#Leave').html().toUpperCase());
    }
    //Leave End
}

//View Start
$(document).on("click", '#btn_view', function () {

    var _dateFrom = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
    var _dateTo = moment(txtdateto.find("input").val()).format("YYYY-MM-DD");
    var _dateason = moment(txtdatason.find("input").val()).format("YYYY-MM-DD");

    if (reportid.value == '') {
        Swal.fire({
            title: "Report not selected",

            icon: 'error',
            showConfirmButton: true,

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        });

        return;
    }
    var cre = "";

    var _branchId = "", _employeeId = "", _officeWorker = "", _TemporaryPermanent = "", _designationId = "", _departmentId = "", _gender = "", _active = "2";
    if ($("#txtbranch").select2('data') != null) { _branchId = $("#txtbranch").select2('data').id; }
    if ($("#txtemployee").select2('data') != null) { _employeeId = $("#txtemployee").select2('data').id; }
    if ($("#ddl_office_worker").val() != "1") { _officeWorker = $("#ddl_office_worker").val(); }
    if ($("#ddl_TemporaryPermanent").val() != "1") { _TemporaryPermanent = $("#ddl_TemporaryPermanent").val(); }
    if ($("#txtdesignation").select2('data') != null) { _designationId = $("#txtdesignation").select2('data').id; }
    if ($("#txtdepartment").select2('data') != null) { _departmentId = $("#txtdepartment").select2('data').id; }
    if ($("#ddl_gender").val() != "1") { _gender = $("#ddl_gender").val(); }
    if ($("#ddl_Active").val() != "2") { _active = $("#ddl_Active").val(); }


    var viewreport_url = '';
    //Click Single Day of Attandance Start
    if (reportid.value == '1') {

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/SingleDayAttandance?S=' + sessid;
    }


    //Click Time Sheet Start
    else if (reportid.value == '3') {
        var ddlreportType = $("#ddl_reportType");
        var reporttype = (ddlreportType.val());

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        if (reporttype == 'S') {
            viewreport_url = apiUrl_View + '/Payroll/Report/TimeSheet?S=' + sessid;
        }
        else if (reporttype == 'D') {
            viewreport_url = apiUrl_View + '/Payroll/Report/TimeSheetDetail?S=' + sessid;

        }

    }
    //Click Time Sheet End

    // //Click in Out Editor Start
    else if (reportid.value == '4') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/InoutEditor?S=' + sessid;

    }
    // //Click in Out Editor End

    //Click Absent Start
    else if (reportid.value == '5') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/Absent?S=' + sessid;
    }
    //Click Absent End

    //Click Daily Attandace Start
    else if (reportid.value == '6') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/DailyAttendance?S=' + sessid;
    }
    //Click Daily Attandace End

    //Click Over Time Start
    else if (reportid.value == '7') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/OverTime?S=' + sessid;
    }
    //Click Over Time End


    //Click Employee Profile Start
    else if (reportid.value == '8') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateason + '","dateTo":"' + _dateason + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '","active":"' + _active + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/EmployeeProfile?S=' + sessid;
    }
    //Click Employee Profile End

    // //Click Balance Sheet Start
    // else if (reportid.value == '9') {


    //     //Date Start
    //     cre = "Voucher_Date between '" + datfrm + "' and '" + datto + "'";
    //     sessid_name = " Date from '" + datfrm + "' to '" + datto + "'";
    //     //Date End

    //     sessionStorage.setItem(sessid, cre);
    //     //viewreport_url = apiUrl_View + '/GL_Report/Voucher_Report?1&' + sessid + '&' + sessid_name + '&' + dateason;
    // }
    // //Click Balance Sheet End

    //Click Advance Start
    else if (reportid.value == '10') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/Advance?S=' + sessid;

        // cre = "";
        // sessionStorage.setItem(sessid, cre);
        // viewreport_url = apiUrl_View + '/Payroll/Report/Advance_Sum?1&' + sessid + '&' + _emppro_id + '&' + datfrm + '&' + datto;
    }
    //Click Advance End

    //Click Loan Start
    else if (reportid.value == '11') {
        var _ddlloanstatus = $("#ddl_loan_status").val();


        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        var _active = $("#ddl_Active").val();
        cre = '{"dateAsOn": "' + _dateason + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '","active":"' + _active + '","loanStatus":"' + _ddlloanstatus + '"}';

        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/Loan?S=' + sessid;
    }
    //Click Loan End

    //Click Loan Receive Start
    else if (reportid.value == '12') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/LoanRecieve?S=' + sessid;
    }
    //Click Loan Receive End

    //Click Salary Start
    else if (reportid.value == '13') {
        var ddlreportType = $("#ddl_reportType");
        var reporttype = (ddlreportType.val());

        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");

        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        if (reporttype == 'S') {
            viewreport_url = apiUrl_View + '/Payroll/Report/SalaryRegisterWorker?S=' + sessid;
        }
        else if (reporttype == 'P') {
            viewreport_url = apiUrl_View + '/Payroll/Report/SalaryPaySlip?S=' + sessid;

        }

    }
    //Click Salary End 



    //Click SalaryIncrement Start    
    else if (reportid.value == '14') {
        // var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        // cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        // sessionStorage.setItem(sessid, cre);
        // viewreport_url = apiUrl_View + '/Payroll/Report/SalaryIncrement?S=' + sessid;
        var ddlreportType = $("#ddl_reportType");
        var reporttype = (ddlreportType.val());
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateFrom + '","dateTo":"' + _dateTo + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        if (reporttype == 'S') {
            viewreport_url = apiUrl_View + '/Payroll/Report/SalaryIncrement?S=' + sessid;
        }
        else if (reporttype == 'C') {
            viewreport_url = apiUrl_View + '/Payroll/Report/CurrentSalaries?S=' + sessid;

        }
    }
    //Click SalaryIncrement End 

    //Click Leave Start
    else if (reportid.value == '17') {
        var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
        cre = '{"dateFrom": "' + _dateason + '","dateTo":"' + _dateason + '","employeeId":"' + _employeeId + '","branchId":"' + _branchId + '","officeWorker":"' + _officeWorker + '","TemporaryPermanent":"' + _TemporaryPermanent + '","designationId":"' + _designationId + '","departmentId":"' + _departmentId + '","gender":"' + _gender + '"}';
        sessionStorage.setItem(sessid, cre);
        viewreport_url = apiUrl_View + '/Payroll/Report/Leave?S=' + sessid;
    }
    //Click Leave End

    window.open(viewreport_url, '_blank');

});
//View End

//Comment Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {
        //Branch Start
        fillBaranch();
        //Branch Type Start

        //Department Start
        fillDepartment();
        //Department End

        //Salesman Start
        fillSalesman();
        //Salesman End

        //Designation Start
        fillDesignation();
        //Designation Start

    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Comment End

//Branch Start
function fillBaranch() {
    $("#txtbranch").select2({
        placeholder: "Search Branch",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Auth/v1/LOVServices/GetBranch',
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
//Branch End

//Department Start
function fillDepartment() {
    $("#txtdepartment").select2({
        placeholder: "Search Department",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetDepartment',
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
//Department End


//Salesman Start
function fillSalesman() {
    $("#txtemployee").select2({
        placeholder: "Search Employee",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetEmployee',
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
//Salesman End

//Designation Start
function fillDesignation() {
    $("#txtdesignation").select2({
        placeholder: "Search Designation",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetDesignation',
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
//Designation End
function getMonth(chosen) {
    var _Month = chosen;
    if (_Month > 0) {
        var FirstDay = moment(new Date().getFullYear() + '-' + _Month + '-01');
        var LastDay = moment(FirstDay).endOf('month');
        txtdatfrom.find("input").val(moment(FirstDay).format("DD/MMM/YYYY"));
        txtdateto.find("input").val(moment(LastDay).format("DD/MMM/YYYY"));
    }

}

function ProcessAttendance() {

    var _dateFrom = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
    var _dateTo = moment(txtdateto.find("input").val()).format("YYYY-MM-DD");
    _cre = JSON.stringify({
        "DateFrom": _dateFrom,
        "DateTo": _dateTo,
    })
    $.ajax({
        // url: apiUrl + '/Payroll/Report/TimeSheetWorker/' + strkey + '/' + _date+'/'+_emppro_id+'/'+_emppro_com_id,
        url: ApiForm + 'PayrollDashboard/ProcessAttendance',
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
                imgload.hide();
                Swal.fire({
                    title: "Attendance Process Completed",

                    icon: 'warning',
                    showConfirmButton: true,

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                });

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