var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var ApiForm = '';

var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_update");
var taxid = $("#txt_id");
var txtdat = $("#txt_dat");
var _Item_ID = 0;
var _Item_Name = "";
var _MQuo_ID = 0;
var _MQuo_Name = "";
var _DQuo_ID = 0;
var _mquo_id = 0;


$(function () {
    txtdat.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    discon();
});

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    var CurrentDate = moment(new Date()).format("DD/MMM/YYYY");
    txtdat.find("input").val(CurrentDate);
    btnsav.show();
    btnupd.hide();
    imgloadsav.hide();
});

//calculation start
$(document).on("click", '#btn_cal', function () {

    calculate();


})
//calculation end

function calculate() {

    //board size widht
    var boradsizewidth = parseFloat($("#txt_bswidth").val());
    boradsizewidth = parseFloat(boradsizewidth * 0.03937).toFixed(3);
    $("#txt_dboardsize").val(boradsizewidth);

    //board size height
    var boradsizeHeight = parseFloat($("#txt_bsheight").val());
    boradsizeHeight = parseFloat(boradsizeHeight * 0.03937).toFixed(3);
    $("#txt_dboardsizebyheight").val(boradsizeHeight);

    //layout size width
    var layoutsize = parseFloat($("#txt_lswidth").val());
    layoutsize = parseFloat(layoutsize * 0.03937).toFixed(3);
    $("#txt_dlayoutsize").val(layoutsize);

    //layout size height
    var layoutsizeHeight = parseFloat($("#txt_lsheight").val());
    layoutsizeHeight = parseFloat(layoutsizeHeight * 0.03937).toFixed(3);
    $("#txt_dlayoutsizebyheight").val(layoutsizeHeight);

    //ater wastage quantity
    var qty = parseFloat($("#txt_quantity").val());
    var wastage = parseFloat($("#txt_wastage").val());
    var afterwastage = parseFloat(qty * wastage / 100 + qty).toFixed(3);
    $("#txt_afterwastageQuantity").val(afterwastage);

    //weight packet
    var gsm = parseFloat($("#txt_gsm").val());
    var boradsizewidth = parseFloat($("#txt_dboardsize").val());
    var boardsizebyheight = parseFloat($("#txt_dboardsizebyheight").val());
    var weightPacket = parseFloat(boardsizebyheight * boradsizewidth * gsm / 15500).toFixed(4);
    $("#txt_weightPacket").val(weightPacket);

    //packet cost
    var boardrate = parseFloat($("#txt_boardrate").val());
    var packetcost = parseFloat(boardrate * weightPacket).toFixed(3);
    $("#txt_packetCost").val(packetcost);

    //Required packets
    var bsups = parseFloat($("#txt_bups").val());
    var requirePackets = parseFloat(afterwastage / bsups / 100).toFixed(3);
    $("#txt_requiredPackets").val(requirePackets);

    //Layout sheet
    var cuttingMode = parseFloat($("#txt_cuttingmode").val());
    var layoutsheet = (requirePackets * 100 * cuttingMode).toFixed(0);
    $("#txt_layoutsheet").val(layoutsheet);

    //BOARD TOTAL WEIGHT(KGS)
    $("#txt_boardtotalWeight").val((weightPacket * requirePackets).toFixed(2));

    //Board
    var board = (packetcost * requirePackets).toFixed(2);
    $("#txt_board").val(board);

    //Plates
    var clrs = parseFloat($("#txt_colour").val());
    var platereate = parseFloat($("#txt_PLATERate").val());
    var Plates = parseFloat(platereate * clrs).toFixed(3);
    $("#txt_Plates").val(Plates);

    //Printing  
    var printingRate = parseFloat($("#txt_printingRate").val());
    var printing = parseFloat(printingRate * clrs / 1000 * layoutsheet).toFixed(3);
    $("#txt_printing").val(printing);

    //UV
    var uvsqft = parseFloat($("#txt_uvsq").val());
    var uv = (uvsqft > 0) ? parseFloat(layoutsize * layoutsizeHeight / 144 * uvsqft * layoutsheet).toFixed(3) : 0;
    $("#txt_uv").val(uv);

    //Lamination(SQ Ft)

    var laminationSqft = parseFloat($("#txt_laminationsq").val());
    var lamination = 0;
    if (laminationSqft > 0) {
        lamination = parseFloat(layoutsize * layoutsizeHeight / 144 * laminationSqft * layoutsheet).toFixed(3);
    }
    else { lamination = 0; }
    $("#txt_lamination").val(lamination);

    // Die-Cutting
    var dieCutting = parseFloat($("#txt_diecutting").val());
    if (dieCutting > 0) {
        dieCutting = parseFloat(dieCutting / 1000 * layoutsheet).toFixed(3);
    }
    else { dieCutting = 0; }
    $("#txt_die_Cutting").val(dieCutting);

    //Foiling
    var foiling = parseFloat($("#txt_foilingunit").val());
    if (foiling > 0) { foiling = parseFloat(foiling * afterwastage).toFixed(3); } else { foiling = 0; }
    $("#txt_foiling").val(foiling);

    //Window Patching unit
    var windwoPatchingunit = parseFloat($("#txt_windowPacthingUnit").val());
    var windwoPatching = (windwoPatchingunit > 0) ? parseFloat(windwoPatchingunit * afterwastage).toFixed(3) : 0;
    $("#txt_windowPatching").val(windwoPatching);

    //Pasting
    var pastingunit = parseFloat($("#txt_pastingunit").val());
    var pasting = (pastingunit > 0) ? parseFloat(pastingunit / 1000 * afterwastage).toFixed(3) : 0;
    $("#txt_pasting").val(pasting);

    //Bag Making
    var bagmakingunit = parseFloat($("#txt_bagmakingunit").val());
    var bagMaking = (bagmakingunit > 0) ? parseFloat(bagmakingunit * afterwastage).toFixed(3) : 0;
    $("#txt_bagmaking").val(bagMaking);

    //Eyelet
    var eyeletUnit = parseFloat($("#txt_eyeletunit").val());
    var eyelet = (eyeletUnit > 0) ? parseFloat(eyeletUnit * afterwastage).toFixed(3) : 0;
    $("#txt_eyelet").val(eyelet);

    //Hanging Wire Unit
    var hangingwireUnit = parseFloat($("#txt_hangingwireunit").val());
    var hangingwire = (hangingwireUnit > 0) ? parseFloat(hangingwireUnit * afterwastage).toFixed(3) : 0;
    $("#txt_hangingwire").val(hangingwire);

    //Packing
    var packingper = parseFloat($("#txt_packingper").val());
    var packing = (packingper > 0) ? parseFloat(packingper / 1000 * afterwastage).toFixed(3) : 0;
    $("#txt_packing").val(packing);

    //Transport
    var transportper = parseFloat($("#txt_transportper").val());
    var transport = (transportper > 0) ? parseFloat(transportper / 1000 * afterwastage).toFixed(3) : 0;
    $("#txt_transport").val(transport);

    //Total 
    var total = parseFloat(parseFloat(board) + parseFloat(Plates) + parseFloat(printing) + parseFloat(uv) + parseFloat(lamination) + parseFloat(dieCutting) + parseFloat(foiling) + parseFloat(windwoPatching) + parseFloat(pasting) + parseFloat(bagMaking) + parseFloat(eyelet) + parseFloat(hangingwire) + parseFloat(packing) + parseFloat(transport)).toFixed(3);
    $("#txt_total").val(total);

    //Income Tax per
    var incomtaxPer = parseFloat($("#txt_incometaxper").val());
    var incomeTax = (incomtaxPer > 0) ? parseFloat(total * (incomtaxPer / 100)).toFixed(3) : 0;
    $("#txt_incometax").val(incomeTax);

    //Sub Total
    var subTotal = parseFloat(parseFloat(total) + parseFloat(incomeTax)).toFixed(3);
    $("#txt_subtotal").val(subTotal);


    //Margin Per
    var marginper = parseFloat($("#txt_MARGINper").val());
    var margin = (marginper > 0) ? parseFloat(subTotal * (marginper / 100)).toFixed(3) : 0;
    $("#txt_margin").val(margin);

    //Grand Total
    var grandTotal = parseFloat(parseFloat(subTotal) + parseFloat(margin)).toFixed(3);
    $("#txt_grandtotal").val(grandTotal);

    //Unit Cost
    var Qty = parseFloat($("#txt_quantity").val());
    var unitCost = parseFloat(grandTotal / Qty).toFixed(3);
    $("#txt_unitCost").val(unitCost);
    $("#txt_quotedRate").val(unitCost);

    calculatePercentage();
}

