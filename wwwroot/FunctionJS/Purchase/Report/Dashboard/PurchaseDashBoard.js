var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
CallNotification('Procurement');


// var _check = false;
// var _approved = false;

// var imgboxquotation = $("#img_box_total_quotation");
// var imgboxsaleorder = $("#img_box_total_saleorder");
// var imgboxdc = $("#img_box_total_dc");
// var imgboxinvoice = $("#img_box_total_invoice");
// var imgboxreceipt = $("#img_box_total_receipt");
// var imgboxcreditnote = $("#img_box_total_creditnote");


// var txtDate = $("#txt_Date");
// var txtDataUnApproval = $("#txt_DataUnApproval");
// var txtDataApproval = $("#txt_DataApproval");


// var ApiForm = '';


// $(function () {
//     txtDate.datetimepicker({ format: 'DD/MMM/YYYY' });
//     txtDataUnApproval.datetimepicker({ format: 'DD/MMM/YYYY' });
//     txtDataApproval.datetimepicker({ format: 'DD/MMM/YYYY' });
// });


// $(document).ready(function () {

//     var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
//     txtDate.find("input").val(CurrentDate);
//     txtDataUnApproval.find("input").val(CurrentDate);
//     txtDataApproval.find("input").val(CurrentDate);


//     ApiForm = apiUrl + '/api/Sales/v1/SalesDashboard';

//     CallNotification('Sales');

//     imgboxquotation.hide();
//     imgboxsaleorder.hide();
//     imgboxdc.hide();
//     imgboxinvoice.hide();
//     imgboxreceipt.hide();
//     imgboxcreditnote.hide();

//     MenuPermission();

// });
// function MenuPermission() {
//     $.ajax({
//         url: apiUrl + '/api/Auth/v1/LOVServices/GetMenuPermissionByMenuId',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);

//         },
//         success: function (response) {

//             if (response.statusCode == 200) {
//                 _check = response["data"]["check_Permission"];
//                 _approved = response["data"]["approve_Permission"];
//                 GetRecord();
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

// function GetRecord() {
//     GetTotalCount();
//     GetQuotation();
//     GetQuotationDetail();
//     GetSaleOrder();
//     GetDeliveryChallan();
//     GetInvoice();
//     // GetCreditNote();
// }

// //Get Total Count
// function GetTotalCount() {

//     var txtDate1 = moment(txtDate.find("input").val()).format("YYYY-MM-DD");
//     var txtbox_total_quotation = $("#box_total_quotation");
//     var spn_totalquotation = $("#spn_totalquotation");

//     var txtbox_total_saleorder = $("#box_total_saleorder");
//     var spn_totalsaleOrder = $("#spn_totalsaleOrder");

//     var txtbox_total_dc = $("#box_total_dc");
//     var spn_totaldc = $("#spn_totaldc");

//     var txtbox_total_invoice = $("#box_total_invoice");
//     var spn_totalinvoice = $("#spn_totalinvoice");

//     var txtbox_total_receipt = $("#box_total_receipt");
//     var spn_totalreceipt = $("#spn_totalreceipt");

//     var txtbox_total_creditnote = $("#box_total_creditnote");
//     var spn_totalcreditnote = $("#spn_totalcreditnote");

//     $.ajax({
//         url: ApiForm + '/GetTotalCount',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);
//             imgboxquotation.show();
//             imgboxsaleorder.show();

//         },
//         success: function (response) {

//             if (response.statusCode == 200) {
//                 imgboxquotation.hide();
//                 imgboxsaleorder.hide();


//                 txtbox_total_quotation.html(response["data"]["totalQuotation"]);
//                 txtbox_total_saleorder.html(response["data"]["totalSaleOrder"]);
//                 txtbox_total_dc.html(response["data"]["totalDC"]);
//                 txtbox_total_invoice.html(response["data"]["totalInvoice"]);
//                 txtbox_total_receipt.html(response["data"]["totalReceipt"]);
//                 txtbox_total_creditnote.html(response["data"]["totalCreditNote"]);

