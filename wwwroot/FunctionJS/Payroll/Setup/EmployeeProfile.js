var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
var ApiForm = '';

var txtcardno = '';
var txtcardno = '';
var txtemployeeName = '';
var txtfatherName = '';
var txtpresentAddress = '';
var txtpermanentAddress = '';
var txtemergencyContactOne = '';
var txtemergencyContactTwo = '';
var txtcnic = '';
var cnicexp = '';
var txtcell = '';
var txtntn = '';
var txteml = '';
var txtrmk = '';
var txtdop1 = '';
var txtdoj1 = '';
var txtdob1 = '';
var txtrefNameOne = '';
var txtrefNameTwo = '';
var txtrefCnicOne = '';
var txtrefCnicTwo = '';
var txtrefAddressOne = '';
var txtrefAddressTwo = '';
var txtrefcontactOne = '';
var txtrefcontactTwo = '';
var txtdoj = '';
var txtdob = '';
var txtgender = '';
var txtmodeOfPayment = '';
var txtmaritalStatus = '';
var txtsalary = '';
var txttakaful = '';
var txtrate = '';
var ckgratuity;
var ckact;
var cktemporarypermanent;
var ckattendanceAllowance;
var ckholidayOvertime;
var ckovertime;
var ckauthorized;
var ckincomeTax;
var ckattendanceExemption;
var ckfactoryOvertime;
var dtsessi = '';
var txtsessi = '';
var ckstopPayment;
var cklateDeduction;
var dteobi = '';
var txteobi = '';
var dtreg = '';
var txtresignRemark = '';
var txtinstitute = '';
var txtqualification = '';
var qualificationYear = '';
var txtqualificationRemark = '';
var txtExperianceCompany = '';
var txtExperianceDesignation = '';
var expdtfrom = '';
var expdtto = '';
var txtexperianceRemark = '';
var officeWorker = '';

var _EmployeeCategory_ID = 0;
var _EmployeeCategory_Name = '';
var _Designation_ID = 0;
var _Designation_Name = '';
var _Department_ID = 0;
var _Department_Name = '';
var _Roster_ID = 0;
var _Roster_Name = '';
var _Branch_ID = 0;
var _Branch_Name = '';
var _AnnualLeave_ID = 0;
var _AnnualLeave_Name = '';
var _ReportOfficer_ID = 0;
var _ReportOfficer_Name = '';

var txtdop = $("#txt_dop");
var txtdoj = $("#txt_doj");
var txtdateOfBirth = $("#txt_dateOfBirth");;
var txtcnicexpdt = $("#txt_cnicexp");
var txtdtsessi = $("#txt_dat_sesi");
var txtdteobi = $("#txt_dat_eobi");
var txtdtreg = $("#txt_dat_reg");
var txtqualificationYear = $("#txt_qualificationYear");
var txtexpdtfrom = $("#txt_experiance_from");
var txtexpdtto = $("#txt_experiance_to");

