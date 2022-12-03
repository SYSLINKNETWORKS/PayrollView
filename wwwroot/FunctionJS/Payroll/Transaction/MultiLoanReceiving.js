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
var txtDate = $("#txt_Date");
var ApiForm = '';

$(function () {
    txtDate.datetimepicker({ format: 'MMM/YYYY' });
});

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Payroll/v1';
    imgload.hide();
    imgloadsav.hide();

    discon();
});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    //Onload();
    imgload.hide();
}

function Onload() {
    var dt = '01/' + txtDate.find("input").val();
    var txtdt = moment(dt).format("YYYY-MM-DD");
    var tbl_row_cnt = 1;
    $.ajax({
        //url: ApiForm + '/MultiLoanReceiving?_MenuId=' + _menuid,
        url: ApiForm + '/MultiLoanReceiving',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
            xhr.setRequestHeader("_Date", txtdt);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var action_button = ' ';


                //Update
                if (Boolean(response["data"][0]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }


                if (response["data"] != null) {

                    $('#Table_View').DataTable().clear().destroy();

                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true, retrieve: true,
                        paging: false, search: false,
                        bFilter: false, bInfo: false,
                        columns: [
                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            },

                            { data: 'employeeName' },
                            // {
                            //     data:null,
                            //     "render": function (data, type, full, meta) {
                            //         return  '['+data.id+']-'+data.employeeName
                            //     }
                            // },
                            { data: 'loanCategoryName' },
                            {
                                data: 'loanAmount',
                                "render": function (data, type, full, meta) {
                                    return accounting.format(data)
                                }
                            },
                            {
                                data: 'installmentAmount',
                                "render": function (data, type, full, meta) {
                                    return accounting.format(data)
                                }
                            },
                            {
                                data: 'received',
                                "render": function (data, type, full, meta) {
                                    return accounting.format(data)
                                }
                            },
                            {
                                data: 'balance',
                                "render": function (data, type, full, meta) {
                                    return accounting.format(data)
                                }
                            },
                            {
                                data: 'receiving',
                                "render": function (data, type, full, meta) {
                                    return "<input id=txt_receiving class=txt-receiving type=text value='" + data + "'/>"
                                }
                            },
                            {
                                data: 'totalBalance',
                                "render": function (data, type, full, meta) {
                                    return accounting.format(data)
                                }
                            },


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





function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';


    var rows_create = $("#Table_View tbody >tr");
    var detail_record = [];

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        var currentRow = columns.closest("tr");
        var data = $('#Table_View').DataTable().row(currentRow).data();

        var _loanIssueId = data['id'];
        var _receiving = $(columns[7]).find("input").val().trim();

        detail_record.push({
            "loanIssueId": _loanIssueId,
            "receiving": _receiving,
            "menuId": _menuid
        })
    }
    if (!Boolean(ck)) {
        _cre = JSON.stringify({ "MultiLoanReceivingListAddModel": detail_record });
    }
    ;
    return { ckval: ck, creteria: _cre };
}


function updrec() {

    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
    var dt = '01/' + txtDate.find("input").val();
    var _date = moment(dt).format("YYYY-MM-DD");

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
                url: ApiForm + '/MultiLoanReceiving',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("_Date", _date);
                    imgload.show();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgload.hide();
                        discon();
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