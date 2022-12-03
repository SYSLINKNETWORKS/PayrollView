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
var txtid='';
var txtdat = $("#txt_dat");

var txtmonintime = $("#txt_monintime");
var txtmonouttime = $("#txt_monouttime");

var txttusintime = $("#txt_tusintime");
var txttusouttime = $("#txt_tusouttime");

var txtwedintime = $("#txt_wedintime");
var txtwedouttime = $("#txt_wedouttime");

var txtthrintime = $("#txt_thrintime");
var txtthrouttime = $("#txt_throuttime");

var txtFriintime = $("#txt_Friintime");
var txtFriouttime = $("#txt_Friouttime");

var txtSatintime = $("#txt_Satintime");
var txtSatouttime = $("#txt_Satouttime");

var txtSunintime = $("#txt_Sunintime");
var txtSunouttime = $("#txt_Sunouttime");

var _Roster_ID = 0;
var _Roster_Name = '';

var txtdate = '';
var txtlatcom = '';
var txtEargo = '';
var txtovtimaft = '';
var txtwrkhr = '';
var txtmorwrkhr = '';
var txtevwrkhr = '';
var txtevwrkhr = '';

var ckmon;
var txtmondayintime = '';
var txtmondayouttime = '';

var cktus;
var txttuesdayintime = '';
var txttuesdatouttime = '';

var ckWed;
var txtwednesdayintime = '';
var txtwednesdayouttime = '';

var ckthurs;
var txtthursdayintime = '';
var txtthursdayouttime = '';

var ckFri;
var txtFridayintime;
var txtFridayouttime;

var ckSat;
var txtSaturdayintime = '';
var txtSaturdayouttime = '';

var ckSun;
var txtSundayintime = '';
var txtSundayouttime = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1';
    imgload.hide();
    discon();
});

var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        FillRoster();   //Fill Select 2 of Roster
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

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

$(function () {
    txtdat.datetimepicker({ format: 'DD/MMM/YYYY' });

    txtmonintime.datetimepicker({ format: 'HH:mm' });
    txtmonouttime.datetimepicker({ format: 'HH:mm' });
    txttusintime.datetimepicker({ format: 'HH:mm' });
    txttusouttime.datetimepicker({ format: 'HH:mm' });
    txtwedintime.datetimepicker({ format: 'HH:mm' });
    txtwedouttime.datetimepicker({ format: 'HH:mm' });
    txtthrintime.datetimepicker({ format: 'HH:mm' });
    txtthrouttime.datetimepicker({ format: 'HH:mm' });
    txtFriintime.datetimepicker({ format: 'HH:mm' });
    txtFriouttime.datetimepicker({ format: 'HH:mm' });
    txtSatintime.datetimepicker({ format: 'HH:mm' });
    txtSatouttime.datetimepicker({ format: 'HH:mm' });
    txtSunintime.datetimepicker({ format: 'HH:mm' });
    txtSunouttime.datetimepicker({ format: 'HH:mm' });
});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    var CurrentTime = moment(new Date()).format("HH:mm");
    txtdat.find("input").val(CurrentDate);

    txtmonintime.find("input").val(CurrentTime);
    txtmonouttime.find("input").val(CurrentTime);
    txttusintime.find("input").val(CurrentTime);
    txttusouttime.find("input").val(CurrentTime);
    txtwedintime.find("input").val(CurrentTime);
    txtwedouttime.find("input").val(CurrentTime);
    txtthrintime.find("input").val(CurrentTime);
    txtthrouttime.find("input").val(CurrentTime);
    txtFriintime.find("input").val(CurrentTime);
    txtFriouttime.find("input").val(CurrentTime);
    txtSatintime.find("input").val(CurrentTime);
    txtSatouttime.find("input").val(CurrentTime);
    txtSunintime.find("input").val(CurrentTime);
    txtSunouttime.find("input").val(CurrentTime);

    ComponentsDropdowns.init();
}

function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/RosterGroup?_MenuId=' + _menuid,
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

                            { data: 'roster' },
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },
                            { data: 'late' },
                            { data: 'overtime' },
                            { data: 'workingHours' }

                        ],
                        "order": [[3, "desc"]],
                        "pageLength": 10,

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

