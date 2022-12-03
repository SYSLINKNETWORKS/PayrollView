
var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}


// var txtdatfrm = $("#txtPerForm");
// var txtdatto = $("#txtPerto");


var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var imgloadpwd = $("#img_load_pwd");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_upd");
var taxid = $("#txt_id");
var DivPasword = $("#div_pwd");
var ApiForm = '';
_Branch_ID = 0;
_Branch_Name = "";
_Role_ID = 0;
_Role_Name = "";
_ItemCat_ID = 0;
_ItemCat_Name = "";
_Employee_ID = 0;
_Employee_Name = "";

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Auth/v1';
    imgload.hide();
    discon();
    // txtdatfrm.datetimepicker({ format: 'DD/MMM/YYYY' });
    // txtdatto.datetimepicker({ format: 'DD/MMM/YYYY' });
    ComponentsDropdowns.init();
});

//#region select 2
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillBranches(); //Fill Select 2 of Branches
        FillRoles(); //Fill Select 2 of Roles
        FillEmployees(); //Fill Select 2 of Employees
        FillItemCategory(); //Fill Select 2 of Itemcategory
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Branches start
function FillBranches() {
    $("#txt_branch").select2({
        placeholder: "Search Branches",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServices/GetBranch',
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

//Roles start
function FillRoles() {
    $("#txt_rol").select2({
        placeholder: "Search Roles",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServices/GetRoles',
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
            var data = { "id": _Role_ID, "text": _Role_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}



$('#txt_rol').on("select2-selected", function (e) {
    _Role_ID = $("#txt_rol").select2('data').id;
});

$('#txt_rol').on("select2-removed", function (e) {
    _Role_ID = "0";
});

//ItemCategory start
function FillItemCategory() {
    $("#txt_itm").select2({
        placeholder: "Search Category",
        //  minimumInputLength: 1,
        triggerChange: true,
        //        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Inventory/v1/LOVServicesItem/GetItemCatgory',
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
            var data = { "id": _ItemCat_ID, "text": _ItemCat_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
$('#txt_itm').on("select2-selected", function (e) {
    _ItemCat_ID = $("#txt_itm").select2('data').id;
});

$('#txt_itm').on("select2-removed", function (e) {
    _ItemCat_ID = "0";
});


function FillEmployees() {
    $("#txt_Emp").select2({
        placeholder: "Search Employees",
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
            var data = { "id": _Employee_ID, "text": _Employee_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_Emp').on("select2-selected", function (e) {
    _Employee_ID = $("#txt_Emp").select2('data').id;
});

$('#txt_Emp').on("select2-removed", function (e) {
    _Employee_ID = "0";
});





function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();
    //var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrm.find("input").val(CurrentDate);
    // txtdatto.find("input").val(CurrentDate);

    var detailsTableBody = $("#RoleSelectTable tbody >tr");
    detailsTableBody.remove();

}

function Onload() {
    $.ajax({
        url: ApiForm + '/User?_MenuId=' + _menuid,
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

                // //Delete
                // if (Boolean(response["data"][0]["deletePermission"])) {
                //     action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                // }
                //Update
                if (Boolean(response["data"][0]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                    action_button += "<a href='#' class='btn-cpwd glyphicon glyphicon-lock' data-toggle='tooltip' title='Change Password'></a> ";
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
                            { data: 'firstName' },

                            { data: 'lastName' },

                            { data: 'email' },

                            { data: 'employee' },
                            { data: 'roleName' },
                            { data: 'itemCategoryName' },

                            { data: 'branchName' },
                            {
                                data: 'active', render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },
                            }

                        ],
                        "order": [[1, "asc"]],
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
    DivPasword.show()
    btnsav.show();
    btnupd.hide();
    var txt_id = $("#txt_id");
    txt_id.html('');
    imgloadsav.hide();
});


function savrec() {

    var ckpass = Passvalidation();
    var ck = ckvalidation();
    var ckval = ck.ckval;
    var valpass = ckpass.ckvalpass;
    if (ckval == 1 || valpass == 1) { return; }
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
                url: ApiForm + '/User',
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
                url: ApiForm + '/User',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnsav.hide();
                    btnupd.hide();
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

}

// // //Delete Start
// $('table').on('click', '.btn-delete', function (e) {
//     e.preventDefault();
//     var currentRow = $(this).closest("tr");
//     var data = $('#Table_View').DataTable().row(currentRow).data();
//     var _id = data['id'];
//     var _name = data['firstName'] + ' ' + data['lastName'];
//     var _type = data['type'];

//     if (_type == "S") {
//         Swal.fire({
//             title: "This is system generated record!",
//             icon: 'warning',
//             showConfirmButton: true,
//             showClass: {
//                 popup: 'animated fadeInDown faster'
//             },
//             hideClass: {
//                 popup: 'animated fadeOutUp faster'
//             }

//         })
//         return;
//     }
//     Swal.fire({
//         title: 'Are sure wants to delete <br> ' + _name + '?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#5cb85c',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Delete',
//         showClass: {
//             popup: 'animated fadeInDown faster'
//         },
//         hideClass: {
//             popup: 'animated fadeOutUp faster'
//         }
//     }).then((result) => {
//         if (result.value) {
//             $.ajax({
//                 url: ApiForm + '/User',
//                 type: "Delete",
//                 contentType: "application/json",
//                 dataType: "json",
//                 data: JSON.stringify({
//                     "ID": _id,
//                     "menu_Id": _menuid
//                 }),
//                 beforeSend: function (xhr) {
//                     xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//                     imgload.show();
//                 },
//                 success: function (response) {

//                     if (response.statusCode == 200) {
//                         imgload.hide();
//                         discon();
//                         Swal.fire({
//                             title: response.message,

//                             icon: 'success',
//                             showConfirmButton: true,

//                             showClass: {
//                                 popup: 'animated fadeInDown faster'
//                             },
//                             hideClass: {
//                                 popup: 'animated fadeOutUp faster'
//                             }

//                         })
//                     }
//                     else {
//                         imgload.hide();
//                         var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
//                         Swal.fire({

//                             title: _title,

//                             icon: 'warning',
//                             showConfirmButton: true,

//                             showClass: {
//                                 popup: 'animated fadeInDown faster'
//                             },
//                             hideClass: {
//                                 popup: 'animated fadeOutUp faster'
//                             }

//                         })
//                     }

//                 },
//                 error: function (xhr, status, err) {
//                     imgloadsav.hide();
//                     btnsav.show();
//                     Swal.fire({
//                         title: xhr.status.toString() + ' ' + err.toString(),

//                         icon: 'error',
//                         showConfirmButton: true,

//                         showClass: {
//                             popup: 'animated fadeInDown faster'
//                         },
//                         hideClass: {
//                             popup: 'animated fadeOutUp faster'
//                         }

//                     })
//                 }
//             })
//         }
//     })
// });
// //Delete End

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _name = data['firstName'] + ' ' + data['lastName'];
    var _type = data['type'];
    DivPasword.hide()
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

                url: ApiForm + '/User/GetUserById',
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
                        $('#txtPerForm').val(response["data"]["permissionFrom"]);
                        $('#txtPerto').val(response["data"]["permissionTo"]);
                        $('#txt_fnam').val(response["data"]["firstName"]);
                        $('#txt_lnam').val(response["data"]["lastName"]);
                        $('#txt_email').val(response["data"]["email"]);
                        $('#txt_pho').val(response["data"]["phoneNumber"]);

                        $('#txt_bcklog').val(response["data"]["backLog"]);

                        //Dropdown
                        _Branch_ID = response["data"]["branchId"];
                        _Branch_Name = response["data"]["branchName"];
                        $('#txt_branch').val(_Branch_ID);
                        $('#txt_branch').trigger('change');

                        _Employee_ID = response["data"]["employeeId"];
                        _Employee_Name = response["data"]["employee"];
                        $('#txt_Emp').val(_Employee_ID);
                        $('#txt_Emp').trigger('change');


                        //Active
                        if (Boolean(response["data"]["active"])) {
                            $("#ddl_active").val(1);
                        } else { $("#ddl_active").val(0); }

                        //All Branches
                        if (Boolean(response["data"]["allBranchCheck"])) {
                            $("#ddl_allbranch").val(1);
                        } else { $("#ddl_allbranch").val(0); }


                        //Required Attendance
                        if (Boolean(response["data"]["ck_RequiredAttandance"])) {
                            $("#ddl_attendancerequired").val(1);
                        } else { $("#ddl_attendancerequired").val(0); }
                        //Online Attendance
                        if (Boolean(response["data"]["ck_OnlineAttandance"])) {
                            $("#ddl_attendanceonline").val(1);
                        } else { $("#ddl_attendanceonline").val(0); }


                        var detailsTableBody = $("#RoleSelectTable tbody");
                        detailsTableBody.empty();
                        const _DetailRecord = response["data"]["userRolesViewModels"];

                        var Roles;
                        for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {

                            Roles += '<tr>' +
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +

                                '<td>' + _DetailRecord[row_cnt]["roleName"] + '</td>' +

                                '</tr>';
                            app_checkid = row_cnt

                        }
                        detailsTableBody.append(Roles);

                        var ItemdetailsTableBody = $("#ItemsCategorySelectTable tbody");
                        ItemdetailsTableBody.empty();
                        const _DetailRecord1 = response["data"]["userItemCategoryViewModels"];

                        var Items;
                        for (var row_cnt = 0; row_cnt < _DetailRecord1.length; row_cnt++) {

                            Items += '<tr>' +
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +

                                '<td style="display:none">' + _DetailRecord1[row_cnt]["itemCategoryId"] + '</td>' +
                                '<td>' + _DetailRecord1[row_cnt]["itemCategoryName"] + '</td>' +

                                '</tr>';

                        }
                        ItemdetailsTableBody.append(Items);

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

//Validation Edit Start
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    // txtPerDateFrom = moment(txtdatfrm.find("input").val()).format("YYYY-MM-DD");
    // txtPerDateTo = moment(txtdatto.find("input").val()).format("YYYY-MM-DD");
    var txtid = $('#txt_id').html();
    var txtbcklog = $("#txt_bcklog");
    var txtfname = $("#txt_fnam");
    var txtlname = $("#txt_lnam");
    var txtemail = $("#txt_email");
    var txtPhone = $("#txt_pho");
    var txtEmployee = $('txt_Emp');
    var txtBranches = $('txt_branch');
    var ConfPass = $("#txt_con_pass");
    var ckActive = false;
    var ckAllbranch = false;
    var reqatt = false;
    var onlineatt = false;

    if ($('#ddl_active').val() == "1") { ckActive = true; };
    if ($('#ddl_allbranch').val() == "1") { ckAllbranch = true; };
    if ($('#ddl_attendancerequired').val() == "1") { reqatt = true; };
    if ($('#ddl_attendanceonline').val() == "1") { onlineatt = true; };


    var _RoleTable = $("#RoleSelectTable tbody >tr");
    const detail_Role = [];

    var _ItemCategoryTable = $("#ItemsCategorySelectTable tbody >tr");
    const detail_itemcate = [];

    function stringHasTheWhiteSpaceOrNot(value) {
        return value.indexOf(' ') >= 0;
    }


    var columns_Role;
    var columns_itemCate;

    if (txtbcklog.val() < 0) {
        ck = 1;
        _Error = 'BackLog should greater then zero';
        txtbcklog.focus();
    }
    if (txtbcklog.val() == '') {
        ck = 1;
        _Error = 'Please enter BackLog';
        txtbcklog.focus();
    }
    if (txtfname.val() == '') {
        ck = 1;
        _Error = 'Please enter First Name';
        txtfname.focus();
    }
    else if (txtlname.val() == '') {
        ck = 1;
        _Error = 'Please enter Last Name ';
        txtlname.focus();
    }
    else if (txtEmployee.val() == '') {
        ck = 1;
        _Error = 'Please Select Employee Name ';
        txtEmployee.focus();
    }
    else if (txtemail.val() == '') {
        ck = 1;
        _Error = 'Please Enter Email';
        txtemail.focus();
    }
    else if (txtPhone.val() == '') {
        ck = 1;
        _Error = 'Please Enter Phone Number ';
        txtPhone.focus();
    }
    else if (txtBranches.val() == '') {
        ck = 1;
        _Error = 'Please Select Branch Name ';
        txtBranches.focus();
    }

    for (var i = 0; i < _RoleTable.length; i++) {
        columns_Role = $(_RoleTable[i]).find('td');
        detail_Role.push({ "roleName": $(columns_Role[1]).html() });
    }

    for (var i = 0; i < _ItemCategoryTable.length; i++) {
        columns_itemCate = $(_ItemCategoryTable[i]).find('td');
        detail_itemcate.push({ "itemCategoryId": $(columns_itemCate[1]).html() });
    }
    // if (detail_itemcate == '') {
    //     ck = 1;
    //     _Error = 'Please select ItemCategory Table ';
    // }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "ID": txtid,
            "firstName": txtfname.val(),
            "lastName": txtlname.val(),
            "email": txtemail.val(),
            "password": ConfPass.val(),
            "branchId": _Branch_ID,
            "employeeid": _Employee_ID,
            "phoneNumber": txtPhone.val(),
            "active": ckActive,
            "backLog": txtbcklog.val(),
            "ck_RequiredAttandance": reqatt,
            "ck_OnlineAttandance": onlineatt,
            "allBranchCheck": ckAllbranch,
            "Type": "U",
            "userRolesList": detail_Role,
            "userItemCategoryViewModels": detail_itemcate,
            "menu_Id": _menuid
        })
    }
    return { ckval: ck, creteria: _cre };
}

function Passvalidation() {

    var pass = 0, _ErrorPass = '';
    var password = $("#txt_pass");
    var ConfPass = $("#txt_con_pass");


    // var password = $("#txt_pass");
    //  var ConfPass = $("#txt_con_pass");
    var passpattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (password.val() == '') {
        pass = 1;
        _ErrorPass = 'Please Enter Password ';
        password.focus();
    }
    else if (ConfPass.val() == '') {
        pass = 1;
        _ErrorPass = 'Please Enter Confirm Password ';
        ConfPass.focus();
    }
    else if (password.val() != ConfPass.val()) {
        pass = 1;
        _ErrorPass = 'Password and Confirm Password is not matched';
        password.focus();
    }
    else if (!password.val().match(passpattern) && !ConfPass.val().match(passpattern)) {
        pass = 1
        _ErrorPass = '"Password Must contain at least one number and one uppercase and lowercase letter, and Minimum 8 characters" ';
        ConfPass.focus();
    }

    if (Boolean(pass)) {
        Swal.fire({
            title: _ErrorPass,
            icon: 'error'
        })

    }
    return { ckvalpass: pass };

}


function ChangePassvalidation() {

    var pass = 0, _ErrorPass = '';
    var password = $("#txt_pwd");
    var ConfPass = $("#txt_con_pwd");


    // var password = $("#txt_pass");
    //  var ConfPass = $("#txt_con_pass");
    var passpattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (password.val() == '') {
        pass = 1;
        _ErrorPass = 'Please Enter Password ';
        password.focus();
    }
    else if (ConfPass.val() == '') {
        pass = 1;
        _ErrorPass = 'Please Enter Confirm Password ';
        ConfPass.focus();
    }
    else if (password.val() != ConfPass.val()) {
        pass = 1;
        _ErrorPass = 'Password and Confirm Password is not matched';
        password.focus();
    }
    else if (!password.val().match(passpattern) && !ConfPass.val().match(passpattern)) {
        pass = 1
        _ErrorPass = '"Password Must contain at least one number and one uppercase and lowercase letter, and Minimum 8 characters" ';
        ConfPass.focus();
    }

    if (Boolean(pass)) {
        Swal.fire({
            title: _ErrorPass,
            icon: 'error'
        })

    }
    return { ckvalpass: pass };

}
//Delete from Table Start
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

$(document).on("click", '#btnAddRole', function () {
    var _Role_Name = $("#txt_rol").val();
    if (_Role_Name != "") {
        var _RoleTable = $("#RoleSelectTable tbody");
        var _RowRole = '<tr>' +
            '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
            '<td>' + $("#txt_rol").select2('data').text + '</td>' +
            '</tr>';
        _RoleTable.append(_RowRole);
        $("#txt_rol").select2('val', '');

    }
    else {
        Swal.fire({
            title: "Please select Role",
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

$(document).on("click", '#btnaddCategory', function () {
    var _ItemCate_Name = $("#txt_itm").val();
    if (_ItemCate_Name != "") {
        var _ItemCategoryTable = $("#ItemsCategorySelectTable tbody");
        var _RowRole = '<tr>' +
            '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
            '<td style="display:none">' + $("#txt_itm").select2('data').id + '</td>' +
            '<td>' + $("#txt_itm").select2('data').text + '</td>' +
            '</tr>';
        _ItemCategoryTable.append(_RowRole);
        $("#txt_itm").select2('val', '');

    }
    else {
        Swal.fire({
            title: "Please select ItemCategory",
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

//Role Select table
//$("body").on("click", "#btnAddRole", function () {
$('#txt_rol').on("select2-selected", function (e) {

});

//Change Password Start
$('table').on('click', '.btn-cpwd', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();

    var _Id = data['id'];
    var _Name = data['firstName'] + ' ' + data['lastName'];
    Swal.fire({
        title: 'Are you sure wants to change password </br> ' + _Name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Change Password',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            imgloadpwd.hide();
            $('#data_Modal_pwd').modal('show');

            $("#txt_id_pwd").html(_Id);
            $("#txt_nam_pwd").html(_Name);

        }
    });

})
//Change Password End

//Discon Password Start
function discon_pwd() {
    document.getElementById('change_form_password').reset();

    $("#txt_id_pwd").html('');
    $("#txt_nam_pwd").html('');
    $("#txt_pwd").html('');
    $("#txt_con_pwd").html('');
    $('#data_Modal_pwd').modal('hide');

    imgloadpwd.hide();
};
//Discon Password End

// Change Password API Start
function changepassword() {

    var ckpass = ChangePassvalidation();

    var valpass = ckpass.ckvalpass;
    if (valpass == 1) { return; }
    Swal.fire({
        title: 'Are you sure you want to change password?',
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

            var urlStr = ApiForm + '/Auth/ForgetPassword';
            $.ajax({
                url: urlStr,
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "ID": $("#txt_id_pwd").html(),
                    "Password": $("#txt_con_pwd").val()
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadpwd.show();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgloadpwd.hide();

                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        discon_pwd();
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
                        imgloadpwd.hide();
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
                    imgloadpwd.hide();
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

// Change Password API End
