var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var txtdatfrm = $("#txt_dat_frm");
var txtdatto = $("#txt_dat_to");
var _Account_Id = '0';
var _Account_Name = '';

var ApiForm = '';


$(document).ready(function () {
    ApiForm = apiUrl + '/api/Accounts/v1';
    imgload.hide();
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);

    ComponentsDropdowns.init();

});

$(function () {
    txtdatfrm.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatto.datetimepicker({ format: 'DD/MMM/YYYY' });
});
//Discon Detail Start
function discon() {
    $('#txt_acc_mas').select2('val', '');
    $('#txt_acc_mas').html('');

    var rows_createBP = $("#Table_View_BP tbody >tr");
    var rows_createBR = $("#Table_View_BR tbody >tr");
    rows_createBP.empty();
    rows_createBR.empty();

}

function FindRec() {
    // var TableViewBodyBP = $("#Table_View_BP tbody");
    // TableViewBodyBP.empty();


    // var TableViewBodyBR = $("#Table_View_BR tbody");
    // TableViewBodyBR.empty();

    var ck = FindRecvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;

    var txtaccmas = $("#txt_acc_mas");
    if (txtaccmas.val() == '') {
        Swal.fire({
            title: "Please Select Account First",
            icon: 'error'
        })
        return false;
    }

    // var txtdatfrm1 = txtdatfrm.find("input").val();
    // var txtdatto1 = txtdatto.find("input").val();
    // var clearedamtbp = 0;
    // var unclearedamtbp = 0;
    // var amtbp = 0;
    // var clearedamtbr = 0;
    // var unclearedamtbr = 0;
    // var amtbr = 0;
    $.ajax({
        url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetBankReconciliation',// + txtaccmas.select2('data').id + '/' + txtdatfrm1 + '/' + txtdatto1,
        type: "put",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
            // btnsav.hide();
        },
        success: function (response) {

            // ;
            if (response.statusCode == 200) {
                FillPayment(response);
                FillReceiving(response);
                // var bpcnt = 0, brcnt = 0;;


                // var Record = response["data"];
                // // array = response;

                // for (var row_cnt = 0; row_cnt < Record.length; row_cnt++) {

                //     //BP Start
                //     if (Record[row_cnt]["voucherTypeNo"] == "04") {
                //         var datePicker_Div_BP = "<div class='input-group date' id='txtchqcleardatebp" + bpcnt + "'><input type='text' class='form-control'/><span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span></div>";
                //         var ck_Div_BP = "<div class='icheck-inline'><label><input id = 'ckclearedbp" + bpcnt + "' type='checkbox' class='icheck' data-checkbox='icheckbox_square-grey'></label></div>";
                //         var productItemBP = '<tr>' +
                //             '<td><label class="control-label">' + Record[row_cnt]["id"] + '</label><label id=lblvchbp' + bpcnt + ' class="control-label"  style="visibility:hidden;">' + Record[row_cnt]["no"] + '</label>' +
                //             '</td>' +
                //             '<td>' + Record[row_cnt]["chqNO"] + '</td>' +
                //             '<td>' + moment(Record[row_cnt]["chqDate"]).format('DD-MMM-YYYY') + '</td>' +
                //             '<td>' + datePicker_Div_BP + '</td>' +
                //             '<td>' + ck_Div_BP + '</td>' +
                //             '<td>' + accounting.formatNumber(Record[row_cnt]["chqAmount"], 2) + '</td>' +
                //             '<td>' + Record[row_cnt]["paidReceived"] + '</td>' +
                //             '<td>' + Record[row_cnt]["narration"] + '</td>' +
                //             '</tr>';
                //         TableViewBodyBP.append(productItemBP);

                //         var txtcleardatebp = $("#txtchqcleardatebp" + brcnt);
                //         txtcleardatebp.datetimepicker({ format: 'DD/MMM/YYYY' });
                //         txtcleardatebp.find("input").val(moment(Record[row_cnt]["chqClearDate"]).format("DD/MMM/YYYY"));

                //         if (Record[row_cnt]["cleared"]) {
                //             clearedamtbp = parseFloat(clearedamtbp) + parseFloat(Record[row_cnt]["chqAmount"]);
                //             $('#ckclearedbp' + brcnt).iCheck('check'); //To uncheck the radio button
                //         }
                //         if (!Record[row_cnt]["cleared"]) {
                //             unclearedamtbp = parseFloat(unclearedamtbp) + parseFloat(Record[row_cnt]["chqAmount"]);
                //             $('#ckclearedbp' + brcnt).iCheck('uncheck'); //To uncheck the radio button
                //         }
                //         amtbp = parseFloat(amtbp) + parseFloat(Record[row_cnt]["chqAmount"]);
                //         bpcnt += 1;
                //     }
                //     //BP End





                //     //BR Start
                //     if (Record[row_cnt]["voucherTypeNo"] == "03") {
                //         var datePicker_Div_BR = "<div class='input-group date' id='txtchqcleardatebr" + brcnt + "'><input type='text' class='form-control'/><span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span></div>";
                //         var ck_Div_BR = "<div class='icheck-inline'><label><input id = 'ckclearedbr" + brcnt + "' type='checkbox' class='icheck' data-checkbox='icheckbox_square-grey'></label></div>";
                //         var productItembr = '<tr>' +
                //             '<td><label class="control-label">' + Record[row_cnt]["id"] + '</label><label id=lblvchbr' + brcnt + ' class="control-label"  style="visibility:hidden;">' + Record[row_cnt]["no"] + '</label>' +
                //             '</td>' +
                //             '<td>' + Record[row_cnt]["chqNO"] + '</td>' +
                //             '<td>' + moment(Record[row_cnt]["chqDate"]).format('DD-MMM-YYYY') + '</td>' +
                //             '<td>' + datePicker_Div_BR + '</td>' +
                //             '<td>' + ck_Div_BR + '</td>' +
                //             '<td>' + accounting.formatNumber(Record[row_cnt]["chqAmount"], 2) + '</td>' +
                //             '<td>' + Record[row_cnt]["paidReceived"] + '</td>' +
                //             '<td>' + Record[row_cnt]["narration"] + '</td>' +
                //             '</tr>';
                //         TableViewBodyBR.append(productItembr);

                //         var txtcleardatebr = $("#txtchqcleardatebr" + brcnt);
                //         txtcleardatebr.datetimepicker({ format: 'DD/MMM/YYYY' });
                //         txtcleardatebr.find("input").val(moment(Record[row_cnt]["chqClearDate"]).format("DD/MMM/YYYY"));

                //         if (Record[row_cnt]["cleared"]) {
                //             clearedamtbr = parseFloat(clearedamtbr) + parseFloat(Record[row_cnt]["chqAmount"]);
                //             $('#ckclearedbr' + brcnt).iCheck('check'); //To uncheck the radio button
                //         }
                //         if (!Record[row_cnt]["cleared"]) {
                //             unclearedamtbr = parseFloat(unclearedamtbr) + parseFloat(Record[row_cnt]["chqAmount"]);
                //             $('#ckclearedbr' + brcnt).iCheck('uncheck'); //To uncheck the radio button
                //         }
                //         amtbr = parseFloat(amtbr) + parseFloat(Record[row_cnt]["chqAmount"]);
                //         brcnt += 1;
                //     }
                //     //BR End
                // }

                // $("#txt_cleared_amount_bp").html(accounting.format(clearedamtbp, 2));
                // $("#txt_unclear_amount_bp").html(accounting.format(unclearedamtbp, 2));
                // $("#txt_total_amount_bp").html(accounting.format(amtbp, 2));
                // $("#txt_cleared_amount_br").html(accounting.format(clearedamtbr, 2));
                // $("#txt_unclear_amount_br").html(accounting.format(unclearedamtbr, 2));
                // $("#txt_total_amount_br").html(accounting.format(amtbr, 2));
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

function FillPayment(response) {

    var TableViewBodyBP = $("#Table_View_BP tbody");
    TableViewBodyBP.empty();



    var clearedamtbp = 0;
    var unclearedamtbp = 0;
    var amtbp = 0;

    var bpcnt = 0;


    var Record = response["data"].filter(d => d.voucherTypeNo == "04");

    for (var row_cnt = 0; row_cnt < Record.length; row_cnt++) {

        //BP Start
        //if (Record[row_cnt]["voucherTypeNo"] == "04") {
        var datePicker_Div_BP = "<div class='input-group date' id='txtchqcleardatebp" + bpcnt + "'><input type='text' class='form-control' style='width:150px' /><span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span></div>";
        var ck_Div_BP = "<div class='icheck-inline'><label><input id = 'ckclearedbp" + bpcnt + "' type='checkbox' class='icheck' data-checkbox='icheckbox_square-grey'></label></div>";
        var productItemBP = '<tr>' +
            '<td><label class="control-label">' + Record[row_cnt]["id"] + '</label><label id=lblvchbp' + bpcnt + ' class="control-label"  style="visibility:hidden;">' + Record[row_cnt]["no"] + '</label>' +
            '</td>' +
            '<td>' + Record[row_cnt]["chqNO"] + '</td>' +
            '<td>' + moment(Record[row_cnt]["chqDate"]).format('DD-MMM-YYYY') + '</td>' +
            '<td>' + datePicker_Div_BP + '</td>' +
            '<td>' + ck_Div_BP + '</td>' +
            '<td>' + accounting.formatNumber(Record[row_cnt]["chqAmount"], 2) + '</td>' +
            '<td>' + Record[row_cnt]["paidReceived"] + '</td>' +
            '<td>' + Record[row_cnt]["narration"] + '</td>' +
            '</tr>';
        TableViewBodyBP.append(productItemBP);

        var txtcleardatebp = $("#txtchqcleardatebp" + bpcnt);
        txtcleardatebp.datetimepicker({ format: 'DD/MMM/YYYY' });
        txtcleardatebp.find("input").val(moment(Record[row_cnt]["chqClearDate"]).format("DD/MMM/YYYY"));

        if (Record[row_cnt]["cleared"]) {
            clearedamtbp = parseFloat(clearedamtbp) + parseFloat(Record[row_cnt]["chqAmount"]);
            $('#ckclearedbp' + bpcnt).iCheck('check'); //To uncheck the radio button
        }
        if (!Record[row_cnt]["cleared"]) {
            unclearedamtbp = parseFloat(unclearedamtbp) + parseFloat(Record[row_cnt]["chqAmount"]);
            $('#ckclearedbp' + bpcnt).iCheck('uncheck'); //To uncheck the radio button
        }
        amtbp = parseFloat(amtbp) + parseFloat(Record[row_cnt]["chqAmount"]);
        bpcnt += 1;
        //  }
        //BP End
    }
    $("#txt_cleared_amount_bp").html(accounting.format(clearedamtbp, 2));
    $("#txt_unclear_amount_bp").html(accounting.format(unclearedamtbp, 2));
    $("#txt_total_amount_bp").html(accounting.format(amtbp, 2));
}
function FillReceiving(response) {
    var TableViewBodyBR = $("#Table_View_BR tbody");
    TableViewBodyBR.empty();

    var brcnt = 0;;
    var clearedamtbr = 0;
    var unclearedamtbr = 0;
    var amtbr = 0;


    var Record = response["data"].filter(d => d.voucherTypeNo == "03");
    // array = response;

    for (var row_cnt = 0; row_cnt < Record.length; row_cnt++) {

        //BR Start
        // if (Record[row_cnt]["voucherTypeNo"] == "03") {
        var datePicker_Div_BR = "<div class='input-group date' id='txtchqcleardatebr" + brcnt + "'><input type='text' class='form-control' style='width:150px'/><span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span></div>";
        var ck_Div_BR = "<div class='icheck-inline'><label><input id = 'ckclearedbr" + brcnt + "' type='checkbox' class='icheck' data-checkbox='icheckbox_square-grey'></label></div>";
        var productItembr = '<tr>' +
            '<td><label class="control-label">' + Record[row_cnt]["id"] + '</label><label id=lblvchbr' + brcnt + ' class="control-label"  style="visibility:hidden;">' + Record[row_cnt]["no"] + '</label>' +
            '</td>' +
            '<td>' + Record[row_cnt]["chqNO"] + '</td>' +
            '<td>' + moment(Record[row_cnt]["chqDate"]).format('DD-MMM-YYYY') + '</td>' +
            '<td>' + datePicker_Div_BR + '</td>' +
            '<td>' + ck_Div_BR + '</td>' +
            '<td>' + accounting.formatNumber(Record[row_cnt]["chqAmount"], 2) + '</td>' +
            '<td>' + Record[row_cnt]["paidReceived"] + '</td>' +
            '<td>' + Record[row_cnt]["narration"] + '</td>' +
            '</tr>';
        TableViewBodyBR.append(productItembr);

        var txtcleardatebr = $("#txtchqcleardatebr" + brcnt);
        txtcleardatebr.datetimepicker({ format: 'DD/MMM/YYYY' });
        txtcleardatebr.find("input").val(moment(Record[row_cnt]["chqClearDate"]).format("DD/MMM/YYYY"));

        if (Record[row_cnt]["cleared"]) {
            clearedamtbr = parseFloat(clearedamtbr) + parseFloat(Record[row_cnt]["chqAmount"]);
            $('#ckclearedbr' + brcnt).iCheck('check'); //To uncheck the radio button
        }
        if (!Record[row_cnt]["cleared"]) {
            unclearedamtbr = parseFloat(unclearedamtbr) + parseFloat(Record[row_cnt]["chqAmount"]);
            $('#ckclearedbr' + brcnt).iCheck('uncheck'); //To uncheck the radio button
        }
        amtbr = parseFloat(amtbr) + parseFloat(Record[row_cnt]["chqAmount"]);
        brcnt += 1;
        //}
        //BR End
    }
    $("#txt_cleared_amount_br").html(accounting.format(clearedamtbr, 2));
    $("#txt_unclear_amount_br").html(accounting.format(unclearedamtbr, 2));
    $("#txt_total_amount_br").html(accounting.format(amtbr, 2));

}
$('#txtchqcleardatebp').datepicker({
    changeYear: true,
    beforeShow: function (textbox, instance) {
        instance.dpDiv.css({
            marginTop: (-textbox.offsetHeight) + 'px',
            marginLeft: textbox.offsetWidth + 'px'
        });
    }
});

function FindRecvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var txtdatfrm1 = moment(txtdatfrm.find("input").val()).format("YYYY-MM-DD");
    var txtdatto1 = moment(txtdatto.find("input").val()).format("YYYY-MM-DD");
    _Account_Id = $('#txt_acc_mas').select2('data').id;

    // 

    _cre = JSON.stringify({
        // "bankReconciliationSearchViewModel": detail_record,
        // //"menu_Id": _menuid,
        "no": _Account_Id,
        "dateFrom": txtdatfrm1,
        "dateTo": txtdatto1,
    });
    return { ckval: ck, creteria: _cre };
}

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
                url: ApiForm + '/BankReconciliation',
                type: "Put",
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
            return true;
        }
    })
}