$(function () {
    txtdop.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdoj.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdateOfBirth.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtcnicexpdt.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdtsessi.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdteobi.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdtreg.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtqualificationYear.datetimepicker({ format: 'YYYY' });
    txtexpdtfrom.datetimepicker({ format: 'YYYY' });
    txtexpdtto.datetimepicker({ format: 'YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1';
    imgload.hide();
    $(".nav-tabs a").click(function () {
        $(this).tab('show');
    });
    $('.nav-tabs a').on('shown.tab', function (event) {
    });
    discon();

    ComponentsDropdowns.init();
});
//#region select 2
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        FillEmployeeCategory(); //Fill Select 2 of Employee Category
        FillEmployeeDesignation();  //Fill Select 2 of Designation
        FillDepartment();   //Fill Select 2 of Department
        FillRoster();   //Fill Select 2 of Roster
        FillBranch();   //Fill Select 2 of Branch
        FillAnnualLeave();   //Fill Select 2 of Annual Leave
        FillReportingOfficer();   //Fill Select 2 of reporting Officer
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Employee Category start
function FillEmployeeCategory() {
    $("#txt_employeeCategory").select2({
        placeholder: "Search Category",
        triggerChange: true,
        ajax: {
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetEmployeeCategory',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
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
            var data = { "id": _EmployeeCategory_ID, "text": _EmployeeCategory_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_employeeCategory').on("select2-selected", function (e) {
    _EmployeeCategory_ID = $("#txt_employeeCategory").select2('data').id;
});

$('#txt_employeeCategory').on("select2-removed", function (e) {
    _EmployeeCategory_ID = "0";

});
//Employee Category end

//Designation start
function FillEmployeeDesignation() {
    $("#txt_designation").select2({
        placeholder: "Search Designation",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPayroll/GetDesignation',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
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
            var data = { "id": _Designation_ID, "text": _Designation_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_designation').on("select2-selected", function (e) {
    _Designation_ID = $("#txt_designation").select2('data').id;
});

$('#txt_designation').on("select2-removed", function (e) {
    _Designation_ID = "0";

});
//Designation end

//Departmant start
function FillDepartment() {
    $("#txt_department").select2({
        placeholder: "Search Department",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPayroll/GetDepartment',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
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
            var data = { "id": _Department_ID, "text": _Department_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_department').on("select2-selected", function (e) {
    _Department_ID = $("#txt_department").select2('data').id;
});

$('#txt_department').on("select2-removed", function (e) {
    _Department_ID = "0";

});
//Departmant end

//Roster start
function FillRoster() {
    $("#txt_roster").select2({
        placeholder: "Search Roster",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPayroll/GetRoster',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
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
            var data = { "id": _Roster_ID, "text": _Roster_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_roster').on("select2-selected", function (e) {
    _Roster_ID = $("#txt_roster").select2('data').id;
});

$('#txt_roster').on("select2-removed", function (e) {
    _Roster_ID = "0";

});
//Roster end


//Branch start
function FillBranch() {
    $("#txt_branch").select2({
        placeholder: "Search Branch",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Auth/v1/LOVServices/GetBranch',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
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
            var data = { "id": _Branch_ID, "text": _Branch_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_branch').on("select2-selected", function (e) {
    _Branch_ID = $("#txt_branch").select2('data').id;
});

$('#txt_branch').on("select2-removed", function (e) {
    _Branch_ID = "0";

});
//Branch end

//Annual Leave start
function FillAnnualLeave() {
    $("#txt_annualLeave").select2({
        placeholder: "Search Annual Leaves",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPayroll/GetAnnualLeave',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
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
            var data = { "id": _AnnualLeave_ID, "text": _AnnualLeave_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_annualLeave').on("select2-selected", function (e) {
    _AnnualLeave_ID = $("#txt_annualLeave").select2('data').id;
});

$('#txt_annualLeave').on("select2-removed", function (e) {
    _AnnualLeave_ID = "0";

});
//Annual Leave end

//Annual Leave start
function FillReportingOfficer() {
    $("#txt_reportOfficer").select2({
        placeholder: "Search Reporting Officer",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesPayroll/GetEmployee',
            type: "Get",
            contentType: "application/json",
            dataType: "json",
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
            var data = { "id": _ReportOfficer_ID, "text": _ReportOfficer_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

//#endregion select 2
function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    $("#div_Permanent").hide();
    $("#div_Temporary").hide();

    Onload();
    imgload.hide();


    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    var CurrentDateYear = moment(new Date()).format("DD/MMM/YYYY");
    txtdop.find("input").val(CurrentDate);
    txtdoj.find("input").val(CurrentDate);
    txtcnicexpdt.find("input").val(CurrentDate);
    txtdateOfBirth.find("input").val(CurrentDate);
    txtdtsessi.find("input").val(CurrentDate);
    txtdteobi.find("input").val(CurrentDate);
    txtdtreg.find("input").val(CurrentDate);
    txtqualificationYear.find("input").val(CurrentDateYear);
    txtexpdtfrom.find("input").val(CurrentDateYear);
    txtexpdtto.find("input").val(CurrentDateYear);
}

function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/EmployeeProfile?_MenuId=' + _menuid,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var action_button = ' ';
                //New
                if (response["data"][0]["newPermission"] == 'true') {
                    btnnew.show();
                }

                //Delete
                if (Boolean(response["data"][0]["deletePermission"])) {
                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                }
                //Update
                if (Boolean(response["data"][0]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }
                if (response["data"] != null) {
                    $('#Table_View').DataTable().clear().destroy();
                    $('#txt_cardno').val(response["data"][0]["machineIdMax"]);
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        columns: [
                            {
                                data: null,
                                "defaultContent": action_button
                            },
                            {
                                "render": function (data, type, full, meta) {
                                    return tbl_row_cnt++;
                                }
                            },
                            { data: 'machineId' },
                            { data: 'name' },
                            { data: 'fatherName' },
                            {data :  'reportOfficerName'},
                            {
                                data: 'dateofJoin',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },
                            { data: 'designation' },
                            { data: 'department' },
                            {
                                data: 'active',
                                "render": function (data, type, full, meta) {
                                    if (Boolean(data)) {
                                        return 'Yes';
                                    }
                                    else { return 'No'; }
                                }
                            },
                            {
                                data: 'resignationCheck',
                                "render": function (data, type, full, meta) {
                                    if (Boolean(data)) {
                                        return 'Yes';
                                    }
                                    else { return 'No'; }
                                }
                            },
                            {
                                data: 'type',
                                "render": function (data, type, full, meta) {
                                    if (data == 'S') {
                                        return 'System';
                                    }
                                    else { return 'User'; }
                                }
                            }

                        ],
                        "order": [[3, "asc"]],
                        "pageLength": 10,

                    });
                    imgload.hide();

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


    return true;

}

$(document).on("click", '#btn_new', function () {
    $('#data_Modal').modal('show');
    btnupd.hide();
    btnsav.show();
    imgloadsav.hide();
});


function savrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;

    Swal.fire({
        title: 'Are you sure you want to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/EmployeeProfile',
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        //  $("#txt_id").html(response.message)
                        saveImage();
                        imgloadsav.hide();
                        discon();
                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        Swal.fire({
                            title: "Record Save",// response.message,

                            icon: 'success',
                            showConfirmButton: true,

                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                    else {
                        imgloadsav.hide();
                        btnsav.show();
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
                    imgloadsav.hide();
                    btnsav.show();
                    Swal.fire({
                        title: xhr.status.toString() + ' ' + err.toString(),

                        icon: 'error',
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
    })

}

function updrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var cre = ck.creteria;

    Swal.fire({
        title: 'Are you sure you want to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/EmployeeProfile',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnupd.hide();
                },
                success: function (response) {

                    var jres = response;
                    if (response.statusCode == 200) {
                        $("#txt_id").html(response.message)
                        saveImage();
                        imgloadsav.hide();
                        discon();
                        btnsav.show();
                        $('#data_Modal').modal('hide');

                        Swal.fire({
                            title: 'Record Update',

                            icon: 'success',
                            showConfirmButton: true,

                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                    else {
                        imgloadsav.hide();
                        btnupd.show();
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
                    imgloadsav.hide();
                    btnupd.show();
                    Swal.fire({
                        title: xhr.status.toString() + ' ' + err.toString(),

                        icon: 'error',
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
    })

}

//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['name'];
    var _type = data['type'];

    if (_type == "S") {
        Swal.fire({
            title: "This is system generated record!",
            icon: 'warning',
            showConfirmButton: true,
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return;
    }
    Swal.fire({
        title: 'Are sure wants to delete <br> ' + _name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/EmployeeProfile',
                type: "Delete",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "ID": _id,
                    "menu_Id": _menuid
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        imgload.hide();
                        discon();
                        Swal.fire({
                            title: response.message,

                            icon: 'success',
                            showConfirmButton: true,

                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
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
                    imgloadsav.hide();
                    btnsav.show();
                    Swal.fire({
                        title: xhr.status.toString() + ' ' + err.toString(),

                        icon: 'error',
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
    })
});
//Delete End


//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['name'];
    var _type = data['type'];
    if (_type == "S") {
        Swal.fire({
            title: "This is system generated record!",
            icon: 'warning',
            showConfirmButton: true,
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }

        })
        return;
    }
    Swal.fire({
        title: 'Are sure wants to edit <br/>' + _name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'edit',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({

                url: ApiForm + '/EmployeeProfile/GetEmployeeProfileById',
                type: "Get",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("_MenuId", _menuid);
                    xhr.setRequestHeader("_Id", _id);
                    imgload.show();
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.hide();
                },

                success: function (response) {
                    if (response.statusCode == 200) {
                        $('#data_Modal').modal('show');
                        $('#txt_id').html(response["data"]["id"]);
                        $('#txt_cardno').val(response["data"]["machineId"]);

                        _EmployeeCategory_ID = response["data"]["employeeCategoryId"];
                        _EmployeeCategory_Name = response["data"]["employeeCategoryName"];

                        if (Boolean(response["data"]["active"])) {
                            $("#ddl_Active").val(1);
                        } else {
                            $("#ddl_Active").val(0);
                        }

                        $('#txt_employeeCategory').val(_EmployeeCategory_ID); // Select the option with a value of '1'
                        $('#txt_employeeCategory').trigger('change'); // Notify any JS components that the value changed                        
                        $('#ddl_OfficeStaff').val(response["data"]["officeWorker"]);
                        $('#ddl_Gender').val(response["data"]["gender"]);
                        $('#ddl_MaritalStatus').val(response["data"]["married"]);
                        $('#ddl_TP').val(response["data"]["temporaryPermanent"]);

                        _Branch_ID = response["data"]["branchId"];
                        _Branch_Name = response["data"]["branchName"];
                        $('#txt_branch').val(_Branch_ID); // Select the option with a value of '1'
                        $('#txt_branch').trigger('change'); // Notify any JS components that the value changed


                        _Department_ID = response["data"]["departmentId"];
                        _Department_Name = response["data"]["departmentName"];
                        $('#txt_department').val(_Department_ID); // Select the option with a value of '1'
                        $('#txt_department').trigger('change'); // Notify any JS components that the value changed

                        _Designation_ID = response["data"]["designationId"];
                        _Designation_Name = response["data"]["designationName"];
                        $('#txt_designation').val(_Designation_ID); // Select the option with a value of '1'
                        $('#txt_designation').trigger('change'); // Notify any JS components that the value changed


                        $('#txt_Name').val(response["data"]["name"]);
                        $('#txt_fatherName').val(response["data"]["fatherName"]);
                        $('#txt_Address').val(response["data"]["address"]);
                        $('#txt_AddressPermanent').val(response["data"]["addressPermanent"]);


                        _AnnualLeave_ID = response["data"]["annualLeavesId"];
                        _AnnualLeave_Name = response["data"]["annualLeavesName"];
                        $('#txt_annualLeave').val(_AnnualLeave_ID); // Select the option with a value of '1'
                        $('#txt_annualLeave').trigger('change'); // Notify any JS components that the value changed

                        _ReportOfficer_ID = response["data"]["reportOfficerId"];
                        _ReportOfficer_Name = response["data"]["reportOfficerName"];
                        $('#txt_reportOfficer').val(_ReportOfficer_ID); // Select the option with a value of '1'
                        $('#txt_reportOfficer').trigger('change'); // Notify any JS components that the value changed



                        $('#txt_cnic').val(response["data"]["cnic"]);
                        txtcnicexpdt.find("input").val(moment(response["data"]["cnicExpire"]).format('DD/MMM/YYYY'));

                        $('#txt_ExperianceCompany').val(response["data"]["companyExpirence"]);
                        $('#txt_ExperianceDesignation').val(response["data"]["companyExpirenceDescription"]);
                        txtexpdtfrom.find("input").val(moment(response["data"]["companyExpirenceFrom"]).format('YYYY'));
                        txtexpdtto.find("input").val(moment(response["data"]["companyExpirenceTo"]).format('YYYY'));
                        $('#txt_experianceRemark').val(response["data"]["companyExpirenceRemarks"]);

                        txtdateOfBirth.find("input").val(moment(response["data"]["dateofBirth"]).format('DD/MMM/YYYY'));
                        txtdoj.find("input").val(moment(response["data"]["dateofJoin"]).format('DD/MMM/YYYY'));


                        $('#txt_email').val(response["data"]["email"]);
                        $('#txt_emergencyContactOne').val(response["data"]["emergencyContactOne"]);
                        $('#txt_emergencyContactTwo').val(response["data"]["emergencyContactTwo"]);

                        txtdteobi.find("input").val(moment(response["data"]["eobiRegistrationDate"]).format('DD/MMM/YYYY'));
                        $('#txt_eobi').val(response["data"]["eobiRegistrationNo"]);

                        if (Boolean(response["data"]["gratuity"])) {
                            $("#ddl_Gratuity").val(1);
                        } else {
                            $("#ddl_Gratuity").val(0);
                        }

                        if (Boolean(response["data"]["documentAuthorize"])) {
                            $("#ddl_Authorized").val(1);
                        } else {
                            $("#ddl_Authorized").val(0);
                        }


                        if (Boolean(response["data"]["incomeTax"])) {
                            $("#ddl_IncomeTax").val(1);
                        } else {
                            $("#ddl_IncomeTax").val(0);
                        }

                        if (Boolean(response["data"]["stopPayment"])) {
                            $("#ddl_StopPayment").val(1);
                        } else {
                            $("#ddl_StopPayment").val(0);
                        }

                        if (Boolean(response["data"]["attendanceAllowance"])) {
                            $("#ddl_attendanceAllowance").val(1);
                        } else {
                            $("#ddl_attendanceAllowance").val(0);
                        }

                        if (Boolean(response["data"]["attendanceExempt"])) {
                            $("#ddl_attendanceExemption").val(1);
                        } else {
                            $("#ddl_attendanceExemption").val(0);
                        }


                        if (Boolean(response["data"]["lateDeduction"])) {
                            $("#ddl_LateDeduction").val(1);
                        } else {
                            $("#ddl_LateDeduction").val(0);
                        }

                        $('#txt_cell').val(response["data"]["mobile"]);
                        $('#ddl_ModeOfPayment').val(response["data"]["modeOfPayment"]);
                        $('#txt_salaryAccount').val(response["data"]["salaryAccount"]);
                        $('#txt_ntn').val(response["data"]["ntn"]);



                        if (Boolean(response["data"]["overTime"])) {
                            $("#ddl_OverTime").val(1);
                        } else {
                            $("#ddl_OverTime").val(0);
                        }


                        if (Boolean(response["data"]["overTimeFactory"])) {
                            $("#ddl_FactoryOvertime").val(1);
                        } else {
                            $("#ddl_FactoryOvertime").val(0);
                        }

                        if (Boolean(response["data"]["overTimeHoliday"])) {
                            $("#ddl_HolidayOvertime").val(1);
                        } else {
                            $("#ddl_HolidayOvertime").val(0);
                        }

                        $('#txt_overtimerate').val(response["data"]["overTimeRate"]);

                        $('#txt_qualification').val(response["data"]["qualification"]);
                        $('#txt_institute').val(response["data"]["qualificationInstitute"]);
                        $('#txt_qualificationRemark').val(response["data"]["qualificationRemarks"]);

                        txtqualificationYear.find("input").val(moment(response["data"]["qualificationYear"]).format("YYYY"));

                        $('#txt_refAddressOne').val(response["data"]["referenceAddressOne"]);
                        $('#txt_refAddressTwo').val(response["data"]["referenceAddressTwo"]);
                        $('#txt_refCnicOne').val(response["data"]["referenceCNICOne"]);
                        $('#txt_refCnicTwo').val(response["data"]["referenceCNICTwo"]);
                        $('#txt_refcontactOne').val(response["data"]["referenceContactOne"]);
                        $('#txt_refcontactTwo').val(response["data"]["referenceContactTwo"]);
                        $('#txt_refNameOne').val(response["data"]["referenceOne"]);
                        $('#txt_refNameTwo').val(response["data"]["referenceTwo"]);
                        $('#txt_remark').val(response["data"]["remarks"]);

                        var _ddlResign = "N";
                        if (Boolean(response["data"]["resignationCheck"])) { _ddlResign = "R"; }

                        $('#ddl_Resign').val(_ddlResign)
                        txtdtreg.find("input").val(moment(response["data"]["resignationDate"]).format('DD/MMM/YYYY'));
                        $('#txt_resignRemark').val(response["data"]["resignationRemarks"]);

                        _Roster_ID = response["data"]["rosterId"];
                        _Roster_Name = response["data"]["rosterName"];
                        $('#txt_roster').val(_Roster_ID); // Select the option with a value of '1'
                        $('#txt_roster').trigger('change'); // Notify any JS components that the value changed

                        txtdtsessi.find("input").val(moment(response["data"]["sessiRegistrationDate"]).format('DD/MMM/YYYY'));
                        $('#txt_sessi').val(response["data"]["sessiRegistrationNo"]);


                        $('#txt_takaful').val(response["data"]["takafulRate"]);

                        TemporaryPermanent();

                        if (response["data"]["employeeProfileDocumentLists"] != null) {
                            var _AttachmentTable = $("#AttachmentTable tbody");
                            _AttachmentTable.empty();
                            for (var image_row_cnt = 0; image_row_cnt < response["data"]["employeeProfileDocumentLists"].length; image_row_cnt++) {
                                imageB64 = response["data"]["employeeProfileDocumentLists"][image_row_cnt]["imageBytes"];
                                FileName = response["data"]["employeeProfileDocumentLists"][image_row_cnt]["imageName"];
                                mimeType = response["data"]["employeeProfileDocumentLists"][image_row_cnt]["imageExtension"];
                                profileCheck = response["data"]["employeeProfileDocumentLists"][image_row_cnt]["imageProfileCheck"];

                                var _RowAttachment = '<tr>' +
                                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                    '<td>' + FileName + '</td>' +
                                    '<td><img src = data:image/jpeg;base64,' + imageB64 + ' height="100" width="100"> </td>' +
                                    '<td hidden >' + imageB64 + '</td>' +
                                    '<td hidden >' + mimeType + '</td>';
                                if (profileCheck == "1") {
                                    _RowAttachment += '<td>Yes</td>';
                                }
                                else {
                                    _RowAttachment += '<td>No</td>';
                                }

                                _RowAttachment += '</tr>';
                                _AttachmentTable.append(_RowAttachment);
                            }
                        }
                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();
                    }

                    else {
                        imgload.hide();
                        btnsav.hide();
                        btnupd.show();

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
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.show();
                    Swal.fire({
                        title: xhr.status.toString() + ' ' + err.toString(),

                        icon: 'error',
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
    })
});
function TemporaryPermanent() {
    _ddlTP = $("#ddl_TP").val();
    _divPermanent = $("#div_Permanent");
    _divTemporary = $("#div_Temporary");
    _divPermanent.hide();
    _divTemporary.hide();

    if (_ddlTP == "Temporary") {
        _divPermanent.hide();
        _divTemporary.show();
    }
    else if (_ddlTP == "Permanent") {
        _divPermanent.show();
        _divTemporary.hide();

    }

}

//Validation Edit Start
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';

    txtid = $("#txt_id").html();
    txtcardno = $('#txt_cardno');
    ddlOfficeStaff = $("#ddl_OfficeStaff");
    ddlGender = $('#ddl_Gender');
    ddlMaritalStatus = $('#ddl_MaritalStatus');
    ddlTP = $('#ddl_TP');

    txtbranch = $('#txt_branch');
    txtdesignation = $('#txt_designation');
    txtdepartment = $('#txt_department');

    txtName = $('#txt_Name');
    txtfatherName = $('#txt_fatherName');
    txtAddress = $('#txt_Address');
    txtAddressPermanent = $('#txt_AddressPermanent');

    txtdoj1 = moment(txtdoj.find("input").val()).format("YYYY-MM-DD");
    txtroster = $('#txt_roster');

    txtcnic = $('#txt_cnic');
    txtcnicexp = moment(txtcnicexpdt.find("input").val()).format("YYYY-MM-DD");


    txtdop1 = moment(txtdop.find("input").val()).format("YYYY-MM-DD");
    txtTemporaryPeriod = $("#txt_Temporary_Period");

    txtdateOfBirth1 = moment(txtdateOfBirth.find("input").val()).format("YYYY-MM-DD");

    txtemergencyContactOne = $('#txt_emergencyContactOne').val();
    txtemergencyContactTwo = $('#txt_emergencyContactTwo').val();
    txtcell = $('#txt_cell');
    txtntn = $('#txt_ntn');
    txteml = $('#txt_email');
    txtrmk = $('#txt_remark').val();

    txtreportOfficer = $("#txt_reportOfficer");
    txtannualLeave = $("#txt_annualLeave");
    ddlModeOfPayment = $('#ddl_ModeOfPayment').val();
    txtsalaryAccount = $('#txt_salaryAccount');


    txtrefNameOne = $('#txt_refNameOne').val();
    txtrefCnicOne = $('#txt_refCnicOne').val();
    txtrefAddressOne = $('#txt_refAddressOne').val();
    txtrefcontactOne = $('#txt_refcontactOne').val();

    txtrefNameTwo = $('#txt_refNameTwo').val();
    txtrefCnicTwo = $('#txt_refCnicTwo').val();
    txtrefAddressTwo = $('#txt_refAddressTwo').val();
    txtrefcontactTwo = $('#txt_refcontactTwo').val();

    txtsessi = $('#txt_sessi').val();
    dtsessi = moment(txtdtsessi.find("input").val()).format("YYYY-MM-DD");

    txteobi = $('#txt_eobi').val();
    dteobi = moment(txtdteobi.find("input").val()).format("YYYY-MM-DD");


    var _ddlResign = false;
    ddlResign = $('#ddl_Resign').val();
    if (ddlResign == "R") { _ddlResign = true; }
    resignationDate1 = moment(txtdtreg.find("input").val()).format("YYYY-MM-DD");
    txtresignRemark = $('#txt_resignRemark').val();




    txttakaful = $('#txt_takaful').val();
    ckovertime = false
    if ($('#ddl_OverTime').val() == "1") { ckovertime = true; };
    txtovertimerate = $('#txt_overtimerate').val();

    ckgratuity = false
    if ($('#ddl_Gratuity').val() == "1") { ckgratuity = true; };

    ckauthorized = false
    if ($('#ddl_Authorized').val() == "1") { ckauthorized = true; };

    ckincomeTax = false
    if ($('#ddl_IncomeTax').val() == "1") { ckincomeTax = true; };

    ckstopPayment = false
    if ($('#ddl_StopPayment').val() == "1") { ckstopPayment = true; };

    ckattendanceAllowance = false
    if ($('#ddl_attendanceAllowance').val() == "1") { ckattendanceAllowance = true; };

    ckattendanceExemption = false
    if ($('#ddl_attendanceExemption').val() == "1") { ckattendanceExemption = true; };


    cklateDeduction = false
    if ($('#ddl_LateDeduction').val() == "1") { cklateDeduction = true; };

    ckholidayOvertime = false
    if ($('#ddl_HolidayOvertime').val() == "1") { ckholidayOvertime = true; };


    ckfactoryOvertime = false
    if ($('#ddl_FactoryOvertime').val() == "1") { ckfactoryOvertime = true; };


    ckact = false
    if ($('#ddl_Active').val() == "1") { ckact = true; };



    txtinstitute = $('#txt_institute').val();
    txtqualification = $('#txt_qualification').val();
    qualificationYear = moment(txtqualificationYear.find("input").val()).format("YYYY-MM-DD");
    txtqualificationRemark = $('#txt_qualificationRemark').val();

    txtExperianceCompany = $('#txt_ExperianceCompany').val();
    txtExperianceDesignation = $('#txt_ExperianceDesignation').val();
    expdtfrom = moment(txtexpdtfrom.find("input").val()).format("YYYY-MM-DD");
    expdtto = moment(txtexpdtto.find("input").val()).format("YYYY-MM-DD");
    txtexperianceRemark = $('#txt_experianceRemark').val();

    if (txtcardno.val() == '' || txtcardno.val() == '0') {
        ck = 1;
        _Error = 'Please enter card #';
        txtcardno.focus();
    }
    else if (ddlOfficeStaff.val() == '0') {
        ck = 1;
        _Error = 'Please select office / Worker';
        ddlOfficeStaff.focus();
    }
    else if (ddlGender.val() == '0') {
        ck = 1;
        _Error = 'Please select Gender';
        ddlGender.focus();
    }
    else if (ddlMaritalStatus.val() == '0') {
        ck = 1;
        _Error = 'Please select Martial Status';
        ddlMaritalStatus.focus();
    }
    else if (ddlTP.val() == '0') {
        ck = 1;
        _Error = 'Please select Permanent / Temperory';
        ddlTP.focus();
    }
    else if (txtbranch.val() == '') {
        ck = 1;
        _Error = "Please select branch";
        txtbranch.focus();
    }
    else if (txtreportOfficer.val() == '') {
        ck = 1;
        _Error = "Please select Reporting Officer";
        txtreportOfficer.focus();
    }
    else if (txtdesignation.val() == '') {
        ck = 1;
        _Error = "Please select designation";
        txtdesignation.focus();
    }
    else if (txtdepartment.val() == '') {
        ck = 1;
        _Error = "Please select department";
        txtdepartment.focus();
    }
    else if (txtName.val() == '') {
        ck = 1;
        _Error = "Name cannot be blank";
        txtName.focus();
    }
    else if (txtfatherName.val() == '') {
        ck = 1;
        _Error = "Father name cannot be blank";
        txtfatherName.focus();
    }
    else if (txtAddress.val() == '') {
        ck = 1;
        _Error = "Address cannot be black";
        txtAddress.focus();
    }
    else if (txtroster.val() == '') {
        ck = 1;
        _Error = "Please select roster";
        txtroster.focus();
    }
    else if (txtcnic.val() == '') {
        ck = 1;
        _Error = "C.N.I.C cannot be blank";
        txtcnic.focus();
    }
    else if (txtntn.val() == '') {
        ck = 1;
        _Error = "N.T.N cannot be blank";
        txtntn.focus();
    }
    else if (txtannualLeave.val() == '') {
        ck = 1;
        _Error = "Please select Annual Leave";
        txtannualLeave.focus();
    }



    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "Id": txtid,
            "machineId": txtcardno.val(),
            "employeeCategoryId": _EmployeeCategory_ID,
            "officeWorker": ddlOfficeStaff.val(),
            "gender": ddlGender.val(),
            "married": ddlMaritalStatus.val(),
            "temporaryPermanent": ddlTP.val(),

            "branchId": txtbranch.val(),
            "designationId": txtdesignation.val(),
            "departmentId": txtdepartment.val(),

            "name": txtName.val(),
            "fatherName": txtfatherName.val(),
            "address": txtAddress.val(),
            "addressPermanent": txtAddressPermanent.val(),

            "dateofBirth": txtdateOfBirth1,
            "rosterId": txtroster.val(),
            "cnic": txtcnic.val(),
            "cnicExpire": txtcnicexp,
            "ntn": txtntn.val(),
            "phone": txtcell.val(),
            "mobile": txtcell.val(),
            "email": txteml.val(),

            "provisionPeriod": txtTemporaryPeriod.val(),
            "DateofParmanent": txtdop1,

            "dateofJoin": txtdoj1,

            "annualLeavesId": txtannualLeave.val(),
            "modeOfPayment": ddlModeOfPayment,
            "salaryAccount": txtsalaryAccount.val(),

            "takafulRate": txttakaful,
            "overTime": ckovertime,
            "overTimeRate": txtovertimerate,

            "gratuity": ckgratuity,
            "documentAuthorize": ckauthorized,
            "stopPayment": ckstopPayment,
            "incomeTax": ckincomeTax,


            "resignationCheck": _ddlResign,
            "resignationDate": resignationDate1,
            "resignationRemarks": txtresignRemark,


            "companyExpirence": txtExperianceCompany,
            "companyExpirenceDescription": txtExperianceDesignation,
            "companyExpirenceFrom": expdtfrom,
            "companyExpirenceTo": expdtto,
            "companyExpirenceRemarks": txtexperianceRemark,
            "qualificationInstitute": txtinstitute,
            "qualification": txtqualification,
            "qualificationYear": qualificationYear,
            "qualificationRemarks": txtqualificationRemark,
            "eobiRegistrationDate": dteobi,
            "eobiRegistrationNo": txteobi,
            "sessiRegistrationDate": dtsessi,
            "sessiRegistrationNo": txtsessi,

            "overTimeHoliday": ckholidayOvertime,
            "overTimeFactory": ckfactoryOvertime,
            "lateDeduction": cklateDeduction,
            "attendanceAllowance": ckattendanceAllowance,
            "attendanceExempt": ckattendanceExemption,
            "overTimeRateCheck": true,
            "emergencyContactOne": txtemergencyContactOne,
            "emergencyContactTwo": txtemergencyContactTwo,
            "remarks": txtrmk,
            "referenceOne": txtrefNameOne,
            "referenceCNICOne": txtrefCnicOne,
            "referenceAddressOne": txtrefAddressOne,
            "referenceContactOne": txtrefcontactOne,
            "referenceTwo": txtrefNameTwo,
            "referenceCNICTwo": txtrefCnicTwo,
            "referenceAddressTwo": txtrefAddressTwo,
            "referenceContactTwo": txtrefcontactTwo,

            "reportOfficerId":txtreportOfficer.val(),
            "type": "U",
            "active": ckact,
            "menu_Id": _menuid
        });
    }
    return { ckval: ck, creteria: _cre };
}
//Validation Edit  End
//Save Images Start
async function saveImage() {
    //txtid = $("#txt_id").html();
    // var input = document.querySelector('#ImageUpload1');

    // file = input.files[0];
    // if (input.files.length > 0) {
    //     var formData = new FormData();
    //     formData.append('EmployeeId', txtid);
    //     formData.append('ImageProfileCheck', true);
    //     formData.append('ProfileImage', file);
    var ck = getImagesRecords();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    await $.ajax({
        url: ApiForm + '/EmployeeProfileDocument',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        processData: false,
        //        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgloadsav.show();
            btnsav.hide();
        },
        success: function (response) {

            if (response.statusCode == 200) {
                imgloadsav.hide();
                discon();
                btnsav.show();
                $('#data_Modal').modal('hide');
                // Swal.fire({
                //     title: response.message,

                //     icon: 'success',
                //     showConfirmButton: true,

                //     showClass: {
                //         popup: 'animated fadeInDown faster'
                //     },
                //     hideClass: {
                //         popup: 'animated fadeOutUp faster'
                //     }

                // })
            }
            else {
                imgloadsav.hide();
                btnsav.show();
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
            imgloadsav.hide();
            btnsav.show();
            Swal.fire({
                title: xhr.status.toString() + ' ' + err.toString(),

                icon: 'error',
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

//Save Image End
// async function saveImage() {
//     txtid = $("#txt_id").html();
//     var input = document.querySelector('#ImageUpload1');

//     file = input.files[0];
//     if (input.files.length > 0) {
//         var formData = new FormData();
//         formData.append('EmployeeId', txtid);
//         formData.append('ImageProfileCheck', true);
//         formData.append('ProfileImage', file);

//         await $.ajax({
//             url: ApiForm + '/EmployeeProfileDocument',
//             type: "Post",
//             contentType: "application/json",
//             dataType: "json",
//             data: formData,
//             processData: false,
//             contentType: false,
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//                 imgloadsav.show();
//                 btnsav.hide();
//             },
//             success: function (response) {

//                 if (response.statusCode == 200) {
//                     imgloadsav.hide();
//                     discon();
//                     btnsav.show();
//                     $('#data_Modal').modal('hide');
//                     Swal.fire({
//                         title: response.message,

//                         icon: 'success',
//                         showConfirmButton: true,

//                         showClass: {
//                             popup: 'animated fadeInDown faster'
//                         },
//                         hideClass: {
//                             popup: 'animated fadeOutUp faster'
//                         }

//                     })
//                 }
//                 else {
//                     imgloadsav.hide();
//                     btnsav.show();
//                     var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
//                     Swal.fire({

//                         title: _title,

//                         icon: 'warning',
//                         showConfirmButton: true,

//                         showClass: {
//                             popup: 'animated fadeInDown faster'
//                         },
//                         hideClass: {
//                             popup: 'animated fadeOutUp faster'
//                         }

//                     })
//                 }

//             },
//             error: function (xhr, status, err) {
//                 imgloadsav.hide();
//                 btnsav.show();
//                 Swal.fire({
//                     title: xhr.status.toString() + ' ' + err.toString(),

//                     icon: 'error',
//                     showConfirmButton: true,

//                     showClass: {
//                         popup: 'animated fadeInDown faster'
//                     },
//                     hideClass: {
//                         popup: 'animated fadeOutUp faster'
//                     }

//                 })
//             }
//         })
//     }
// }
// //Save Image End
//Image Start
function readURL(input) {
    if (input.files && input.files[0]) {
        for (let i = 0; i < input.files.length; i++) {
            if (input.files[i].size > 10240000) {
                Swal.fire({
                    title: input.files[i].name + "<br/> File is too big!<br/> Max allowed file size is 10 MB ",

                    icon: 'error',
                    showConfirmButton: false,
                    // timer: 1500,
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                })
                // return;
            }
            else {
                var reader = new FileReader();

                reader.onload = function (e) {

                    var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
                    document.getElementById("img").src = e.target.result;
                    document.getElementById("img").style.display = 'block'

                    if (match == null) {
                        throw 'Could not parse result'; // should not happen
                    }
                    mimeType = match[1];
                    content = match[2];
                    imageB64 = content;
                };

                reader.readAsDataURL(input.files[i]);

            }
        }
    }
}
//Image End

//Delete from Image Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    output = confirm('Are sure wants to delete?');
    if (output == false) {
        return false;
    }
    e.preventDefault();
    var $self = $(this);
    if ($(this).attr('data-itemId') == "0") {
        $(this).parents('tr').css("background-color", "#FF6347").fadeOut(800, function () {
            $(this).remove();
            dgcal();
        });
    }
});

//Attachment table
$("body").on("click", "#btnAddImg", function () {
    var FileName = $("#txt_imgname").val();
    //var IsProfile = $("#ck_ProfileCheckBox");
    if (FileName != "" && imageB64 != "") {
        var _AttachmentTable = $("#AttachmentTable tbody");
        var _RowAttachment = '<tr>' +
            '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
            '<td>' + FileName + '</td>' +
            '<td><img src = data:image/jpeg;base64,' + imageB64 + ' height="100" width="100"> </td>' +
            '<td hidden >' + imageB64 + '</td>' +
            '<td hidden >' + mimeType + '</td>';
        if ($("#ck_ProfileCheckBox").is(":checked")) {
            _RowAttachment += '<td>Yes</td>';
        }
        else {
            _RowAttachment += '<td>No</td>';
        }
        _RowAttachment += '</tr>';
        _AttachmentTable.append(_RowAttachment);
        $("#txt_imgname").val("");
        $("#txt_imgname").val("");
    }
    else {
        Swal.fire({
            title: "Document name is not found",
            icon: 'error',
            showConfirmButton: false,
            showCancelButton: true,
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        })
    }
});


function getImagesRecords() {
    var ck = 0, _Error = '', _cre = '';
    txtid = $("#txt_id").html();
    var rows_create = $("#AttachmentTable tbody >tr");
    var MultipleImages = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        var FileName = ($(columns[1]).html().trim());
        var imageB64 = $(columns[3]).html().trim();
        var Extension = $(columns[4]).html().replace("image/", ".").trim();
        var IsProfile = $(columns[5]).html() == "Yes" ? "1" : "0";


        MultipleImages.push({
            "employeeId": txtid,
            "imageProfileCheck": IsProfile,
            "imageName": FileName,
            "imageBytes": imageB64,
            "imageExtension": Extension,
            "menu_Id": _menuid
        })
    }
    if (!Boolean(ck)) {
        _cre = JSON.stringify({ "EmployeeProfileDocumentLists": MultipleImages });
    }
    return { ckval: ck, creteria: _cre };
}