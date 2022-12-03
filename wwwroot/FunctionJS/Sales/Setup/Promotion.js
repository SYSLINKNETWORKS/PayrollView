var txtdat = $("#txt_dat");
var txtdatfrm = $("#txt_datfrm");
var txtdatto = $("#txt_datto");
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new ");
var _Item_ID = 0;
var _Item_Name = '0';
var _FItem_ID = 0;
var _FItem_Name = '0';
var _Customer_ID = 0;
var _Customer_Name = '0';
var _Category_ID = 0;
var _Category_Name = '0';
var _Brand_ID = 0;
var _Brand_Name = '0';

$(document).ready(function () {
    $('#txt_freeitm').prop('disabled', true);

    imgload.hide();
    discon();
    ComponentsDropdowns.init();

});

function discon() {
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();
    $('#txt_id').html('');
    $('#ck_active').iCheck('update')[0].checked;
    $('#ck_active').iCheck('check'); //To check the radio button

    Onload();
    imgload.hide();
}
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/Sales/Setup/Promotion/GetPromotion',
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
                            "defaultContent": action_button,
                        },
                        { data: 'ID' },
                        {
                            data: 'Date',
                            type: 'date',
                            render: function (data, type, row) {
                                return moment(data).format('DD-MMM-YYYY')
                            }
                        },
                        {
                            data: 'Date_From',
                            type: 'date',
                            render: function (data, type, row) {
                                return moment(data).format('DD-MMM-YYYY')
                            }
                        },

                        {
                            data: 'Date_To',
                            type: 'date',
                            render: function (data, type, row) {
                                return moment(data).format('DD-MMM-YYYY')
                            }
                        },
                        { data: 'Category_Name' },
                        { data: 'Item_Name' },
                        { data: 'Free_Item_Name' },
                        { data: 'Cus_Name' },
                        { data: 'Min_Qty' },
                        { data: 'Bonus_qty' },
                        { data: 'Min_Amt' },
                        { data: 'Discount' },

                        {
                            data: 'Active',
                            "render": function (data, type, full, meta) {
                                if (data) {
                                    return 'Yes';
                                }
                                else { return 'No'; }
                            }
                        },
                        //{
                        //    data: 'Type',
                        //    "render": function (data, type, full, meta) {
                        //        if (data == 'S') {
                        //            return 'System';
                        //        }
                        //        else { return 'User'; }
                        //    }
                        //}

                    ],
                    "order": [[1, "desc"]],
                    "pageLength": 10
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
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);
});

$(function () {
    txtdat.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatfrm.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatto.datetimepicker({ format: 'DD-MMM-YYYY' });
});

function savrec() {
    var free_item = 0;
    var txtdat1 = txtdat.find("input").val();
    var txtdatfrm1 = txtdatfrm.find("input").val();
    var txtdatto1 = txtdatto.find("input").val();
    if (_FItem_ID > 0) {
        free_item = $('#txt_freeitm').select2('data').id
    }
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var detailrecord = ck.detailrecord;
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
            detailrecord = ck.detailrecord;
            var urlStr = apiUrl + '/Sales/Setup/Promotion/create';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "Date": txtdat1,
                    "Date_From": txtdatfrm1,
                    "Date_To": txtdatto1,
                    "Active": $("#ck_active").iCheck('Update')[0].checked,
                    "Category_ID": $('#txt_cat').select2('data').id,
                    "Item_ID": $('#txt_itm').select2('data').id,
                    "FreeItem_ID": free_item,
                    "MinQty": $("#txt_minqty").val(),
                    "BonusQty": $("#txt_bonusqty").val(),
                    "MinAmt": $("#txt_minAmt").val(),
                    "Discount": $("#txt_discper").val(),
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
    })
}

function updrec() {
    var free_item = 0;
    var txtdat1 = txtdat.find("input").val();
    var txtdatfrm1 = txtdatfrm.find("input").val();
    var txtdatto1 = txtdatto.find("input").val();
    if (_FItem_ID > 0) {
        free_item = $('#txt_freeitm').select2('data').id
    }
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var detailrecord = ck.detailrecord;
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
            detailrecord = ck.detailrecord;
            var urlStr = apiUrl + '/Sales/Setup/Promotion/edit';
    $.ajax({
        url: urlStr,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $('#txt_id').html(),
            "Date": txtdat1,
            "Date_From": txtdatfrm1,
            "Date_To": txtdatto1,
            "Active": $("#ck_active").iCheck('Update')[0].checked,
            "Category_ID": $('#txt_cat').select2('data').id,
            "Item_ID": $('#txt_itm').select2('data').id,
            "FreeItem_ID": free_item,
            "MinQty": $("#txt_minqty").val(),
            "BonusQty": $("#txt_bonusqty").val(),
            "MinAmt": $("#txt_minAmt").val(),
            "Discount": $("#txt_discper").val(),
            "Detail": detailrecord
        }),
        beforeSend: function () {
            btnupd.hide();
        },
        success: function (response) {
            if (response[0].status == 1) {
                $('#data_Modal').modal('hide');
                alert(response[0].Remarks);
                discon();
            }
            else {
                btnupd.show();
                alert(response[0].Remarks);
            }

        },
        error: function (error) {
            btnupd.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
            return true;
        }
    })
}