//Calculate Percentage
function calculatePercentage() {
    var _BoardValue = $("#txt_board").val();
    var _PlatesValue = $("#txt_Plates").val();
    var _PrintingValue = $("#txt_printing").val();
    var _UVValue = $("#txt_uv").val();
    var _LaminationValue = $("#txt_lamination").val();
    var _DieCuttingValue = $("#txt_die_Cutting").val();
    var _FoilingValue = $("#txt_foiling").val();
    var _WindowPatchingValue = $("#txt_windowPatching").val();
    var _PastingValue = $("#txt_pasting").val();
    var _BagmakingValue = $("#txt_bagmaking").val();
    var _EyeletValue = $("#txt_eyelet").val();
    var _HangingwireValue = $("#txt_hangingwire").val();
    var _PackingValue = $("#txt_packing").val();
    var _TransportValue = $("#txt_transport").val();

    var _Total = $("#txt_total").val();

    var _BoardPer = parseFloat(_BoardValue) > 0 ? parseFloat(parseFloat(_BoardValue / _Total) * 100).toFixed(2) : 0;
    var PlatesPer = parseFloat(_PlatesValue) > 0 ? parseFloat(parseFloat(_PlatesValue / _Total) * 100).toFixed(2) : 0;
    var _PrintingPer = parseFloat(_PrintingValue) > 0 ? parseFloat(parseFloat(_PrintingValue / _Total) * 100).toFixed(2) : 0;
    var _UVPer = parseFloat(_UVValue) > 0 ? parseFloat(parseFloat(_UVValue / _Total) * 100).toFixed(2) : 0;
    var _LaminationPer = parseFloat(_LaminationValue) > 0 ? parseFloat(parseFloat(_LaminationValue / _Total) * 100).toFixed(2) : 0;
    var _DieCuttingPer = parseFloat(_DieCuttingValue) > 0 ? parseFloat(parseFloat(_DieCuttingValue / _Total) * 100).toFixed(2) : 0;
    var _FoilingPer = parseFloat(_FoilingValue) > 0 ? parseFloat(parseFloat(_FoilingValue / _Total) * 100).toFixed(2) : 0;
    var _WindowPatchingPer = parseFloat(_WindowPatchingValue) > 0 ? parseFloat(parseFloat(_WindowPatchingValue / _Total) * 100).toFixed(2) : 0;
    var _PastingPer = parseFloat(_PastingValue) > 0 ? parseFloat(parseFloat(_PastingValue / _Total) * 100).toFixed(2) : 0;
    var _BagmakingPer = parseFloat(_BagmakingValue) > 0 ? parseFloat(parseFloat(_BagmakingValue / _Total) * 100).toFixed(2) : 0;
    var _EyeletPer = parseFloat(_EyeletValue) > 0 ? parseFloat(parseFloat(_EyeletValue / _Total) * 100).toFixed(2) : 0;
    var _HangingwirePer = parseFloat(_HangingwireValue) > 0 ? parseFloat(parseFloat(_HangingwireValue / _Total) * 100).toFixed(2) : 0;
    var _PackingPer = parseFloat(_PackingValue) > 0 ? parseFloat(parseFloat(_PackingValue / _Total) * 100).toFixed(2) : 0;
    var _TransportPer = parseFloat(_TransportValue) > 0 ? parseFloat(parseFloat(_TransportValue / _Total) * 100).toFixed(2) : 0;

    $("#txt_board_per").val(_BoardPer);
    $("#txt_Plates_per").val(PlatesPer);
    $("#txt_printing_per").val(_PrintingPer);
    $("#txt_uv_per").val(_UVPer);
    $("#txt_lamination_per").val(_LaminationPer);
    $("#txt_die_Cutting_per").val(_DieCuttingPer);
    $("#txt_foiling_per").val(_FoilingPer);
    $("#txt_windowPatching_per").val(_WindowPatchingPer);
    $("#txt_pasting_per").val(_PastingPer);
    $("#txt_bagmaking_per").val(_BagmakingPer);
    $("#txt_eyelet_per").val(_EyeletPer);
    $("#txt_hangingwire_per").val(_HangingwirePer);
    $("#txt_packing_per").val(_PackingPer);
    $("#txt_transport_per").val(_TransportPer);

}
//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    $("#txt_id").html('');
    ApiForm = apiUrl + '/api/Sales/v1/QuotationRate';

    btnsav.hide();
    btnupd.hide();
    Onload();
    ComponentsDropdowns.init();
    imgload.hide();
    imgloadsav.hide();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);

    $('#txt_pquo').select2('enable');
    $('#txt_itm').select2('enable');

    $('#txt_itm').select2('val', '');
    $('#txt_itm').html('');

    $('#txt_pquo').select2('val', '');
    $('#txt_pquo').html('');

}
//Discon End

