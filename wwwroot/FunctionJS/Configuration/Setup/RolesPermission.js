var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_update");

$(document).ready(function () {
    imgload.hide();
    imgloadsav.hide();
    btnnew.hide();
    discon();
    ComponentsDropdowns.init();
});
function discon() {
    var listmodule = $("#list_module")
    listmodule.empty();

    $("#txt_rolename").select2('val', '');
    $("#txt_rolename").html('');

    $("#txt_rolename_copy").select2('val', '');
    $("#txt_rolename_copy").html('');

    imgload.hide();
}



function Onload(txtrolename) {
    var tbl_row_cnt = 1;
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/api/Auth/v1/UserRolePermission/GetUserRolePermissionById?_MenuId=' + _menuid,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_Id", txtrolename.select2('data').id);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var listmodule = $("#list_module")
                listmodule.empty();
                const module_1 = response["data"]["menuPerViews"];
                var module = [];
                for (i = 0; i < module_1.length; i++) {
                    if (module.findIndex(x => x._id == module_1[i].module_Id) == -1) {
                        module.push({ _id: module_1[i].module_Id, _nam: module_1[i].module_Name });
                    }
                }
                module.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                var il_row = "<ul class='nav nav-tabs'>";

                for (var module_cnt = 0; module_cnt < module.length; module_cnt++) {
                    il_row += "<li>";
                    il_row += "<a href='#" + module[module_cnt]["_id"] + "' data-toggle='tab'>";
                    il_row += module[module_cnt]["_nam"];
                    il_row += "</a>";

                    il_row += "</li>";
                }
                il_row += "</ul>";
                il_row += "<div class='tab-content'>";
                const module_1_tab = response["data"]["menuPerViews"];
                var module_tab = [];
                for (i = 0; i < module_1_tab.length; i++) {
                    if (module_tab.findIndex(x => x._id == module_1_tab[i].module_Id) == -1) {
                        module_tab.push({ _id: module_1_tab[i].module_Id, _nam: module_1_tab[i].module_Name });
                    }
                }
                module_tab.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                $("#lbl_modulecount").text(module_tab.length);
                for (var module_cnt = 0; module_cnt < module_tab.length; module_cnt++) {

                    il_row += "<div class='tab-pane fade ' id='" + module_tab[module_cnt]["_id"] + "'>";
                    //il_row += '<table id="tbl' + module[module_cnt]["_id"] + '" class="table table-sm" style="font-size:smaller;">';
                    il_row += '<table id="tbl' + module_cnt + '" class="table table-sm" style="font-size:smaller;">';
                    il_row += '<thead >';
                    il_row += '<tr>' +
                        '<th style="text-align:center;font-weight:bold;">SNo.</th>' +
                        '<th style="text-align:center;font-weight:bold;">Category</th>' +
                        '<th style="text-align:center;font-weight:bold;">Menu</th>' +
                        '<th style="text-align:center;font-weight:bold;"><div class="icheck-inline"><input type="checkbox" id="ck_view_head" name="ck_view_head" onclick="viewhead(' + module_cnt + ')"><br/>View</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div class="icheck-inline"><input type="checkbox" id="ck_new_head" name="ck_new_head" onclick="newhead(' + module_cnt + ')"><br/>New</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div class="icheck-inline"><input type="checkbox" id="ck_update_head" name="ck_update_head" onclick="updatehead(' + module_cnt + ')"><br/>Update</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div class="icheck-inline"><input type="checkbox" id="ck_delete_head" name="ck_delete_head" onclick="deletehead(' + module_cnt + ')"><br/>Delete</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div class="icheck-inline"><input type="checkbox" id="ck_print_head" name="ck_print_head" onclick="printhead(' + module_cnt + ')"><br/>Print</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div class="icheck-inline"><input type="checkbox" id="ck_check_head" name="ck_check_head" onclick="checkhead(' + module_cnt + ')"><br/>Check</div></th>' +
                        '<th style="text-align:center;font-weight:bold;"><div class="icheck-inline"><input type="checkbox" id="ck_approved_head" name="ck_approved_head" onclick="approvedhead(' + module_cnt + ')"><br/>Approved</div></th>' +
                        '</tr>';
                    il_row += '</thead>';
                    il_row += '<tbody>';
                    const _menu = response["data"]["menuPerViews"].filter(d => d.module_Id == module[module_cnt]["_id"]);

                    var _menu_category = [];
                    for (i = 0; i < _menu.length; i++) {
                        if (_menu_category.findIndex(x => x._nam == _menu[i].subCategory_Name) == -1) {
                            _menu_category.push({ _nam: _menu[i].subCategory_Name });
                        }
                    }
                    _menu_category.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                    for (var menucategory_row_cnt = 0; menucategory_row_cnt < _menu_category.length; menucategory_row_cnt++) {
                        //il_row += '<tr><td style="text-align:center;font-weight:bold;">' + _menu_category[menucategory_row_cnt]["_nam"] + '</td></tr>';

                        var _menu_sort = [];
                        for (i = 0; i < _menu.length; i++) {
                            if (_menu_sort.findIndex(x => x._id == _menu[i].menu_Id) == -1) {
                                _menu_sort.push({ _id: _menu[i].menu_Id, _nam: _menu[i].menu_Name });
                            }
                        }
                        _menu_sort.sort((a, b) => (a._nam > b._nam) ? 1 : -1);
                        var sno = 1;
                        for (var menu_row_cnt = 0; menu_row_cnt < _menu_sort.length; menu_row_cnt++) {
                            const _transaction = response["data"]["menuPerViews"].filter(d => d.subCategory_Name == _menu_category[menucategory_row_cnt]["_nam"] && d.menu_Id == _menu_sort[menu_row_cnt]["_id"]);
                            for (var row_cnt = 0; row_cnt < _transaction.length; row_cnt++) {
                                var ckview = '', cknew = '', ckupdate = '', ckdelete = '', ckprint = '', ckapproved = '', ckcheck = '';
                                //New
                                if (Boolean(_transaction[row_cnt]["view_Permission"])) {
                                    ckview = 'checked';
                                }
                                //Save
                                if (Boolean(_transaction[row_cnt]["insert_Permission"])) {
                                    cknew = 'checked';
                                }
                                //Update
                                if (Boolean(_transaction[row_cnt]["update_Permission"])) {
                                    ckupdate = 'checked';
                                }
                                //Delete
                                if (Boolean(_transaction[row_cnt]["delete_Permission"])) {
                                    ckdelete = 'checked';
                                }
                                //Print
                                if (Boolean(_transaction[row_cnt]["print_Permission"])) {
                                    ckprint = 'checked';
                                }

                                //Check
                                if (Boolean(_transaction[row_cnt]["check_Permission"])) {
                                    ckcheck = 'checked';
                                }

                                //Approved
                                if (Boolean(_transaction[row_cnt]["approve_Permission"])) {
                                    ckapproved = 'checked';
                                }

                                il_row += '<tr>' +
                                    '<td hidden id="lbl_MenuId' + module_cnt + '' + menu_row_cnt + '" name="lbl_MenuId">' + _transaction[row_cnt]["menu_Id"] + '</td>' +
                                    '<td>' + sno++ + '</td>' +
                                    '<td>' + _menu_category[menucategory_row_cnt]["_nam"] + '</td>' +
                                    '<td>' + _transaction[row_cnt]["menu_Name"] + '</td>' +
                                    '<td style="text-align:center;">' + '<div class="icheck-inline"><input type="checkbox" id="ck_view' + module_cnt + '' + menu_row_cnt + '" name="ck_view" ' + ckview + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div class="icheck-inline"><input type="checkbox" id="ck_new' + module_cnt + '' + menu_row_cnt + '" name="ck_new" ' + cknew + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div class="icheck-inline"><input type="checkbox" id="ck_update' + module_cnt + '' + menu_row_cnt + '" name="ck_update" ' + ckupdate + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div class="icheck-inline"><input type="checkbox" id="ck_delete' + module_cnt + '' + menu_row_cnt + '" name="ck_delete" ' + ckdelete + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div class="icheck-inline"><input type="checkbox" id="ck_print' + module_cnt + '' + menu_row_cnt + '" name="ck_print" ' + ckprint + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div class="icheck-inline"><input type="checkbox" id="ck_check' + module_cnt + '' + menu_row_cnt + '" name="ck_check" ' + ckcheck + '></div>' + '</td>' +
                                    '<td style="text-align:center;">' + '<div class="icheck-inline"><input type="checkbox" id="ck_approved' + module_cnt + '' + menu_row_cnt + '" name="ck_approved" ' + ckapproved + '></div>' + '</td>' +
                                    '</tr>';


                            }
                        }
                    }
                    il_row += '</tbody>';
                    il_row += '</table>';

                    il_row += "</div>";
                }
                il_row += "</div>";
                il_row += "<div class='clearfix margin-bottom-20'>";
                il_row += "</div>";

                listmodule.append(il_row);
                imgload.hide();

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

//Validation Start
function ckvalidation() {
    var txtrolename = $("#txt_rolename");
    var modulecount = $("#lbl_modulecount").text();
    const detail_record = [];
    var ck = 0;

    if (txtrolename.val() == "") {
        ck = 1;
        _Error = "Please select role";
        txtrolename.focus();
    }
    else if (modulecount == 0) {
        ck = 1;
        _Error = "Module not found";
        txtrolename.focus();

    }
    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else {
        for (var tcount = 0; tcount < modulecount; tcount++) {
            var rows_create = $("#tbl" + tcount + " tbody >tr");
            for (var i = 0; i < rows_create.length; i++) {
                var _MenuId = $("#lbl_MenuId" + tcount + i).html();
                if (_MenuId != 'undefined') {
                    detail_record.push({
                        "roles_Id": txtrolename.select2('data').id,
                        "menu_Id": $("#lbl_MenuId" + tcount + i).html(),
                        "view_Permission": $("#ck_view" + tcount + i).iCheck('Update')[0].checked,
                        "insert_Permission": $("#ck_new" + tcount + i).iCheck('Update')[0].checked,
                        "update_Permission": $("#ck_update" + tcount + i).iCheck('Update')[0].checked,
                        "delete_Permission": $("#ck_delete" + tcount + i).iCheck('Update')[0].checked,
                        "print_Permission": $("#ck_print" + tcount + i).iCheck('Update')[0].checked,
                        "check_Permission": $("#ck_check" + tcount + i).iCheck('Update')[0].checked,
                        "approved_Permission": $("#ck_approved" + tcount + i).iCheck('Update')[0].checked
                    });
                }
            }
        }
    }
    return { ckval: ck, detailrecord: detail_record };
}
//Validation End


function savrec() {
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
            var ck = ckvalidation();
            var ckval = ck.ckval;
            if (ckval == 1) { return; }
            detailrecord = ck.detailrecord;
            var urlStr = apiUrl + '/api/Auth/v1/UserRolePermission';

            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "userRolePermissions": detailrecord
                }),
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
                        $('#create_data_Modal').modal('hide');
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

