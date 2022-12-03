var imgboxreadyforDelivery = $("#img_box_readyfordelivery");

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Production/v1/ProductionDashboard';
    //ReadyForDelivery();
    CallNotification('Inventory');
    imgboxreadyforDelivery.hide();

});
$(document).on('click', '#readyfordelivery', function () {
    
    ReadyForDelivery();

});
$(document).on('click', '#jobdelivery', function () {
    // alert();
    
    
    
    // ApiForm = apiUrl + '/api/Production/v1/ProductionDashboard';
    // ReadyForDelivery();
    // CallNotification('Inventory');
    

    

  });

//Get Inventory Start
function ReadyForDelivery() {
    $('#div_readyfordelivery_inventory').empty();
    imgboxreadyforDelivery.show();

    var div_ViewReadyforDelivery = '<div class="col-md-12 col-xs-12">' +
        '<div class="bg-white" style="color: rgb(128, 128, 128); overflow:scroll; height:400px;padding: 2%">' +
        
        '<table class="table table-striped" id="Table_ViewReadyforDelivery" style="font-size:small;width:100%">' +
        '<thead>' +
        '<tr>' +
        '<th style="text-align:left">SO#</th>' +
        '<th style="text-align:left">Date</th>' +
        '<th style="text-align:left">PO#</th>' +
        '<th style="text-align:left">Customer</th>' +
        '<th style="text-align:left">Item</th>' +
        '<th style="text-align:left">Qty</th>' +
        '<th style="text-align:left">Delivered</th>' +
        '<th style="text-align:left">Balance</th>' +
        '<th style="text-align:left">Stock</th>' +
        '<th style="text-align:left">Days</th>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</div>' +
        '</div>';

    $('#div_readyfordelivery_inventory').append(div_ViewReadyforDelivery);

    $('#Table_ViewReadyforDelivery').DataTable().clear().destroy();
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
        url: apiUrl + '/api/Inventory/v1/Report/GetStockSummarySoWise',
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
                imgboxreadyforDelivery.hide();

                $("#box_readyfordelivery").html(response.data.length);
                $("#spn_ReadyforDelivery").html(response.data.length);


                detailsTableBody = $("#Table_ViewReadyforDelivery").dataTable({
                    data: response.data,
                    destroy: true,
                    retrieve: true,
                    paging: false,
                    columns: [
                        {
                            data: "soNo",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=SO#>' + data + '</span>'
                            }
                        },
                        {
                            data: 'soDate',
                            type: 'date',
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Date>' + moment(data).format('DD-MMM-YYYY') + '</span>'
                            }
                        },

                        {
                            data: null,
                            render: function (data, type, row) {
                                if (data.poNo != '') {
                                    return '<span data-toggle="tooltip" title=PO#>' + data.poNo + '</br>' + moment(data.poDate).format('DD-MMM-YYYY') + '</span>'
                                }
                                else { return ''; }
                            }
                        },
                        {
                            data: "customerName",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Customer>' + data + '</span>';
                            }
                        },
                        {
                            data: "itemName"
                            ,
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Item>' + data + '</span>';
                            }
                        },
                        {
                            data: "orderQty",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=OrderQty>' + accounting.formatNumber(data, 0) + '</span>';
                            }
                        },
                        {
                            data: "dcQty",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=DCQty>' + accounting.formatNumber(data, 0) + '</span>';
                            }
                        },
                        {
                            data: "balanceQty",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=BalanceQty>' + accounting.formatNumber(data, 0) + '</span>';
                            }
                        },
                        {
                            data: "stockQty",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=StockQty>' + accounting.formatNumber(data, 0) + '</span>';
                            }
                        },
                        {
                            data: "days",
                            render: function (data, type, row) {
                                return '<span data-toggle="tooltip" title=Days>' + data + '</span>';
                            }
                        },



                    ],
                    dom: 'Bfrtip',
                    buttons: [{
                        extend: 'csv',
                        className: 'btn btn-primary  glyphicon glyphicon-download csvExport aba',
                        text: '',
                        title: 'Ready For Delivery',

                        // action: function(e, dt, button, config) {

                        //     // Add code to make changes to table here

                        //     // Call the original action function afterwards to
                        //     // continue the action.
                        //     // Otherwise you're just overriding it completely.
                        //     $.fn.dataTable.ext.buttons.print.action(e, dt, button, config);
                        // }

                    }
                    ],

                    "order": [[1, "desc"], [2, "asc"]],
                    "pageLength": 10
                });

            }
            exportCS()


        },

        error: function (xhr, status, err) {
            imgboxreadyforDelivery.hide();

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

function exportCS() {
    $(".csvExport").css("margin-left", 1085);
    $('.csvExport').css('margin-top', -10);


}
$(document).on('click', '.aba', function () {

    //confirm("Are you sure want to download this file");

    // Swal.fire({
    //     title: 'Are you sure you want to update?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#5cb85c',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Update',
    //     showClass: {
    //         popup: 'animated fadeInDown faster'
    //     },
    //     hideClass: {
    //         popup: 'animated fadeOutUp faster'
    //     }
    // }).then((result) => {
    //     if (result.value) {
    //         exportCSV();
    //     }
    // });



});




// function CallInventorySocket() {
//     //Socket Start

//     var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl_Notification + "/notificationMessageHub").build();
//     connection.on("ReceiveNotificationMessage", function (topic, _DateTime, customerId, customerName, messageCategory, message) {
//         if (topic == apiUrl_NotificationCompany) {
//             if (messageCategory == "Inventory") {
//                 ReadyForDelivery();
//                 var msg = message;
//                 var msgDateTime = moment(_DateTime).format('LT');
//                 alertcnt += 1;
//                 titlecnt += 1;
//                 var ulmsgmaster = $('#ul_msg_master ul');
//                 var ulmsgmaster_old = ulmsgmaster.html();
//                 ulmsgmaster.empty();
//                 ulmsgmaster.append(
//                     '<li>' +
//                     '<a href="javascript:;">' +
//                     '<span class="time">' + msgDateTime + '</span>' +
//                     '<span class="details">' +
//                     msg +
//                     '</span>' +
//                     '</a>' +
//                     '</li>'
//                 );
//                 ulmsgmaster.append(ulmsgmaster_old);
//                 $('#spn_alert_master').html(alertcnt);
//                 $('#spn_alert_master').css("background", "red");
//                 lbltitle.html('(' + titlecnt + ')' + title);


//                 //Web Notification Start
//                 //console.log(Notification.permission);
//                 if (Notification.permission === "granted") {
//                     //alert("we have permission");
//                     showWebNotification(msgDateTime, msg);
//                 }
//                 else if (Notification.permission !== "denied") {
//                     //        Notification.requestPermission().then(permission => { console.log(permission); });

//                     Notification.requestPermission().then(permission => {
//                         if (permission === "granted") { showWebNotification(); }
//                     });
//                 }    //Web Notification End
//             }
//         }
//     });
//     connection.start().then(function () {
//         // document.getElementById("sendButton").disabled = false;
//         //console.log("Socket Connected");
//     }).catch(function (err) {
//         return console.error(err.toString());
//     });
// }
// // Get JobOrder End