//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        //Fill Item Start
        FillItm();
        //Fill Item End

        //Fill previous quotation
        FillPreviousQuotation();

        //Fill Quotation Start
        FillQuotation()
        //Fill Quotation End
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End
$('#txt_pquo').on("select2-selected", function (e) {
    _mquo_id = $('#txt_pquo').select2('data').NO;

});
$('#txt_pquo').on("select2-removed", function (e) {

    _mquo_id = 0;
});
$('#txt_itm').on("select2-selected", function (e) {
    _Item_ID = $('#txt_cus').val($('#txt_itm').select2('data').id)
    _Item_Name = $('#txt_cus').val($('#txt_itm').select2('data').CustomerName)
    $('#txt_location').val($('#txt_itm').select2('data').LocationName)
    $('#txt_qty').val($('#txt_itm').select2('data').Quantity)
    $('#txt_tbl_paperdes').val($('#txt_itm').select2('data').ItemPaperName)
    $("#txt_colour").val($('#txt_itm').select2('data').PrintingColorName);
    $("#txt_quantity").val($('#txt_itm').select2('data').Quantity);
    $("#txt_rowid").val($('#txt_itm').select2('data').RowIdDetail);

});
$('#txt_itm').on("select2-removed", function (e) {

    $('#txt_cus').val('')
    $('#txt_location').val('')
    $('#txt_qty').val('')
    $('#txt_tbl_paperdes').val('')
    $('#txt_tbl_printdes').val('')
    $('#txt_tbl_uvdes').val('')
    $('#txt_tbl_lamdes').val('')
    $('#txt_tbl_foildes').val('')
    $('#txt_tbl_dcdes').val('')
    $('#txt_tbl_pastdes').val('')
    $('#txt_tbl_eyedes').val('')
    $('#txt_tbl_subdes').val('')
    $('#txt_tbl_packdes').val('')
    $("#txt_colour").val('')
});
$('#txt_previousquotation').on("select2-selected", function (e) {

    $("#txt_bswidth").val($('#txt_previousquotation').select2('data').BoardWidth);
    $("#txt_bsheight").val($('#txt_previousquotation').select2('data').BoardHeight);
    $("#txt_bups").val($('#txt_previousquotation').select2('data').BoardUPS);
    $("#txt_lswidth").val($('#txt_previousquotation').select2('data').LayoutWidth);
    $("#txt_lsheight").val($('#txt_previousquotation').select2('data').LayoutHeight);
    $("#txt_lups").val($('#txt_previousquotation').select2('data').LayoutUPS);


    $("#txt_cuttingmode").val($('#txt_previousquotation').select2('data').CuttingMode);
        $("#txt_gsm").val($('#txt_previousquotation').select2('data').GSM);
    $("#txt_boardrate").val($('#txt_previousquotation').select2('data').BoardRate);
    $("#txt_wastage").val($('#txt_previousquotation').select2('data').Wastage);
    $("#txt_PLATERate").val($('#txt_previousquotation').select2('data').PlateRate);
    $("#txt_printingRate").val($('#txt_previousquotation').select2('data').PrintingRate);
    $("#txt_uvsq").val($('#txt_previousquotation').select2('data').UV);
    $("#txt_laminationsq").val($('#txt_previousquotation').select2('data').Lamination);
    $("#txt_diecutting").val($('#txt_previousquotation').select2('data').DieCutting);
    $("#txt_foilingunit").val($('#txt_previousquotation').select2('data').Foiling);
    $("#txt_windowPacthingUnit").val($('#txt_previousquotation').select2('data').WindowPacthing);
    $("#txt_pastingunit").val($('#txt_previousquotation').select2('data').Pasting);
    $("#txt_bagmakingunit").val($('#txt_previousquotation').select2('data').BagMaking);
    $("#txt_eyeletunit").val($('#txt_previousquotation').select2('data').Eyelet);
    $("#txt_hangingwireunit").val($('#txt_previousquotation').select2('data').HangingWire);
    $("#txt_packingper").val($('#txt_previousquotation').select2('data').Packing);
    $("#txt_transportper").val($('#txt_previousquotation').select2('data').Transport);
    $("#txt_incometaxper").val($('#txt_previousquotation').select2('data').IncomeTax);
    $("#txt_MARGINper").val($('#txt_previousquotation').select2('data').Margin);

    calculate();
    
    $("#txt_quotedRate").val($('#txt_previousquotation').select2('data').QuotedRate);

});

