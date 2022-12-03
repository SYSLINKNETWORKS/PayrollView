import { functionDashboardPermissionByName as DashboardPermissionByName } from '../../..//Login/DashboardPermissionByName.js';

var txtdatfrom = $("#txt_datFromjoborder");
var txtdatTo = $("#txt_datTojoborder");

var ApiForm = '';
var _viewPermission = false;
var _checkPermission = false;
var _approvedPermission = false;
var imgboxjoborder = $("#img_box_total_joborder");
var imgboxproduction = $("#img_box_production");


$(document).ready(function () {
    txtdatfrom.datetimepicker({ format: 'DD/MMM/YYYY' });
    txtdatTo.datetimepicker({ format: 'DD/MMM/YYYY' });

    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdatTo.find("input").val(CurrentDate);


    ApiForm = apiUrl + '/api/Production/v1/ProductionDashboard';
    imgboxjoborder.hide();
    imgboxproduction.hide();
    MenuPermission();
});

export function GetRecord() {

    MenuPermission();
}
async function MenuPermission() {
    let _Permission = await DashboardPermissionByName("joborderDashboard");
    _viewPermission = _Permission[0];
    _checkPermission = _Permission[1];
    _approvedPermission = _Permission[2];
    if (Boolean(_viewPermission)) {
        // CallApi();
    }

}

// function MenuPermission() {
//     $.ajax({
//         url: apiUrl + '/api/Auth/v1/LOVServices/GetDashboardPermissionByName',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuName", "joborderDashboard");

//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 _checkPermission = response["data"]["check_Permission"];
//                 _approvedPermission = response["data"]["approve_Permission"];
//                 CallApi();
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