//                 spn_totalquotation.html(response["data"]["totalQuotation"]);
//                 spn_totalsaleOrder.html(response["data"]["totalSaleOrder"]);

//                 spn_totaldc.html(response["data"]["totalDC"]);
//                 spn_totalinvoice.html(response["data"]["totalInvoice"]);

//                 spn_totalreceipt.html(response["data"]["totalReceipt"]);
//                 spn_totalcreditnote.html(response["data"]["totalCreditNote"]);



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

// //Get Quotation
// function GetQuotation() {
//     $('#Table_View_Quotations').DataTable().clear().destroy();

//     imgboxquotation.show();
//     $.ajax({
//         url: ApiForm + '/GetQuotation',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);
//             imgboxquotation.show();
//             imgboxsaleorder.show();

//         },
//         success: function (response) {

//             if (response.statusCode == 200) {

//                 var action_button = "";
//                 if (Boolean(_approved)) {
//                     action_button = "<a href='#' class='btn-edit-QuotationMaster glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
//                 }
//                 detailsTableBody = $("#Table_View_Quotations").dataTable({
//                     data: response["data"],
//                     destroy: true,
//                     retrieve: true,
//                     paging: false,
//                     columns: [
//                         {
//                             data: null,
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return action_button;
//                                 }
//                                 else {
//                                     return action_button;
//                                 }
//                             }
//                         },


//                         {
//                             data: 'check',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'approved',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'cancel',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'close',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 return "<a href='#' class='btn-print-quotation'>" + data.no + "</a>"// ;
//                             }
//                         },
//                         {
//                             data: 'date',
//                             type: 'date',
//                             render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
//                         },
//                         { data: "customerName" },
//                         { data: "salesmanName" },
//                         { data: "remarks" },


//                     ],
//                     "order": [[5, "desc"], [6, "asc"]],
//                     "pageLength": 10
//                 });

//                 imgboxquotation.hide();

//             }
//             else {
//                 imgboxquotation.hide();
//             }
//         },
//         error: function (xhr, status, err) {

//             imgboxquotation.hide();
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
// };

// //Get Quotation Detail
// function GetQuotationDetail() {
//     $('#Table_View_QuotationsDetail').DataTable().clear().destroy();

//     imgboxquotation.show();

//     $.ajax({
//         url: ApiForm + '/GetQuotationDetail',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",

//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);

//         },
//         success: function (response) {

//             if (response.statusCode == 200) {

//                 $("#spn_totalquotationDetail").html(response["data"].length)
//                 var action_button = "";
//                 if (Boolean(_approved)) {
//                     action_button = "<a href='#' class='btn-editQuotationDetail glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
//                 }
//                 detailsTableBody = $("#Table_View_QuotationsDetail").dataTable({
//                     data: response["data"],
//                     destroy: true,
//                     retrieve: true,
//                     paging: false,
//                     columns: [
//                         {
//                             data: null,
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return action_button;
//                                 }
//                                 else {
//                                     return action_button;
//                                 }
//                             }
//                         },

//                         {
//                             data: 'approved',
//                             "render": function (data, type, full, meta) {
//                                 if (data == 0) {
//                                     return "<select id=ddl_approvedDetail class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_approvedDetail class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },


//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 return "<a href='#' class='btn-print-quotationDetail'>" + data.no + "</a>"// ;
//                             }
//                         },
//                         { data: "customerName" },
//                         { data: "salesmanName" },
//                         { data: "itemName" },
//                         { data: "itemDescription" },
//                         { data: "quantity" },
//                         { data: "rate" },
//                         { data: "amount" },
//                         { data: "remarks" },
//                     ],
//                     "order": [[2, "desc"], [3, "asc"]],
//                     "pageLength": 10
//                 });


//                 imgboxquotation.hide();

//             }
//             else {
//                 imgboxquotation.hide();
//             }
//         },
//         error: function (xhr, status, err) {
//             imgboxquotation.hide();
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
// };