function gettextboxValue() {
    
    txtid = $('#txt_id').html();
    txtdate = moment(txtdat.find("input").val()).format("YYYY-MM-DD")
    txtlatcom = $("#txt_latcom").val();
    txtEargo = $("#txt_Eargo").val();
    txtovtimaft = $("#txt_ovtimaft").val();
    txtwrkhr = $("#txt_wrkhr").val();
    txtmorwrkhr = $("#txt_morwrkhr").val();
    txtevwrkhr = $("#txt_evwrkhr").val();

    var mon =txtdate+'T'+moment(txtmonintime.find("input").val())._i;//moment(txtmonintime.find("input").val()).format("HH:mm");
    ckmon = $('#ck_mon').iCheck('update')[0].checked;
    txtmondayintime = txtdate+'T'+moment(txtmonintime.find("input").val())._i;
    txtmondayouttime = txtdate+'T'+moment(txtmonouttime.find("input").val())._i;
    

    cktus = $('#ck_tus').iCheck('update')[0].checked;
    txttuesdayintime = txtdate+'T'+moment(txttusintime.find("input").val())._i;
    txttuesdatouttime = txtdate+'T'+moment(txttusouttime.find("input").val())._i;
    

    ckWed = $('#ck_Wed').iCheck('update')[0].checked;
    txtwednesdayintime = txtdate+'T'+moment(txtwedintime.find("input").val())._i;
    txtwednesdayouttime = txtdate+'T'+moment(txtwedouttime.find("input").val())._i;
    

    ckthurs = $('#ck_thurs').iCheck('update')[0].checked;
    txtthursdayintime = txtdate+'T'+moment(txtthrintime.find("input").val())._i;
    txtthursdayouttime = txtdate+'T'+moment(txtthrouttime.find("input").val())._i;


    ckFri = $('#ck_Fri').iCheck('update')[0].checked;
    txtFridayintime = txtdate+'T'+moment(txtFriintime.find("input").val())._i;
    txtFridayouttime = txtdate+'T'+moment(txtFriouttime.find("input").val())._i;
    

    ckSat = $('#ck_Sat').iCheck('update')[0].checked;
    txtSaturdayintime = txtdate+'T'+moment(txtSatintime.find("input").val())._i;
    txtSaturdayouttime = txtdate+'T'+moment(txtSatouttime.find("input").val())._i;
    

    ckSun = $('#ck_Sun').iCheck('update')[0].checked;
    txtSundayintime=txtdate+'T'+moment(txtSunintime.find("input").val())._i;
    txtSundayouttime = txtdate+'T'+moment(txtSunouttime.find("input").val())._i;
    

}

