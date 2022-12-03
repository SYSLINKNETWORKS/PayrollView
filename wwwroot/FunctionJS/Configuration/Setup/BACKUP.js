
var url = params = new URLSearchParams(window.location.search);
var _menuid = '';
if (url.has('M')) {
    _menuid = url.get('M');
}
var ApiForm = '';


var imgload = $("#img_load");
var bac = $("#btn_backup");
var backuptable = $("#Table_View");

var _Service_Id='0';
var _Service_Name='';

$(document).ready(function () {
    ApiForm = apiUrl + '/api/Auth/v1/BackupDB';

    imgload.hide();
    backuptable.hide();
    discon();
});

//Discon Start
function discon() {
    ComponentsDropdowns.init();
    $('#txt_service').select2('val', '');
    $('#txt_service').html('');
   


}
//Discon End

//Backup Start
function create_backup() {
    if(_Service_Name =='')
    {
        Swal.fire({
            title: "Please Select Service",
            icon: 'error'
        })
        return false
    }
    Swal.fire({
        title: 'Are you sure wants to Backup?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: apiUrl + '/api/'+_Service_Name+'/v1/BackupDB',
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                    bac.hide();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgload.hide();
                        bac.show();
                        show_backup();
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
                        bac.show();
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
//Backup End

// Delete Start 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var file = data['fileName'];
    Swal.fire({
        title: "Are sure wants to delete " + file + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: apiUrl + '/api/'+_Service_Name+'/v1/BackupDB',
                type: "Delete",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("FileName", file);
                    imgload.show();
                },
                success: function (response) {
                    if (response.statusCode == 200) {
                        imgload.hide();
                        show_backup();
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
                    imgload.hide();

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

// Delete End 

//Download backup Start
$('table').on('click', '.btn-download', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var file = data['fileName'];


    Swal.fire({
        title: "Are sure wants to download : " + file + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            // var urlstr = ApiForm + '/' + file;
            // window.location.assign(urlstr);
            $.ajax({
                url: apiUrl + '/api/'+_Service_Name+'/v1/BackupDB/DownloadBackup',

                type: "Get",
              //  contentType: "application/zip",
                //dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("FileName", file);
                    imgload.show();
                },
                success: function (response) {
                     var blob = new Blob([response]);
                     var link = document.createElement('a');
                     link.href = window.URL.createObjectURL(blob);
                     link.download =file;// fileName;
                     link.click();
                     imgload.hide();
                    

                },
                error: function (xhr, status, err) {
                    imgload.hide();

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

//Download backup End 

//show backup Start
function show_backup() {
    var tbl_row_cnt = 1;
   
    if(_Service_Name =='')
    {
        Swal.fire({
            title: "Please Select Service",
            icon: 'error'
        })
        return false
    }
   
    

    $.ajax({
        url: apiUrl + '/api/'+_Service_Name+'/v1/BackupDB',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            backuptable.hide();
            imgload.show();
        },
        success: function (response) {
            if (response.statusCode == 200) {
                var action_button = ' ';
                //Delete
                action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                //Download
                action_button += "<a href='#' class='btn-download glyphicon glyphicon-download-alt' data-toggle='tooltip' title='Download'></a>  ";
                backuptable.show();
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
                        {
                            "render": function (data, type, full, meta) {
                                return tbl_row_cnt++;
                            }
                        },
                        { data: 'date' },
                        { data: 'time' },
                        { data: 'fileName' },
                        { data: 'size' }
                    ],
                    "pageLength": 10,
                    "order": [[2, "desc"], [3, "desc"]]
                });
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
    return true;
}
//show backup End



//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        //Fill Service Start
        FillService();
        //Fill Service End
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();

//Fill Service Start
function FillService() {
    $("#txt_service").select2({
        placeholder: "Search for Services",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/api/Log/v1/LOV/GetService',
            type: "Get",
            dataType: 'json',
            delay: 250,
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
                            text: item.name,
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
            var data = { "id": _Service_Id, "text": _Service_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Service End

//Trigger after Selection Start
$('#txt_service').on("select2-selected", function (e) {
    var service = $("#txt_service");
    _Service_Name =service.select2('data').text;
    
});