function ckvalidation() {
    var ck = 0, _Error = '', _cre = '';
    var detail_record = []



    var rows_createBP = $("#Table_View_BP tbody >tr");
    var rows_createBR = $("#Table_View_BR tbody >tr");
    //Detail Start
    //Bank Payment Start
    for (var i = 0; i < rows_createBP.length; i++) {
        var mvchnobp = $("#lblvchbp" + i).html();
        var chqcleardatebp = $("#txtchqcleardatebp" + i);
        var chqcleardatebp1 = chqcleardatebp.find("input").val();
        var ckclearbp = $("#ckclearedbp" + i).iCheck('Update')[0].checked;
        chqcleardatebp1 = moment(chqcleardatebp1).format("YYYY-MM-DD");

        detail_record.push({
            "no": mvchnobp,
            "chqClearDate": chqcleardatebp1,
            "cleared": ckclearbp,
        })

    }
    //Bank Payment End
    //Bank Receipt Start
    for (var i = 0; i < rows_createBR.length; i++) {
        var mvchnobr = $("#lblvchbr" + i).html();
        var chqcleardatebr = $("#txtchqcleardatebr" + i);
        var chqcleardatebr1 = chqcleardatebr.find("input").val();
        var ckclearbr = $("#ckclearedbr" + i).iCheck('Update')[0].checked;
        chqcleardatebr1 = moment(chqcleardatebr1).format("YYYY-MM-DD");

        detail_record.push({
            "no": mvchnobr,
            "chqClearDate": chqcleardatebr1,
            "cleared": ckclearbr,
        })

    }

    //Validation End

    _cre = JSON.stringify({


        "bankReconciliationListViewModel": detail_record,
        "menu_Id": _menuid,
    });
    return { ckval: ck, creteria: _cre };
}

//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        //Master Account Start
        FillMasterAccount()
        //Master Account End

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();


//Select2 End
//Fill Master Account Start
function FillMasterAccount() {
    $("#txt_acc_mas").select2({
        placeholder: "Search for a Master Account",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Accounts/v1/LOVServicesAccounts/GetChartOfAccountCBJ',
            type: "Get",
            dataType: 'json',
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CBJ", 'B');
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
                            text: item.name,


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
            var data = { "id": _Account_Id, "text": _Account_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
