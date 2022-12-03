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

    Onload();
    imgload.hide();
}
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/GL/Setup/Department/GetDepartment',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Menu": _menid }),
        beforeSend: function () {
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
                        data: json,
                        destroy: true,
                        retrieve: true,
                        columns: [
                            {
                                data: null,
                                "defaultContent": action_button
                            },
                            { data: 'Name' },
                            {
                                data: 'Type',
                                "render": function (data, type, full, meta) {
                                    if (data == 'S') {
                                        return 'System';
                                    }
                                    else { return 'User'; }
                                }
                            }

                        ],

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


function savrec() {
    var txtname = $('#txt_name').val();
    output = confirm('Are sure wants to Save?');
    if (output == false) {

        return false;
    }
    $.ajax({
        url: apiUrl + '/GL/Setup/Department/create',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Name": txtname,
            "Type": "U"
        }),
        beforeSend: function () {
            imgloadsav.show();
            btnsav.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadsav.hide();
                discon();
                btnsav.show();
                $('#data_Modal').modal('hide');
                alert(jres[0].Remarks);
            }
            else {
                imgloadsav.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadsav.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
    return true;

}



function updrec() {
    var txtid = $('#txt_id').html();
    var txtname = $('#txt_name').val();
    output = confirm('Are sure wants to Update?');
    if (output == false) {

        return false;
    }
    $.ajax({
        url: apiUrl + '/GL/Setup/Department/Edit',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": txtid,
            "Name": txtname,
            "Type": "U"
        }),
        beforeSend: function () {
            //imgloadsav.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                //imgloadsav.hide();
                $('#data_Modal').modal('hide');
                alert(jres[0].Remarks);
                discon();
                //Onload();
            }
            else {
                // imgloadsav.hide();
                btnupd.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            // imgloadsav.hide();
            btnupd.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
}


//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _dpt_id = data['ID'];
    var _dpt_nam = data['Name'];
    var _dpt_typ = data['Type'];
    if (_dpt_typ == "S") {
        alert("This is system generated record!");
        return;
    }
    var output;
    output = confirm("Are sure wants to edit " + _dpt_nam + "?");
    if (output == false) {
        return false;
    }
    ///Inventory/Brand/FetchBDEdit/{_bd_id}
    $.ajax({

        url: apiUrl + '/GL/Setup/Department/FetchDepartmentEdit/' + _dpt_id,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey }),
        beforeSend: function () {
            imgload.show();
            btnsav.hide();
        },
        success: function (response) {

            if (response[0].status == 1) {
                btnupd.show();
                $('#data_Modal').modal('show');
                $('#txt_id').html(_dpt_id);
                $('#txt_name').val(response[0]["Result"][0]["Name"]);



                imgload.hide();
                imgloadsav.hide()
                return true;
            }



        },
        error: function (error) {
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })


});
//Edit End



//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _dpt_id = data['ID'];
    var _dpt_nam = data['Name'];
    var _dpt_typ = data['Type'];
    if (_dpt_typ == "S") {
        alert("This is system generated record!");
        return;
    }
    var output;
    output = confirm("Are sure wants to delete " + _dpt_nam + "?");
    if (output == false) {
        return false;
    }
    ///Inventory/Brand/delete/{_bd_id}
    $.ajax({

        url: apiUrl + '/GL/Setup/Department/delete/' + _dpt_id,
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
                alert(jres[0].Remarks);
                imgload.hide();

                return true;
            }
            else {
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })


});
//Delete End

