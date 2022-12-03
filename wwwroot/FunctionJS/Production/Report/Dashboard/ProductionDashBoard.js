
var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

CallNotification('Production');

// var url = params = new URLSearchParams(window.location.search);
// var _menuid = '';
// if (url.has('M')) {
//     _menuid = url.get('M');
// }
// //image Loader
// var imgboxTotaljob = $("#img_box_totaljob");
// var imgboxOpenjob = $("#img_box_openjob");
// //var imgboxreadyforDelivery = $("#img_box_readyfordelivery");

// //Count Box
// var boxTotalJob = $("#box_totaljob");
// var boxOpenJob = $("#box_openjob");
// //var boxreadyforDelivery = $("#box_readyfordelivery");

// //span
// var spn_totaljob = $("#spn_totaljob");
// var spn_Production = $("#spn_Production");
// //var spn_ReadyforDelivery = $("#spn_ReadyforDelivery");



// var ApiForm = '';


// $(function () {
// });


// $(document).ready(function () {
//     ApiForm = apiUrl + '/api/Production/v1/ProductionDashboard';
//     CallNotification('Production');

//     GetRecord();


// });


// function GetRecord() {
//     GetJobOrder();

//     //ReadyForDelivery();
//     // GetOpenJob();

// }
// function FillJobOrderCard(_Data) {

//     //Fill Joborder Table
//     boxTotalJob.html(_Data.length);
//     spn_totaljob.html(_Data.length);

//     if (_Data.length > 0) {
//         var action_button = "";

//         action_button = "<a href='#' class='btn-edit-JoborderMaster glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";


//         $('#Table_ViewJobOrder').DataTable().clear().destroy();
//         detailsTableBody = $("#Table_ViewJobOrder").dataTable({
//             data: _Data,
//             destroy: true,
//             retrieve: true,
//             paging: false,
//             columns: [
//                 {
//                     data: null,
//                     "render": function (data, type, full, meta) {
//                         if (data == true) {
//                             return action_button;
//                         }
//                         else {
//                             return action_button;
//                         }
//                     }
//                 },
//                 {
//                     data: 'close',
//                     "render": function (data, type, full, meta) {
//                         if (data == true) {
//                             return "<select id=ddl_check class='ddl-approved'>" +
//                                 "<option value=1 selected>Yes</option>" +
//                                 "<option value=0 >No</option>" +
//                                 "</select>";
//                         }
//                         else {
//                             return "<select id=ddl_check class='ddl-approved'>" +
//                                 "<option value=1 >Yes</option>" +
//                                 "<option value=0 selected>No</option>" +
//                                 "</select>";
//                         }
//                     }
//                 },
//                 { data: "jobNo" },
//                 {
//                     data: 'JobDate',
//                     type: 'date',
//                     render: function (data, type, row) { return moment(data).format('DD-MMM-YYYY') }
//                 },
//                 { data: "soNo" },
//                 {
//                     data: null,
//                     render: function (data, type, row) {
//                         if (data.poNo != '') {
//                             return data.poNo + '</br>' + moment(data.poDate).format('DD-MMM-YYYY')
//                         }
//                         else { return ''; }
//                     }
//                 },

//                 { data: "customerName" },
//                 { data: "itemName" },
//                 { data: "description" },
//                 {
//                     data: "sheetQty",
//                     render: function (data, type, row) {
//                         return accounting.format(data)
//                     }
//                 },
//                 {
//                     data: "orderQty",
//                     render: function (data, type, row) {
//                         return accounting.format(data)
//                     }
//                 },
//                 {
//                     data: "packingQty",
//                     render: function (data, type, row) {
//                         return accounting.format(data)
//                     }
//                 },
//                 {
//                     data: null,
//                     render: function (data, type, row) {
//                         return accounting.format(data.orderQty - data.packingQty);
//                     }
//                 },
//                 // {
//                 //     data: "days",
//                 //     render: function (data, type, row) {
//                 //         return accounting.format(data)
//                 //     }
//                 // }


//             ],
//             "order": [[2, "asc"]],
//             "pageLength": 10
//         });

//     }
// }
// function FillJobOrderOpenCard(_Data) {

//     const _FilterData = _Data.filter(d => d.balanceSheetQty > 0);
//     boxOpenJob.html(_FilterData.length);
//     spn_Production.html(_FilterData.length);

