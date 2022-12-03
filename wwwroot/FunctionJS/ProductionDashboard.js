var ImagedetailsTable = $("#Image_detailsTable tbody");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var imgloadcheck = $("#img_load_check");
var btncreate = $("#btn_create");
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var btnstasav = $('#btn_status_sav');

function readURL(input) {
    if (input.files && input.files[0]) {
        for (let i = 0; i < input.files.length; i++) {

            var reader = new FileReader();

            reader.onload = function (e) {
                //var productItem = '<tr><td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td><td><img src="' + e.target.result + '" /></td></tr>';
                //ImagedetailsTable.append(productItem);

                //$('#image')
                //    .attr('src', e.target.result)
                //    .width(150)
                //    .height(200);
                var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
                if (match == null) {
                    throw 'Could not parse result'; // should not happen
                }
                var mimeType = match[1];
                var content = match[2];
                var productItem = '<tr>' +
                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                    '<td><a href=' + URL.createObjectURL(input.files[i]) + ' target="_blank">' + input.files[i].name + '</a></td>' +
                    '<td style="display:none;">' + input.files[i].type + '</td>' +
                    '<td style="display:none;">' + content + ' </td>' +
                    '<td style="display:none;">' + input.files[i].name + ' </td>' +
                    '</tr>';
                ImagedetailsTable.append(productItem);
            };

            reader.readAsDataURL(input.files[i]);
        }
    }
}

//Delete from Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    output = confirm('Are sure wants to delete?');
    if (output == false) {

        return false;
    }

    e.preventDefault();
    var $self = $(this);
    if ($(this).attr('data-itemId') == "0") {
        $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
            $(this).remove();
        });
    }
});
//Delete from Table End
// Create Code start *@

