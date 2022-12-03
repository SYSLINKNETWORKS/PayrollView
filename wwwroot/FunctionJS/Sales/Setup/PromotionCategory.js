
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
$(document).ready(function () {
    imgload.hide();
    discon();
});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    $('#txt_id').html('');
    $("#ck_active").iCheck('Update')[0].unchecked;
    $('#ck_active').iCheck('check'); //To check the radio button

    Onload();
    imgload.hide();
}
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/Sales/Setup/PromotionCategory/GetPromotionCategory',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Menu": _menid }),
        beforeSend: function () {
            imgload.show();

        },
        success: function (response) {
            var action_button = ' ';
            //New
            if (response[0]["Result"][0]["Permission_New"] == 'True') {
                btnnew.show();
            }

            //Delete
            if (response[0]["Result"][0]["Permission_Delete"] == 'True') {
                action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
            }
            //Update
            if (response[0]["Result"][0]["Permission_Update"] == 'True') {
                action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
            }

            var jres = response;

            if (jres[0].status == 1) {
                var json = response[0]["Result"];
                $('#Table_View').DataTable().clear().destroy();
                detailsTableBody = $("#Table_View").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data: null,
                            "defaultContent": action_button
                        },
                        
                        { data: 'ID' },
                        { data: 'Promotion_Category' },
                        { data: 'Name' },
                        {
                            data: 'Active',
                            "render": function (data, type, full, meta) {
                                if (data) {
                                    return 'Yes';
                                }
                                else { return 'No'; }
                            }
                        }

                    ],

                });
                imgload.hide();

            }
            else {
                imgload.hide();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            alert('Error ' + error)
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

            var urlStr = apiUrl + '/Sales/Setup/PromotionCategory/create';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "Name": $('#txt_name').val(),
                    "Active": $("#ck_active").iCheck('Update')[0].checked,
                    "Promotion": $("#txt_cat").val()
                }),
                beforeSend: function () {
                    imgloadsav.show();
                    btnsav.hide();
                },
                success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        imgloadsav.hide();

                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        discon();

                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            // timer: 1500,
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
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnsav.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
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
                    })
                },
            })
            return true;
        }
    })
}

//Update Start
function updrec() {
    
    Swal.fire({
        title: 'Are you sure wants to Update?',
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
            var urlStr = apiUrl + '/Sales/Setup/PromotionCategory/edit';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "ID": $("#txt_id").html(),
                    "Name": $('#txt_name').val(),
                    "Active": $("#ck_active").iCheck('Update')[0].checked,
                    "Promotion": $("#txt_cat").val()
                }),
                beforeSend: function () {
                    imgloadsav.show();
                    btnupd.hide();
                },
                success: function (response) {
                    if (response[0].status == 1) {
                        imgloadsav.hide();
                        $('#data_Modal').modal('hide');
                        Swal.fire({
                            title: `${response[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            //   timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                        discon();
                    }
                    else {
                        imgloadsav.hide();
                        btnupd.show();
                        Swal.fire({
                            title: `${response[0].Remarks}`,

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
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnupd.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: `Error ${error}`,

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

                }
            })
            return true;
        }
    })
}
//Update End

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['ID'];
    var _nam = data['Name'];

    imgloadsav.hide();

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Swal.fire({
        title: "Are you sure wants to edit Promotion Category # " + _nam + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Edit',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: apiUrl + '/Sales/Setup/PromotionCategory/FetchPromotionCategoryEdit/' + _id,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ "Token": strkey }),
                beforeSend: function () {
                    imgload.show();
                    btnupd.hide();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response[0].status == 1) {

                        $('#data_Modal').modal('show');
                        btnupd.show();
                        $("#txt_id").html(response[0]["Result"][0]["ID"]);                      
                        $('#txt_cat').val(response[0]["Result"][0]["Promotion"]);               
                        $("#txt_name").val(response[0]["Result"][0]["Name"]);  
                        if (!response[0]["Result"][0]["Active"]) {
                            $('#ck_active').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Active"]) {
                            $('#ck_active').iCheck('check'); //To check the radio button
                        }
                        imgload.hide();
                        return true;
                    }
                    else {
                        imgloadsav.hide();
                        btnsav.show();
                        Swal.fire({
                            title: `${response[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnsav.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showConfirmButton: true,
                        // timer: 1500,
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
    });
});
//Edit End
//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['ID'];
    var _nam = data['Name'];
    Swal.fire({
        title: "Are you sure wants to delete Promotion Category # " + _nam + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: apiUrl + '/Sales/Setup/PromotionCategory/delete/' + _id,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ "Token": strkey }),
                beforeSend: function () {
                    imgload.show();
                    btnsav.hide();
                }, success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        Onload();
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            // timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })

                        imgload.hide();
                        discon();
                        return true;
                    }
                    else {
                        imgload.hide();
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },

                error: function (error) {
                    imgload.hide();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showConfirmButton: true,
                        // timer: 1500,
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
    });
})
//Delete End
//$('#txt_cat').change(function () {

//    //paymentmode = $('#ddl_mop').val(); //it gets you the value of selected option 
//    if ($('#txt_cat').val() == 'B') {
//        cat = 'B';
//    }
//    else if ($('#txt_cat').val() == 'S') {
//        cat = 'S';
//    }
//    else if ($('#txt_cat').val() == 'F') {
//        cat = 'F';
//    }
//});