// //Get SaleOrder
// function GetSaleOrder() {
//     imgboxsaleorder.show();

//     $('#Table_View_saleOrder').DataTable().clear().destroy();

//     $.ajax({
//         url: ApiForm + '/GetSaleOrder',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);


//         },
//         success: function (response) {

//             if (response.statusCode == 200) {


//                 var action_button = "";
//                 if (Boolean(_approved)) {
//                     action_button = "<a href='#' class='btn-edit-SaleOrder glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
//                 }
//                 detailsTableBody = $("#Table_View_saleOrder").dataTable({
//                     data: response["data"],
//                     destroy: true,
//                     retrieve: true,
//                     paging: false,
//                     columns: [
//                         {
//                             data: null,
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return action_button;
//                                 }
//                                 else {
//                                     return action_button;
//                                 }
//                             }
//                         },
//                         {
//                             data: 'check',
//                             "render": function (data, type, full, meta) {

//                                 if (data == true) {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'approved',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'cancel',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'close',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 return "<a href='#' class='btn-print-saleorder'>" + data.no + "</a>"// ;
//                             }
//                         },
//                         {
//                             data: 'date',
//                             type: 'date',
//                             render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
//                         },
//                         { data: "itemName" },
//                         { data: "customerName" },
//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 if (data.customerPo != '') {
//                                     return data.customerPo + '<br/>' + moment(data.customerPoDate).format('DD-MMM-YYYY')
//                                 }

//                                 return ''
//                             }
//                         },
//                         { data: "salesmanName" },


//                     ],
//                     "order": [[5, "desc"], [6, "asc"]],
//                     "pageLength": 10
//                 });

//                 imgboxsaleorder.hide();

//             }
//             else {
//                 imgboxsaleorder.hide();
//             }
//         },
//         error: function (xhr, status, err) {
//             imgboxsaleorder.hide();
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


// //Get DeliveryChallan
// function GetDeliveryChallan() {
//     imgboxdc.show();

//     $('#Table_View_dc').DataTable().clear().destroy();

//     $.ajax({
//         url: ApiForm + '/GetDeliveryChallan',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);
//         },
//         success: function (response) {

//             if (response.statusCode == 200) {
//                 var action_button = "";
//                 if (Boolean(_approved)) {
//                     action_button = "<a href='#' class='btn-edit-dc glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
//                 }
//                 detailsTableBody = $("#Table_View_dc").dataTable({
//                     data: response["data"],
//                     destroy: true,
//                     retrieve: true,
//                     paging: false,
//                     columns: [
//                         {
//                             data: null,
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return action_button;
//                                 }
//                                 else {
//                                     return action_button;
//                                 }
//                             }
//                         },
//                         {
//                             data: 'check',
//                             "render": function (data, type, full, meta) {

//                                 if (data == true) {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'approved',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'cancel',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'close',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 return "<a href='#' class='btn-print-deliverychallan'>" + data.no + "</a>"// ;
//                             }
//                         },
//                         {
//                             data: 'date',
//                             type: 'date',
//                             render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
//                         },
//                         { data: "itemName" },
//                         { data: "customerName" },
//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 if (data.customerPo != '') {
//                                     return data.customerPo + '<br/>' + moment(data.customerPoDate).format('DD-MMM-YYYY')
//                                 }

//                                 return ''
//                             }
//                         },

//                         { data: "salesmanName" },


//                     ],
//                     "order": [[5, "desc"], [6, "asc"]],
//                     "pageLength": 10
//                 });

//                 imgboxdc.hide();


//             }
//             else {
//                 imgboxdc.hide();

//             }
//         },
//         error: function (xhr, status, err) {
//             imgboxdc.hide();
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


// //Get Invoice
// function GetInvoice() {
//     imgboxinvoice.show();

