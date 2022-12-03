var imgload = $("#img_load");

var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var ApiForm = '';




$(document).ready(function () {
    ApiForm = apiUrl + '/api/Log/v1/LOV/GetService';
    imgload.hide();
    Onload();

});


//Onload Start
function Onload() {
    $.ajax({
        url: ApiForm,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {

                var detailsTableBody = $("#Table_View tbody");
                detailsTableBody.empty();
                const _DetailRecord = response["data"];
                var sno = 1;
                var productItem;

                for (var row_cnt = 0; row_cnt < _DetailRecord.length; row_cnt++) {
                    productItem += '<tr>' +
                        '<td>' + sno++ + '</td>' +
                        '<td >' + _DetailRecord[row_cnt]["name"] + '</td>' +
                        '<td ></td>' +
                        '<td ></td>' +
                        '</tr>';

                }

                detailsTableBody.append(productItem);
                imgload.hide();
                GetVersion();
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

//Auth Start
async function GetVersion() {

    var rows_create = $("#Table_View tbody >tr");
    var _ServerName = '';
    var error = '';

    var row_cnt = 0;
    for (row_cnt = 0; row_cnt < rows_create.length; row_cnt++) {
        columns = $(rows_create[row_cnt]).find('td');
        _ServerName = $(columns[1]).html();
        try {
            await GetVersionServiceWise(_ServerName);
        } catch (error) {
            continue;
        }

    }

}
//Onload End



async function GetVersionServiceWise(_ServerName) {

    var _Version = '';
    var _Style = 'style="color:green; font-weight: bold"';
    await $.ajax({
        url: apiUrl + '/api/' + _ServerName + '/v1/Version',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {

            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {

                _Version = response.message;
                $(columns[2]).html(_Version);
                $(columns[3]).addClass("Ok");;
                $(columns[3]).html('OK');
                imgload.hide();
            }
            else {
                _Version = response.statusCode == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                //                _Version = response.message;
                $(columns[2]).html(_Version);
                $(columns[3]).addClass("Error");;
                $(columns[3]).html('Error');

                imgload.hide();

            }
        },
        error: function (xhr, status, err) {

            _Version = xhr.status.toString() + ' ' + err.toString();

            $(columns[2]).html(_Version);
            $(columns[3]).addClass("Error");;
            $(columns[3]).html('Error');
            imgload.hide();
        }


    })
}




