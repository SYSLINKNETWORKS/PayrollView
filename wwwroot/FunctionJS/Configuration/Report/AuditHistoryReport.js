var imgload = $("#img_load");
//var currentURL = document.URL;
var sessid = "";
var url = params = new URLSearchParams(window.location.search);

if (url.has('S')) {
    sessid = url.get('S');
}

var _cre = sessionStorage.getItem(sessid);


var ApiForm = '';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Log';
    imgload.hide();
    window.resizeTo(960, 600);
    printReport();


});

function printReport() {
    detailsTable = $("#div_HistoryAudit");
    detailsTable.empty();
    $.ajax({
        url: ApiForm + '/v1/Report/GetAuditHistoryReport',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        infoEmpty: "No records available - Got it?",
        data: _cre,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                const _creObj = JSON.parse(_cre);
                var _MenuID = _creObj.menuId;


                var _columnno = 13;
                var today = 'Print By : ' + response["data"]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
                var rowdata = '';
                rowdata = '<table id="detail_table_master" class="table table-responsive" style="font-size:8pt;" >';
                rowdata += '<thead>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=' + _columnno + ' >' + response["data"]["companyName"] + ' </th></tr>';
                rowdata += '<tr><th style="font-weight:bold;text-align:center;" colspan=' + _columnno + ' >' + response["data"]["headingName"] + '</th></tr>';
                rowdata += '<tr><th style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;" colspan=' + _columnno + ' >' + today + '</th></tr>';
                rowdata += '</thead>';
                rowdata += '</table>';



                var _sno = 0;
                rowdata += '<table id="detail_table" class="table table-responsive table-bordered" style="font-size:7pt;" >';
                rowdata += '<thead>';
                rowdata += '<tr style="font-weight:bold;">' +
                    '<th style="font-weight:bold;text-align:center;">S.No</th>' +
                    '<th style="font-weight:bold;text-align:center;">Date</th>' +
                    '<th style="font-weight:bold;text-align:center;">Time</th>' +
                    '<th style="font-weight:bold;text-align:center;">User Name</th>' +
                    '<th style="font-weight:bold;text-align:center;">Menu</th>' +
                    '<th style="font-weight:bold;text-align:center;">Action</th>' +
                    '<th style="font-weight:bold;text-align:center;">History</th>' +
                    '</tr>';
                rowdata += '</thead>';
                rowdata += '<body>';
                const _transaction = response["data"]["auditReportServicesDetailViewModels"];
                for (var row_cnt = 0; row_cnt < _transaction.length; row_cnt++) {


                    var cre_audit = '{ "id": "' + _transaction[row_cnt]["id"] + '","menuId": "' + _MenuID + '"} ';

                    var sessid_audit = "T" + _transaction[row_cnt]["id"] + "C" + moment(new Date()).format("DDMMYYYYHHmmss");


                    sessionStorage.setItem(sessid_audit, cre_audit)

                    _sno = parseFloat(_sno) + 1;
                    var _HistoryLink = '';
                    // if (_transaction[0]["oldValue"] != '' || _transaction[0]["newValue"] != '') {
                    _HistoryLink = '<a href="#" onclick=window.open("' + apiUrl_View + '/Configuration/Report/AuditHistoryReport?S=' + sessid_audit + '","_blank") > History</a >';
                    // }
                    rowdata += '<tr>' +
                        '<td>' + _sno + '</td>' +
                        '<td>' + moment(_transaction[row_cnt]["date"]).format('DD-MMMM-YYYY') + '</td>' +
                        '<td>' + moment(_transaction[row_cnt]["date"]).format('hh-mm A') + '</td>' +
                        '<td>' + _transaction[row_cnt]["userName"] + '</td>' +
                        '<td>' + _transaction[row_cnt]["menuAlias"] + '</td>' +
                        '<td>' + _transaction[row_cnt]["action"] + '</td>' +
                        //                        '<td>' + _transaction[row_cnt]["id"] + '</td>' +
                        '<td>' + _HistoryLink + '</td > ' +
                        '</tr>';

                }
                rowdata += '</body>';
                rowdata += '</table>';
                detailsTable.append(rowdata);
                //Old Value
                if (_transaction[0]["oldValue"] != '') {
                    var _oldValue = JSON.parse(_transaction[0]["oldValue"]);
                    filteredarr = Object.keys(_oldValue);//.filter((key) => typeof _oldValue[key] === "object" && _oldValue[key] !== null && _oldValue[key].length)
                    rowdata = '<table id="detail_table_history_old" class="table table-responsive" style="font-size:8pt;" >';
                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th style="font-weight:bold;text-align:center;" colspan=4>old Value</th>' +
                        '</tr>';
                    rowdata += '</thead>';
                    rowdata += '<body>';
                    for (var i = 1; i < Object.keys(_oldValue).length; i++) {
                        if (Object.values(_oldValue)[i] != null) {
                            rowdata += '<tr>' +
                                '<td style="font-weight:bold;">' + Object.keys(_oldValue)[i] + ' : ' + Object.values(_oldValue)[i] + ' </td>';
                        }
                        i++;

                        if (Object.values(_oldValue)[i] == null) { i++; }
                        if (i <= Object.keys(_oldValue).length) {
                            rowdata += '<td style="font-weight:bold;">' + Object.keys(_oldValue)[i] + ' : ' + Object.values(_oldValue)[i] + ' </td>' +
                                '</tr>';
                        }
                    }
                    rowdata += '</body>';
                    rowdata += '</table>';
                    detailsTable.append(rowdata);
                }

                //New Value
                if (_transaction[0]["newValue"] != '') {
                    var _newValue = JSON.parse(_transaction[0]["newValue"]);
                    filteredarr = Object.keys(_newValue);//.filter((key) => typeof _oldValue[key] === "object" && _oldValue[key] !== null && _oldValue[key].length)
                    rowdata = '<table id="detail_table_history_new" class="table table-responsive" style="font-size:8pt;" >';
                    rowdata += '<thead>';
                    rowdata += '<tr style="font-weight:bold;">' +
                        '<th style="font-weight:bold;text-align:center;" colspan=4>New Value</th>' +
                        '</tr>';
                    rowdata += '</thead>';
                    rowdata += '<body>';
                    for (var i = 1; i < Object.keys(_newValue).length; i++) {
                        if (Object.values(_newValue)[i] != null) {
                            rowdata += '<tr>' +
                                '<td style="font-weight:bold;">' + Object.keys(_newValue)[i] + ' : ' + Object.values(_newValue)[i] + ' </td>';
                        }
                        i++;

                        if (Object.values(_newValue)[i] == null) { i++; }
                        if (i <= Object.keys(_newValue).length) {
                            rowdata += '<td style="font-weight:bold;">' + Object.keys(_newValue)[i] + ' : ' + Object.values(_newValue)[i] + ' </td>' +
                                '</tr>';
                        }
                    }
                    rowdata += '</body>';
                    rowdata += '</table>';
                    detailsTable.append(rowdata);
                }
                imgload.hide();
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
}
$(document).on("click", '#btnExport', function (e) {
    //  window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()), new Date() + '.xls');
    //  e.preventDefault();

    var a = document.createElement('a');
    //getting data from our div that contains the HTML table
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = encodeURIComponent($('#Print_Div').html());
    // var table_html = table_div.outerHTML.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_div;
    //setting the file name
    a.download = 'Voucher' + moment(new Date()).format('DDMMYYYYHHmmss') + '.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
});
$(document).on("click", '#btnPrint', function (e) {
    $("#btnPrint").hide();
    $("#btnExport").hide();
    window.print();
    $("#btnPrint").show();
    $("#btnExport").show();

    e.preventDefault();
});



// var _oldValue = {
//     "$id": "1", "No": "003b4a7b-6754-4aed-afb6-5f65159c067d", "Id": "019-20220819", "CostCenterName": "Accounts", "CurrencyName": "Rs", "Date": "2022-08-19T00:00:00", "TransactionDate": "2022-08-19T00:00:00", "PaidReceived": "", "Remarks": "", "CostCenterId": null, "VoucherTypeNo": "JV", "CurrencyId": "00000000-0000-0000-0000-000000000000", "OnlineCheck": false, "ChqNo": 0, "ChqDate": "2022-08-19T00:00:00", "ChqClear": false, "ExchangeRate": 1, "Approved": false, "Check": false, "Type": null,
//     "Majid": [{ "ControlId": "02003002001001001", "Description": "salman-Mobile ", "Level": 7, "MasterDetail": "D", "OldId": "string", "Action": "E", "UserNameInsert": "AbdulSattar", "InsertDate": "2022-08-17" }, { "ControlId": "02003002001001001", "Description": "salman-Mobile ", "Level": 7, "MasterDetail": "D", "OldId": "string", "Action": "E", "UserNameInsert": "AbdulSattar", "InsertDate": "2022-08-17" }],
//     "Detail": [{ "ControlId": "02003002001001001", "Description": "salman-Mobile ", "Level": 7, "MasterDetail": "D", "OldId": "string", "Action": "E", "UserNameInsert": "AbdulSattar", "InsertDate": "2022-08-17" }, { "ControlId": "02003002001001001", "Description": "salman-Mobile ", "Level": 7, "MasterDetail": "D", "OldId": "string", "Action": "E", "UserNameInsert": "AbdulSattar", "InsertDate": "2022-08-17" }, { "ControlId": "02003002001001001", "Description": "salman-Mobile ", "Level": 7, "MasterDetail": "D", "OldId": "string", "Action": "E", "UserNameInsert": "AbdulSattar", "InsertDate": "2022-08-17" }],
//     "VoucherDetailViewByIdList": [{ "$id": "2", "AccountName": "CAPITAL ACCOUNT", "AccountNo": "1905493d-6324-43a4-f037-08d9dff11528", "Naration": null, "DebitAmount": 123, "CreditAmount": 0 }, { "$id": "3", "AccountName": "PAKISTAN FIRE & FUMIGATION SERVICES", "AccountNo": "e087b39c-d2e1-4ad1-9d7e-08da120b7418", "Naration": null, "DebitAmount": 0, "CreditAmount": 123 }]
// }
// let arr = []
// let filteredarr = []
// // the json data. (you can change the values for output.)
// filteredarr = Object.keys(_oldValue).filter((key) => typeof _oldValue[key] === "object" && _oldValue[key] !== null && _oldValue[key].length)
// filteredarr.forEach((item) => _oldValue[item].forEach((item) => arr.push(...Object.keys(item))))
// //let unique = [...new Set(arr)]

// function Onload() {
//     _oldValue = [_oldValue];
//     console.log(_oldValue)
//     // Extract value from table header.
//     var col = [];
//     for (var i = 0; i < _oldValue.length; i++) {

//         let abc = Object.keys(_oldValue[i]).filter((key) => typeof _oldValue[i][key] !== "object")
//         console.log(abc)

//         for (var key in abc) {

//             if (col.indexOf(key) === -1) {
//                 col.push(abc[key]);
//             }
//         }
//     }
//     // Create a table.
//     var table = document.createElement("table");

//     // Create table header row using the extracted headers above.
//     // table row.
//     var tr = table.insertRow(-1);

//     for (var i = 0; i < col.length; i++) {
//         // table header.
//         var th = document.createElement("th");
//         th.innerHTML = col[i];
//         tr.appendChild(th);
//     }

//     // add json data to the table as rows.
//     for (var i = 0; i < _oldValue.length; i++) {
//         // console.log(_oldValue[0][filteredarr[0]]);
//         // console.log(_oldValue[0][filteredarr[1]]);
//         tr = table.insertRow(-1);
//         for (var j = 0; j < col.length; j++) {
//             var tabCell = tr.insertCell(-1);
//             tabCell.innerHTML = _oldValue[i][col[j]];
//         }
//     }

//     // Now, add the newly created table with json data, to a container.
//     var divShowData = document.getElementById('showtable');
//     divShowData.innerHTML = "";
//     divShowData.appendChild(table);

// }


// //  console.log(_oldValue[filteredarr[0]][0])

// filteredarr.forEach((item, ind) => {
//     console.log(ind);
//     var array = _oldValue[filteredarr[ind]];
//     // console.log(_oldValue[filteredarr[0]]);

//     // Extract value from table header.
//     var col = [];
//     col.push(...Object.keys(array[0]))

//     // Create a table.
//     var table = document.createElement("table");
//     table.id = 't_' + ind + '';
//     div_HistoryAudit.append(table);
//     var div = document.createElement('div');
//     div.style = "height: 20px;"
//     div_HistoryAudit.append(div);

//     // Create table header row using the extracted headers above.
//     // table row.
//     var tr = table.insertRow(-1);

//     for (var i = 0; i < col.length; i++) {
//         // table header.
//         var th = document.createElement("th");
//         th.innerHTML = col[i];
//         tr.appendChild(th);
//     }

//     for (let j = 0; j < array.length; j++) {
//         tr = table.insertRow(-1);
//         col.forEach((column) => {
//             let tabCell = tr.insertCell(-1);
//             tabCell.innerHTML = array[j][column];
//         })
//     }

// })

