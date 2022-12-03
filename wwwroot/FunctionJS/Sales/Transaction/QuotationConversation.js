var TableView = $("Table_View");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");

$(document).ready(function () {
    Onload();
    //ComponentsDropdowns.init();
});


//Onload Start
function Onload() {
    var _menid = 75;//document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/Sales/QuotationConversation/GetQuotation',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": _menid
        }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                var action_button = ' ';

                action_button += "<a href='#' class='btn-select glyphicon glyphicon-edit' data-toggle='tooltip' title='Select'></a> ";
                action_button += "<a href='#' class='btn-print glyphicon glyphicon-print' data-toggle='tooltip' title='Select'></a> ";

                var json = response[0]["Result"];
                array = response[0]["Result"];
                $('#Table_View').DataTable().clear().destroy();
                detailsTableBody = $("#Table_View").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data: null,
                            "defaultContent": action_button
                        },
                        { data: 'BranchName' },
                        { data: 'No' },
                        {
                            data: 'Date',
                            type: 'date',
                            render: function (data, type, row) {
                                return moment(data).format('DD-MMM-YYYY')
                            }
                        },

                        { data: 'Attn' },
                        { data: 'CustomerName' },
                        { data: 'Item' },
                        { data: 'Conversation' }
                    ],
                    "order": [[2, "desc"], [1, "desc"]],
                    "pageLength": 10
                });
                imgload.hide();
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
            imgload.hide();
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
//Onload End

//Discon Working Start
function discon() {
    document.getElementById('create_form').reset();
    $("#txt_id").html('');
    $("#txt_no").html('');
    $("#txt_attn").html('');
    $("#txt_cus").html('');
    $("#txt_titm").val('');
    $('#ck_close').iCheck('update')[0].checked;

    //Current Date Start
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdat.find("input").val(CurrentDate);
    txtddat.find("input").val(CurrentDate);

    

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();

    //discon_det();
    Onload();
    //imgload.hide();
}

function discon_det() {
    $("#txt_rmk").val('');
    $("#txt_rmk").focus();
};
//Discon Working End

//Fill conversation Start
$('table').on('click', '.btn-select', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mpso_id = data['ID'];
    var _mpso_no = data['No'];
    var _mpso_dat = data['Date'];
    var _mpso_attn = data['Attn'];
    var _cus_nam = data['CustomerName'];
    var _titm_nam = data['Item'];

    var txtid = $("#txt_id");
    var txtno = $("#txt_no");
    var txtdat = $("#txt_dat");
    var txtattn = $("#txt_attn");
    var txtcus = $("#txt_cus");
    var txttitm = $("#txt_titm");

    var detailsTableBody = $("#detailsTable tbody");
    detailsTableBody.empty();

    Swal.fire({
        title: "Are sure wants to Edit Quotation # " + _mpso_no + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Edit Conversation',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({

                url: apiUrl + '/Sales/QuotationConversation/GetConversation/' + _mpso_id,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ "Token": strkey }),
                beforeSend: function () {
                    imgload.show();
                    //btnsav.hide();
                },
                success: function (response) {
                    if (response[0].status == 1) {
                        imgloadsav.hide();
                        $('#data_Modal').modal('show');
                        //btnupd.show();
                        txtid.html(_mpso_id);
                        txtno.html(_mpso_no);
                        txtdat.find("input").val(moment(_mpso_dat).format("DD-MMM-YYYY"));
                        txtattn.html(_mpso_attn);
                        txtcus.html(_cus_nam);
                        txttitm.html(_titm_nam);

                        //Detail Start
                        var sno = 1;
                        for (var i = 0; i < response[0]["Result"].length; i++) {

                            var productItem = '<tr>' +
                                '<td>' + moment(response[0]["Result"][i]["mpsoconv_dat"]).format("DD-MMM-YYYY") + '</td>' +
                                '<td>' + moment(response[0]["Result"][i]["mpsoconv_dat"]).format("hh-mm") + '</td>' +
                                '<td>' + response[0]["Result"][i]["mpsoconv_rmk"] + '</td>' +
                                '</tr>';
                            detailsTableBody.append(productItem);
                        }

                        imgload.hide();

                        return true;
                    }
                    else {
                        alert(response[0].Remarks);
                    }

                },
                error: function (error) {
                    console.log('Error ' + error)
                    alert('Error ' + error)
                }
            })

        }
    })
});
//Fill Conversation End

//Enter Remarks start
$("#txt_rmk").keyup(function (e) {
    if (e.keyCode === 13) {
        var rmk = $("#txt_rmk").val();
        var _mpso_id = $("#txt_id").html();
        var ckclose = $('#ck_close').iCheck('update')[0].checked;
        var date = moment(new Date());
        if (rmk == "") {
            alert("Please Enter Remarks");
            return false;
        }


        var detailsTableBody = $("#detailsTable tbody");
        var productItem = '<tr>' +
            '<td>' + moment(new Date()).format("DD-MMM-YYYY") + '</td>' +
            '<td>' + moment(new Date()).format("hh-mm") + '</td>' +
            '<td>' + rmk + '</td>' +
            '</tr>';
        detailsTableBody.append(productItem);

        var urlstr = apiUrl + '/Sales/QuotationConversation/create/' + rmk + '/' + _mpso_id + '/' + ckclose;
        $.ajax({
            url: urlstr,
            type: "Post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({ "Token": strkey }),
            beforeSend: function () {
                imgloadsav.show();
                //btnsav.hide();
            },
            success: function (response) {
                var jres = response;
                if (jres[0].status == 1) {
                    imgloadsav.hide();
                    discon_det();
                    //btnsav.show();
                    //$('#data_Modal').modal('hide');
                    alert(jres[0].Remarks);
                    // Onload_Voucher_CR();
                }
                else {
                    imgloadsav.hide();
                    //btnsav.show();
                    alert(jres[0].Remarks);
                }

            },
            error: function (error) {
                imgloadsav.hide();
                //btnsav.show();
                console.log('Error ' + error)
                alert('Error ' + error)
            }
        })
        return true;
    }
});
//Enter Remarks End


//Print Start
$('table').on('click', '.btn-print', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _mpso_id = data['ID'];
    var _mpso_no = data['No'];


    Swal.fire({
        title: "Are sure wants to print Quotation Conversation # " + _mpso_no + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Print',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            var cre = "";
            cre = " and v_rpt_pso.mpso_id=" + _mpso_id;
            var sessid = "C" + moment(new Date()).format("DDMMYYYYHHmmss");
            var sessid_name = "N" + moment(new Date()).format("DDMMYYYYHHmmss");
            sessionStorage.setItem(sessid, cre);
            sessionStorage.setItem(sessid_name, '');

            var win = window.open(ViewUrl + '/Sale_Reports/QuotationSummary?1&' + sessid + '&' + sessid_name, '_blank');

            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                Swal.fire({
                    title: 'Please allow popups for this website',
                    icon: 'error'
                })
            }

        }
    })
});
//Print End