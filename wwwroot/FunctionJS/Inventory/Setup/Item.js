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

var _itemcategoryclassification_Id = 0;
var _itemcategoryclassification_Name = '';
var _ItemSubCategory_Id = 0;
var _ItemSubCategory_Name = '';
var _Brand_Id = 0;
var _Brnad_Name = '';
var _InnerScale_Id = 0;
var _InnerScale_Name = '';
var _ManufactureScale_Id = 0;
var _ManufactureScale_Name = '';
var _MasterScale_Id = 0;
var _MasterScale_Name = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Inventory/v1';
    imgload.hide();
    discon();

    ComponentsDropdowns.init();
});

//#region select 2
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        Fillitemcategoryclassification();   //Fill Select 2 of ItemCategories
        FillItemSubCategory();   //Fill Select 2 of ItemSubCategories
        FillBrand();  //Fill Select 2 of Brand
        FillMasterScale();  //Fill Select 2 of MasterScale
        FillManufactureScale();  //Fill Select 2 of ManufactureSacle
        FillInnerScale();  //Fill Select 2 of InnerScale
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();

function Fillitemcategoryclassification() {
    $("#txt_itemcategoryclassification").select2({
        placeholder: "Search Item Category Classification",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesItem/GetItemCatgoryClassificationUserWise',
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
            var data = { "id": _itemcategoryclassification_Id, "text": _itemcategoryclassification_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_itemcategoryclassification').on("select2-selected", function (e) {
    _itemcategoryclassification_Id = $("#txt_itemcategoryclassification").select2('data').id;
});

$('#txt_itemcategoryclassification').on("select2-removed", function (e) {
    _itemcategoryclassification_Id = "0";

});

function FillItemSubCategory() {
    $("#txt_itemsubcategories").select2({
        placeholder: "Search Item Sub Categories",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesItem/GetItemSubCatgory',
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
            var data = { "id": _ItemSubCategory_Id, "text": _ItemSubCategory_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_itemsubcategories').on("select2-selected", function (e) {
    _ItemSubCategory_Id = $("#txt_itemsubcategories").select2('data').id;
});

$('#txt_itemsubcategories').on("select2-removed", function (e) {
    _ItemSubCategory_Id = "0";

});

function FillBrand() {
    $("#txt_brand").select2({
        placeholder: "Search Brand",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesItem/Getbrand',
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
            var data = { "id": _Brand_Id, "text": _Brnad_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_brand').on("select2-selected", function (e) {
    _Brand_Id = $("#txt_brand").select2('data').id;
});

$('#txt_brand').on("select2-removed", function (e) {
    _Brand_Id = "0";

});


function FillInnerScale() {
    $("#txt_innerscale").select2({
        placeholder: "Inner Scale",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesItem/GetScale',
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
            var data = { "id": _InnerScale_Id, "text": _InnerScale_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_innerscale').on("select2-selected", function (e) {
    _InnerScale_Id = $("#txt_innerscale").select2('data').id;
});

$('#txt_innerscale').on("select2-removed", function (e) {
    _InnerScale_Id = "0";

});


function FillManufactureScale() {
    $("#txt_mqty_scale").select2({
        placeholder: "Manufacture Scale",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesItem/GetScale',
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
            var data = { "id": _ManufactureScale_Id, "text": _ManufactureScale_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_mqty_scale').on("select2-selected", function (e) {
    _ManufactureScale_Id = $("#txt_mqty_scale").select2('data').id;
});

$('#txt_mqty_scale').on("select2-removed", function (e) {
    _ManufactureScale_Id = "0";

});



function FillMasterScale() {
    $("#txt_masterscale").select2({
        placeholder: "Master Scale",
        //  minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: ApiForm + '/LOVServicesItem/GetScale',
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
            var data = { "id": _MasterScale_Id, "text": _MasterScale_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_masterscale').on("select2-selected", function (e) {
    _MasterScale_Id = $("#txt_masterscale").select2('data').id;
});

$('#txt_masterscale').on("select2-removed", function (e) {
    _MasterScale_Name = "0";

});


function discon() {
    document.getElementById('create_form').reset();
    $('#txt_id').html('');
    $('#ck_active').iCheck('update')[0].checked;
    $('#ck_active').iCheck('check'); //To check the radio button
    var detailsTableBody = $("#DescriptionTable tbody");
    detailsTableBody.empty();
    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();
}


function Onload() {
    var tbl_row_cnt = 1;
    $.ajax({
        url: ApiForm + '/Item',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
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
                            { data: 'categoryClassificationName' },
                            {
                                data: null,
                                render: function (data) {
                                    return data.subCategoryMasterName + ' ' + data.subCategoryName;
                                },
                            },
                            { data: 'brandName' },
                            { data: 'name' },
                            {
                                data: 'active',
                                render: function (data) {
                                    return data == true ? 'Yes' : 'No'
                                },
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
                        "order": [[4, "asc"], [5, "asc"]],
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
    $('#txt_id').html("");

    $("#ck_active").iCheck('Update')[0].checked;
    $("#ck_active").iCheck('uncheck');
    $('#txt_itemcategoryclassification').select2('val', '');
    $('#txt_itemsubcategories').select2('val', '');
    $('#txt_brand').select2('val', '');
    $('#txt_name').val('');
    $('#txt_qty').val('0');
    $('#txt_innerscale').select2('val', '');
    $('#txt_masterqty').val('0');
    $('#txt_masterscale').select2('val', '');
    $('#txt_mqty').val('0');
    $('#txt_mqty_scale').select2('val', '');
    $('#txt_minqty').val('0');
    $('#txt_reorderqty').val('0');
    $('#txt_height').val('0');
    $('#txt_width').val('0');
    $('#txt_weight').val('0');
    $('#select_paperscale').select2('val', '');


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
                url: ApiForm + '/Item',
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
    var _cre = ck.creteria;

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
                url: ApiForm + '/Item',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
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
                url: ApiForm + '/Item',
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
                url: ApiForm + '/Item/GetItemById',
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
                        $('#txt_name').val(response["data"]["name"]);
                        $('#txt_qty').val(response["data"]["qty"]);
                        $('#txt_masterqty').val(response["data"]["masterQty"]);
                        $('#txt_mqty').val(response["data"]["manufacturerQty"]);
                        $('#txt_minqty').val(response["data"]["minQty"]);
                        $('#txt_reorderqty').val(response["data"]["reOrderQty"]);
                        $('#select_paperscale').val(response["data"]["paperScale"]);
                        $('#txt_height').val(response["data"]["hight"]);
                        $('#txt_width').val(response["data"]["width"]);
                        $('#txt_weight').val(response["data"]["weight"]);


                        _itemcategoryclassification_Id = response["data"]["itemCategoryClassificationId"];
                        _itemcategoryclassification_Name = response["data"]["itemCategoryClassificationName"];
                        $('#txt_itemcategoryclassification').val(_itemcategoryclassification_Id); // Select the option with a value of '1'
                        $('#txt_itemcategoryclassification').trigger('change'); // Notify any JS components that the value changed


                        _ItemSubCategory_Id = response["data"]["itemSubCategoryId"];
                        _ItemSubCategory_Name = response["data"]["itemSubCategoryName"];
                        $('#txt_itemsubcategories').val(_itemcategoryclassification_Id); // Select the option with a value of '1'
                        $('#txt_itemsubcategories').trigger('change'); // Notify any JS components that the value changed

                        _Brand_Id = response["data"]["brandId"];
                        _Brnad_Name = response["data"]["brandName"];
                        $('#txt_brand').val(_ItemSubCategory_Id); // Select the option with a value of '1'
                        $('#txt_brand').trigger('change'); // Notify any JS components that the value changed

                        _InnerScale_Id = response["data"]["innerscaleId"];
                        _InnerScale_Name = response["data"]["innerScale"];
                        $('#txt_innerscale').val(_InnerScale_Id); // Select the option with a value of '1'
                        $('#txt_innerscale').trigger('change'); // Notify any JS components that the value changed

                        _MasterScale_Id = response["data"]["masterScaleId"];
                        _MasterScale_Name = response["data"]["masterScale"];
                        $('#txt_masterscale').val(_MasterScale_Id); // Select the option with a value of '1'
                        $('#txt_masterscale').trigger('change'); // Notify any JS components that the value changed

                        _ManufactureScale_Id = response["data"]["manufactureScaleId"];
                        _ManufactureScale_Name = response["data"]["manufactureScale"];
                        $('#txt_mqty_scale').val(_ManufactureScale_Id); // Select the option with a value of '1'
                        $('#txt_mqty_scale').trigger('change'); // Notify any JS components that the value changed

                        if (!response["data"]["active"]) {
                            $('#ck_active').iCheck('uncheck');
                        } else { $('#ck_active').iCheck('check'); }

                        var detailsTableBody = $("#DescriptionTable tbody");
                        detailsTableBody.empty();
                        const _DetailRecord = response["data"]["itemDescriptionListViewModel"];

                        var productItem;
                        for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {
                            productItem += '<tr>' +
                                //                               
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                                '<td>' + _DetailRecord[row_cnt]["description"] + '</td>' +
                                '</tr>';
                            app_checkid = row_cnt
                        }
                        detailsTableBody.append(productItem);

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

function ckvalidation() {



    var ck = 0, _Error = '', _cre = '';
    var txtid = $('#txt_id').html();
    var txtname = $('#txt_name');
    var ddlitemcategoryclassification = $('#txt_itemcategoryclassification');
    var ddlbrand = $('#txt_brand');
    var ddlitemSubcategory = $('#txt_itemsubcategories');
    var txtqty = $('#txt_qty');
    var ddlinnserscale = $('#txt_innerscale');
    var txtmasterqty = $('#txt_masterqty');
    var ddlmasterscale = $('#txt_masterscale');
    var txtmanufactureqty = $('#txt_mqty');
    var ddlmmanufacturescale = $('#txt_mqty_scale');
    var txtminqty = $('#txt_minqty');
    var txtreorderqty = $('#txt_reorderqty');
    var txtheight = $('#txt_height');
    var ddlpaperscale = $('#select_paperscale');
    var txtwidth = $('#txt_width');
    var txtweight = $('#txt_weight');

    var _DesTable = $("#DescriptionTable tbody >tr");
    const detail_Des = [];


    var columns_Des;
    for (var i = 0; i < _DesTable.length; i++) {
        columns_Des = $(_DesTable[i]).find('td');

        detail_Des.push({
            "description": $(columns_Des[1]).html(),
        });
    }

    ck_active = $("#ck_active").iCheck('Update')[0].checked;

    if (txtname.val() == '') {
        ck = 1;
        _Error = 'Please Enter Name';
        txtname.focus();
    }

    if (ddlbrand.val() == '') {
        ck = 1;
        _Error = 'Please Select brand';
        ddlbrand.focus();
    }

    if (ddlitemcategoryclassification.val() == '') {
        ck = 1;
        _Error = 'Please Select item Category';
        ddlitemcategoryclassification.focus();
    }

    if (ddlitemSubcategory.val() == '') {
        ck = 1;
        _Error = 'Please Select item Sub Category';
        ddlitemSubcategory.focus();
    }

    if (ddlinnserscale.val() == '') {
        ck = 1;
        _Error = 'Please Select Inner Scale';
        ddlinnserscale.focus();
    }

    if (ddlmasterscale.val() == '') {
        ck = 1;
        _Error = 'Please Select Master Scale';
        ddlmasterscale.focus();
    }

    if (ddlmmanufacturescale.val() == '') {
        ck = 1;
        _Error = 'Please Select Manufacture Scale';
        ddlmmanufacturescale.focus();
    }

    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "ID": txtid,
            "name": txtname.val(),
            "qty": txtqty.val(),
            "masterQty": txtmasterqty.val(),
            "minQty": txtminqty.val(),
            "manufacturerQty": txtmanufactureqty.val(),
            "reOrderQty": txtreorderqty.val(),
            "hight": txtheight.val(),
            "width": txtwidth.val(),
            "weight": txtweight.val(),
            "paperScale": ddlpaperscale.val(),
            "itemcategoryclassificationId": _itemcategoryclassification_Id,
            "itemSubCategoryId": _ItemSubCategory_Id,
            "brandId": _Brand_Id,
            "innerscaleId": _InnerScale_Id,
            "manufactureScaleId": _ManufactureScale_Id,
            "masterScaleId": _MasterScale_Id,
            "itemDescriptionListViewModel": detail_Des,
            "active": ck_active,
            "type": "U",
            "menu_Id": _menuid
        });
    }
    return { ckval: ck, creteria: _cre };
}

$("body").on("click", "#btnAddDes", function () {

    var _RoleTable = $("#DescriptionTable tbody");
    var des = $("#txt_description").val();;


    var _RowRole = '<tr>' +
        '<td style="width:150px;"><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
        '<td>' + des + '</td>' +
        '</tr>';
    _RoleTable.append(_RowRole);
    $("#txt_description").val('');
});

//Delete from Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    Swal.fire({
        text: "Are sure wants to delete",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            e.preventDefault();
            var $self = $(this);
            if ($(this).attr('data-itemId') == "0") {
                $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
                    $(this).remove();
                });
            }
        }
    })
});
//Delete from Table End

function PaperCalculation() {
    var _sizex = $('#txt_height').val();
    var _sizey = $('#txt_width').val();
    var _weight = $('#txt_weight').val();
    var _paperscale = $('#select_paperscale').val() == 'inch' ? 15500 : $('#select_paperscale').val() == 'mm' ? 10000000 : 0;
    var _calculate = (_sizex * _sizey * _weight) / _paperscale;

    $("#txt_mqty").val(_calculate);


}