//     $.ajax({
//         url: ApiForm + '/GetInvoice',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);
//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 var action_button = "";
//                 if (Boolean(_approved)) {
//                     action_button = "<a href='#' class='btn-edit-invoice glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
//                 }
//                 $('#Table_View_invoice').DataTable().clear().destroy();
//                 detailsTableBody = $("#Table_View_invoice").dataTable({
//                     data: response["data"],
//                     destroy: true,
//                     retrieve: true,
//                     paging: false,
//                     columns: [
//                         {
//                             data: null,
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return action_button;
//                                 }
//                                 else {
//                                     return action_button;
//                                 }
//                             }
//                         },
//                         {
//                             data: 'check',
//                             "render": function (data, type, full, meta) {

//                                 if (data == true) {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'approved',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'cancel',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'close',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 return "<a href='#' class='btn-print-invoice'>" + data.no + "</a>"// ;
//                             }
//                         },
//                         {
//                             data: 'date',
//                             type: 'date',
//                             render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
//                         },

//                         { data: "customerName" },
//                         {
//                             data: null,
//                             render: function (data, type, row) {
//                                 if (data.customerPo != '') {
//                                     return data.customerPo + '<br/>' + moment(data.customerPoDate).format('DD-MMM-YYYY')
//                                 }

//                                 return ''
//                             }
//                         },

//                         { data: "itemName" },
//                         { data: "salesmanName" },


//                     ],
//                     "order": [[5, "desc"], [6, "asc"]],
//                     "pageLength": 10
//                 });
//                 imgboxinvoice.hide();


//             }
//             else {
//                 imgboxinvoice.hide();

//             }
//         },
//         error: function (xhr, status, err) {
//             imgboxinvoice.hide();
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

// //Get Credit Note
// function GetCreditNote() {
//     imgboxcreditnote.show();

//     $.ajax({
//         url: ApiForm + '/GetCreditNote',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("MenuId", _menuid);
//         },
//         success: function (response) {

//             if (response.statusCode == 200) {
//                 var action_button = "";
//                 if (Boolean(_approved)) {
//                     action_button = "<a href='#' class='btn-edit-creditnote glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
//                 }
//                 $('#Table_View_creditnote').DataTable().clear().destroy();
//                 detailsTableBody = $("#Table_View_creditnote").dataTable({
//                     data: response["data"],
//                     destroy: true,
//                     retrieve: true,
//                     paging: false,
//                     columns: [
//                         {
//                             data: null,
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return action_button;
//                                 }
//                                 else {
//                                     return action_button;
//                                 }
//                             }
//                         },
//                         {
//                             data: 'check',
//                             "render": function (data, type, full, meta) {

//                                 if (data == true) {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_check class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'approved',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 selected>Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_approved class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'cancel',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_cancel class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         {
//                             data: 'close',
//                             "render": function (data, type, full, meta) {
//                                 if (data == true) {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 selected> Yes</option>" +
//                                         "<option value=0 >No</option>" +
//                                         "</select>";
//                                 }
//                                 else {
//                                     return "<select id=ddl_close class='ddl-approved'>" +
//                                         "<option value=1 >Yes</option>" +
//                                         "<option value=0 selected>No</option>" +
//                                         "</select>";
//                                 }
//                             }
//                         },
//                         { data: "no" },
//                         {
//                             data: 'date',
//                             type: 'date',
//                             render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
//                         },
//                         { data: "itemName" },
//                         { data: "customerName" },
//                         { data: "customerPo" },
//                         {
//                             type: 'customerPoDate',
//                             render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
//                         },
//                         { data: "salesmanName" },


//                     ],
//                     "order": [[5, "desc"], [6, "asc"]],
//                     "pageLength": 10
//                 });
//                 imgboxcreditnote.hide();


//             }
//             else {
//                 imgboxcreditnote.hide();

//             }
//         },
//         error: function (xhr, status, err) {
//             imgboxcreditnote.hide();
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

// //SaleOrder Update
// $('table').on('click', '.btn-edit-SaleOrder', function (e) {
//     e.preventDefault();
//     var rows_create = $("#Table_View_saleOrder tbody >tr");


