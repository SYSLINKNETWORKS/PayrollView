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

var txtDate = $("#txt_Date");

$(function () {
    txtDate.datetimepicker({ format: 'DD/MMM/YYYY' });
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

        FillInOutCategory(); //Fill Select 2 of In Out Category
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();


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
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}


function discon() {
    imgload.hide();
}


function Onload() {
    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
    $('#Table_View').DataTable().clear().destroy();

    $.ajax({
        url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetRosterByEmployeeId',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("RosterDateFrom", txtDate1);
            xhr.setRequestHeader("RosterDateTo", txtDate1);
            imgload.show();
        },
        success: function (response) {

            if (response.statusCode == 200) {
                var action_button = ' ';
                //New
                if (response["data"][0]["newPermission"] == 'true') {
                    btnnew.show();
                }
                var sno = 1;

                if (response["data"] != null) {
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        paging: false,
                        search: false,
                        bFilter: false,
                        bInfo: false,
                        columns: [
                            {
                                data: null,
                                render: function () { return sno++ }
                            },
                            {
                                data: 'employeeName',
                            },
                            {
                                data: 'rosterInn',
                                render: function (data, type, row) {
                                    var InnTime = '';
                                    if (data != null) {
                                        InnTime = moment(data).format('HH:mm');
                                    }
                                    return '<input type="text" class="form-control" id="txt_inntime" name="txt_inntime" value="' + InnTime + '" />'
                                }

                            },
                            {
                                data: 'rosterOut',
                                render: function (data, type, row) {
                                    var OutTime = '';
                                    if (data != null) {
                                        OutTime = moment(data).format('HH:mm');
                                    }
                                    return '<input type="text" class="form-control" id="txt_outtime" name="txt_outtime" value="' + OutTime + '" />'
                                }

                            },

                        ],
                        "order": [[2, "asc"]],

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



function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';

    txtinoutCategory = $("#txt_inoutCategory");

    var rows_create = $("#Table_View tbody >tr");

    var detail_record = [];


    if (txtinoutCategory.val() == '') {
        ck = 1;
        _Error = 'Please Select In-Out Category';
        txtinoutCategory.focus();
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })
        return { ckval: ck, creteria: _cre };;
    }
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        var txtdt = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
        var txtinn = $(columns[2]).find("input").val();
        var txtinn = $(columns[2]).find("input").val();
        var txtout = $(columns[3]).find("input").val();

        var inn = txtdt + 'T' + moment(txtinn)._i;
        var out = txtdt + 'T' + moment(txtout)._i;
        var data = $('#Table_View').DataTable().row(i).data();
        

        if (txtinn != '') {
            detail_record.push({
                "employeeId": data['employeeId'],
                "inOutCategoryId": txtinoutCategory.val(),
                "checkTime": inn,
                "checkType": "I",
                "menuId": _menuid
            })
        }
        if (txtout != '') {
            detail_record.push({
                "employeeId":data['employeeId'],
                "inOutCategoryId": txtinoutCategory.val(),
                "checkTime": out,
                "checkType": "O",
                "menuId": _menuid
            })
        }


    }
    if (!Boolean(ck)) {
        _cre = JSON.stringify({ "inOutEditorListAddModel": detail_record });
    }
    return { ckval: ck, creteria: _cre };

}

function savrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    // return;

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
                    imgload.show();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        imgload.hide();
                        discon();
                        btnsav.show();
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
                    imgload.hide();
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

    var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
    var txtDateTo1 = moment(txtDateTo.find("input").val()).format("YYYY-MM-DD");

    $.ajax({

        url: apiUrl + '/api/Payroll/v1/LOVServicesPayroll/GetRosterByEmployeeId',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("RosterDate", txtDate1);
            xhr.setRequestHeader("RosterDateTo", txtDateTo1);
            xhr.setRequestHeader("EmployeeId", $("#txt_employee").val());
            imgloadsav.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                $("#txt_inntime").find("input").val(moment(response["data"]["rosterInn"]).format('HH:mm'));
                $("#txt_outtime").find("input").val(moment(response["data"]["rosterOut"]).format('HH:mm'));

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