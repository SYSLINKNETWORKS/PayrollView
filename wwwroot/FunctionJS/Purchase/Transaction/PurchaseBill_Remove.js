var txtdat = $("#txt_dat");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_upd");
var Qtyblock = $("#Qty_block");
var _Mpb_ID = 0;
var txtamt = $("#txt_amt");
var txtdisper = $("#txt_disper");
var txtdisamt = $("#txt_disamt");
var txtnetamt = $("#txt_netamt");
var txtgstper = $("#txt_gstper");
var txtgstamt = $("#txt_gstamt");
var txtact = $("#ck_can");



var _Sup_ID = '0';
var _Sup_Name = '';

var _Item_ID = '0';
var _Item_Name = '';

var _GRN_ID = '0';
var _GRN_Name = '';

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    imgloadsav.hide();
    discon();
    btnsav.show();
    $('#data_Modal').modal('show');
    $("#detailsTable > tbody").html("");
    btnupd.hide();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);

});

//Discon Start
function discon() {
    document.getElementById('create_form').reset();
    $("#txt_id").html('');
    $("#txt_rmk").val('');
    var txtdpt = $('#txt_dpt').select2('val', '');
    var txtemp = $('#txt_emp').select2('val', '');
    $("#txt_rmk").val('');
    $("#txt_scaleId").val('');
    $("#txt_scale").val('');
    txtdpt.html('');
    txtemp.html('');
    cleartext();


    btnsav.hide();
    btnupd.hide();

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Onload();
    imgload.hide();
    imgloadsav.hide();
};
//Discon End
$(function () {
    txtdat.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    //Qtyblock.hide();
    //Onload();
    discon();
    ComponentsDropdowns.init();

});

// Onload_Device Start 
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/Purchase/Transaction/PurchaseOrder/GetPurchaseOrder',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Menu": _menid }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {

            var jres = response;
            if (jres[0].status == 1) {

                var action_button = ' ';
                //New
                if (Boolean(response[0]["Record_Insert"])) {
                    btnnew.show();
                }

                if (response[0]["Result"] != null) {


                    //Print
                    if (response[0]["Result"][0]["Permission_Print"] == 'True') {
                        action_button += "<a href='#' class='btn-print glyphicon glyphicon-print' data-toggle='tooltip' title='Print'></a> ";
                    }
                    //Delete
                    if (response[0]["Result"][0]["Permission_Delete"] == 'True') {
                        action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                    }
                    //Update
                    if (response[0]["Result"][0]["Permission_Update"] == 'True') {
                        action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                    }

                    var json = response[0]["Result"];
                    array = response[0]["Result"];


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

                            { data: 'Supplier' },
                            { data: 'stage' },
                        ],
                        "order": [[2, "desc"], [1, "desc"]],
                        "pageLength": 10,
                    });

                }
                imgload.hide();

            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,

                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
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
                timer: 1500,
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
// Onload_Device End 

