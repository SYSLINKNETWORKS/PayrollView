function ProductionDetail(response) {
    var rowdata = '';
    var masterRecord = response.data;

    if (masterRecord.length > 0) {
        for (var row_cnt = 0; row_cnt < masterRecord.length; row_cnt++) {
            var today = 'Print By : ' + masterRecord[row_cnt]["userName"] + ' Date : ' + moment(new Date()).format("DD-MMM-YYYY") + ' Time : ' + moment(new Date()).format("HH:mm:S");
            var productiondepartment = masterRecord[row_cnt]["productionLists"];
            var _totalcolumn = 8;
            //Table form Master Record

            rowdata += '<table id="detail_table" class="table" style="font-size:8pt;">';
            // rowdata += '<thead>';
            // rowdata += '  <tr style="border:1px solid black"><th rowspan="2" style="width:100px;border:1px solid black"><div style="text-align:center;"><img src="/images/twpp.png" style="width: 100px; text-align:center ;" alt="twp"></dev></th><th rowspan="2" style="border:1px solid black;"><div style="text-align:center;margin-bottom: 15px;">' + masterRecord[row_cnt]["headingName"] + '</div></th><th colspan="2" style="border:1px solid black">'+ masterRecord[row_cnt]["departmentName"]+'</th>';
            // rowdata += ' <tr style="border:1px solid black"><th style="border:1px solid black">Date:' + moment(masterRecord[row_cnt]["date"]).format("DD-MMM-YYYY") + '</th><th style="border:1px solid black"><div style="text-align:center;">Page 1 of 1</div></th></tr>';


            // rowdata += '</thead>';
            rowdata += '<thead>';
            rowdata += '<tr>' +
                '<th colspan=' + _totalcolumn + ' style="text-align:center;font-size:14pt;font-weight:bold;">' + masterRecord[row_cnt]["companyName"] + '</th>' +
                '</tr>' +
                '<tr>' +
                '<th colspan=' + _totalcolumn + ' style="text-align:center;font-variant-caps:all-petite-caps;font-size:12pt;font-weight:bold;">' + masterRecord[row_cnt]["headingName"] + ' Hourly Production Report' + '</th>' +
                '</tr>' +
                '<tr>' +
                '<th colspan=' + _totalcolumn + ' style="text-align:right;font-variant-caps:all-petite-caps;font-size:6pt;font-weight:bold;">' + today + '</th>' +
                '</tr>';

            rowdata += '</thead>';
            rowdata += '</table>';

            // detailsTable.append(rowdata);
            //Table for Details Record
            rowdata += '<table id="detail_table" class="table" style="font-size:8pt;">';
            rowdata += '<thead>';
            rowdata += '<tr>' +
                '<th colspan="6"style="text-align:right;font-weight:bold;">Date : </th>' +
                '<th style="text-align:left;font-weight:bold;">' + moment(masterRecord[row_cnt]["date"]).format("DD-MMM-YYYY") + ' </th>' + //'+ + moment(masterRecord[row_cnt]["date"]).format("DD-MMM-YYYY") + ' </th > ' +
                '</tr>';
            rowdata += '<tr style="font-weight:bold;">' +
                '<th>Time</th>' +
                '<th>Job#</th>' +
                '<th>SO#</th>' +
                '<th>Job Description</th>' +
                '<th>Sheets</th>' +
                '<th>Machine</th>' +
                '<th>Operator</th>' +
                '</tr>';
            rowdata += '</thead>';

            rowdata += '<tbody>';
            for (row_cnt_filter = 0; row_cnt_filter < productiondepartment.length; row_cnt_filter++) {

                rowdata += '<tr style="font-size:7pt;">';
                if (row_cnt_filter == productiondepartment.length - 1) {
                    //                    rowdata += '<td>' + 'From ' + moment(productiondepartment[row_cnt_filter]["time"]).format("hh:mm A") + '<br>' + 'To ' + moment(productiondepartment[0]["time"]).format("hh:mm A") + '</td>';
                    rowdata += '<td>' + moment(productiondepartment[row_cnt_filter]["time"]).format("HH") + '-' + moment(productiondepartment[0]["time"]).format("HH") + '</td>';
                }
                if (row_cnt_filter != productiondepartment.length - 1) {
                    //                  rowdata += '<td>' + 'From ' + moment(productiondepartment[row_cnt_filter]["time"]).format("hh:mm A") + '<br>' + 'To ' + moment(productiondepartment[row_cnt_filter + 1]["time"]).format("hh:mm A") + '</td>';
                    rowdata += '<td>' + moment(productiondepartment[row_cnt_filter]["time"]).format("HH") + '-' + moment(productiondepartment[row_cnt_filter + 1]["time"]).format("HH") + '</td>';
                }
                rowdata +=
                    '<td>' + productiondepartment[row_cnt_filter]["jobNo"] + '</td>' +
                    '<td>' + productiondepartment[row_cnt_filter]["saleOrderNo"] + '</td>' +
                    '<td style="Font-wight:bold;">' + productiondepartment[row_cnt_filter]["jobDescription"] + '</td>' +
                    // '<td>' + productiondepartment[row_cnt_filter]["size"] + '</td>' +
                    // '<td>' + productiondepartment[row_cnt_filter]["cutMode"] + '</td>' +
                    '<td>' + (productiondepartment[row_cnt_filter]["sheet"] != '' ? accounting.format(productiondepartment[row_cnt_filter]["sheet"], 0) : '') + '</td>' +
                    //                    '<td>' + productiondepartment[row_cnt_filter]["board"] + '</td>' +
                    '<td>' + productiondepartment[row_cnt_filter]["machineName"] + '</td>' +
                    '<td>' + productiondepartment[row_cnt_filter]["operatorName"] + '</td>' +
                    '</tr>';


            }
            rowdata += '</tbody">';
            rowdata += '</table>';
        }
    }
    else {
        rowdata = '<h2 style="text-align:center">Record Not Found</h2>';
    }
    return rowdata;

}

//export { ProductionDetail }