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

var _Employee_ID = 0;
var _Employee_MachineID = 0;
var _Employee_Name = '';

var _InOutCategory_ID = 0;
var _InOutCategory_Name = '';

var txtDate = $("#txt_Date");
var txtdat = $("#txt_dat");
var txtinn = $("#txt_inntime");
var txtout = $("#txt_outtime");
var ckinn;
var ckout;

$(function () {
    txtDate.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtinn.datetimepicker({ format: 'HH:mm' });
    txtout.datetimepicker({ format: 'HH:mm' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1/InOutEditor';
    imgload.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtDate.find("input").val(CurrentDate);

    discon();

    ComponentsDropdowns.init();
});

var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        FillEmployee(); //Fill Select 2 of Employee
        FillInOutCategory(); //Fill Select 2 of In Out Category
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

function FillEmployee() {
    $("#txt_employee").select2({
        placeholder: "Search Employee",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetEmployee',
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
                            text: item.name,
                            machineid: item.machineID,
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
            var data = { "id": _Employee_ID, "text": _Employee_Name, "machineid": _Employee_MachineID };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_employee').on("select2-selected", function (e) {
    _Employee_ID = $("#txt_employee").select2('data').id;
    _Employee_MachineID = $("#txt_employee").select2('data').machineid;
    FillRoster();
});

$('#txt_employee').on("select2-removed", function (e) {
    _Employee_ID = "0";

});

function FillInOutCategory() {
    $("#txt_inoutCategory").select2({
        placeholder: "Search In-Out Category",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetInOutCategory',
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
                            text: item.name,
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
            var data = { "id": _InOutCategory_ID, "text": _InOutCategory_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_inoutCategory').on("select2-selected", function (e) {
    _InOutCategory_ID = $("#txt_inoutCategory").select2('data').id;
    _InOutCategory_Name = $("#txt_inoutCategory").select2('data').text;

});

$('#txt_inoutCategory').on("select2-removed", function (e) {
    _InOutCategory_ID = "0";
    _InOutCategory_Name = "";

});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    var CurrentTime = moment(new Date()).format("HH:mm");

    txtdat.find("input").val(CurrentDate);
    txtinn.find("input").val(CurrentTime);
    txtout.find("input").val(CurrentTime);

    Onload();
    imgload.hide();


}


function Onload() {
    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
    var tbl_row_cnt = 1;

    $.ajax({
        url: ApiForm,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_DateFrom", txtDate1);
            xhr.setRequestHeader("_DateTo", txtDate1);
            imgload.show();
        },
        headers: {
            '_Menuid': _menuid
        },
        // data: function (term, page) {
        //     return {
        //         _Menuid: term // search term                            
        //     };
        // },
        success: function (response) {

            if (response.statusCode == 200) {
                var action_button = ' ';
                //New
                if (response["data"][0]["newPermission"] == 'true') {
                    btnnew.show();
                }

                // //Delete
                // if (Boolean(response["data"][0]["deletePermission"])) {
                //     action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                // }
                //Update
                if (Boolean(response["data"][0]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }

                if (response["data"] != null) {
                    $('#Table_View').DataTable().clear().destroy();
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
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },
                            { data: 'employeeName' },
                            {
                                data: 'approved',
                                "render": function (data, type, full, meta) {
                                    if (data == true) {
                                        return 'Approved';
                                    }
                                    else { return 'Un-Approved'; }
                                }
                            }

                        ],
                        "order": [[2, "asc"]],
                        "pageLength": 100,

                    });
                    imgload.hide();

                }

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


    return true;

}


$(document).on("click", '#btn_new', function () {
    $('#data_Modal').modal('show');
    btnupd.hide();
    btnsav.show();
    imgloadsav.hide();
});

function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var checktype = '';
    var detail_record = []

    txtid = $("#txt_id").html();
    txtemployee = $('#txt_employee');
    txtinoutCategory = $("#txt_inoutCategory");
    var txtdt = moment(txtdat.find("input").val()).format("YYYY-MM-DD");
    ckinn = $('#ck_inn').iCheck('update')[0].checked;
    var inn = txtdt + 'T' + moment(txtinn.find("input").val())._i;
    ckout = $('#ck_out').iCheck('update')[0].checked;
    var out = txtdt + 'T' + moment(txtout.find("input").val())._i;



    if (ckinn) {
        detail_record.push({
            "employeeId": txtemployee.val(),
            "inOutCategoryId": txtinoutCategory.val(),
            "checkTime": inn,
            "checkType": "I",
            "menuId": _menuid
        })
        //        checktype = 'I';
    } if (ckout) {
        detail_record.push({
            "employeeId": txtemployee.val(),
            "inOutCategoryId": txtinoutCategory.val(),
            "checkTime": out,
            "checkType": "O",
            "menuId": _menuid
        })
        //      checktype = 'O';
    }
    if (!Boolean(ckinn) && !Boolean(ckout)) {
        ck = 1;
        _Error = 'Please check In or Our Time';
    }



    if (txtinoutCategory.val() == '') {
        ck = 1;
        _Error = 'Please Select In-Out Category';
        txtinoutCategory.focus();
    }
    else if (txtemployee.val() == '') {
        ck = 1;
        _Error = 'Please Select Employee';
        txtemployee.focus();
    }


    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({ "inOutEditorListAddModel": detail_record });
    }
    return { ckval: ck, creteria: _cre };
}

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
                url: ApiForm,
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
                        imgloadsav.hide();
                        discon();
                        btnsav.show();
                        $('#data_Modal').modal('hide');
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

$("#txtin").keyup(function (e) {

    if (e.keyCode === 13) {
        savrec();
    }
});


$("#txt_outtime").keyup(function (e) {
    if (e.keyCode === 13) {
        savrec();
    }
});



$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['employeeId'];
    var _name = data['employeeName'];
    var _date = moment(data['date']).format("YYYY-MM-DD");
    //data['date']; 

    var _approved = data['approved'];
    if (_approved) {
        Swal.fire({
            title: "This is Approved Record can't be edit!",
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

                url: ApiForm,
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.hide();
                },
                data: JSON.stringify({
                    "employeeId": _id,
                    "date": _date,
                    "menuId": _menuid
                }),
                success: function (response) {
                    if (response.statusCode == 200) {
                        $('#data_Modal').modal('show');


                        _Employee_ID = response["data"][0]["employeeId"];
                        _Employee_Name = response["data"][0]["employeeName"];
                        $('#txt_employee').val(_Employee_ID); // Select the option with a value of '1'
                        $('#txt_employee').trigger('change'); // Notify any JS components that the value changed

                        txtdat.find("input").val(moment(response["data"][0]["date"]).format('DD/MMM/YYYY'));

                        _InOutCategory_ID = response["data"][0]["inOutCategoryId"];
                        _InOutCategory_Name = response["data"][0]["inOutCategoryName"];
                        $('#txt_inoutCategory').val(_InOutCategory_ID); // Select the option with a value of '1'
                        $('#txt_inoutCategory').trigger('change'); // Notify any JS components that the value changed

                        for (var i = 0; i < response["data"].length; i++) {
                            if (response["data"][i]["checkType"] == 'I') {
                                $('#ck_inn').iCheck('check');
                                txtinn.find("input").val(moment(response["data"][i]["checktime"]).format('HH:mm'));
                            }

                            if (response["data"][i]["checkType"] == 'O') {
                                $('#ck_out').iCheck('check');
                                txtout.find("input").val(moment(response["data"][i]["checktime"]).format('HH:mm'));
                            }
                        }

                        imgload.hide();
                        imgloadsav.hide();
                        btnsav.hide();
                        btnupd.show();
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
function FillRoster() {

    var txtdat1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");

    $.ajax({

        url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetRosterByEmployeeId',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("RosterDateFrom", txtdat1);
            xhr.setRequestHeader("RosterDateTo", txtdat1);
            xhr.setRequestHeader("EmployeeId", $("#txt_employee").val());
            imgloadsav.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                $("#txt_inntime").find("input").val(moment(response["data"][0]["rosterInn"]).format('HH:mm'));
                $("#txt_outtime").find("input").val(moment(response["data"][0]["rosterOut"]).format('HH:mm'));

                imgloadsav.hide();
            }

            else {
                imgloadsav.hide();
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