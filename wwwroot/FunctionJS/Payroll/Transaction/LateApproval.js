var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
var ApiForm='';

$(document).ready(function () {
    ApiForm=apiUrl +'/api/Payroll/v1/LateApproval';
    imgloadsav.hide();
    discon();
});

function discon() {
    document.getElementById('create_form').reset();
    // btnsav.hide();
    btnupd.hide();

    //Onload();
    imgload.hide();
}

$(document).on("click", '#btn_new', function () {
    $('#data_Modal').modal('show');
    btnupd.hide();
    btnsav.show();
    imgloadsav.hide();
});