//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {
        FillRoles($("#txt_rolename"));
        FillRoles($("#txt_rolename_copy"));
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Fill User Group Start
function FillRoles(txtrolename) {
    txtrolename.select2({
        placeholder: "Search for a Roles",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Auth/v1/LOVServices/GetRoles',
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
//Fill  User Group End
//Trigger after Selection Start
$('#txt_rolename').on("select2-selected", function (e) {
    Onload($('#txt_rolename'));
});

$('#txt_rolename_copy').on("select2-selected", function (e) {
    Onload($('#txt_rolename_copy'));
});

$('#txt_rolename').on("select2-removed", function (e) {
    var listmodule = $("#list_module")
    listmodule.empty();

});

function viewhead(tcount) {
    var ckviewhead = document.getElementsByName("ck_view_head");
    //var ckview = document.getElementsByName("ck_view");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_view" + tcount + i).iCheck('Update')[0].checked = Boolean(ckviewhead[tcount].checked);
    }
}

function newhead(tcount) {
    var cknewhead = document.getElementsByName("ck_new_head");
    //var cknew = document.getElementsByName("ck_new");
    //  var ckcnt = 0;
    //var modulecount = $("#lbl_modulecount").text();
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_new" + tcount + i).iCheck('Update')[0].checked = Boolean(cknewhead[tcount].checked);
    }
    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         cknew[ckcnt].checked = Boolean(cknewhead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }


}


function updatehead(tcount) {
    var ckupdatehead = document.getElementsByName("ck_update_head");
    //var ckupdate = document.getElementsByName("ck_update");
    //var ckcnt = 0;
    //var modulecount = $("#lbl_modulecount").text();
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_update" + tcount + i).iCheck('Update')[0].checked = Boolean(ckupdatehead[tcount].checked);
    }
    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         ckupdate[ckcnt].checked = Boolean(ckupdatehead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }
}

