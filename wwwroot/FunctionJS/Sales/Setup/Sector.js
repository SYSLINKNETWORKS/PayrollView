var btnupd = $('#btn_update');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_create");


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
    var tbl_row_cnt = 1;
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/GL/Setup/BankType/GetBankType',
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
                        {
                            "render": function (data, type, full, meta) {
                                return tbl_row_cnt++;
                            }
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



$(document).on("click", '#btn_create', function () {
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
        url: apiUrl + '/GL/Setup/BankType/create',
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
        url: apiUrl + '/GL/Setup/BankType/Edit',
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
    var _bktyp_id = data['ID'];
    var _bktyp_nam = data['Name'];
    var _bktyp_typ = data['Type'];
    if (_bktyp_typ == "S") {
        alert("This is system generated record!");
        return;
    }
    var output;
    output = confirm("Are sure wants to edit " + _bktyp_nam + "?");
    if (output == false) {
        return false;
    }
    ///Inventory/Brand/FetchBDEdit/{_bd_id}
    $.ajax({

        url: apiUrl + '/GL/Setup/BankType/FetchBankTypeEdit/' + _bktyp_id,
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
                $('#txt_id').html(_bktyp_id);
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
    var _bktyp_id = data['ID'];
    var _bktyp_nam = data['Name'];
    var _bktyp_typ = data['Type'];
    if (_bktyp_typ == "S") {
        alert("This is system generated record!");
        return;
    }
    var output;
    output = confirm("Are sure wants to delete " + _bktyp_nam + "?");
    if (output == false) {
        return false;
    }
    ///Inventory/Brand/delete/{_bd_id}
    $.ajax({

        url: apiUrl + '/GL/Setup/BankType/delete/' + _bktyp_id,
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

