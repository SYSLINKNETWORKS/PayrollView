import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../..//Login/DashboardPermissionByName.js';


var imgboxvoucher = $("#img_box_voucher");
var txtdatfrom = $("#txt_datFromVoucher");
var txtdatTo = $("#txt_datToVoucher");



var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;


$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    ApiForm = apiUrl + '/api/Accounts/v1';
    // CallNotification('Accounts');
    imgboxvoucher.hide();
    MenuPermission();
    loadDashboardVoucher();
});

function loadDashboardVoucher() {
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);
}

async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("VoucherDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //VouchcerCheckApprove();
    }

}
$(document).on('click', '#vouchers', function () {
    
    VouchcerCheckApprove();

});
// Fill Voucher Start
export function VouchcerCheckApprove() {
    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "id": $("#txt_no").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
    });

    $("#box_voucher").html("Check : 0 <br/> Approval : 0");


    var div_datamaster = $('#div_vouchermaster');
    div_datamaster.empty();




    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_voucher" style="text-align:right;">' +
        '</div>' +
        '</div>');

    var div_data = $('#div_voucher');
    div_data.empty();

    var refreshButton = " <button type='button' class='btn-refresh-voucher glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelVoucher'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);


    var tblvouchercheckrow = '';
    //Heading
    tblvouchercheckrow = '<table class="table table-responsive" id="tbl_voucher" style="font-size:small;width:100%">';
    tblvouchercheckrow += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblvouchercheckrow += '<tr>';
    tblvouchercheckrow += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tblvouchercheckrow += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Check</th>';
    tblvouchercheckrow += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tblvouchercheckrow += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Voucher #</th>';
    tblvouchercheckrow += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tblvouchercheckrow += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Received / Paid</th>';
    tblvouchercheckrow += '<th scope="col" style="width:20%;padding-top: 4%;text-align:left">Amount</th>';
    tblvouchercheckrow += '</tr>';
    tblvouchercheckrow += '</thead>';
    tblvouchercheckrow += '<tbody style="text-align:left">';
    tblvouchercheckrow += '</tbody>';
    tblvouchercheckrow += '</table>';
    div_data.append(tblvouchercheckrow);

    $.ajax({
        url: ApiForm + '/Dashboard/GetCheckApproveVoucher', //apiUrl + '/DashBoard/CheckApproveVoucher/' + strkey+'/false',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgboxvoucher.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                if (response["data"] != null) {
                    var _CheckVoucher = response["data"]["voucherViewModel"].filter(x => x.checked == false && x.approved == false).length;
                    var _ApprovedVoucher = response["data"]["voucherViewModel"].filter(x => x.checked == true && x.approved == false).length;

                    $("#box_voucher").html("Check : " + _CheckVoucher + "<br/> Approval : " + _ApprovedVoucher);
                    $('#spn_voucher_check').text(response["data"]["voucherViewModel"].length);
                    //$('#spn_voucher_approval').text(response["data"]["approvedVoucherViewModel"].length);


                    var TableViewvoucher = $('#tbl_voucher');
                    var action_button1 = "";
                    var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                    var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                    if (_disableCheck == '' || _disableapproved == '') { action_button1 = "<a href='#' class='btn-edit-Voucher-status glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  "; }
                    //var _sno = 0;
                    //                    div_data.DataTable().clear().destroy();
                    TableViewvoucher.dataTable({
                        data: response["data"]["voucherViewModel"],
                        destroy: true,
                        retrieve: true,
                        paging: false,
                        searching: true,
                        columns: [
                            {
                                data: null,
                                "render": function (data, type, full, meta) {
                                    if (data == true) {
                                        return action_button1;
                                    }
                                    else {
                                        return action_button1;
                                    }
                                }
                            },
                            {
                                data: 'checked',
                                "render": function (data, type, full, meta) {
                                    if (Boolean(data) == true) {
                                        return "<select id=ddl_check class='ddl-approved' " + _disableCheck + " >" +
                                            "<option value=1 selected>Yes</option>" +
                                            "<option value=0 >No</option>" +
                                            "</select>";
                                    }
                                    else {
                                        return "<select id=ddl_check class='ddl-approved' " + _disableCheck + ">" +
                                            "<option value=1 >Yes</option>" +
                                            "<option value=0 selected>No</option>" +
                                            "</select>";
                                    }
                                }
                            },
                            {
                                data: 'approved',
                                "render": function (data, type, full, meta) {
                                    if (Boolean(data) == true) {
                                        return "<select id=ddl_approved class='ddl-approved' " + _disableapproved + " >" +
                                            "<option value=1 selected>Yes</option>" +
                                            "<option value=0 >No</option>" +
                                            "</select>";

                                    }
                                    else {
                                        return "<select id=ddl_approved class='ddl-approved'  " + _disableapproved + ">" +
                                            "<option value=1 >Yes</option>" +
                                            "<option value=0 selected>No</option>" +
                                            "</select>";
                                    }
                                }
                            },
                            {
                                data: null,
                                render: function (data, type, row) {
                                    return "<a href='#' class='btn-print-voucher-check'>" + data.id + "</a>"// ;
                                }
                            },
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },
                            { data: 'paidRecived' },


                            {
                                data: null,
                                render: function (data, type, row) {
                                    return accounting.formatNumber(data.amount)
                                }
                            },


                        ], dom: 'Bfrtip',
                        buttons: [{
                            extend: 'csv',
                            className: 'btn btn-primary  glyphicon glyphicon-download exportCsv',
                            text: '',
                            title: 'Vouchers'


                        }
                        ],

                        "order": [[4, "desc"]],
                        "pageLength": 10,
                    });
                    exportCSV()

                }

            }
            imgboxvoucher.hide();

        },
        error: function (xhr, status, err) {
            imgboxvoucher.hide();
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

function exportCSV() {

    $('.exportCsv').css('margin-top', -60);
    $('.exportCsv').css('margin-right', 120);

}

//Print Voucher Check Start
$(document).on('click', '.btn-print-voucher-check', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#tbl_voucher').DataTable().row(currentRow).data();
    var _mvch_id = data['id'];
    var _mvch_no = data['no'];
    var _mvch_date = data['date'];

    // Swal.fire({
    //     title: "Are sure wants to print voucher # " + _mvch_id + "?",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#5cb85c',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Print',
    //     showClass: {
    //         popup: 'animated fadeInDown faster'
    //     },
    //     hideClass: {
    //         popup: 'animated fadeOutUp faster'
    //     }
    // }).then((result) => {
    // if (result.value) {
    var _cre = JSON.stringify({
        "VoucherNo": _mvch_no,
        "dateFrom": _mvch_date,
        "dateTo": _mvch_date,
        "status": "",
        "voucherTypeId": "",
        "chqNo": ""
    });
    var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
    sessionStorage.setItem(sessid, _cre);
    var win = window.open(apiUrl_View + '/GL/Report/Voucher?S=' + sessid, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        Swal.fire({
            title: 'Please allow popups for this website',
            icon: 'error'
        })
    }

    // }
    // })
});
//Print Voucher Check end


