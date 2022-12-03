import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../../Login/DashboardPermissionByName.js';

var txtdatfrom = $("#txt_datFromInvoice");
var txtdatTo = $("#txt_datToInvoice");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxinvoice = $("#img_box_total_invoice");

$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    // txtdatfrom.find("input").val(CurrentDate);
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Sales/v1/SalesDashboard';
    //  CallNotification('Accounts');
    imgboxinvoice.hide();
    MenuPermission();



});

export function GetRecord() {
    MenuPermission();
}


async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("InvoiceDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        //Getinvoice();
    }

}
$(document).on('click', '#invoice', function () {

    Getinvoice();

});

// function MenuPermission() {
//     $.ajax({
//         url: apiUrl + '/api/Auth/v1/LOVServices/GetDashboardPermissionByName',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuName", "InvoiceDashboard");

//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 _viewPermission = response["data"]["view_Permission"];
//                 _checkPermission = response["data"]["check_Permission"];
//                 _approvedPermission = response["data"]["approve_Permission"];
//                 if (Boolean(_viewPermission)) {
//                     Getinvoice();
//                 }
//             }
//         },

//         error: function (xhr, status, err) {
//             Swal.fire({
//                 title: xhr.status.toString() + ' ' + err.toString(),

//                 icon: 'warning',
//                 showConfirmButton: true,

//                 showClass: {
//                     popup: 'animated fadeInDown faster'
//                 },
//                 hideClass: {
//                     popup: 'animated fadeOutUp faster'
//                 }

//             })
//         }
//     })
// }
//Get invoice
function Getinvoice() {

    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_noInvoice").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });

    var div_datamaster = $("#div_invoicemaster");
    div_datamaster.empty();
    div_datamaster.append('<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<div style="text-align:left;">' +
        '</div>' +
        '<div id="div_invoice" style="text-align:right;">' +
        '</div>' +
        '</div>');


    var div_data = $("#div_invoice");
    div_data.empty();


    var _CheckTotal = 0
    var _ApprovalTotal = 0;


    var txtbox_total_invoice = $("#box_total_invoice");
    var spn_totalinvoice = $("#spn_totalinvoice");

    txtbox_total_invoice.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");


    var refreshButton = " <button type='button' class='btn-refresh-invoice glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModelInvoice'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);


    var tblinvoiceheader = '';
    //Heading
    tblinvoiceheader = '<table class="table table-striped" id="Table_View_invoices" style="font-size:small;width:100%">';
    tblinvoiceheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tblinvoiceheader += '<tr>';
    tblinvoiceheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tblinvoiceheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Check</th>';
    tblinvoiceheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Approved</th>';
    tblinvoiceheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Cancel</th>';
    tblinvoiceheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Close</th>';
    tblinvoiceheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">No</th>';
    tblinvoiceheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tblinvoiceheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Customer</th>';
    tblinvoiceheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">PO #</th>';
    tblinvoiceheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Salesman</th>';
    tblinvoiceheader += '</tr>';
    tblinvoiceheader += '</thead>';
    tblinvoiceheader += '<tbody style="text-align:left">';
    tblinvoiceheader += '</tbody>';
    tblinvoiceheader += '</table>';
    div_data.append(tblinvoiceheader);

    imgboxinvoice.show();
    $.ajax({
        url: ApiForm + '/Getinvoice',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgboxinvoice.show();

        },
        success: function (response) {
            if (response.statusCode == 200) {

                _CheckTotal = response["data"].filter(c => c.check == false && c.approved == false).length;
                _ApprovalTotal = response["data"].filter(a => a.check == true && a.approved == false).length;

                txtbox_total_invoice.html("Check : " + _CheckTotal + " <br/> Approval : " + _ApprovalTotal + "");

                spn_totalinvoice.html(response["data"].length);





                var TableViewinvoices = $('#Table_View_invoices');

                var action_button = "";
                var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
                var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';

                if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-invoice glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }

                TableViewinvoices.dataTable({
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
                            data: 'check',
                            "render": function (data, type, full, meta) {

                                if (data == true) {
                                    return "<select id=ddl_check class='ddl-approved'  " + _disableCheck + ">" +
                                        "<option value=1 selected>Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_check class='ddl-approved'  " + _disableCheck + ">" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: 'approved',
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return "<select id=ddl_approved class='ddl-approved' " + _disableapproved + ">" +
                                        "<option value=1 selected>Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_approved class='ddl-approved' " + _disableapproved + ">" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: 'cancel',
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return "<select id=ddl_cancel class='ddl-approved'>" +
                                        "<option value=1 selected> Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_cancel class='ddl-approved'>" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: 'close',
                            "render": function (data, type, full, meta) {
                                if (data == true) {
                                    return "<select id=ddl_close class='ddl-approved'>" +
                                        "<option value=1 selected> Yes</option>" +
                                        "<option value=0 >No</option>" +
                                        "</select>";
                                }
                                else {
                                    return "<select id=ddl_close class='ddl-approved'>" +
                                        "<option value=1 >Yes</option>" +
                                        "<option value=0 selected>No</option>" +
                                        "</select>";
                                }
                            }
                        },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return "<a href='#' class='btn-print-invoice'>" + data.no + "</a>"// ;
                            }
                        },
                        {
                            data: 'date',
                            type: 'date',
                            render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
                        },

                        { data: "customerName" },
                        {
                            data: null,
                            render: function (data, type, row) {
                                if (data.customerPo != '') {
                                    return data.customerPo + '<br/>' + moment(data.customerPoDate).format('DD-MMM-YYYY')
                                }

                                return ''
                            }
                        },


                        { data: "salesmanName" },


                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Delivery Challan',
                    }
                    ],
                    "order": [[5, "desc"], [6, "asc"]],
                    "pageLength": 10
                });
                exportCSV()

                imgboxinvoice.hide();

            }
            else {
                imgboxinvoice.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxinvoice.hide();
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

$(document).on('click', '.btn-edit-invoice', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_invoices').DataTable().row(currentRow).data();
    var id = data["id"];
    var _close = $(this).closest('tr').find('#ddl_close option:selected').val();
    var _check = $(this).closest('tr').find('#ddl_check option:selected').val();
    var _approved = $(this).closest('tr').find('#ddl_approved option:selected').val();
    var _cancel = $(this).closest('tr').find('#ddl_cancel option:selected').val();

    var _data = JSON.stringify({
        "Id": id,
        "check": _check == 1 ? true : false,
        "approved": _approved == 1 ? true : false,
        "cancel": _cancel == 1 ? true : false,
        "close": _close == 1 ? true : false,
        "Type": "U",
        "menu_id": _menuid,
    });
    updrecinvoice(_data);
});