//Fill Quotation Start
function FillQuotation() {
    $("#txt_pquo").select2({
        placeholder: "Search for Quotation",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetQuotationforRate',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("CustomerId", $('#txt_cus').select2('data').id);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {

                        myResults.push({
                            id: item.id,
                            text: item.name
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
            var data = { "id": _MQuo_ID, "text": _MQuo_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Quotation End

//Fill Item Start
function FillItm() {
    $("#txt_itm").select2({
        placeholder: "Search for Item",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetQuotationItemforRate',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("QuotationMasterId", $('#txt_pquo').select2('data').id);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            // data: function (term, page) {
            //     return {
            //         _mquo_id: _mquo_id,
            //         _key: strkey, // search term
            //         _srch: term, // search term
            //         page: page // page number
            //     };
            // },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {

                        myResults.push({
                            id: item.detailId,
                            text: item.description,
                            ItemId: item.itemId,
                            Quantity: item.quantity,
                            CustomerName: item.customerName,
                            LocationName: item.locationName,
                            ItemPaperName: item.itemPaperName,
                            PrintingColorName: item.printingColorName,
                            GSM: item.gsm,
                            BoardHeight: item.boardHeight,
                            BoardWidth: item.boardWidth,
                            LayoutHeight: item.layoutHeight,
                            LayoutWidth: item.layoutWidth,
                            RowIdDetail: item.rowIdDetail,

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

//Fill Previous Quotation Start
function FillPreviousQuotation() {
    $("#txt_previousquotation").select2({
        placeholder: "Search for Previous Quotation",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Sales/v1/LOVServicesSales/GetPreviousQuotationItemforRate',
            type: "Get",
            dataType: 'json',
            delay: 250,
            transport: function (params) {
                params.beforeSend = function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + strkey);
                    request.setRequestHeader("ItemId", $('#txt_itm').select2('data').ItemId);
                };
                return $.ajax(params);
            }, data: function (term, page) {
                return {
                    _srch: term, // search term                            
                    page: page // page number
                };
            },
            // data: function (term, page) {
            //     return {
            //         _mquo_id: _mquo_id,
            //         _key: strkey, // search term
            //         _srch: term, // search term
            //         page: page // page number
            //     };
            // },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data.statusCode != 200) {
                    myResults.push({
                        id: data.statusCode,
                        text: data.message
                    })
                }
                else {
                    $.each(data.data, function (index, item) {

                        myResults.push({
                            id: item.quotationNo,
                            text: item.customerName,
                            BoardWidth: item.boardWidth,
                            BoardHeight: item.boardHeight,
                            BoardUPS: item.boardUPS,
                            LayoutWidth: item.layoutWidth,
                            LayoutHeight: item.layoutHeight,
                            LayoutUPS: item.layoutUPS,
                            CuttingMode: item.cuttingMode,
                            GSM: item.gsm,
                            BoardRate: item.boardRate,
                            Wastage: item.wastage,
                            PlateRate: item.plateRate,
                            PrintingRate: item.printingRate,
                            UV: item.uv,
                            Lamination: item.lamination,
                            DieCutting: item.dieCutting,

                            Foiling: item.foiling,
                            WindowPacthing: item.windowPacthing,
                            Pasting: item.pasting,
                            BagMaking: item.bagMaking,
                            Eyelet: item.eyelet,
                            HangingWire: item.hangingWire,
                            DieCutting: item.dieCutting,
                            Packing: item.packing,
                            Transport: item.transport,
                            IncomeTax: item.incomeTax,
                            Margin: item.margin,
                            QuotedRate:item.quotedRate
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },

        // initSelection: function (element, callback) {
        //     var data = { "id": _Item_ID, "text": _Item_Name };
        //     callback(data);
        // },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Previous Quotation End

//Onload Start
function Onload() {
    $('#Table_View').DataTable().clear().destroy();

    $.ajax({
        url: ApiForm,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("_MenuId", _menuid);
            imgload.show();
        },
        success: function (response) {
            //var jres = response;
            if (response.statusCode == 200) {
                var action_button = '';
                //New
                if (response["data"][0]["newPermission"] == 'true') {
                    btnnew.show();
                }

                //Delete
                if (Boolean(response["data"][0]["deletePermission"])) {
                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                }
                //Update
                if (Boolean(response["data"][0]["updatePermission"])) {
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                }

                // 

                if (response["data"] != null) {
                    $('#Table_View').DataTable().clear().destroy();
                    detailsTableBody = $("#Table_View").dataTable({
                        data: response["data"],
                        destroy: true,
                        retrieve: true,
                        columns: [
                            {
                                data: null,
                                "defaultContent": action_button
                            },
                            { data: 'quotationMasterNo' },

                            {
                                data: 'date',
                                type: 'date',
                                render: function (data, type, row) { return moment(data).format('DD-MM-YYYY') }
                            },
                            { data: 'customerName' },
                            { data: 'employeeName' },
                            { data: 'description' },
                            { data: 'quantity' },
                            { data: 'color' },
                            // { data: 'boardWidth' },
                            { data: 'size' },
                            { data: 'unitCostCal' },
                            { data: 'quotedRate' },
                            { data: 'quotedStatus' },
                            {
                                data: 'quotationStatus',
                                render: function (data) {
                                    return data == 1 ? 'Yes' : 'No'
                                },


                            },


                        ],
                        "order": [[1, "desc"], [2, "asc"]],
                        "pageLength": 10
                    });
                    imgload.hide();
                }
            }
            else {
                imgload.hide();
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
            imgload.hide();
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
    return true;
}
//Onload End

// Create Start 
function savrec() {
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;



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
            var urlStr = ApiForm;
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnsav.hide();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        $("#txt_id").html(response.message)
                        imgloadsav.hide();
                        discon();
                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        Swal.fire({
                            title: "Record Save",// response.message,

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
                        imgloadsav.hide();
                        btnsav.show();
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
                    imgloadsav.hide();
                    btnsav.show();
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
// Create End 



// Update Start 
function updrec() {


    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var _cre = ck.creteria;
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
                url: ApiForm,
                type: "Put",
                contentType: "application/json",
                dataType: "json",
                data: _cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgloadsav.show();
                    btnupd.hide();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        discon();

                        imgloadsav.show();
                        btnupd.hide();

                        $('#data_Modal').modal('hide');

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
                        imgloadsav.hide();
                        btnupd.show();
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
                    imgloadsav.hide();
                    btnupd.show();
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




//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();

    var _id = data['id'];
    var _Item = data['description'];
    var _quotationStatus = data['quotationStatus'];

    if (Boolean(_quotationStatus)) {
        Swal.fire({
            title: "Quotation approved",
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
        title: 'Are you sure wants to edit <br/> ' + _Item + '?',
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

                url: ApiForm + '/GetQuotationRateById',
                type: "Get",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("_MenuId", _menuid);
                    xhr.setRequestHeader("_Id", _id);
                    //imgload.show();
                    imgloadsav.hide();
                    btnsav.hide();
                    btnupd.hide();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        $('#data_Modal').modal('show');
                        btnupd.show();
                        $("#txt_id").html(response["data"]["id"]);
                        $("#txt_rowid").html(response["data"]["rowId"]);
                        txtdat.find("input").val(moment(response["data"]["date"]).format("DD/MMM/YYYY"));

                        _MQuo_ID = response["data"]["quotationMasterId"];
                        _MQuo_Name = response["data"]["quotationMasterName"];
                        $('#txt_pquo').val(_MQuo_ID); // Select the option with a value of '1'
                        $('#txt_pquo').trigger('change'); // Notify any JS components that the value changed

                        _Item_ID = response["data"]["quotationMasterId"];
                        _Item_Name = response["data"]["valueAddition"];
                        $('#txt_itm').val(_Item_ID); // Select the option with a value of '1'
                        $('#txt_itm').trigger('change'); // Notify any JS components that the value changed

                        $("#txt_location").val(response["data"]["customerLocation"]);


                        $("#txt_bswidth").val(response["data"]["boardWidth"]);
                        $("#txt_bsheight").val(response["data"]["boardHeight"]);
                        $("#txt_cus").val(response["data"]["customerName"]);
                        $("#txt_bagmakingunit").val(response["data"]["bagMaking"]);
                        $("#txt_colour").val(response["data"]["color"]);
                        $("#txt_cuttingmode").val(response["data"]["cuttingMode"]);
                        $("#txt_diecutting").val(response["data"]["dieCutting"]);
                        $("#txt_eyeletunit").val(response["data"]["eyelet"]);
                        $("#txt_foilingunit").val(response["data"]["foiling"]);
                        $("#txt_gsm").val(response["data"]["gsm"]);
                        $("#txt_hangingwireunit").val(response["data"]["hangingWire"]);
                        $("#txt_laminationsq").val(response["data"]["lamination"]);
                        $("#txt_lsheight").val(response["data"]["layoutHeight"]);
                        $("#txt_bups").val(response["data"]["layoutUPS"]);
                        $("#txt_lswidth").val(response["data"]["layoutWidth"]);
                        $("#txt_MARGINper").val(response["data"]["margin"]);
                        $("#txt_packingper").val(response["data"]["packing"]);
                        $("#txt_pastingunit").val(response["data"]["pasting"]);
                        $("#txt_PLATERate").val(response["data"]["plateRate"]);
                        $("#txt_printingRate").val(response["data"]["printingRate"]);
                        $("#txt_quantity").val(response["data"]["quantity"]);
                        $("#txt_quotedRate").val(response["data"]["quotedRate"]);
                        $("#txt_rowid").val(response["data"]["rowId"]);
                        $("#txt_transportper").val(response["data"]["transport"]);
                        $("#txt_uvsq").val(response["data"]["uv"]);
                        $("#txt_wastage").val(response["data"]["wastage"]);
                        $("#txt_windowPacthingUnit").val(response["data"]["windowPacthing"]);
                        $("#txt_lups").val(response["data"]["layoutUPS"]);
                        $("#txt_bups").val(response["data"]["boardUPS"]);
                        $("#txt_incometaxper").val(response["data"]["incomeTax"]);
                        $("#txt_boardrate").val(response["data"]["boardRate"]);

                        $("#txt_dboardsize").val(response["data"]["boardSizeInch"]);
                        $("#txt_dboardsizebyheight").val(response["data"]["boardSizePercent"]);
                        $("#txt_dlayoutsize").val(response["data"]["layoutSizeInch"]);
                        $("#txt_dlayoutsizebyheight").val(response["data"]["layoutSizePercent"]);
                        $("#txt_afterwastageQuantity").val(response["data"]["afterWasteQuantity"]);
                        $("#txt_weightPacket").val(response["data"]["weightPacket"]);
                        $("#txt_packetCost").val(response["data"]["packetCost"]);
                        $("#txt_requiredPackets").val(response["data"]["requirdPackets"]);
                        $("#txt_layoutsheet").val(response["data"]["layoutSheet"]);
                        $("#txt_boardtotalWeight").val(response["data"]["boardTotalWaste"]);

                        $("#txt_board").val(response["data"]["boardCal"]);
                        $("#txt_board_per").val(response["data"]["boardPercent"]);

                        $("#txt_Plates").val(response["data"]["platesCal"]);
                        $("#txt_Plates_per").val(response["data"]["platesPercent"]);

                        $("#txt_printing").val(response["data"]["printingCal"]);
                        $("#txt_printing_per").val(response["data"]["printingPercent"]);

                        $("#txt_uv").val(response["data"]["uvCal"]);
                        $("#txt_uv_per").val(response["data"]["uvPercent"]);

                        $("#txt_lamination").val(response["data"]["laminationCal"]);
                        $("#txt_lamination_per").val(response["data"]["laminationPercent"]);

                        $("#txt_die_Cutting").val(response["data"]["dieCuttingCal"]);
                        $("#txt_die_Cutting_per").val(response["data"]["dieCuttingPercent"]);

                        $("#txt_foiling").val(response["data"]["foilingCal"]);
                        $("#txt_foiling_per").val(response["data"]["foilingPercent"]);

                        $("#txt_windowPatching").val(response["data"]["windowPatchingCal"]);
                        $("#txt_windowPatching_per").val(response["data"]["windowPatchingPercent"]);

                        $("#txt_pasting").val(response["data"]["pastingCal"]);
                        $("#txt_pasting_per").val(response["data"]["pastingPercent"]);

                        $("#txt_bagmaking").val(response["data"]["bagMakingCal"]);
                        $("#txt_bagmaking_per").val(response["data"]["bagMakingPercent"]);

                        $("#txt_eyelet").val(response["data"]["eyeletCal"]);
                        $("#txt_eyelet_per").val(response["data"]["eyletePercent"]);

                        $("#txt_hangingwire").val(response["data"]["hangingWireCal"]);
                        $("#txt_hangingwire_per").val(response["data"]["hangingWirePercent"]);

                        $("#txt_packing").val(response["data"]["packingCal"]);
                        $("#txt_packing_per").val(response["data"]["packingPercent"]);

                        $("#txt_transport").val(response["data"]["transportCal"]);
                        $("#txt_transport_per").val(response["data"]["transportPercent"]);

                        $("#txt_total").val(response["data"]["totalCal"]);
                        $("#txt_total_per").val(response["data"]["totalPercent"]);

                        $("#txt_incometax").val(response["data"]["incomeTaxCal"]);
                        $("#txt_subtotal").val(response["data"]["subTotalCal"]);

                        $("#txt_margin").val(response["data"]["marginCal"]);
                        $("#txt_grandtotal").val(response["data"]["grandTotalCal"]);
                        $("#txt_unitCost").val(response["data"]["unitCostCal"]);





                        //     $("#txt_location").val(response[0]["Result"][0]["Location"]);
                        //     $("#txt_qty").val(response[0]["Result"][0]["Qty"]);
                        //     $("#txt_layout").val(response[0]["Result"][0]["Layout"]);
                        //     $("#txt_size").val(response[0]["Result"][0]["Size"]);
                        //     $("#").val(response[0]["Result"][0]["Colour"]); 
                        //     _Item_ID = response[0]["Result"][0]["Item_Id"];
                        //     _Item_Name = response[0]["Result"][0]["Item"];
                        //     $('#txt_itm').val(_Item_ID); // Select the option with a value of '1'
                        //     $('#txt_itm').trigger('change'); // Notify any JS components that the value changed
                        //     $('#txt_itm').select2('disable');
                        //     $("#").val(response[0]["Result"][0]["CuttingMode"]);                       
                        //     $("#txt_boardrate").val(response[0]["Result"][0]["costOfPaper_des"]);
                        //     $("#txt_quantity").val(response[0]["Result"][0]["Qty"]);
                        //     $("#txt_wastage").val(response[0]["Result"][0]["Wastage"]);                       
                        //     $("#txt_lswidth").val(response[0]["Result"][0]["Width"]);
                        //     $("#txt_lsheight").val(response[0]["Result"][0]["Height"]);
                        //     $("#txt_bups").val(response[0]["Result"][0]["Ups"]);
                        //     $("#txt_colour").val(response[0]["Result"][0]["Colors"]);
                        //     $("#txt_boardrate").val(response[0]["Result"][0]["BoardRate"]);
                        //     $("#txt_PlateRate").val(response[0]["Result"][0]["PlateRate"]);
                        //     $("#txt_printingRate").val(response[0]["Result"][0]["PrintingRate"]);
                        //     $("#txt_uvsq").val(response[0]["Result"][0]["uv_rat"]);
                        //     $("#txt_laminationsq").val(response[0]["Result"][0]["lamination_rat"]);
                        //     $("#txt_diecutting").val(response[0]["Result"][0]["dieCutting_rat"]);
                        //     $("#txt_foilingunit").val(response[0]["Result"][0]["foiling_rat"]);
                        //     $("#txt_windowPacthingUnit").val(response[0]["Result"][0]["WindowPatching"]);
                        //     $("#txt_pastingunit").val(response[0]["Result"][0]["pasting_rat"]);
                        //     $("#txt_bagmakingunit").val(response[0]["Result"][0]["BagMaking"]);
                        //     $("#txt_eyeletunit").val(response[0]["Result"][0]["eyelet_rat"]);
                        //     $("#").val(response[0]["Result"][0]["HangingWire"]);
                        //     $("#txt_packingper").val(response[0]["Result"][0]["packing_rat"]);
                        //     $("#txt_transportper").val(response[0]["Result"][0]["Transport"]);
                        //     $("#txt_MARGINper").val(response[0]["Result"][0]["Marging"]);
                        //     $("#txt_incometaxper").val(response[0]["Result"][0]["incomeTax_rat"]);

                        //     $("#txt_dboardsize").val(response[0]["Result"][0]["tdqr_boardsizeamt_amt"]);
                        //     $("#txt_dlayoutsize").val(response[0]["Result"][0]["tdqr_layoutsizeamt_amt"]);
                        //     $("#txt_afterwastageQuantity").val(response[0]["Result"][0]["tdqr_afterwastageqty_amt"]);
                        //     $("#txt_weightPacket").val(response[0]["Result"][0]["tdqr_weightpackect_amt"]);
                        //     $("#txt_packetCost").val(response[0]["Result"][0]["tdqr_packetcost_amt"]);
                        //     $("#txt_requiredPackets").val(response[0]["Result"][0]["tdqr_requiredpackets_amt"]);
                        //     $("#txt_layoutsheet").val(response[0]["Result"][0]["tdqr_layoutsheet_amt"]);
                        //     $("#txt_boardtotalWeight").val(response[0]["Result"][0]["tdqr_boardtotalweight_amt"]),
                        //    $("#txt_board").val(response[0]["Result"][0]["tdqr_boardamt"]);
                        //     $("#txt_Plates").val(response[0]["Result"][0]["tdqr_Platesamt"]);
                        //     $("#txt_printing").val(response[0]["Result"][0]["tdqr_printingamt"]);
                        //     $("#txt_uv").val(response[0]["Result"][0]["tdqr_uvamt"]);
                        //     $("#txt_lamination").val(response[0]["Result"][0]["tdqr_laminationamt"]);
                        //     $("#").val(response[0]["Result"][0]["tdqr_diecuttingamt"]);
                        //     $("#").val(response[0]["Result"][0]["tdqr_foilingamt"]);
                        //     $("#txt_windowPatching").val(response[0]["Result"][0]["tdqr_windowpachingamt"]),
                        //     $("#txt_pasting").val(response[0]["Result"][0]["tdqr_pastingamt"]);
                        //     $("#txt_bagmaking").val(response[0]["Result"][0]["tdqr_bagmakingamt"]);
                        //     $("#").val(response[0]["Result"][0]["tdqr_eyeletamt"]);
                        //     $("#").val(response[0]["Result"][0]["tdqr_hangingwireamt"]);
                        //     $("#txt_packing").val(response[0]["Result"][0]["tdqr_packingamt"]);
                        //     $("#txt_transport").val(response[0]["Result"][0]["tdqr_transportamt"]);
                        //     $("#txt_total").val(response[0]["Result"][0]["grosstotal"]);
                        //     $("#txt_incometax").val(response[0]["Result"][0]["tdqr_incometaxamt"]);
                        //     $("#txt_subtotal").val(response[0]["Result"][0]["subtotal"]);
                        //     $("#txt_margin").val(response[0]["Result"][0]["tdqr_margingamt"]);
                        //     $("#txt_grandtotal").val(response[0]["Result"][0]["grandTotal"]);
                        //     $("#txt_unitCost").val(response[0]["Result"][0]["unitPrice"]);
                        //calculate();

                        return true;
                    }
                    else {
                        imgload.hide();
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
                    imgload.hide();
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
            return true;
        }
    });

})
//Edit End

//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _id = data['id'];
    var _Item = data['description'];
    var _quotationStatus = data['quotationStatus'];
    if (Boolean(_quotationStatus)) {
        Swal.fire({
            title: "Quotation approved",
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
        title: 'Are sure wants to delete <br/>' + _Item + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm,
                type: "Delete",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "ID": _id,
                    "menu_Id": _menuid
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                },
                success: function (response) {

                    if (response.statusCode == 200) {
                        imgload.hide();
                        discon();
                        Swal.fire({
                            title: response.message,

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
                        imgload.hide();
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
                    imgloadsav.hide();
                    btnsav.show();
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
});
//Delete End


function cal() {
    var stotal = 0
    // var qty = $("#txt_tbl_qtyrat").val();
    var cop = $("#txt_tbl_coprat").val();
    // var rr = $("#txt_tbl_rrrat").val();
    var sep = $("#txt_tbl_seprat").val();
    var nop = $("#txt_tbl_noprat").val();
    // var proof = $("#txt_tbl_proofrat").val();
    var paper = $("#txt_tbl_paperrat").val();
    var print = $("#txt_tbl_printrat").val();
    var uv = $("#txt_tbl_uvrat").val();
    var lam = $("#txt_tbl_lamrat").val();
    var foil = $("#txt_tbl_foilrat").val();
    var dc = $("#txt_tbl_dcrat").val();
    var pas = $("#txt_tbl_pastrat").val();
    var eye = $("#txt_tbl_eyerat").val();
    var sub = $("#txt_tbl_subrat").val();
    var pack = $("#txt_tbl_packrat").val();

    stotal = parseFloat(cop) + parseFloat(sep) + parseFloat(nop) + parseFloat(paper) + parseFloat(print) + parseFloat(uv) + parseFloat(lam) + parseFloat(foil) + parseFloat(dc) + parseFloat(pas) + parseFloat(eye) + parseFloat(sub) + parseFloat(pack);

    $("#txt_tbl_stotal").val(stotal);
    gtotal();
    incometax();
}
function gtotal() {
    var stax = 0;
    var subtotal = $("#txt_tbl_stotal").val();
    var salestax = $("#txt_tbl_staxdes").val();
    stax = parseInt(subtotal * (salestax / 100))

    $("#txt_tbl_staxrat").val(stax);
    $("#txt_tbl_grosstotal").val(stax + parseFloat(subtotal));
    incometax();
}

function incometax() {
    var itax = 0;
    var groostotal = $("#txt_tbl_grosstotal").val();
    var incometax = $("#txt_tbl_itaxdes").val();
    itax = parseInt(groostotal * (incometax / 100))
    $("#txt_tbl_itaxrat").val(itax);
    $("#txt_tbl_gtotal").val(itax + parseFloat(groostotal));

    unitprice();
}

function unitprice() {
    var grandtotal = $("#txt_tbl_gtotal").val()
    var qty = $('#txt_qty').val()
    $('#txt_tbl_uprice').val(parseFloat(grandtotal) / parseFloat(qty))
}

function ckvalidation() {

    var ck = 0, _Error = '', _cre = '';
    txtid = $("#txt_id").html();
    txtdat1 = moment(txtdat.find("input").val()).format("YYYY-MM-DD");


    var txtbswidth = $("#txt_bswidth");
    var txtcuttingmode = $("#txt_cuttingmode");

    var txtbsheight = $("#txt_bsheight");
    var txtbups = $("#txt_bups");
    var txtlswidth = $("#txt_lswidth");
    var txtlsheight = $("#txt_lsheight");
    var txtlups = $("#txt_lups");
    var txtgsm = $("#txt_gsm");
    var txtboardrate = $("#txt_boardrate");
    var txtquantity = $("#txt_quantity");
    var txtwastage = $("#txt_wastage");
    var txtcolour = $("#txt_colour");
    var txtPLATERate = $("#txt_PLATERate");
    var txtprintingRate = $("#txt_printingRate");
    var txtuvsq = $("#txt_uvsq");
    var txtlaminationsq = $("#txt_laminationsq");
    var txtdiecutting = $("#txt_diecutting");
    var txtfoilingunit = $("#txt_foilingunit");
    var txtwindowPacthingUnit = $("#txt_windowPacthingUnit");
    var txtpastingunit = $("#txt_pastingunit");
    var txtbagmakingunit = $("#txt_bagmakingunit");
    var txteyeletunit = $("#txt_eyeletunit");
    var txthangingwireunit = $("#txt_hangingwireunit");
    var txtpackingper = $("#txt_packingper");
    var txttransportper = $("#txt_transportper");
    var txtincometaxper = $("#txt_incometaxper");
    var txtMARGINper = $("#txt_MARGINper");
    var txtquotedRate = $("#txt_quotedRate");
    var txtpquo = $("#txt_pquo");
    var txtrowid = $("#txt_rowid");
    var txtdboardsize = $("#txt_dboardsize");
    var txtdboardsizebyheight = $("#txt_dboardsizebyheight");
    var txtdlayoutsize = $("#txt_dlayoutsize");
    var txtdlayoutsizebyheight = $("#txt_dlayoutsizebyheight");
    var txtafterwastageQuantity = $("#txt_afterwastageQuantity");
    var txtweightPacket = $("#txt_weightPacket");
    var txtpacketCost = $("#txt_packetCost");
    var txtrequiredPackets = $("#txt_requiredPackets");
    var txtlayoutsheet = $("#txt_layoutsheet");
    var txtboardtotalWeight = $("#txt_boardtotalWeight");
    var txtboard = $("#txt_board");
    var txtboardper = $("#txt_board_per");
    var txtPlates = $("#txt_Plates");
    var txtPlatesper = $("#txt_Plates_per");
    var txtprinting = $("#txt_printing");
    var txtprintingper = $("#txt_printing_per");
    var txtuv = $("#txt_uv");
    var txtuvper = $("#txt_uv_per");
    var txtlamination = $("#txt_lamination");
    var txtlaminationper = $("#txt_lamination_per");
    var txt_dieCutting = $("#txt_die_Cutting");
    var txtdieCuttingper = $("#txt_die_Cutting_per");
    var txt_foiling = $("#txt_foiling");
    var txtfoilingper = $("#txt_foiling_per");
    var txtwindowPatching = $("#txt_windowPatching");
    var txtwindowPatchingper = $("#txt_windowPatching_per");
    var txtpasting = $("#txt_pasting");
    var txtpastingper = $("#txt_pasting_per");
    var txtbagmaking = $("#txt_bagmaking");
    var txtbagmakingper = $("#txt_bagmaking_per");
    var txteyelet = $("#txt_eyelet");
    var txteyeletper = $("#txt_eyelet_per");
    var txthangingwire = $("#txt_hangingwire");
    var txthangingwireper = $("#txt_hangingwire_per");
    var txtpacking = $("#txt_packing");
    var txtpackingpercent = $("#txt_packing_per");
    var txttransport = $("#txt_transport");
    var txttransportpercent = $("#txt_transport_per");
    var txttotalper = $("#txt_total");
    var txttotal_per = $("#txt_total_per");
    var txtincometax = $("#txt_incometax");
    var txtsubtotalper = $("#txt_subtotal");
    var txtmargin = $("#txt_margin");
    var txtgrandtotal = $("#txt_grandtotal");
    var txtunitCost = $("#txt_unitCost");
    var txttotal = $("#txt_total");
    var txtsubtotal = $("#txt_subtotal");
    var txtitm = $('#txt_itm');
    var txtlocation = $("#txt_location");

    if (txtdat1 == "") {
        ck = 1;
        _Error = "Please select date";
        txtdat1.focus();
    }
    else if (txttotal.val() == "" || txtsubtotal.val() == "") {
        ck = 1;
        _Error = "Please Enter Calculation Button";
    }
    else if (txtbups.val() == "") {
        ck = 1;
        _Error = "Please Enter Board UPS Value";
        txtbups.focus();
    }
    else if (txtpquo.val() == "") {
        ck = 1;
        _Error = "Please Select Any Quotation";
        txtpquo.focus();

    } else if (txtitm.val() == "") {
        ck = 1;
        _Error = "Please Select Any Item";
        txtitm.focus();

    }



    if (Boolean(ck)) {
        Swal.fire({
            title: _Error,
            icon: 'error'
        })

    }
    else if (!Boolean(ck)) {



        _cre = JSON.stringify({
            "Id": txtid,
            "date": txtdat1,
            "valueAddition": txtitm.select2('data').text,
            "customerLocation": txtlocation.val(),
            "boardWidth": txtbswidth.val(),
            "cuttingMode": txtcuttingmode.val(),
            "boardHeight": txtbsheight.val(),
            "boardUPS": txtbups.val(),
            "layoutWidth": txtlswidth.val(),
            "layoutHeight": txtlsheight.val(),
            "layoutUPS": txtlups.val(),
            "gsm": txtgsm.val(),
            "boardRate": txtboardrate.val(),
            "quantity": txtquantity.val(),
            "wastage": txtwastage.val(),
            "color": txtcolour.val(),
            "plateRate": txtPLATERate.val(),
            "printingRate": txtprintingRate.val(),
            "uv": txtuvsq.val(),
            "lamination": txtlaminationsq.val(),
            "dieCutting": txtdiecutting.val(),
            "foiling": txtfoilingunit.val(),
            "windowPacthing": txtwindowPacthingUnit.val(),
            "pasting": txtpastingunit.val(),
            "bagMaking": txtbagmakingunit.val(),
            "eyelet": txteyeletunit.val(),
            "hangingWire": txthangingwireunit.val(),
            "packing": txtpackingper.val(),
            "transport": txttransportper.val(),
            "incomeTax": txtincometaxper.val(),
            "margin": txtMARGINper.val(),
            "quotedRate": txtquotedRate.val(),
            "menu_Id": _menuid,
            "quotationMasterId": txtpquo.select2('data').id,
            "RowId": txtrowid.val(),
            "menu_Id": _menuid,
            "boardsizeInch": txtdboardsize.val(),
            "boardsizePercent": txtdboardsizebyheight.val(),
            "layoutsizeInch": txtdlayoutsize.val(),
            "layoutsizePercent": txtdlayoutsizebyheight.val(),
            "afterwasteQuantity": txtafterwastageQuantity.val(),
            "weightPacket": txtweightPacket.val(),
            "packetCost": txtpacketCost.val(),
            "requirdPackets": txtrequiredPackets.val(),
            "layoutSheet": txtlayoutsheet.val(),
            "boardtotalWaste": txtboardtotalWeight.val(),
            "boardCal": txtboard.val(),
            "boardPercent": txtboardper.val(),
            "platesCal": txtPlates.val(),
            "platesPercent": txtPlatesper.val(),
            "PrintingCal": txtprinting.val(),
            "PrintingPercent": txtprintingper.val(),
            "uvCal": txtuv.val(),
            "uvPercent": txtuvper.val(),
            "laminationCal": txtlamination.val(),
            "laminationPercent": txtlaminationper.val(),
            "dieCuttingCal": txt_dieCutting.val(),
            "dieCuttingPercent": txtdieCuttingper.val(),
            "foilingCal": txt_foiling.val(),
            "foilingPercent": txtfoilingper.val(),
            "windowPatchingCal": txtwindowPatching.val(),
            "windowPatchingPercent": txtwindowPatchingper.val(),
            "pastingCal": txtpasting.val(),
            "pastingPercent": txtpastingper.val(),
            "bagMakingCal": txtbagmaking.val(),
            "bagMakingPercent": txtbagmakingper.val(),
            "eyeletCal": txteyelet.val(),
            "eyletePercent": txteyeletper.val(),
            "hangingWireCal": txthangingwire.val(),
            "hangingWirePercent": txthangingwireper.val(),
            "packingCal": txtpacking.val(),
            "packingPercent": txtpackingpercent.val(),
            "transportCal": txttransport.val(),
            "transportPercent": txttransportpercent.val(),
            "totalCal": txttotalper.val(),
            "totalPercent": txttotal_per.val(),
            "incomeTaxCal": txtincometax.val(),
            "subTotalCal": txtsubtotalper.val(),
            "marginCal": txtmargin.val(),
            "grandTotalCal": txtgrandtotal.val(),
            "unitCostCal": txtunitCost.val(),



        });
    }
    return { ckval: ck, creteria: _cre };
}
//Validation End