//Update Check Voucher
$(document).on('click', '.btn-edit-Voucher-status', function (e) {
    e.preventDefault();

    var currentRow = $(this).closest("tr");
    var data = $('#tbl_voucher').DataTable().row(currentRow).data();
    var _No = data["no"];



    var _check = $(this).closest('tr').find('#ddl_check option:selected').val();
    var _approved = $(this).closest('tr').find('#ddl_approved option:selected').val();

    _approved = (_approved == 1) ? true : false;
    _check = (_check == 1) ? true : false;

    VoucherStatus(_No, _check, _approved);

});



$(document).on('click', '.btn-refresh-voucher', function (e) {
    e.preventDefault();
    VouchcerCheckApprove();
});


$(document).on('click', '#btnSearchVoucher', function (e) {
    e.preventDefault();
    VouchcerCheckApprove();


});

function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var _No = $("#txt_noVoucher").val();
    var dateFrom = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
    var dateTo = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");


    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {
        _cre = JSON.stringify({
            "no": _No,
            "dateFrom": dateFrom,
            "DateTo": dateTo,
            "type": "U",
            "menu_Id": _menuid
        });

    }
    return { ckval: ck, creteria: _cre };
}



//Voucher Status Start
function VoucherStatus(_No, _check, _approved) {
    $.ajax({
        url: ApiForm + '/Dashboard',
        type: "Put",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("No", _No);
            xhr.setRequestHeader("Check", _check);
            xhr.setRequestHeader("Approved", _approved);
        },
        success: function (response) {
            var jres = response;
            if (response.statusCode == 200) {
                VouchcerCheckApprove();
                imgboxvoucher.hide();
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
};
//Voucher Status End