//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _prom_id = data['ID'];
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    Swal.fire({
        title: 'Are you sure wants to edit record# ' + _prom_id + '?',
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

                url: apiUrl + '/Sales/Setup/Promotion/FetchPromotionEdit/' + _prom_id,
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
                        $('#txt_id').html(_prom_id);
                        txtdat.find("input").val(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                        txtdatfrm.find("input").val(moment(response[0]["Result"][0]["Date_From"]).format("DD-MMM-YYYY"));
                        txtdatto.find("input").val(moment(response[0]["Result"][0]["Date_To"]).format("DD-MMM-YYYY"));

                        _Category_ID = response[0]["Result"][0]["procat_id"];
                        _Category_Name = response[0]["Result"][0]["procat_nam"];
                        $('#txt_cat').val(_Category_ID); // Select the option with a value of '1'
                        $('#txt_cat').trigger('change'); // Notify any JS components that the value changed

                        _Item_ID = response[0]["Result"][0]["Item_id"];
                        _Item_Name = response[0]["Result"][0]["Item_Name"];
                        $('#txt_itm').val(_Item_ID); // Select the option with a value of '1'
                        $('#txt_itm').trigger('change'); // Notify any JS components that the value changed

                        _Brand_ID = response[0]["Result"][0]["Brand_Id"];
                        _Brand_Name = response[0]["Result"][0]["Brand"];
                        $('#txt_brand').val(_Brand_ID); // Select the option with a value of '1'
                        $('#txt_brand').trigger('change'); // Notify any JS components that the value changed


                        $('#txt_minqty').val(response[0]["Result"][0]["Min_Qty"]);
                        $('#txt_bonusqty').val(response[0]["Result"][0]["Bonus_qty"]);
                        $('#txt_minAmt').val(response[0]["Result"][0]["Min_Amt"]);
                        $('#txt_discper').val(response[0]["Result"][0]["Discount"]);

                        if (response[0]["Result"][0]["Item_id_free"] != null) {
                            $('#txt_freeitm').prop('disabled', false);
                            _FItem_ID = response[0]["Result"][0]["Item_id_free"];
                            _FItem_Name = response[0]["Result"][0]["Free_Item_Name"];
                            $('#txt_freeitm').val(_FItem_ID); // Select the option with a value of '1'
                            $('#txt_freeitm').trigger('change'); // Notify any JS components that the value changed
                        }
                        if (!response[0]["Result"][0]["Active"]) {
                            $('#ck_active').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Active"]) {
                            $('#ck_active').iCheck('check'); //To check the radio button
                        }
                        //Detail Start
                        for (var i = 0; i < response[0]["Deatil_Result"].length; i++) {



                            var productItem = '<tr>' +
                                '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>'+
                                '<td id = cusid' + i + '>' + response[0]["Deatil_Result"][i]["cus_id"] + '</td>' +
                                '<td id = cusnam' + i + '>' + response[0]["Deatil_Result"][i]["cus_nam"] + '</td>' +
                                '<td style="width:5%"></td>' +
                                '</tr>';
                            detailsTableBody.append(productItem);

                        }

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

        }
    });

})
//Edit End

//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _prom_id = data['ID'];
    Swal.fire({
        text: "Are you sure wants to delete record# " + _prom_id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            $.ajax({

                url: apiUrl + '/Sales/Setup/Promotion/delete/' + _prom_id,
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
        }
    });
})
//Delete End

//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {
        FillBrand();
        FillItem();
        FillFreeItem();
        FillCustomer();
        FillCategory();
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End