function CallApi() {
    var txtDatFrom1 = '';
    var txtDatTo1 = '';
    if (txtdatfrom.find("input").val() != '') {
        txtDatFrom1 = moment(txtdatfrom.find("input").val()).format("YYYY-MM-DD");
        txtDatTo1 = moment(txtdatTo.find("input").val()).format("YYYY-MM-DD");
    }

    var _cre = JSON.stringify({
        "no": $("#txt_nojoborder").val(),
        "dateFrom": txtDatFrom1,
        "dateTo": txtDatTo1,
        "menuId": _menuid,
    });
    $.ajax({
        url: ApiForm + '/GetJobOrder',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgboxjoborder.show();
            imgboxproduction.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {


                imgboxjoborder.hide();
                imgboxproduction.hide();

                Getjoborder(response);
                FillJobOrderOpenCard(response.data);


                // Getjoborde(response.data);
                // Getjoborder(response);
                // FillJobOrderOpenCard(response.data);
            }
            else {
                imgboxjoborder.hide();
                imgboxproduction.hide();
            }
        },
        error: function (xhr, status, err) {

            imgboxjoborder.hide();
            imgboxproduction.hide();
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


}



$(document).on('click', '#joborder', function () {
    CallApi();
});

$(document).on('click', '#production', function () {
    CallApi();
});




//Get joborder
function Getjoborder(response) {

    var div_data = $("#div_joborder");
    div_data.empty();



    var _JobTotal = 0


    var txtbox_total_joborder = $("#box_total_joborder");
    var spn_totaljoborder = $("#spn_totaljoborder");

    txtbox_total_joborder.html(_JobTotal);

    // var csvButton = " <button type='button' class='btn-csv-joborder glyphicon glyphicon-download btn btn-primary'></button>";
    var refreshButton = " <button type='button' class='btn-refresh-joborder glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModeljoborder'></button>";
    // div_data.append(csvButton);
    div_data.append(refreshButton);
    div_data.append(searchButton);


    var tbljoborderheader = '';
    //Heading
    tbljoborderheader = '<table class="table table-striped" id="Table_View_joborder" style="font-size:small;width:100%">';
    tbljoborderheader += '<thead style="color: rgb(128, 128, 128);text-align:center;">';
    tbljoborderheader += '<tr style= "text-align:right;">';
    tbljoborderheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Action</th>';
    tbljoborderheader += '<th scope="col" style="width:5%;padding-top: 4%;text-align:center">Close</th>';
    tbljoborderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Job #</th>';
    tbljoborderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Date</th>';
    tbljoborderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">SO #</th>';
    tbljoborderheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">PO #</th>';
    tbljoborderheader += '<th scope="col" style="width:40%;padding-top: 4%;text-align:center">Customer</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Item</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Description</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Sheet Qty</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Order Qty</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Packing Qty</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Balance Qty</th>';
    tbljoborderheader += '</tr>';
    tbljoborderheader += '</thead>';
    tbljoborderheader += '<tbody style="text-align:left">';
    tbljoborderheader += '</tbody>';
    tbljoborderheader += '</table>';
    div_data.append(tbljoborderheader);


    _JobTotal = response["data"].length;
    //_OpenJobTotal = response["data"].filter(a => a.close == false).length;

    txtbox_total_joborder.html(_JobTotal);

    spn_totaljoborder.html(response["data"].length);


    var TableViewjoborders = $('#Table_View_joborder');

    var action_button = "";
    var _disableCheck = !Boolean(_checkPermission) ? 'disabled=true' : '';
    var _disableapproved = !Boolean(_approvedPermission) ? 'disabled=true' : '';
    if (_disableCheck == '' || _disableapproved == '') { action_button = "<a href='#' class='btn-edit-joborder glyphicon glyphicon-edit' data-toggle='tooltip' title='Action'></a>"; }

    TableViewjoborders.dataTable({
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
                    return "<a href='#' class='btn-print-joborder'><span data-toggle='tooltip' title=Job No>" + data.jobNo + "</span></a>"// ;

                }
            },
            {
                data: 'jobDate',
                type: 'date',
                render: function (data, type, row) { return '<span data-toggle="tooltip" title=Job Date>' + moment(data).format('DD-MM-YYYY') + '</span>' }
            },
            {
                data: "soNo",
                render: function (data, type, row) { return '<span data-toggle="tooltip" title=SO #>' + data + '</span>' }
            },
            {
                data: null,
                render: function (data, type, row) {
                    if (data.customerPo != '') {
                        return '<span data-toggle="tooltip" title=PO#>' + data.poNo + '</span><br/>' + moment(data.poDate).format('DD-MMM-YYYY')
                    }

                    return ''
                }
            },

            {
                data: "customerName",
                render: function (data, type, row) {
                    return '<span data-toggle="tooltip" title=Customer>' + data + '</span>'
                }
            },


            {
                data: "itemName",
                render: function (data, type, row) {
                    return '<span data-toggle="tooltip" title=Item>' + data + '</span>'
                }
            },
            {
                data: "description",
                render: function (data, type, row) {
                    return '<span data-toggle="tooltip" title=Description>' + data + '</span>'
                }
            },
            {
                data: "sheetQty",
                render: function (data, type, row) {
                    return '<span data-toggle="tooltip" title=Qty>' + accounting.format(data) + '</span>'
                }
            },
            {
                data: "orderQty",
                render: function (data, type, row) {
                    return '<span data-toggle="tooltip" title=OrderQty>' + accounting.format(data) + '</span>'
                }
            },
            {
                data: "packingQty",
                render: function (data, type, row) {
                    return '<span data-toggle="tooltip" title=PackingQty>' + accounting.format(data) + '</span>'
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return '<span data-toggle="tooltip" title=BalanceQty>' + accounting.format(data.orderQty - data.packingQty); + '</span>'
                }
            },


        ],
        dom: 'Bfrtip',
        buttons: [{
            extend: 'csv',
            className: 'btn btn-primary glyphicon glyphicon-download exportCsv',
            text: '',
            title: 'Job Order'

        }
        ],
        "order": [[2, "asc"]],
        "pageLength": 10
    });
    exportCSV()
};

function exportCSV() {

    $('.exportCsv').css('margin-top', -60);
    $('.exportCsv').css('margin-right', 120);

}



$(document).on('click', '#btn-refresh-joborder', function (e) {

    e.preventDefault();
    CallApi();
});


//Print joborder
$(document).on('click', '.btn-edit-joborder', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_joborder').DataTable().row(currentRow).data();
    var id = data["id"];
    var _close = $(this).closest('tr').find('#ddl_close option:selected').val();


    var _data = JSON.stringify({
        "Id": id,
        "close": _close == 1 ? true : false,
    });
    UpdateJobOrderRecord(_data);
});

//Update Update JobOrder 
function UpdateJobOrderRecord(_data) {

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
                url: ApiForm + '/UpdateJobOrder',// apiUrl + '/api/Production/v1/ProductionDashboard/UpdateJobOrder',
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);

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

                        });
                        GetRecord();

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

