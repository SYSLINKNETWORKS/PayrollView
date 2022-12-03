var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}

var imgdcload = $("#img_diecutting");
var imgeyeload = $("#img_eyelet");
var imgfoilload = $("#img_foiling");
var imglamload = $("#img_lamination");
var imgpackload = $("#img_packing");
var imgpastload = $("#img_pasting");
var imgprintload = $("#img_printing");
var imgsubload = $("#img_sublets");
var imguvload = $("#img_uv");

var ApiForm = '';



$(document).ready(function () {
    ApiForm = apiUrl + '/api/Production/v1';
    CallNotification('Production');
    GetJobOrder();

});
function GetJobOrder() {
    var _cre = JSON.stringify({
    });    
    $.ajax({
        url: ApiForm + '/ProductionDashboard/GetJobOrder',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
        data:_cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgprintload.show();
        },
        success: function (response) {

            if (response.statusCode == 200) {

                FillPrinting(response.data.filter(d => d.printingDepartment == 1));
                FillUV(response.data.filter(d => d.uvDepartment == 2));
                FillLamination(response.data.filter(d => d.laminationDepartment == 3));
                FillFoiling(response.data.filter(d => d.foilingDepartment == 4));
                FillDieCutting(response.data.filter(d => d.dieCuttingDepartment == 5));
                FillPasting(response.data.filter(d => d.pastingDepartment == 6));
                FillEyelet(response.data.filter(d => d.eyeletDepartment == 7));
                FillSublet(response.data.filter(d => d.subletDepartment == 8));
                FillPacking(response.data.filter(d => d.packingDepartment == 9));
                imgprintload.hide(response.data);
            }

            else {
                imgprintload.hide();
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
            imgprintload.hide();
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

function FillPrinting(_Data) {
    $('#tbl_printing').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_printing").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },
            { data: 'itemName' },
            {
                data: 'sheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'printingSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'printingWastageSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.sheetQty - data.printingSheetQty, 0) }
            },
            { data: 'days' },
            { data: 'printingMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.printingInsertDate == null) {
                        return ""
                    }
                    return moment(data.printingInsertDate).format('DD-MM-YYYY')
                }
            },

        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.printingInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        //        "order": [[1, "desc"], [2, "asc"]],
        "order": [[9, "desc"], [1, "desc"]],
        "pageLength": 10
    });

}
function FillUV(_Data) {
    $('#tbl_uv').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_uv").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },

            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },

            { data: 'itemName' },
            {
                data: 'sheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'uvSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'uvWastageSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.sheetQty - data.uvSheetQty, 0) }
            },
            { data: 'days' },
            { data: 'uvMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.uvInsertDate == null) {
                        return ""
                    } return moment(data.uvInsertDate).format('DD-MM-YYYY')
                }
            },
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.uvInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
}
function FillLamination(_Data) {
    $('#tbl_lamination').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_lamination").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },

            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },

            { data: 'itemName' },
            {
                data: 'sheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'laminationSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'laminationWastageSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.sheetQty - data.laminationSheetQty, 0) }
            },
            { data: 'days' },
            { data: 'laminationMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.laminationInsertDate == null) {
                        return ""
                    }
                    return moment(data.laminationInsertDate).format('DD-MM-YYYY')
                }
            },
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.laminationInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
}
function FillFoiling(_Data) {
    $('#tbl_foiling').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_foiling").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },

            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },

            { data: 'itemName' },
            {
                data: 'sheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'foilingSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'foilingWastageSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.sheetQty - data.foilingSheetQty, 0) }
            },
            { data: 'days' },
            { data: 'foilingMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.foilingInsertDate == null) {
                        return ""
                    }
                    return moment(data.foilingInsertDate).format('DD-MM-YYYY')
                }
            },
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.foilingInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
}
function FillDieCutting(_Data) {
    $('#tbl_diecutting').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_diecutting").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },

            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },

            { data: 'itemName' },
            {
                data: 'sheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'dieCuttingSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'dieCuttingWastageSheetQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.sheetQty - data.dieCuttingSheetQty, 0) }
            },
            { data: 'days' },
            { data: 'dieCuttingMachine' },
            {
                data: null,
                type: 'date',

                render: function (data, type, row) {
                    if (data.dieCuttingInsertDate == null) {
                        return ""
                    }
                    return moment(data.dieCuttingInsertDate).format('DD-MM-YYYY')
                }
            },

        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.dieCuttingInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
}
function FillPasting(_Data) {

    $('#tbl_pasting').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_pasting").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },

            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },

            { data: 'itemName' },
            {
                data: 'qty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'pastingQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'pastingWastageQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.qty - data.pastingQty, 0) }
            },
            { data: 'days' },
            { data: 'pastingMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.pastingInsertDate == null) {
                        return ""
                    }
                    return moment(data.pastingInsertDate).format('DD-MM-YYYY')
                }
            },

        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.pastingInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
} function FillEyelet(_Data) {
    $('#tbl_eyelet').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_eyelet").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },

            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            }, 
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },

            { data: 'itemName' },
            {
                data: 'qty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'eyeletQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'eyeletWastageQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.qty - data.eyeletQty, 0) }
            },
            { data: 'days' },
            { data: 'printingMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.eyeletInsertDate == null) {
                        return ""
                    }
                    return moment(data.eyeletInsertDate).format('DD-MM-YYYY')
                }
            },
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.eyeletInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
}
function FillSublet(_Data) {
    $('#tbl_sublet').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_sublet").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },

            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },
            { data: 'itemName' },
            {
                data: 'qty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'subletQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'subletWastageQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.qty - data.subletQty, 0) }
            },
            { data: 'days' },
            { data: 'subletMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.subletInsertDate == null) {
                        return ""
                    }
                    return moment(data.subletInsertDate).format('DD-MM-YYYY')
                }
            },
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.subletInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
}
function FillPacking(_Data) {
    $('#tbl_packing').DataTable().clear().destroy();
    detailsTableBody = $("#tbl_packing").dataTable({
        data: _Data,
        destroy: true,
        retrieve: true,
        paging: false,
        ordering: true,
        info: false,
        searching: true,
        columns: [

            { data: 'jobNo' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) { return moment(data.jobDate).format('DD-MM-YYYY') }
            },
            {
                data: null,
                render: function (data, type, row) { return moment(data.deliveryDate).format('DD-MM-YYYY') }
            },
            { data: 'itemName' },
            {
                data: 'qty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'packingQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: 'packingWastageQty',
                render: function (data, type, row) { return accounting.format(data, 0) }
            },
            {
                data: null,
                render: function (data, type, row) { return accounting.format(data.qty - data.packingQty, 0) }
            },
            { data: 'days' },
            { data: 'packingMachine' },
            {
                data: null,
                type: 'date',
                render: function (data, type, row) {
                    if (data.packingInsertDate == null) {
                        return ""
                    }
                    return moment(data.packingInsertDate).format('DD-MM-YYYY')
                }
            },

        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.packingInsertDate != null) {
                $('td', nRow).css('background-color', 'gray');
                $('td', nRow).css('color', 'white');
            }
        },
        "order": [[9, "desc"], [1, "desc"]],

        "pageLength": 10
    });
}