$(document).on('click', '.btn-refresh-invoice', function (e) {

    e.preventDefault();
    Getinvoice();
});



//invoice Update
function updrecinvoice(_data) {

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
                url: apiUrl + '/api/Sales/v1/SalesDashboard/UpdateInvoice',
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
                        Getinvoice();

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

$(document).on('click', '#btnSearchInvoice', function (e) {
    e.preventDefault();
    Getinvoice();
});



//Print invoice
// $(document).on('click', '.btn-print-invoice', function (e) {
//     e.preventDefault();
//     var currentRow = $(this).closest("tr");
//     var data = $('#Table_View_invoices').DataTable().row(currentRow).data();
//     var _employeeId = data['employeeId'];
//     var _no = data['no'];
//     var _date = data['date'];


//     var _cre = JSON.stringify({
//         "dateFrom": _date,
//         "dateTo": _date,
//         "no": String(_no),
//         "employeeId": _employeeId,
//     });
//     var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
//     sessionStorage.setItem(sessid, _cre);

//     var win = window.open(apiUrl_View + '/Sales/Report/DCReport?S=' + sessid, '_blank');


//     if (win) {
//         //Browser has allowed it to be opened
//         win.focus();
//     } else {
//         //Browser has blocked it
//         Swal.fire({
//             title: 'Please allow popups for this website',
//             icon: 'error'
//         })
//     }


// });

$(document).on('click', '.btn-print-invoice', function (e) {
    e.preventDefault();

    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_invoices').DataTable().row(currentRow).data();
    var _employeeId = data['employeeId'];
    var _no = data['no'];
    var _date = data['date'];


    var _cre = JSON.stringify({
        "dateFrom": _date,
        "dateTo": _date,
        "no": String(_no),
        "employeeId": _employeeId,
    });
    var sessid = moment(new Date()).format("DDMMYYYYHHMMSS");
    sessionStorage.setItem(sessid, _cre);
    var viewreport_url = apiUrl_View + '/Sales/Report/InvoiceReport?S=' + sessid;
    window.open(viewreport_url, '_blank');

    // $.ajax({
    //     url: apiUrl + '/api/Sales/v1/Sales/InvoiceReport',
    //     type: "Post",
    //     contentType: "application/json",
    //     dataType: "json",
    //     infoEmpty: "No records available - Got it?",
    //     data: _cre,
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader("Authorization", "Bearer " + strkey);
    //         imgboxinvoice.show();
    //     },
    //     success: function (response) {
    //         if (response.statusCode == 200) {

    //             const contentType = "application/pdf";
    //             const b64Data = response.data.split(',')[1]; //Replace this with your base64String
    //             const blob = b64toBlob(b64Data, contentType);
    //             const blobUrl = URL.createObjectURL(blob);
    //             var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,' +
    //                 'resizable,screenX=50,screenY=50,width=850,height=1050';
    //             window.open(blobUrl, "PDF", winparams);
    //         }
    //         else {
    //             imgboxinvoice.hide();
    //             var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
    //             Swal.fire({

    //                 title: _title,

    //                 icon: 'warning',
    //                 showConfirmButton: true,

    //                 showClass: {
    //                     popup: 'animated fadeInDown faster'
    //                 },
    //                 hideClass: {
    //                     popup: 'animated fadeOutUp faster'
    //                 }

    //             })
    //         }
    //     },
    //     error: function (xhr, status, err) {
    //         imgboxinvoice.hide();
    //         Swal.fire({
    //             title: xhr.status.toString() + ' ' + err.toString(),
    //             icon: 'warning',
    //             showConfirmButton: true,

    //             showClass: {
    //                 popup: 'animated fadeInDown faster'
    //             },
    //             hideClass: {
    //                 popup: 'animated fadeOutUp faster'
    //             }

    //         })
    //     }
    // })
});
// const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
//     const byteCharacters = atob(b64Data);
//     const byteArrays = [];
//     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//         const slice = byteCharacters.slice(offset, offset + sliceSize),
//             byteNumbers = new Array(slice.length);
//         for (let i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//         }
//         const byteArray = new Uint8Array(byteNumbers);
//         byteArrays.push(byteArray);
//     }
//     const blob = new Blob(byteArrays, { type: contentType });
//     return blob;
// }