function FillJobOrderOpenCard(_Data) {
    var div_data = $("#div_joborderProduction");
    div_data.empty();


    var _JobTotal = 0


    var box_production = $("#box_production");
    var spn_totalproduction = $("#spn_totalproduction");

    box_production.html(_JobTotal);



    var refreshButton = " <button type='button' class='btn-refresh-joborder glyphicon glyphicon-refresh btn btn-primary'></button>";
    var searchButton = " <button type='button' class='glyphicon glyphicon-search btn btn-primary' data-toggle='modal' data-target='#searchModeljoborder'></button>";
    div_data.append(refreshButton);
    div_data.append(searchButton);


    var tbljoborderheader = '';
    //Heading
    tbljoborderheader = '<table class="table table-striped" id="Table_ViewProduction" style="font-size:small; width:100%" >';
    tbljoborderheader += '<thead style="color: rgb(128, 128, 128);text-align:center;" >';
    tbljoborderheader += '<tr>';
    tbljoborderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">Job #</th>';
    tbljoborderheader += '<th scope="col" style="width:10%;padding-top: 4%;text-align:center">SO #</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Item</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Qty</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Printing</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">UV</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Lamination</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Foiling</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">DieCutting</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Pasting</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Eyelet</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Sublet</th>';
    tbljoborderheader += '<th scope="col" style="width:20%;padding-top: 4%;text-align:center">Packing</th>';
    tbljoborderheader += '</tr>';
    tbljoborderheader += '</thead>';
    tbljoborderheader += '<tbody style="text-align:left">';
    tbljoborderheader += '</tbody>';
    tbljoborderheader += '</table>';
    div_data.append(tbljoborderheader);

    const _FilterData = _Data.filter(d => d.balanceSheetQty > 0);
    box_production.html(_FilterData.length);
    spn_totalproduction.html(_FilterData.length);

    //Fill open Job table
    if (_Data.length > 0) {
        $('#Table_ViewProduction').DataTable().clear().destroy();
        var detailsTableBody = $("#Table_ViewProduction").removeAttr('width').dataTable({
            data: _FilterData,
            destroy: true,
            retrieve: true,
            paging: false,
            columns: [
                {
                    data: "jobNo",
                    render: function (data, type, row) {

                        return '<span data-toggle="tooltip" title=Job No>' + data + '</span>'
                    }
                },
                {
                    data: "soNo",
                    render: function (data, type, row) {

                        return '<span data-toggle="tooltip" title=SaleOrder No>' + data + '</span>'
                    }
                },
                {
                    data: "itemName",
                    render: function (data, type, row) {

                        return '<span data-toggle="tooltip" title=Item>' + data + '</span>'
                    }
                },
                {
                    data: "sheetQty",
                    render: function (data, type, row) {

                        return '<span data-toggle="tooltip" title=Qty>' + accounting.format(data) + '</span>'
                    }
                },
                {
                    data: "printingSheetQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=Printing Qty>' + accounting.format(data) + '</span>' }
                },
                {
                    data: "uvSheetQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=UV Qty>' + accounting.format(data) + '</span>'; }
                },
                {
                    data: "laminationSheetQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=Lamination Qty>' + accounting.format(data) + '</span>'; }
                },
                {
                    data: "foilingSheetQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=Foiling Qty>' + accounting.format(data) + '</span>'; }
                },
                {
                    data: "dieCuttingSheetQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=DieCutting Qty>' + accounting.format(data) + '</span>'; }
                },
                {
                    data: "pastingQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=Pasting Qty>' + accounting.format(data) + '</span>'; }
                },
                {
                    data: "eyeletQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=Eyelet Qty>' + accounting.format(data) + '</span>'; }
                },
                {
                    data: "subletQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=Sublet Qty>' + accounting.format(data) + '</span>'; }
                },
                {
                    data: "packingQty",
                    render: function (data, type, row) { return '<span data-toggle="tooltip" title=Packing Qty>' + accounting.format(data) + '</span>'; }
                },
            ],
            dom: 'Bfrtip',
            buttons: [{
                extend: 'csv',
                className: 'btn btn-primary  glyphicon glyphicon-download exportCsv',
                text: '',
                title: 'Production'


            }
            ],
            "order": [[0, "asc"]],
            "pageLength": 10
        });

    }
    exportCSV();

}



$(document).on('click', '#btnSearchjoborder', function (e) {
    e.preventDefault();
    CallApi();
});
//Print Job Order
$(document).on('click', '.btn-print-joborder', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View_joborder').DataTable().row(currentRow).data();
    var _employeeId = data['employeeId'];
    var _no = data['jobNo'];
    var _date = data['jobDate'];


    var _cre = JSON.stringify({
        "dateFrom": _date,
        "dateTo": _date,
        "no": String(_no),
        "employeeId": _employeeId,
    });
    var sessid = moment(new Date()).format("DDMMYYYYHHmmss");
    sessionStorage.setItem(sessid, _cre);

    var win = window.open(apiUrl_View + '/Production/Report/JobOrderProduction?S=' + sessid, '_blank');


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