//Fill Brand Start
function FillBrand() {
    $("#txt_brand").select2({
        placeholder: "Search for Brand",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillItemBrand',
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
                            text: item.Brand

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
            var data = { "id": _Brand_ID, "text": _Brand_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Brand End

//Fill Item Start
function FillItem() {
    $("#txt_itm").select2({
        placeholder: "Search for Item",
        minimumInputLength: 1,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillItemBrandWise',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    _bd_id: $("#txt_brand").select2('data').id,
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks,
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {
                        myResults.push({
                            id: item.ID,
                            text: item.Item,
                            Scale: item.Scale

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
//Fill Item End

//Fill Free Item Start
function FillFreeItem() {
    $("#txt_freeitm").select2({
        placeholder: "Search for a Item",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillFreeItem',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    _itm_id: _FItem_ID,
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
                            text: item.Item
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
            var data = { "id": _FItem_ID, "text": _FItem_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Fill Free Item End

//Fill Customer Start
function FillCustomer() {
    $("#txt_cus").select2({
        placeholder: "Search for a Customer",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillCustomer',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
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
                            text: item.Customer
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
            var data = { "id": _Customer_ID, "text": _Customer_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Fill Customer End

//Fill Customer Start
function FillCategory() {
    $("#txt_cat").select2({
        placeholder: "Search for a Category",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillCategory',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
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
                            text: item.Category
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
            var data = { "id": _Category_ID, "text": _Category_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}
//Fill Item End

$('#txt_cus').on("select2-selected", function (e) {
    var cusid = $("#txt_cus");
    var customer = '<tr>' +
        '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
        '<td>' + cusid.select2('data').id + '</td >' +
        '<td>' + cusid.select2('data').text + '</td >' +
        '</tr>';
    $("#detailsTable tbody").append(customer);
    cusid.select2('val', '');
    cusid.html('');
});

// After Add A New Order In The List, If You Want, You Can Remove It.
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

//Validation Start
function ckvalidation() {
    var txtdat1 = txtdat.find("input").val();
    var txtdatfrm1 = txtdatfrm.find("input").val();
    var txtdatto1 = txtdatto.find("input").val();
    var txtcat = $("#txt_cat").val();
    var txtitm = $("#txt_itm").val();
    var txtcus = $("#txt_cus").val();
    var detail_record = "";
    var rows_create = $("#detailsTable tbody >tr");
    var ck = 0;

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        if (detail_record == "") {
            detail_record = '[' + $(columns[1]).html().trim() + ']-';
        }
        else {
            detail_record = detail_record + "|" + '[' + $(columns[1]).html().trim() + ']-';
        }

    }

    if (txtdat1 == '') {
        ck = 1;
        Swal.fire({
            title: 'Please Enter Date',
            icon: 'error'
        })
    }
    else if (txtdatfrm1 == '') {
        ck = 1;
        Swal.fire({
            title: 'Please Enter Bilty Date',
            icon: 'error'
        })

    } else if (txtdatto1 == '') {
        ck = 1;
        Swal.fire({
            title: 'Please Enter Bilty Date',
            icon: 'error'
        })

    }
    else if (txtcat == '') {
        ck = 1;
        Swal.fire({
            title: 'Please Select Category',
            icon: 'error'
        })
    }

    else if (txtitm == '') {
        ck = 1;
        Swal.fire({
            title: 'Please Select Item',
            icon: 'error'
        })
    }
    //else if (txtcus == '') {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Please Select Customer',
    //        icon: 'error'
    //    })
    //}
    else if (rows_create.length == 0) {
        ck = 1;
        Swal.fire({
            title: 'Detail Record not found',
            icon: 'error'
        })
    }

    return { ckval: ck, detailrecord: detail_record };
}
//Validation End

$('#txt_cat').on("select2-selected", function (e) {
    var catid = $("#txt_cat").select2('data').id == 3;
    var itm = $('#txt_itm').val();
    if (itm != '') {
        _FItem_ID = $('#txt_itm').select2('data').id
    }
    if (catid) {
        $('#txt_freeitm').prop('disabled', false);
    } else {
        $('#txt_freeitm').select2('val', '');
        $('#txt_freeitm').html('');
        $('#txt_freeitm').prop('disabled', true);
        _FItem_ID = 0;
    }
});
$('#txt_itm').on("select2-selected", function (e) {
    var catid = $("#txt_cat").select2('data').id == 3;
    if (catid) {
        _FItem_ID = $('#txt_itm').select2('data').id
    }
});

$('#txt_itm').on("select2-removed", function (e) {
    _FItem_ID = 0;
});
$('#txt_cat').on("select2-removed", function (e) {
    $('#txt_freeitm').prop('disabled', true);
});
//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    $("#txt_id").html('');
    $("#txt_minqty").val(0);
    $("#txt_bonusqty").val(0);
    $("#txt_minAmt").val(0);
    $("#txt_discper").val(0);
    var txt_cat = $('#txt_cat')
    var txt_itm = $('#txt_itm')
    var txt_freeitm = $('#txt_freeitm')
    var txt_cus = $('#txt_cus')

     _Item_ID = 0;
     _Item_Name = '0';
     _FItem_ID = 0;
     _FItem_Name = '0';
     _Customer_ID = 0;
     _Customer_Name = '0';
     _Category_ID = 0;
     _Category_Name = '0';

    $('#ck_active').iCheck('update')[0].checked;

    txt_cat.select2('val', '');
    txt_cat.html('');

    txt_itm.select2('val', '');
    txt_itm.html('');

    txt_freeitm.select2('val', '');
    txt_freeitm.html('');

    txt_cus.select2('val', '');
    txt_cus.html('');

    btnsav.hide();
    btnupd.hide();
    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);
    Onload();
    imgload.hide();
    imgloadsav.hide();
    ComponentsDropdowns.init();
};
//Discon End