function savrec() {
    var rows_cnt = $("#Image_detailsTable tbody >tr");
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var detail_record = ck.detailrecord;


    output = confirm('Are sure wants to Save?');
    if (output == false) {

        return false;
    }
    $.ajax({
        url: apiUrl + '/Complain/create/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Complain_By": $("#txt_comp_by").val(),
            "Complain": $("#txt_comp").val(),
            "Remarks": $("#txt_rmrk").val(),
            "Priority": $("#txt_priority").val(),
            "AttachmentCount": rows_cnt.length,
            "Detail": detail_record
        }),
        beforeSend: function () {
            imgloadsav.show();
            btnsav.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadsav.hide();
                discon();
                btnsav.show();
                $('#data_Modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadsav.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadsav.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
    return true;

}
// Create Code End *@

$(document).ready(function () {
    $("#lbl_status").html('Check');
    discon();

});
$(document).on("click", '#btn_create', function () {
    imgloadsav.hide();
    var lblack = $("#lbl_ack").html();
    if (lblack > 0) {
        console.log("Acknowledgement " + lblack + " Pending");
        alert("Acknowledgement " + lblack + " Pending");
        return;
    }
    $('#data_Modal').modal('show');
    btnupd.hide();
    btnsav.show();

});


//Fill FillPendingRecord Start
function FillPendingRecord() {
    // $("#lbl_status").html(status);
   // onload();


   $.ajax({
    url: apiUrl + '/Dashboard/Dash/FillPending',
    type: "Post",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
        "Token": strkey,
        "Menu": 1
    }),
    beforeSend: function () {
        //imgload.show();
    },
    success: function (response) {
        var jres = response;
        var sno = 1;
        if (jres[0].status == 1) {
            var action_button = ' ';
            var json = response[0]["Result"];
            $("#lbl_pending").html(response[0]["Result"][0]["Pending_count"]);
            //imgload.hide();
        }
        else {
            imgload.hide();
            Swal.fire({
                title: `${jres[0].Remarks}`,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    },
    error: function (error) {
        //imgload.hide();
        console.log('Error ' + error)
        Swal.fire({
            title: "Error" + error,
            icon: 'error',

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });

    }
})



}
//Fill FillPendingRecord End

//Fill FillClose Start
function FillCloseRecord() {
    // $("#lbl_status").html(status);
   // onload();


   $.ajax({
    url: apiUrl + '/Dashboard/Dash/FillClose',
    type: "Post",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
        "Token": strkey,
        "Menu": 1
    }),
    beforeSend: function () {
        //imgload.show();
    },
    success: function (response) {
        var jres = response;
        var sno = 1;
        if (jres[0].status == 1) {
            var action_button = ' ';
            var json = response[0]["Result"];
           
            $("#lbl_close").html(response[0]["Result"][0]["Close_count"]);
            //imgload.hide();
        }
        else {
            imgload.hide();
            Swal.fire({
                title: `${jres[0].Remarks}`,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    },
    error: function (error) {
        //imgload.hide();
        console.log('Error ' + error)
        Swal.fire({
            title: "Error" + error,
            icon: 'error',

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });

    }
})



}
//Fill FillPendingRecord End 

//Fill FillAllRecord Start
function FillAllRecord() {
    // $("#lbl_status").html(status);
   // onload();


   $.ajax({
    url: apiUrl + '/Dashboard/Dash/FillAll',
    type: "Post",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
        "Token": strkey,
        "Menu": 1
    }),
    beforeSend: function () {
        //imgload.show();
    },
    success: function (response) {
        var jres = response;
        var sno = 1;
        if (jres[0].status == 1) {
            var action_button = ' ';
            var json = response[0]["Result"];
            
            $("#lbl_all").html(response[0]["Result"][0]["Count"]);
            //imgload.hide();
        }
        else {
            imgload.hide();
            Swal.fire({
                title: `${jres[0].Remarks}`,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    },
    error: function (error) {
        //imgload.hide();
        console.log('Error ' + error)
        Swal.fire({
            title: "Error" + error,
            icon: 'error',

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });

    }
})



}
//Fill FillAllRecord End 


//Fill FillNotStartRecord Start
function FillNotStartRecord() {
    // $("#lbl_status").html(status);
   // onload();


   $.ajax({
    url: apiUrl + '/Dashboard/Dash/FillNotStrart',
    type: "Post",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
        "Token": strkey,
        "Menu": 1
    }),
    beforeSend: function () {
        //imgload.show();
    },
    success: function (response) {
        var jres = response;
        var sno = 1;
        if (jres[0].status == 1) {
            var action_button = ' ';
            var json = response[0]["Result"];
           
            $("#lbl_nostrt").html(response[0]["Result"][0]["Not_Start"]);
            //imgload.hide();
        }
        else {
            imgload.hide();
            Swal.fire({
                title: `${jres[0].Remarks}`,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });
        }
    },
    error: function (error) {
        //imgload.hide();
        console.log('Error ' + error)
        Swal.fire({
            title: "Error" + error,
            icon: 'error',

            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            }
        });

    }
})



}
//Fill FillNotStartRecord End 

// Fill Edit Start *@
function _Edit(ticket_id, ticket_status) {
    var divChecked = $("#div_Checked");
    var divQC = $("#div_QC");
    divChecked.hide();
    divQC.hide();

    btnstasav.hide();
    var output;
    output = confirm("Are you sure to " + ticket_status + " Ticket  # " + ticket_id + "?");
    if (output == false) {
        return false;
    }
    $.ajax({
        url: apiUrl + '/Complain/FetchEditComplain/' + ticket_id,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                btnupd.show();
                $('#chck_modal').modal('show');
                $("#txt_id_upd").html(response[0]["Result"][0]["Ticket"]);
                $("#txt_date_upd").html(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                $("#txt_comp_by_upd").html(response[0]["Result"][0]["Complain_By"]);
                $("#txt_status").html(ticket_status);


                $("#txt_check_rmk").html(response[0]["Result"][0]["Checked_Remarks"]);
                $("#txt_qc_rmk").html(response[0]["Result"][0]["QC_Remarks"]);

                if (ticket_status == 'Check') {
                    $("#txt_status_rmk").val(response[0]["Result"][0]["Checked_Remarks"]);
                }
                else if (ticket_status == 'QC') {
                    divChecked.show();
                    $("#txt_status_rmk").val(response[0]["Result"][0]["QC_Remarks"]);
                }
                else if (ticket_status == 'Acknowledge') {
                    divChecked.show();
                    divQC.show();
                    $("#txt_status_rmk").val(response[0]["Result"][0]["Acknowledge_Remarks"]);
                }
                else if (ticket_status == 'Cancel') {
                    divChecked.show();
                    divQC.show();
                    $('#ck_sta').iCheck('check');
                    $("#txt_status_rmk").val(response[0]["Result"][0]["Cancelled_Remarks"]);
                }
            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
// Fill Edit End *@
//Update Check Start
function updrec_check() {


    $.ajax({
        url: apiUrl + '/Complain/checkedby/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "CK_Checked": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgload.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
//Update Check End

//Update QC Start
function updrec_QC() {

    $.ajax({
        url: apiUrl + '/Complain/QCby/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "QC_Checked": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
//Update QC End

//Update Acknowledge Start
function updrec_Acknowledge() {
    $.ajax({
        url: apiUrl + '/Complain/Acknowledgeby/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "CK_Acknowledge": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
}
//Update Acknowledge End
//Update Cancel Start
function updrec_Cancel() {


    $.ajax({
        url: apiUrl + '/Complain/Cancel/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "CK_Cancel": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
//Update Cancel End


//Update Start
function updrec() {
    var txtstatus = $("#txt_status").html();
    if (txtstatus == 'Check') { updrec_check(); }
    else if (txtstatus == 'QC') { updrec_QC(); }
    else if (txtstatus == 'Acknowledge') { updrec_Acknowledge(); }
    else if (txtstatus == 'Cancel') { updrec_Cancel(); }

}
//Update End

//Validation Start
function ckvalidation() {
    var rows_create = $("#Image_detailsTable tbody >tr");
    var columns;
    var ck = 0;
    var detail_record = "";
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        if (detail_record == "") {
            detail_record = $(columns[4]).html() + "|" + $(columns[3]).html() + "|" + $(columns[2]).html();
        }
        else {
            detail_record += "|" + $(columns[4]).html() + "|" + $(columns[3]).html() + "|" + $(columns[2]).html();
        }
    }

    if ($("#txt_comp_by").val() == '') {
        ck = 1;
    }
    else if ($("#txt_comp").val() == '') {
        ck = 1;
    }

    return { ckval: ck, detailrecord: detail_record };
}
//Validation End

//Show Attachment Start
function _ShowImage(ticket_id) {
    var imagemodalShow = $("#image_modal_Show");
    var ImagedetailsTableShow = $("#Image_detailsTable_Show tbody");

    var divCheckedimg = $("#div_Checked_img");
    var divQCimg = $("#div_QC_img");
    var divAcknowledgeimg = $("#div_Acknowledge_img");
    divCheckedimg.hide();
    divQCimg.hide();
    divAcknowledgeimg.hide();

    ImagedetailsTableShow.empty();
    var urlstr = apiUrl + '/Complain/FetchImage/' + ticket_id;
    $.ajax({
        url: urlstr,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey
        }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imagemodalShow.modal('show');
                imgload.hide();

                var ticket_status = response[0]["Result"][0]["Status"];

                $("#txt_id_img").html(response[0]["Result"][0]["Ticket"]);
                $("#txt_date_img").html(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                $("#txt_comp_by_img").html(response[0]["Result"][0]["Complain_By"]);
                $("#txt_status_img").html('Attachment (Pending : ' + ticket_status + ')');
                $("#txt_check_rmk_img").val(response[0]["Result"][0]["Checked_Remarks"]);
                $("#txt_qc_rmk_img").val(response[0]["Result"][0]["QC_Remarks"]);
                $("#txt_act_rmk_img").val(response[0]["Result"][0]["Acknowledge_Remarks"]);

                if (ticket_status == 'Acknowledge') {
                    divCheckedimg.show();
                    divQCimg.show();
                    // divAcknowledgeimg.show();
                }
                else if (ticket_status == 'QC') {
                    divCheckedimg.show();
                    //divQCimg.show();
                }
                //else if (ticket_status == 'Check') {
                //    divCheckedimg.show();
                //}

                var productItem;
                var sno = 1;
                for (var row_cnt = 0; row_cnt < response[0]["Result"].length; row_cnt++) {


                    //const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
                    //    const byteCharacters = atob(b64Data);
                    //    const byteArrays = [];

                    //    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    //        const slice = byteCharacters.slice(offset, offset + sliceSize);

                    //        const byteNumbers = new Array(slice.length);
                    //        for (let i = 0; i < slice.length; i++) {
                    //            byteNumbers[i] = slice.charCodeAt(i);
                    //        }

                    //        const byteArray = new Uint8Array(byteNumbers);
                    //        byteArrays.push(byteArray);
                    //    }

                    //    const blob = new Blob(byteArrays, { type: contentType });
                    //    return blob;
                    //}

                    //const contentType = response[0]["Result"][row_cnt]["File_Extension"];// 'image/png';
                    //const b64Data = response[0]["Result"][row_cnt]["Image"];// 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

                    //const blob = b64toBlob(b64Data, contentType);
                    productItem += '<tr>' +
                        '<td>' + sno++ + '</td>' +
                        '<td><a href=' + response[0]["Result"][row_cnt]["Image"] + ' target="_blank">' + response[0]["Result"][row_cnt]["File_Name"] + '</a></td>' +
                        //'<td><div class="embed-responsive embed-responsive-16by9"><iframe src="https://drive.google.com/file/d/' + response[0]["Result"][row_cnt]["File_ID"]+'/preview" width="640" height="480"></iframe></div></td>' +
                        '<td></td>' +
                        '</tr>';

                }
                ImagedetailsTableShow.append(productItem);

            }
            else {
                imgload.hide();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

    //image_modal_Show
}
//Show Attachment End

// loadPrint Start
function loadPrint() {
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetPrintJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_Print').DataTable().clear().destroy();
                detailsTableBody = $("#Table_Print").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/Printing?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadPrint end
// loadUV Start
function loadUV() {
    
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetUVJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_UV').DataTable().clear().destroy();
                detailsTableBody = $("#Table_UV").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                               return '<a href="' + apiUrl_View + '/Production_Transaction/UV?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },
                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadUV end

// loadLamination Start
function loadLamination() {
    
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetLaminationJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_Lamination').DataTable().clear().destroy();
                detailsTableBody = $("#Table_Lamination").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/Lamination?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadLamination end

// loadFoiling Start
function loadFoiling() {
   
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetFoilingJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_Foiling').DataTable().clear().destroy();
                detailsTableBody = $("#Table_Foiling").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/Foiling?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadFoiling end

// loadDieCutting Start
function loadDieCutting() {

    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetDieCuttingJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_DieCutting').DataTable().clear().destroy();
                detailsTableBody = $("#Table_DieCutting").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/DieCutting?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadDieCutting end

// loadPasting Start
function loadPasting() {
  
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetPastingJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_Pasting').DataTable().clear().destroy();
                detailsTableBody = $("#Table_Pasting").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/Pasting?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadPasting end

// loadEyelet Start
function loadEyelet() {
    
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetEyeletJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_Eyelet').DataTable().clear().destroy();
                detailsTableBody = $("#Table_Eyelet").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/Eyelet?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadEyelet end

// loadSublet Start
function loadSublet() {
    
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetSubletJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_Sublet').DataTable().clear().destroy();
                detailsTableBody = $("#Table_Sublet").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/Sublet?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadSublet end

// loadPacking Start
function loadPacking() {
    
    var _menid = document.URL.split("?")[1];
  
    $.ajax({
        url: apiUrl + '/Dashboard/Dash/GetPackingJob',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": 1
        }),
        beforeSend: function () {
            //imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';
                var json = response[0]["Result"];
                $('#Table_Packing').DataTable().clear().destroy();
                detailsTableBody = $("#Table_Packing").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data : null,
                            render: function( data ,type , row){
                            //return '<a href="' + apiUrl_View + '/Reports/ADGE_Report?s=' + data.standard_id + '&c=' +  data.company_id+'&a='+data.assesmentperiod_id+'" target="_blank"><span class="label label-lg label-light-success label-inline label-success-buks">Review</span></a><a href=""><span class="btn-approved label label-lg label-light-success label-inline label-success-buks">Approval</span></a>'
                               return '<a href="' + apiUrl_View + '/Production_Transaction/Packing?2065" target="_blank" >Edit</a>'  
                            }

                        },
                        { data: 'MJO_ID' },
                        { data: 'Description' },
                        { data: 'Date' },
                        { data: 'Machine' },
                        { data: 'Qty' },
                        { data: 'production' },
                        { data: 'status' },

                    ]
                });
                //imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            //imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
// loadPacking end



function discon() {
    // console.log('Discon');
    document.getElementById('check_modal_form').reset();
    document.getElementById('Re_Packing_form').reset();
    btnsav.hide();
    btncreate.hide();
    btnupd.hide();
    var detailsTableBody = $("#Table_View tbody");
    detailsTableBody.empty();
    var ImagedetailsTable = $("#Image_detailsTable tbody");
    ImagedetailsTable.empty();
    
    loadPrint();
    loadUV();
    loadLamination();
    loadFoiling();
    loadDieCutting();
    loadPasting();
    loadEyelet();
    loadSublet();
    loadPacking();
    imgload.hide();

    //Boxes
    FillPendingRecord();
    FillCloseRecord();
    FillAllRecord();
    FillNotStartRecord();

    $('#ck_sta').iCheck('update')[0].checked;

}


//Screen Recoding Start
const start_video = document.getElementById("start_video");
const stop_video = document.getElementById("stop_video");
//const video = document.querySelector("video");
let recorder_video, stream_video;

async function startRecording_video() {
    stream_video = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" }
    });
    recorder_video = new MediaRecorder(stream_video);

    const chunks = [];
    recorder_video.ondataavailable = e => chunks.push(e.data);
    recorder_video.onstop = e => {
        const completeBlob = new Blob(chunks, { type: chunks[0].mimeType });
        //video.src = URL.createObjectURL(completeBlob);
        //var reader = new FileReader();
        //var source = reader.readAsBinaryString(URL.createObjectURL(completeBlob));
        //console.log(source);

        var url = URL.createObjectURL(completeBlob);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = moment(new Date()).format('YYYYMMDDHHmmss') + '.webm';
        a.click();
        window.URL.revokeObjectURL(url);

    };

    recorder_video.start();
}

start_video.addEventListener("click", () => {
    start_video.setAttribute("disabled", true);
    stop_video.removeAttribute("disabled");

    startRecording_video();
});

stop_video.addEventListener("click", () => {
    stop_video.setAttribute("disabled", true);
    start_video.removeAttribute("disabled");

    recorder_video.stop();
    stream.getVideoTracks()[0].stop();
});
//Screen Recording End

//Audio Recoding Start
const start_Audio = document.getElementById("start_Audio");
const stop_Audio = document.getElementById("stop_Audio");
//const Audio = document.querySelector("Audio");
let recorder_Audio, stream_Audio;

async function startRecording_Audio() {
    stream_Audio = await navigator.mediaDevices.getUserMedia({ audio: true });


    recorder_Audio = new MediaRecorder(stream_Audio);
    const audioChunks = [];
    recorder_Audio.ondataavailable = e => audioChunks.push(e.data);
    recorder_Audio.onstop = e => {
        const completeBlob_Audio = new Blob(audioChunks, { type: audioChunks[0].mimeType });
        var url = URL.createObjectURL(completeBlob_Audio);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = moment(new Date()).format('YYYYMMDDHHmmss') + '.wav';
        a.click();
        window.URL.revokeObjectURL(url);
    };


    recorder_Audio.start();
}

start_Audio.addEventListener("click", () => {
    start_Audio.setAttribute("disabled", true);
    stop_Audio.removeAttribute("disabled");

    startRecording_Audio();
});

stop_Audio.addEventListener("click", () => {
    stop_Audio.setAttribute("disabled", true);
    start_Audio.removeAttribute("disabled");

    recorder_Audio.stop();
    //stream_Audio.getAudioTracks()[0].stop();
});
//Audio Recording End