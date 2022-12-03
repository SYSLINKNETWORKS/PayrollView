import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../../Login/DashboardPermissionByName.js';
var txtdatfrom = $("#txt_datFromDetail");
var txtdatTo = $("#txt_datToDetail");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxquotation = $("#img_box_total_quotation");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Sales/v1/SalesDashboard';
    // CallNotification('Accounts');
    imgboxquotation.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}


async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("QuotationDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //GetQuotationDetail();
    }

}
$(document).on('click', '#quotationdetail', function () {
    
    GetQuotationDetail();

});

//Get Quotation Detail
function GetQuotationDetail() {


    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_noDetail").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });



    var div_dataDetailmaster = $("#div_quotationDetailmaster");
    div_dataDetailmaster.empty();
    div_dataDetailmaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_quotationDetail" style="text-align:right;">' +
        '</div>' +
        '</div>');

    var div_dataDetail = $("#div_quotationDetail");
    div_dataDetail.empty();



    var refreshButtonDetail = " <button type='button' class='btn-refresh-QuotationDetail glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButtonDetail = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelQuotationDetail'></button>";
    div_dataDetail.append(refreshButtonDetail);
    div_dataDetail.append(searchButtonDetail);




    var tblquotationDetailheader = '';
    //Heading
    tblquotationDetailheader = '<table class="table table-striped" id="Table_View_QuotationsDetail" style="font-size:small;width:100%">';
    tblquotationDetailheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblquotationDetailheader += '<tr>';
    tblquotationDetailheader += '<th scope="col" style="text-align:center">Action</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:center">Approved</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:center">No</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:center">Customer</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:center">Salesman</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:left">Item</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:right">Description</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:right">Quantity</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:right">Rate</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:right">Amount</th>';
    tblquotationDetailheader += '<th scope="col" style="text-align:center">Remarks</th>';
    tblquotationDetailheader += '</tr>';
    tblquotationDetailheader += '</thead>';
    tblquotationDetailheader += '<tbody style="text-align:left">';
    tblquotationDetailheader += '</tbody>';
    tblquotationDetailheader += '</table>';
    div_dataDetail.append(tblquotationDetailheader);

    var TableViewQuotationsDetail = $('#Table_View_QuotationsDetail');


    imgboxquotation.show();

    $.ajax({
        url: ApiForm + '/GetQuotationDetail',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            // xhr.setRequestHeader("MenuId", _menuid);

        },
        success: function (response) {

            if (response.statusCode == 200) {

                $("#spn_totalquotationDetail").html(response["data"].length)

                var action_button = "";
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';
                if (_disableapproved == '') { action_button = "<a href='#' class='btn-editQuotationDetail glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }


                TableViewQuotationsDetail.dataTable({
                    data: response["data"],
                    destroy: true,
                    retrieve: true,
                    paging: false,
                    searching: true,
                    columns: [
                        {
                            data: null,
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return action_button;
                                }
                                else {
                                    return action_button;
                                }
                            }
                        },

                        {
                            data: 'approved',
                            "render": function (data, type, full, meta) {
                                if (data == 0) {
                                    return "<select id=ddl_approvedDetail class='ddl-approved' " + _disableapproved + ">" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_approvedDetail class='ddl-approved' " + _disableapproved + ">" +
                                        "<option value=1 selected>Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                            }
                        },


                        {
                            data: null,
                            render: function (data, type, row) {
                                return "<a href='#' class='btn-print-quotationDetail'>" + data.no + "</a>"// ;
                            }
                        },
                        { data: "customerName" },
                        { data: "salesmanName" },
                        { data: "itemName" },
                        { data: "itemDescription" },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return accounting.format(data.quantity, 0)
                            }
                        },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return accounting.format(data.rate, 4)
                            }
                        },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return accounting.format(data.amount, 0)
                            }
                        },
                        { data: "remarks" },
                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Quotation Detail',
                    }
                    ],
                    "order": [[2, "desc"], [3, "asc"]],
                    "pageLength": 10
                });
                exportCSV()


                imgboxquotation.hide();

            }
            else {
                imgboxquotation.hide();
            }
        },
        error: function (xhr, status, err) {
            imgboxquotation.hide();
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
};


function exportCSV() {

    $('.csvExport').css('margin-top', -60);
    $('.csvExport').css('margin-right', 120);

}


//Quotation Detail
$(document).on('click', '.btn-editQuotationDetail', function (e) {
    e.preventDefault();
    var rows_create = $("#Table_View_QuotationsDetail tbody >tr");


    var _approveddetail = $(this).closest('tr').find('#ddl_approvedDetail option:selected').val();

    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_QuotationsDetail').DataTable().row(currentRow).data();
    var id = data["id"];
    var _data = JSON.stringify({
        "Id": id,
        "approved": _approveddetail == 1 ? true : false,
        "Type": "U",
        "menu_id": _menuid,
    });
    updrecQuotationDetails(_data);
});

$(document).on('click', '.btn-refresh-QuotationDetail', function (e) {

    e.preventDefault();
    GetQuotationDetail();
});


//Print Quotation Detail
$(document).on('click', '.btn-print-quotationDetail', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_QuotationsDetail').DataTable().row(currentRow).data();
    var _employeeId = data['employeeId'];
    var _no = data['no'];
    var _date = data['date'];
    var _rate = data['rate'];

    if (_rate == 0) {
        Swal.fire({
            title: 'Cost sheet not found',
            icon: 'error'
        })
        return;

    }
    var _cre = JSON.stringify({
        // "dateFrom": _date,
        // "dateTo": _date,
        "no": String(_no),
//        "employeeId": _employeeId,
    });
    var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
    sessionStorage.setItem(sessid, _cre);

    var win = window.open(apiUrl_View + '/Sales/Report/CostSheetReport?S=' + sessid, '_blank');


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


});

//Quotation Detail Update
function updrecQuotationDetails(_data) {

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
                url: apiUrl + '/api/Sales/v1/SalesDashboard/UpdateQuotationDetails',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    //imgloadsav.show();
                    //btnupd.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        GetQuotationDetail();

                        Swal.fire({
                            title: 'Record Update',

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

        }
    })

}

$(document).on('click', '#btnSearchQuotationDetail', function (e) {
    e.preventDefault();
    GetQuotationDetail();
});