function deletehead(tcount) {
    var ckdeletehead = document.getElementsByName("ck_delete_head");

    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_delete" + tcount + i).iCheck('Update')[0].checked = Boolean(ckdeletehead[tcount].checked);
    }
    //var ckdelete = document.getElementsByName("ck_delete");

    // //var ckcnt = 0;
    // var modulecount = $("#lbl_modulecount").text();

    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         ckdelete[ckcnt].checked = Boolean(ckdeletehead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }
}

function printhead(tcount) {
    var ckprinthead = document.getElementsByName("ck_print_head");

    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_print" + tcount + i).iCheck('Update')[0].checked = Boolean(ckprinthead[tcount].checked);
    }
    //var ckprint = document.getElementsByName("ck_print");

    //var ckcnt = 0;
    //var modulecount = $("#lbl_modulecount").text();

    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         ckprint[ckcnt].checked = Boolean(ckprinthead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }
}


function checkhead(tcount) {
    var ckcheckhead = document.getElementsByName("ck_check_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_check" + tcount + i).iCheck('Update')[0].checked = Boolean(ckcheckhead[tcount].checked);
    }

    // var ckcheck = document.getElementsByName("ck_check");
    // var ckcnt = 0;
    // var modulecount = $("#lbl_modulecount").text();

    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         ckcheck[ckcnt].checked = Boolean(ckcheckhead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }
}

