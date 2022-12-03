var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");

var ApiForm = '';


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    Onload();
});

function Onload() {
    var txtdramt = $("#txt_dramt");
    var txtcramt = $("#txt_cramt");
    var txtdiffamt = $("#txt_diffamt");
    var dramt = 0;
    var cramt = 0;
    var diffamt = 0;
    $.ajax({
        url: ApiForm + '/OpeningVoucher',
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
                if (response["data"] != null) {

                    var TableViewBody = $("#Table_View tbody");


                    var Record = response["data"];
                    var productItem;
                    for (var row_cnt = 0; row_cnt < Record.length; row_cnt++) {
                        var _readonly = '';
                        if (Record[row_cnt]["masterDetail"] == 'M') {
                            _readonly = 'readonly';
                        }
                        productItem += '<tr>' +
                            //'<td><label >' + Record[row_cnt]["accountId"] + '</label><label id=lblacc' + row_cnt + '   style="visibility:hidden;">' + Record[row_cnt]["no"] + '</label>' + '</td>' +
                            '<td style="display:none" >' + Record[row_cnt]["no"] + '</td>' +
                            '<td>' + Record[row_cnt]["accountId"] + '</td>' +
                            '<td>' + Record[row_cnt]["accountName"] + '</td>' +
                            '<td><input type="text" id=txtdr' + row_cnt + ' ' + _readonly + ' class="form-control" value=' + Record[row_cnt]["debit"] + '>' +
                            '</td>' +
                            '<td><input type="text" id=txtcr' + row_cnt + ' ' + _readonly + ' class="form-control" value=' + Record[row_cnt]["credit"] + '>' +
                            '</td>' +
                            '</tr>';
                        dramt = parseFloat(dramt) + parseFloat(Record[row_cnt]["debit"]);
                        cramt = parseFloat(cramt) + parseFloat(Record[row_cnt]["credit"]);

                    }
                    TableViewBody.append(productItem);
                    txtdramt.html(accounting.formatNumber(dramt, 2));
                    txtcramt.html(accounting.formatNumber(cramt, 2));
                    diffamt = parseFloat(dramt).toFixed(2) - parseFloat(cramt).toFixed(2);
                    txtdiffamt.html(accounting.formatNumber(diffamt, 2));
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

//Save Record Start
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
                url: ApiForm + '/OpeningVoucher',
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                    btnsav.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        imgload.hide();

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
                        imgload.hide();
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
                    imgload.hide();
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
function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';

    var detail_record = [];
    var columns;

    var date = moment(new Date()).format("YYYY-MM-DD");


    var txtdramt = $("#txt_dramt");
    var txtcramt = $("#txt_cramt");
    var txtdiffamt = $("#txt_diffamt");
    var dramt = 0;
    var cramt = 0;
    var diffamt = 0;

    var rows_create = $("#Table_View tbody >tr");
    //Detail Start
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        var acc_no = + $("#lblacc" + i).html();
        var debit_amt = parseFloat($("#txtdr" + i).val());
        var credit_amt = parseFloat($("#txtcr" + i).val());
        if (debit_amt > 0 || credit_amt > 0) {
            detail_record.push({
                "accountNo": $(columns[0]).html(),
                "naration": "Opening Voucher",
                "debitAmount": $(columns[3]).find("input[type='text']").val(),
                "creditAmount": $(columns[4]).find("input[type='text']").val(),
            })
        }
        if (debit_amt > 0 && credit_amt > 0) {
            Swal.fire({
                icon: 'error',
                title: "Debit and Credit must not be equal of account # " + $(columns[1]).html().trim(),
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
            imgload.hide();
            return;
        }

        dramt += debit_amt;
        cramt += credit_amt;
    }
    //Detail End

    txtdramt.html(parseFloat(dramt).toFixed(2));
    txtcramt.html(parseFloat(cramt).toFixed(2));
    diffamt = parseFloat(dramt).toFixed(2) - parseFloat(cramt).toFixed(2);
    txtdiffamt.html(parseFloat(diffamt).toFixed(2));
    imgload.hide();
    if (parseFloat(diffamt).toFixed(2) != 0) {
        Swal.fire({
            icon: 'error',
            title: "Debit and Credit are not equal",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
        return;
    }

    _cre = JSON.stringify({
        "date": date,
        "transactionDate": date,
        "paidReceived": "",
        "remarks": "",
        "voucherTypeNo": "06",
        "onlineCheck": false,
        "chqNo": 0,
        "chqDate": null,
        "chqClear": false,
        "exchangeRate": 0,
        "approved": true,
        "check": true,
        "type": "S",
        "voucherDetailViewModel": detail_record,
        "menu_Id": _menuid,
    });
    return { ckval: ck, creteria: _cre };
}


