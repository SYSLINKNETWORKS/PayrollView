var imgboxMinimumStockLevel = $("#img_box_MinimumStockLevel");

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Production/v1/ProductionDashboard';
    //MinimumStockLevel();
    CallNotification('Inventory');
    imgboxMinimumStockLevel.hide();


});
$(document).on('click', '#minimumstocklevel', function () {
    
    MinimumStockLevel();

});

//Get Inventory Start
function MinimumStockLevel() {
    $('#div_MinimumStockLevel_inventory').empty();
    imgboxMinimumStockLevel.show();

    var div_ViewMinimumStockLevel = '<div class="col-md-12 col-xs-12">' +
        '<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        '<table class="table table-striped" id="Table_ViewMinimumStockLevel" style="font-size:small;width:100%">' +
        '<thead>' +
        '<tr>' +
        '<th style="text-align:left">Item</th>' +
        '<th style="text-align:left">Warehouse</th>' +
        '<th style="text-align:left">Stock Qty</th>' +
        '<th style="text-align:left">MSL</th>' +
        '<th style="text-align:left">Re-Order Qty</th>' +
        '<th style="text-align:left">Status</th>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</div>' +
        '</div>';

    $('#div_MinimumStockLevel_inventory').append(div_ViewMinimumStockLevel);

    $('#Table_ViewMinimumStockLevel').DataTable().clear().destroy();
    var _cre = JSON.stringify({
        "itemCategoryId": "",
        "itemSubCategoryMasterId": "",
        "itemSubCategoryId": "",
        "itemBrandId": "",
        "itemId": "",
        "branchId": "",
        "dateFrom": "",
        "dateTo": "",
        "saleOrderMasterId": "",
        "saleOrderDetailId": "",
        "warehouseID": ""
    });
    $.ajax({
        url: apiUrl + '/api/Inventory/v1/Report/GetMinimumStockLevel',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: _cre,
        headers: {
            'Authorization': 'Bearer ' + strkey
        },
        beforeSend: function () {


        },
        success: function (response) {
            if (response.statusCode == 200) {
                imgboxMinimumStockLevel.hide();

                $("#box_MinimumStockLevel").html(response.data.length);
                $("#spn_MinimumStockLevel").html(response.data.length);


                detailsTableBody = $("#Table_ViewMinimumStockLevel").dataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    paging: false,
                    columns: [
                        {
                            data: "itemName",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Item>' + data + '</span>';
                            }
                        },
                        {
                            data: "warehouseName",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Warehouse>' + data + '</span>';
                            }
                        },
                        {
                            data: "stockQty",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=StockQty>' + accounting.formatNumber(data, 0) + '</span>';
                            }
                        },
                        {
                            data: "mslQty",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=MSL>' + accounting.formatNumber(data, 0) + '</span>';
                            }
                        },
                        {
                            data: "reOrderQty",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Re-Order>' + accounting.formatNumber(data, 0) + '</span>';
                            }
                        },
                        {
                            data: "status",
                            render: function (data, type, row) {
                                var _style = data == 'Danger' ? 'style="color:Red"' : data == 'Warning' ? 'style="color:Orange"' : data == 'Good' ? 'style="color:Green"' : '';

                                return '<span ' + _style + '>' + '<span data-toggle="tooltip" title=Status>' + data + '</span>' + '</span>';
                            }
                        },



                    ],
                    // columnDefs: [
                    //     {
                    //         //targets: [0, 1, 2, 3, 4, 5],
                    //         render: function (data, type) {
                    //             // if (type == 'display') {
                    //             return '<span data-toggle="tooltip" title=Customer>' + data + '</span>';
                    //             // } else {
                    //             //     return data;
                    //             // }
                    //         }
                    //     }
                    // ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Minimum Stock Level',
                    }
                    ],
                    "order": [[1, "desc"], [2, "asc"]],
                    "pageLength": 10
                });
                exportCSV()
            }

        },
        error: function (xhr, status, err) {
            imgboxMinimumStockLevel.hide();

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


function exportCSV() {

    $('.csvExport').css('margin-top', -10);
    $('.csvExport').css('margin-left', 1085);

}