//     //Fill open Job table
//     if (_Data.length > 0) {
//         $('#Table_ViewProdcution').DataTable().clear().destroy();
//         detailsTableBody = $("#Table_ViewProdcution").removeAttr('width').dataTable({
//             data: _FilterData,
//             destroy: true,
//             retrieve: true,
//             paging: false,
//             columns: [
//                 { data: "jobNo" },
//                 { data: "description" },
//                 {
//                     data: "sheetQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "printingSheetQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "uvSheetQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "laminationSheetQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "foilingSheetQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "dieCuttingSheetQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "pastingQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "eyeletQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "subletQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//                 {
//                     data: "packingQty",
//                     render: function (data, type, row) { return accounting.format(data); }
//                 },
//             ],

//             "order": [[0, "asc"]],
//             "pageLength": 10
//         });

//     }
// }

// //Get JobOrder Start
// function GetJobOrder() {

//     $.ajax({
//         url: ApiForm + '/GetJobOrder',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",

//         headers: {
//             'Authorization': 'Bearer ' + strkey
//         },
//         beforeSend: function () {


//         },
//         success: function (response) {
//             if (response.statusCode == 200) {
//                 imgboxOpenjob.hide();
//                 imgboxTotaljob.hide();
//                 //  imgboxreadyforDelivery.hide();

//                 FillJobOrderCard(response["data"]);
//                 FillJobOrderOpenCard(response["data"]);
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
// // Get JobOrder End

// $('table').on('click', '.btn-edit-JoborderMaster', function (e) {
//     e.preventDefault();
//     var rows_create = $("#Table_ViewJobOrder tbody >tr");
//     for (var i = 0; i < rows_create.length; i++) {

//         columns = $(rows_create[i]).find('td');
//         var _check = $(this).closest('tr').find('#ddl_check option:selected').val();
//         _check = (_check == 1) ? true : false;

//     }
//     var currentRow = $(this).closest("tr");
//     var data = $('#Table_ViewJobOrder').DataTable().row(currentRow).data();
//     var id = data["id"];

//     var _data = JSON.stringify({
//         "Id": id,
//         "close": _check,
//         "Type": "U",
//         "menu_id": _menuid,
//     });
//     UpdateJobOrderRecord(_data);
// });

// //Update Update JobOrder 
// function UpdateJobOrderRecord(_data) {

//     Swal.fire({
//         title: 'Are you sure you want to update?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#5cb85c',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Update',
//         showClass: {
//             popup: 'animated fadeInDown faster'
//         },
//         hideClass: {
//             popup: 'animated fadeOutUp faster'
//         }
//     }).then((result) => {
//         if (result.value) {
//             $.ajax({
//                 url: apiUrl + '/api/Production/v1/ProductionDashboard/UpdateJobOrder',
//                 type: "Put",
//                 contentType: "application/json",
//                 dataType: "json",
//                 data: _data,
//                 beforeSend: function (xhr) {
//                     xhr.setRequestHeader("Authorization", "Bearer " + strkey);

//                 },
//                 success: function (response) {

//                     if (response.statusCode == 200) {

//                         Swal.fire({
//                             title: 'Record Update',

//                             icon: 'success',
//                             showConfirmButton: true,

//                             showClass: {
//                                 popup: 'animated fadeInDown faster'
//                             },
//                             hideClass: {
//                                 popup: 'animated fadeOutUp faster'
//                             }

//                         });
//                         GetRecord();

//                     }
//                     else {

//                         var _title = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
//                         Swal.fire({

//                             title: _title,

//                             icon: 'warning',
//                             showConfirmButton: true,

//                             showClass: {
//                                 popup: 'animated fadeInDown faster'
//                             },
//                             hideClass: {
//                                 popup: 'animated fadeOutUp faster'
//                             }

//                         })


//                     }

//                 },
//                 error: function (xhr, status, err) {

//                     Swal.fire({
//                         title: xhr.status.toString() + ' ' + err.toString(),

//                         icon: 'error',
//                         showConfirmButton: true,

//                         showClass: {
//                             popup: 'animated fadeInDown faster'
//                         },
//                         hideClass: {
//                             popup: 'animated fadeOutUp faster'
//                         }

//                     })
//                 }
//             })

//         }
//     })

// }