var ComponentsDropdowns = function () {
    var handleSelect2 = function () {


        //supplier start
        FillSupplier();
        //supplier End

        // GRN Start
        FillGRN(_Sup_ID);
        //GRN End

        //Get GRN Item start
        FillGRNItems(_GRN_ID);
        //Get GRN Item End
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End

// Create Start 
function savrec() {

    var ck = ckvalidation();
    detailrecord = ck.detailrecord;

    if ($("#txt_req").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select Requisition",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else if ($("#txt_sup").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select supplier",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }

    else if (detailrecord == "") {
        Swal.fire({
            icon: 'error',
            title: "Please fill table data",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else {
        var _txtdat = txtdat.find("input").val();
        var supId = $("#txt_sup").val();
        var mprId = $("#txt_req").val();
        var txtck_mprck = $("#ck_mprck").iCheck('update')[0].checked;
        var txtck_auth = $("#ck_auth").iCheck('update')[0].checked;
        var txtck_act = $("#ck_act").iCheck('update')[0].checked;



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

                var urlStr = apiUrl + '/Purchase/Transaction/PurchaseOrder/create';
                $.ajax({
                    url: urlStr,
                    type: "Post",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({
                        "Token": strkey,
                        "Date": _txtdat,
                        "Sup_Id": supId,
                        "Mpr_Id": mprId,
                        "Ckeck_by": txtck_mprck,
                        "Authorize_by": txtck_auth,
                        "Close_Act": txtck_act,
                        "Detail": detailrecord
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
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
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
                            btnsav.show();
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'error',
                                showConfirmButton: false,
                                timer: 1500,
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
                            timer: 1500,
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

}
// Create End
//Update Start
function updrec() {

    var ck = ckvalidation();
    detailrecord = ck.detailrecord;

    if ($("#txt_req").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select Requisition",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else if ($("#txt_sup").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select supplier",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }

    else if (detailrecord == "") {
        Swal.fire({
            icon: 'error',
            title: "Please fill table data",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else {
        var _mpo_id = $("#txt_id").html();
        var _txtdat = txtdat.find("input").val();
        var supId = $("#txt_sup").val();
        var mprId = $("#txt_req").val();
        var txtck_mprck = $("#ck_mprck").iCheck('update')[0].checked;
        var txtck_auth = $("#ck_auth").iCheck('update')[0].checked;
        var txtck_act = $("#ck_act").iCheck('update')[0].checked;



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

                var urlStr = apiUrl + '/Purchase/Transaction/PurchaseOrder/edit';
                $.ajax({
                    url: urlStr,
                    type: "Post",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({
                        "Token": strkey,
                        "ID": _mpo_id,
                        "Date": _txtdat,
                        "Sup_Id": supId,
                        "Mpr_Id": mprId,
                        "Ckeck_by": txtck_mprck,
                        "Authorize_by": txtck_auth,
                        "Close_Act": txtck_act,
                        "Detail": detailrecord
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
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
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
                            btnsav.show();
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'error',
                                showConfirmButton: false,
                                timer: 1500,
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
                            timer: 1500,
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

}
//Update End







//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mpo_id = data['ID'];
    Swal.fire({
        title: "Are you sure wants to delete Purchase Order # " + _mpo_id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: apiUrl + '/Purchase/Transaction/PurchaseOrder/delete/' + _mpo_id,
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

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    imgloadsav.hide();

    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mpo_id = data['ID'];
    var _Stage = data['stage'];

    if (_Stage != 'Open') {
        Swal.fire({
            title: "Bill has been " + _Stage,
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

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Swal.fire({
        title: "Are you sure wants to edit purchase Order # " + _mpo_id + "?",
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
                url: apiUrl + '/Purchase/Transaction/PurchaseOrder/FetchPurchaseOrder/' + _mpo_id,
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

                        txtdat.find("input").val(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                        $('#ddl_category').val(response["data"]["category"]);

                        _Requisition_ID = response[0]["Result"][0]["mpr_ID"];
                        _Requisition_Name = response[0]["Result"][0]["Requisition"];
                        $('#txt_req').val(_Requisition_ID); // Select the option with a value of '1'
                        $('#txt_req').trigger('change'); // Notify any JS components that the value changed

                        _Sup_ID = response[0]["Result"][0]["sup_ID"];
                        _Sup_Name = response[0]["Result"][0]["Supplier"];
                        $('#txt_sup').val(_Sup_ID); // Select the option with a value of '1'
                        $('#txt_sup').trigger('change'); // Notify any JS components that the value changed

                        $("#txt_dpt").val(response[0]["Result"][0]["Deparment"]);
                        $("#txt_cr").val(response[0]["Result"][0]["CredDay"]);

                        if (!response[0]["Result"][0]["Check_by"]) {
                            $('#ck_mprck').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Check_by"]) {
                            $('#ck_mprck').iCheck('check'); //To check the radio button
                        }
                        if (!response[0]["Result"][0]["Check_auth"]) {
                            $('#ck_auth').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Check_auth"]) {
                            $('#ck_auth').iCheck('check'); //To check the radio button
                        }
                        if (!response[0]["Result"][0]["Check_act"]) {
                            $('#ck_act').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Check_act"]) {
                            $('#ck_act').iCheck('check'); //To check the radio button
                        }

                        for (var i = 0; i < response[0]["Result"].length; i++) {
                            var productItem = '<tr>' +
                                '<td><a data-itemId="0"  class="deleteItem">Remove</a></td>' +
                                '<td style="display:none">' + response[0]["Result"][i]["Item_Id"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["ItemName"] + '</td>' +
                                '<td  style="display:none">' + response[0]["Result"][i]["Sca_Id"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Scale"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Qty"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["AppQty"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Rate"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Gst"] + '</td>' +
                                '<td style="display:none">' + response[0]["Result"][i]["Tamt"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Amt"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Remarks"] + '</td>' +
                                '</tr>';
                            detailsTableBody.append(productItem);
                        }
                        // _dgcal_detail();


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
//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mdn_id = data['ID'];


    Swal.fire({
        title: "Are sure wants to print Debit Note # " + _mdn_id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Print',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            var cre = "";
            cre = "t_mdn.mdn_id=" + _mdn_id;
            var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
            var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");
            sessionStorage.setItem(sessid, cre);
            sessionStorage.setItem(sessid_name, '');

            var win = window.open(apiUrl_View + '/Purchase_Report/DebitNoteReport?1&' + sessid + '&' + sessid_name, '_blank');

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

        }
    })
});
//Print end




//Fill Supplier Start
function FillSupplier() {
    $("#txt_sup").select2({
        placeholder: "Search for Supplier",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillSupplier',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {

                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Supplier,
                            cred: item.CredDay,


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
            var data = { "id": _Sup_ID, "text": _Sup_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Supplier End
$('#txt_sup').on("select2-selected", function (e) {

    $("#txt_cr").val($('#txt_sup').select2('data').cred);

});

$('#txt_req').on("select2-selected", function (e) {

    var _mpr_id = $('#txt_req').select2('data').id;
    var urlStr = apiUrl + '/Purchase/Transaction/PurchaseOrder/FetchPurchaseOrderById/' + _mpr_id;
    $.ajax({
        url: urlStr,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {

            if (response[0].status == 1) {


                $("#txt_dpt").val(response[0]["Result"][0]["Department"]);

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
    FillItems(_mpr_id);

});


function FillItems(_mpr_id) {
    $("#txt_itm").select2({
        placeholder: "Search for Item",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FetchItemsById',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _mpr_id: _mpr_id,
                    _srch: term, // search term
                    _key: strkey, // search term


                    page: page // page number

                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.Item_ID,
                            text: item.ItemName,
                            Sca_Id: item.sca_id,
                            Scale: item.Scale,
                            Qty: item.Qty


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
            var data = { "id": _Item_ID, "text": _Item_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}

$('#txt_itm').on("select2-selected", function (e) {
    $('#txt_scale').val($("#txt_itm").select2('data').Scale);
    $('#txt_scale_Id').val($("#txt_itm").select2('data').Sca_Id);
    $('#txt_qty').val($("#txt_itm").select2('data').Qty);
    $('#txt_appqty').val($("#txt_itm").select2('data').Qty);

});

$("#txt_rmk").keyup(function (e) {
    if (e.keyCode === 13) {
        if ($('#txt_itm').val() == "") {
            Swal.fire({
                icon: 'error',
                title: "please select Item",
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
        else if ($('#txt_rate').val() == 0) {
            Swal.fire({
                icon: 'error',
                title: "rate not be zero",
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
        else {
            var txtitmid = $('#txt_itm').val();
            _Item_Name = $('#txt_itm').select2('data').text
            var txtsca_id = $('#txt_scale_Id').val();
            var txtscale = $('#txt_scale').val();
            var txtqty = $('#txt_qty').val();
            var txtappqty = $('#txt_appqty').val()
            var txtrate = $('#txt_rate').val();
            var txtgst = $('#txt_gst').val();
            var txamt = $('#txt_amt').val();
            var txttotalamt = $('#txt_tamt').val();
            var txtdrmk = $('#txt_rmk').val();

            var detailsTableBody = $("#detailsTable tbody");
            var productItem = '<tr> <td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                '<td style="display:none">' + txtitmid + '</td>' +
                '<td>' + _Item_Name + '</td>' +
                '<td style="display:none">' + txtsca_id + '</td>' +
                '<td>' + txtscale + '</td>' +
                '<td>' + txtqty + '</td>' +
                '<td>' + txtappqty + '</td>' +
                '<td>' + txtrate + '</td>' +
                '<td>' + txtgst + '</td>' +
                '<td style="display:none">' + txttotalamt + '</td>' +
                '<td>' + txamt + '</td>' +
                '<td>' + txtdrmk + '</td>' +
                '</tr>';
            detailsTableBody.append(productItem);
            clearonkeypess();

        }
    }
});
function clearonkeypess() {
    $('#txt_itm').select2('val', '');
    $('#txt_qty').val('');
    $('#txt_rate').val(0);
    $('#txt_scale').val('');
    $('#txt_scale_Id').val('');
    $('#txt_appqty').val('')
    $('#txt_tamt').val(0);
    $('#txt_rmk').val('');
    $('#txt_amt').val(0);
    $('#txt_gst').val(0);
}
//clear text Start
function cleartext() {
    $('#txt_dpt').val('');
    $('#txt_req').select2('val', '');
    $('#txt_sup').select2('val', '');
    $('#txt_cr').val('');
    $("#ck_mprck").iCheck('update')[0].checked;
    $("#ck_auth").iCheck('update')[0].checked;
    $("#ck_act").iCheck('update')[0].checked;
}
//clear text End

//Delete from Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    output = confirm('Are sure wants to delete?');
    if (output == false) {

        return false;
    }

    e.preventDefault();
    var $self = $(this);
    if ($(this).attr('data-itemId') == "0") {
        $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {

            $(this).remove();
            //dgcal("E");
        });
    }
});
//Delete from Table End

//Validation Start
function ckvalidation() {
    var detail_record = "";
    var rows_create = $("#detailsTable tbody >tr");
    var ck = 0;
    var columns = '';
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        if (detail_record == "") {
            detail_record = $(columns[1]).html() + "|" + $(columns[3]).html() + "|" + $(columns[5]).html() + "|" + $(columns[6]).html() + "|" + $(columns[7]).html() + "|" + $(columns[8]).html() + "|" + $(columns[9]).html() + "|" + $(columns[10]).html() + "|" + $(columns[11]).html();
        }
        else {
            detail_record += "|" + $(columns[1]).html() + "|" + $(columns[3]).html() + "|" + $(columns[5]).html() + "|" + $(columns[6]).html() + "|" + $(columns[7]).html() + "|" + $(columns[8]).html() + "|" + $(columns[9]).html() + "|" + $(columns[10]).html() + "|" + $(columns[11]).html();
        }

    }
    if (detail_record == '') {
        Swal.fire({
            title: 'Please Select the Purchae Order',
            icon: 'error'
        })
    }
    return { ckval: ck, detailrecord: detail_record };
}
//Validation End

//Calculation Start


function Amount() {
    var tamt = 0;
    var appqty = 0;
    var rate = 0;
    var gst = 0;
    var amt = 0;

    appqty = $('#txt_appqty').val();
    rate = $('#txt_rate').val();
    gst = $('#txt_gst').val();
    if (appqty == "") { appqty = 0 }
    else if (rate == "") { rate = 0 }
    else if (gst == "") { gst = 0 }
    amt = (parseFloat(appqty) * parseFloat(rate));
    tamt = (parseFloat(appqty) * parseFloat(rate)) / 100 * parseFloat(gst);

    $('#txt_amt').val(amt);
    $('#txt_tamt').val(parseFloat(tamt) + parseFloat(amt));

}
var txtdat = $("#txt_dat");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_upd");
var Qtyblock = $("#Qty_block");
var _Mpb_ID = 0;
var txtamt = $("#txt_amt");
var txtdisper = $("#txt_disper");
var txtdisamt = $("#txt_disamt");
var txtnetamt = $("#txt_netamt");
var txtgstper = $("#txt_gstper");
var txtgstamt = $("#txt_gstamt");
var txtact = $("#ck_can");



var _Sup_ID = '0';
var _Sup_Name = '';

var _Requisition_ID = '0';
var _Requisition_Name = '';

var _Item_ID = '0';
var _Item_Name = '';

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    imgloadsav.hide();
    discon();
    btnsav.show();
    $('#data_Modal').modal('show');
    $("#detailsTable > tbody").html("");
    btnupd.hide();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);

});

//Discon Start
function discon() {
    document.getElementById('create_form').reset();
    $("#txt_id").html('');
    $("#txt_rmk").val('');
    var txtdpt = $('#txt_dpt').select2('val', '');
    var txtemp = $('#txt_emp').select2('val', '');
    $("#txt_rmk").val('');
    $("#txt_scaleId").val('');
    $("#txt_scale").val('');
    txtdpt.html('');
    txtemp.html('');
    cleartext();


    btnsav.hide();
    btnupd.hide();

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Onload();
    imgload.hide();
    imgloadsav.hide();
};
//Discon End
$(function () {
    txtdat.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    //Qtyblock.hide();
    //Onload();
    discon();
    ComponentsDropdowns.init();

});

// Onload_Device Start 
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/Purchase/Transaction/PurchaseOrder/GetPurchaseOrder',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Menu": _menid }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {

            var jres = response;
            if (jres[0].status == 1) {

                var action_button = ' ';
                //New
                if (Boolean(response[0]["Record_Insert"])) {
                    btnnew.show();
                }

                if (response[0]["Result"] != null) {


                    //Print
                    if (response[0]["Result"][0]["Permission_Print"] == 'True') {
                        action_button += "<a href='#' class='btn-print glyphicon glyphicon-print' data-toggle='tooltip' title='Print'></a> ";
                    }
                    //Delete
                    if (response[0]["Result"][0]["Permission_Delete"] == 'True') {
                        action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                    }
                    //Update
                    if (response[0]["Result"][0]["Permission_Update"] == 'True') {
                        action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                    }

                    var json = response[0]["Result"];
                    array = response[0]["Result"];


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
                            // {
                            //     data: 'Date',
                            //     type: 'date',
                            //     render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
                            // },
                            { data: 'Supplier' },
                            // { data: 'Department' },

                        ],
                        "order": [[2, "desc"], [1, "desc"]],
                        "pageLength": 10,
                    });

                }
                imgload.hide();

            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,

                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
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
                timer: 1500,
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
// Onload_Device End 



// Create Start 
function savrec() {

    var ck = ckvalidation();
    detailrecord = ck.detailrecord;

    if ($("#txt_sup").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select Supplier",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else if ($("#txt_grn").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select GRN",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }

    else if (detailrecord == "") {
        Swal.fire({
            icon: 'error',
            title: "Please fill table data",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else {
        var _txtdat = txtdat.find("input").val();
        var supId = $("#txt_sup").val();
        var grnId = $("#txt_grn").val();
        var txtck_mprck = $("#ck_mprck").iCheck('update')[0].checked;
        var txtck_auth = $("#ck_auth").iCheck('update')[0].checked;
        var txtck_act = $("#ck_act").iCheck('update')[0].checked;



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

                var urlStr = apiUrl + '/Purchase/Transaction/PurchaseBill/create';
                $.ajax({
                    url: urlStr,
                    type: "Post",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({
                        "Token": strkey,
                        "Date": _txtdat,
                        "Sup_Id": supId,
                        "GRN_Id": grnId,
                        "Ckeck_by": txtck_mprck,
                        "Authorize_by": txtck_auth,
                        "Close_Act": txtck_act,
                        "Detail": detailrecord
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
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
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
                            btnsav.show();
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'error',
                                showConfirmButton: false,
                                timer: 1500,
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
                            timer: 1500,
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

}
// Create End
//Update Start
function updrec() {

    var ck = ckvalidation();
    detailrecord = ck.detailrecord;
    if ($("#txt_req").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select Requisition",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else if ($("#txt_sup").val() == "") {
        Swal.fire({
            icon: 'error',
            title: "Please select supplier",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }

    else if (detailrecord == "") {
        Swal.fire({
            icon: 'error',
            title: "Please fill table data",
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });
    }
    else {
        var _mpo_id = $("#txt_id").html();
        var _txtdat = txtdat.find("input").val();
        var supId = $("#txt_sup").val();
        var mprId = $("#txt_req").val();
        var txtck_mprck = $("#ck_mprck").iCheck('update')[0].checked;
        var txtck_auth = $("#ck_auth").iCheck('update')[0].checked;
        var txtck_act = $("#ck_act").iCheck('update')[0].checked;



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

                var urlStr = apiUrl + '/Purchase/Transaction/PurchaseOrder/edit';
                $.ajax({
                    url: urlStr,
                    type: "Post",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({
                        "Token": strkey,
                        "ID": _mpo_id,
                        "Date": _txtdat,
                        "Sup_Id": supId,
                        "Mpr_Id": mprId,
                        "Ckeck_by": txtck_mprck,
                        "Authorize_by": txtck_auth,
                        "Close_Act": txtck_act,
                        "Detail": detailrecord
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
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
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
                            btnsav.show();
                            Swal.fire({
                                title: `${jres[0].Remarks}`,

                                icon: 'error',
                                showConfirmButton: false,
                                timer: 1500,
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
                            timer: 1500,
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

}
//Update End







//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mpo_id = data['ID'];

    var _Stage = data['stage'];

    if (_Stage != 'Open') {
        Swal.fire({
            title: "Bill has been " + _Stage,
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
        title: "Are you sure wants to delete Purchase Order # " + _mpo_id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: apiUrl + '/Purchase/Transaction/PurchaseOrder/delete/' + _mpo_id,
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

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();

    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mpo_id = data['ID'];

    imgloadsav.hide();

    var _Stage = data['stage'];

    if (_Stage != 'Open') {
        Swal.fire({
            title: "Bill has been " + _Stage,
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
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Swal.fire({
        title: "Are you sure wants to edit purchase Order # " + _mpo_id + "?",
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
                url: apiUrl + '/Purchase/Transaction/PurchaseOrder/FetchPurchaseOrder/' + _mpo_id,
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

                        txtdat.find("input").val(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                        //txtddat.find("input").val(moment(response[0]["Result"][0]["DDate"]).format("DD-MMM-YYYY"));

                        _Requisition_ID = response[0]["Result"][0]["mpr_ID"];
                        _Requisition_Name = response[0]["Result"][0]["Requisition"];
                        $('#txt_req').val(_Requisition_ID); // Select the option with a value of '1'
                        $('#txt_req').trigger('change'); // Notify any JS components that the value changed

                        _Sup_ID = response[0]["Result"][0]["sup_ID"];
                        _Sup_Name = response[0]["Result"][0]["Supplier"];
                        $('#txt_sup').val(_Sup_ID); // Select the option with a value of '1'
                        $('#txt_sup').trigger('change'); // Notify any JS components that the value changed

                        $("#txt_dpt").val(response[0]["Result"][0]["Deparment"]);
                        $("#txt_cr").val(response[0]["Result"][0]["CredDay"]);

                        if (!response[0]["Result"][0]["Check_by"]) {
                            $('#ck_mprck').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Check_by"]) {
                            $('#ck_mprck').iCheck('check'); //To check the radio button
                        }
                        if (!response[0]["Result"][0]["Check_auth"]) {
                            $('#ck_auth').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Check_auth"]) {
                            $('#ck_auth').iCheck('check'); //To check the radio button
                        }
                        if (!response[0]["Result"][0]["Check_act"]) {
                            $('#ck_act').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Check_act"]) {
                            $('#ck_act').iCheck('check'); //To check the radio button
                        }

                        for (var i = 0; i < response[0]["Result"].length; i++) {
                            var productItem = '<tr>' +
                                '<td><a data-itemId="0"  class="deleteItem">Remove</a></td>' +
                                '<td style="display:none">' + response[0]["Result"][i]["Item_Id"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["ItemName"] + '</td>' +
                                '<td  style="display:none">' + response[0]["Result"][i]["Sca_Id"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Scale"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Qty"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["AppQty"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Rate"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Gst"] + '</td>' +
                                '<td style="display:none">' + response[0]["Result"][i]["Tamt"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Amt"] + '</td>' +
                                '<td>' + response[0]["Result"][i]["Remarks"] + '</td>' +
                                '</tr>';
                            detailsTableBody.append(productItem);
                        }
                        // _dgcal_detail();


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
//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mdn_id = data['ID'];


    Swal.fire({
        title: "Are sure wants to print Debit Note # " + _mdn_id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Print',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            var cre = "";
            cre = "t_mdn.mdn_id=" + _mdn_id;
            var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
            var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");
            sessionStorage.setItem(sessid, cre);
            sessionStorage.setItem(sessid_name, '');

            var win = window.open(apiUrl_View + '/Purchase_Report/DebitNoteReport?1&' + sessid + '&' + sessid_name, '_blank');

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

        }
    })
});
//Print end


//Fill Supplier Start
function FillSupplier() {
    $("#txt_sup").select2({
        placeholder: "Search for Supplier",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillSupplier',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {

                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Supplier,


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
            var data = { "id": _Sup_ID, "text": _Sup_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Supplier End




function FillGRN(_sup_id) {
    $("#txt_grn").select2({
        placeholder: "Search for GRN",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillGRNBySupplier',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _sup_id: _sup_id,
                    _srch: term, // search term
                    _key: strkey, // search term


                    page: page // page number

                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.GRN,


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
            var data = { "id": _GRN_ID, "text": _GRN_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
$('#txt_sup').on("select2-selected", function (e) {
    var _sup_id = $('#txt_sup').select2('data').id;
    FillGRN(_sup_id);

});
$('#txt_grn').on("select2-selected", function (e) {
    var _GRN_ID = $("#txt_grn").select2('data').id;
    FillGRNItems(_GRN_ID);

});

//Fill GRN Item Start
function FillGRNItems(_GRN_ID) {
    $("#txt_itm").select2({
        placeholder: "Search for GRN Items",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillItemByGRN',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _grn_id: _GRN_ID,
                    _srch: term, // search term
                    _key: strkey, // search term
                    page: page // page number

                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {

                    $.each(data[0].Result, function (index, item) {
                        myResults.push({
                            id: item.Item_Id,
                            text: item.Item_Name,
                            Qty: item.dgrn_qty,
                            sca_id: item.Sca_Id,
                            sca_name: item.sca_Name,
                            Rate: item.Rate,
                            Amount: item.Amount,
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
            var data = { "id": _Item_ID, "text": _Item_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill GRN Item End
$('#txt_itm').on("select2-selected", function (e) {
    $('#txt_qty').val($("#txt_itm").select2('data').Qty);
    $('#txt_rate').val($("#txt_itm").select2('data').Rate);
    $('#txt_amt').val($("#txt_itm").select2('data').Amount);
    $('#txt_scaid').val($("#txt_itm").select2('data').sca_id);
    $('#txt_scaname').val($("#txt_itm").select2('data').sca_name);
});

$("#txt_drmk").keyup(function (e) {
    if (e.keyCode === 13) {
        // if($('#txt_itm').val() == "")
        // {
        // Swal.fire({
        //     icon: 'error',
        //     title: "please select Item",
        //     showClass: {
        //         popup: 'animated fadeInDown faster'
        //     },
        //     hideClass: {
        //         popup: 'animated fadeOutUp faster'
        //     }
        // });
        // }
        // else
        // {
        _Item_ID = $('#txt_itm').val();
        _Item_Name = $('#txt_itm').select2('data').text
        var txtsca_id = $('#txt_scaid').val();
        var txtscale = $('#txt_scaname').val();
        var txtqty = $('#txt_qty').val();
        var txtdisper = $('#txt_discountPer').val();
        var txtdis = $('#txt_dis').val();
        var txtgst = $('#txt_gst').val();
        var txtother = $('#txt_other').val();
        var txtfed = $('#txt_fed').val();
        var txtdrmk = $('#txt_drmk').val();

        var detailsTableBody = $("#detailsTable tbody");
        var productItem = '<tr> <td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
            '<td style="display:none;">' + _Item_ID + '</td>' +
            '<td>' + _Item_Name + '</td>' +
            '<td style="display:none;">' + txtsca_id + '</td>' +
            '<td>' + txtscale + '</td>' +
            '<td>' + txtqty + '</td>' +
            '<td>' + txtdisper + '</td>' +
            '<td>' + txtdis + '</td>' +
            '<td>' + txtgst + '</td>' +
            '<td>' + txtother + '</td>' +
            '<td>' + txtfed + '</td>' +
            '<td>' + txtdrmk + '</td>' +
            '</tr>';
        detailsTableBody.append(productItem);
        clearonkeypess();

        //  }
    }
});
function clearonkeypess() {
    $('#txt_itm').select2('val', '');
    $('#txt_qty').val('');
    $('#txt_rate').val(0);
    $('#txt_scale').val('');
    $('#txt_scale_Id').val('');
    $('#txt_appqty').val('')
    $('#txt_tamt').val(0);
    $('#txt_rmk').val('');
    $('#txt_amt').val(0);
    $('#txt_gst').val(0);
}
//clear text Start
function cleartext() {
    $('#txt_dpt').val('');
    $('#txt_req').select2('val', '');
    $('#txt_sup').select2('val', '');
    $('#txt_cr').val('');
    $("#ck_mprck").iCheck('update')[0].checked;
    $("#ck_auth").iCheck('update')[0].checked;
    $("#ck_act").iCheck('update')[0].checked;
}
//clear text End

//Delete from Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    output = confirm('Are sure wants to delete?');
    if (output == false) {

        return false;
    }

    e.preventDefault();
    var $self = $(this);
    if ($(this).attr('data-itemId') == "0") {
        $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {

            $(this).remove();
            //dgcal("E");
        });
    }
});
//Delete from Table End

//Validation Start
function ckvalidation() {
    var detail_record = "";
    var rows_create = $("#detailsTable tbody >tr");
    var ck = 0;
    var columns = '';
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        if (detail_record == "") {
            detail_record = $(columns[1]).html() + "|" + $(columns[3]).html() + "|" + $(columns[5]).html() + "|" + $(columns[6]).html() + "|" + $(columns[7]).html() + "|" + $(columns[8]).html() + "|" + $(columns[9]).html() + "|" + $(columns[10]).html() + "|" + $(columns[11]).html();
        }
        else {
            detail_record += "|" + $(columns[1]).html() + "|" + $(columns[3]).html() + "|" + $(columns[5]).html() + "|" + $(columns[6]).html() + "|" + $(columns[7]).html() + "|" + $(columns[8]).html() + "|" + $(columns[9]).html() + "|" + $(columns[10]).html() + "|" + $(columns[11]).html();
        }

    }
    if (detail_record == '') {
        Swal.fire({
            title: 'Please Select the Purchae Order',
            icon: 'error'
        })
    }
    return { ckval: ck, detailrecord: detail_record };
}
//Validation End

//Calculation Start


function Amount() {
    var tamt = 0;
    var appqty = 0;
    var rate = 0;
    var gst = 0;
    var amt = 0;

    appqty = $('#txt_appqty').val();
    rate = $('#txt_rate').val();
    gst = $('#txt_gst').val();
    if (appqty == "") { appqty = 0 }
    else if (rate == "") { rate = 0 }
    else if (gst == "") { gst = 0 }
    amt = (parseFloat(appqty) * parseFloat(rate));
    tamt = (parseFloat(appqty) * parseFloat(rate)) / 100 * parseFloat(gst);

    $('#txt_amt').val(amt);
    $('#txt_tamt').val(parseFloat(tamt) + parseFloat(amt));

}