function savrec() {
    gettextboxValue();
    var cre = JSON.stringify({
        "date": txtdate,
        "rosterId":_Roster_ID,
        "late": txtlatcom,
        "earlyGoing": txtEargo,
        "overtime": txtovtimaft,
        "workingHours": txtwrkhr,
        "morningWorkingHours": txtmorwrkhr,
        "eveningWorkingHours": txtevwrkhr,
        "mondayCheck": ckmon,
        "mondayInn": txtmondayintime,
        "mondayOut": txtmondayouttime,
        "tuesdayCheck": cktus,
        "tuesdayInn": txttuesdayintime,
        "tuesdayOut": txttuesdatouttime,
        "wednesdayCheck": ckWed,
        "wednesdayInn": txtwednesdayintime,
        "wednesdayOut": txtwednesdayouttime,
        "thursdayCheck": ckthurs,
        "thursdayInn": txtthursdayintime,
        "thursdayOut": txtthursdayouttime,
        "fridayCheck": ckFri,
        "fridayInn": txtFridayintime,
        "fridayOut": txtFridayouttime,
        "saturdayCheck": ckSat,
        "saturdayInn": txtSaturdayintime,
        "saturdayOut": txtSaturdayouttime,
        "sundayCheck": ckSun,
        "sundayInn": txtSundayintime,
        "sundayOut": txtSundayouttime,
        "type": "U",
        "active": true,
        "menu_Id": _menuid
    });
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
                url: ApiForm + '/RosterGroup',
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: cre,
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

function updrec() {
    
    gettextboxValue();
    var cre = JSON.stringify({
        "Id": txtid,
        "date": txtdate,
        "rosterid":_Roster_ID,
        "late": txtlatcom,
        "earlyGoing": txtEargo,
        "overtime": txtovtimaft,
        "workingHours": txtwrkhr,
        "morningWorkingHours": txtmorwrkhr,
        "eveningWorkingHours": txtevwrkhr,
        "mondayCheck": ckmon,
        "mondayInn": txtmondayintime,
        "mondayOut": txtmondayouttime,
        "tuesdayCheck": cktus,
        "tuesdayInn": txttuesdayintime,
        "tuesdayOut": txttuesdatouttime,
        "wednesdayCheck": ckWed,
        "wednesdayInn": txtwednesdayintime,
        "wednesdayOut": txtwednesdayouttime,
        "thursdayCheck": ckthurs,
        "thursdayInn": txtthursdayintime,
        "thursdayOut": txtthursdayouttime,
        "fridayCheck": ckFri,
        "fridayInn": txtFridayintime,
        "fridayOut": txtFridayouttime,
        "saturdayCheck": ckSat,
        "saturdayInn": txtSaturdayintime,
        "saturdayOut": txtSaturdayouttime,
        "sundayCheck": ckSun,
        "sundayInn": txtSundayintime,
        "sundayOut": txtSundayouttime,
        "type": "U",
        "active": true,
        "menu_Id": _menuid
    });

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
                url: ApiForm + '/RosterGroup',
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
                url: ApiForm + '/RosterGroup',
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
    var _name = data['roster'];
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

                url: ApiForm + '/RosterGroup/GetRosterGroupById',
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
                        txtdat.find("input").val(moment(response["data"]["date"]).format('DD/MMM/YYYY'));
                        _Roster_ID = response["data"]["rosterId"];
                        _Roster_Name = response["data"]["rosterName"];
                        $('#txt_roster').val(_Roster_ID); // Select the option with a value of '1'
                        $('#txt_roster').trigger('change'); // Notify any JS components that the value changed
                        $('#txt_latcom').val(response["data"]["late"]);
                        $('#txt_Eargo').val(response["data"]["earlyGoing"]);
                        $('#txt_ovtimaft').val(response["data"]["overtime"]);
                        $('#txt_wrkhr').val(response["data"]["workingHours"]);
                        $('#txt_morwrkhr').val(response["data"]["morningWorkingHours"]);
                        $('#txt_evwrkhr').val(response["data"]["eveningWorkingHours"]);

                        if (!response["data"]["mondayCheck"]) {
                            $('#ck_mon').iCheck('uncheck');
                        } else { $('#ck_mon').iCheck('check'); }
                        txtmonintime.find("input").val(moment(response["data"]["mondayInn"]).format('HH:mm'));
                        txtmonouttime.find("input").val(moment(response["data"]["mondayOut"]).format('HH:mm'));

                        if (!response["data"]["tuesdayCheck"]) {
                            $('#ck_tus').iCheck('uncheck');
                        } else { $('#ck_tus').iCheck('check'); }
                        txttusintime.find("input").val(moment(response["data"]["tuesdayInn"]).format('HH:mm'));
                        txttusouttime.find("input").val(moment(response["data"]["tuesdayOut"]).format('HH:mm'));

                        if (!response["data"]["wednesdayCheck"]) {
                            $('#ck_Wed').iCheck('uncheck');
                        } else { $('#ck_Wed').iCheck('check'); }
                        txtwedintime.find("input").val(moment(response["data"]["wednesdayInn"]).format('HH:mm'));
                        txtwedouttime.find("input").val(moment(response["data"]["wednesdayOut"]).format('HH:mm'));

                        if (!response["data"]["thursdayCheck"]) {
                            $('#ck_thurs').iCheck('uncheck');
                        } else { $('#ck_thurs').iCheck('check'); }
                        txtthrintime.find("input").val(moment(response["data"]["thursdayInn"]).format('HH:mm'));
                        txtthrouttime.find("input").val(moment(response["data"]["thursdayOut"]).format('HH:mm'));

                        if (!response["data"]["fridayCheck"]) {
                            $('#ck_Fri').iCheck('uncheck');
                        } else { $('#ck_Fri').iCheck('check'); }
                        txtFriintime.find("input").val(moment(response["data"]["fridayInn"]).format('HH:mm'));
                        txtFriouttime.find("input").val(moment(response["data"]["fridayOut"]).format('HH:mm'));

                        if (!response["data"]["saturdayCheck"]) {
                            $('#ck_Sat').iCheck('uncheck');
                        } else { $('#ck_Sat').iCheck('check'); }
                        txtSatintime.find("input").val(moment(response["data"]["saturdayInn"]).format('HH:mm'));
                        txtSatouttime.find("input").val(moment(response["data"]["saturdayOut"]).format('HH:mm'));

                        if (!response["data"]["sundayCheck"]) {
                            $('#ck_Sun').iCheck('uncheck');
                        } else { $('#ck_Sun').iCheck('check'); }
                        txtSunintime.find("input").val(moment(response["data"]["sundayInn"]).format('HH:mm'));
                        txtSunouttime.find("input").val(moment(response["data"]["sundayOut"]).format('HH:mm'));

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