function approvedhead(tcount) {
    var ckapprovedhead = document.getElementsByName("ck_approved_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_approved" + tcount + i).iCheck('Update')[0].checked = Boolean(ckapprovedhead[tcount].checked);
    }


    // var ckapproved = document.getElementsByName("ck_approved");
    // var ckcnt = 0;
    // var modulecount = $("#lbl_modulecount").text();

    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         ckapproved[ckcnt].checked = Boolean(ckapprovedhead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }
}

function cancelhead(tcount) {
    var ckcancelhead = document.getElementsByName("ck_cancel_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_cancel" + tcount + i).iCheck('Update')[0].checked = Boolean(ckcancelhead[tcount].checked);
    }


    // var ckcancel = document.getElementsByName("ck_cancel");
    // var ckcnt = 0;
    // var modulecount = $("#lbl_modulecount").text();

    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         ckcancel[ckcnt].checked = Boolean(ckcancelhead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }
}

function taxhead(tcount) {
    var cktaxhead = document.getElementsByName("ck_tax_head");
    var rows_create = $("#tbl" + tcount + " tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        $("#ck_tax" + tcount + i).iCheck('Update')[0].checked = Boolean(cktaxhead[tcount].checked);
    }

    // var cktax = document.getElementsByName("ck_tax");
    // var ckcnt = 0;
    // var modulecount = $("#lbl_modulecount").text();

    // for (var _module_cnt = 0; _module_cnt < modulecount; _module_cnt++) {

    //     var rows_create = $("#tbl" + _module_cnt + " tbody >tr");
    //     for (var i = 0; i < rows_create.length; i++) {
    //         cktax[ckcnt].checked = Boolean(cktaxhead[_module_cnt].checked);
    //         ckcnt++;
    //     }
    // }
}


