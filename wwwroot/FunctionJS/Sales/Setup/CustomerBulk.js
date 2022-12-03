var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var _Category_ID = '0';
var _Category_Name = '';
var _SubCategory_ID = '0';
var _SubCategory_Name = '';
var _Zone_ID = '0';
var _Zone_Name = '';

$(document).ready(function () {
    imgload.hide();
    discon();
});

function discon() {
    imgload.hide();
}




$(document).on("click", '#btn_new', function () {
    savrec();
});



async function savrec() {


    output = confirm('Are sure wants to Upload Data?');
    if (output == false) {

        return false;
    }

    var rowinsert = 0;
    var customername = "";
    var rows_create = $("#Table_View tbody >tr");
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');
        var txtname = $(columns[1]).html().trim();
        var txtcp = $(columns[3]).html().trim();
        var txt_address = $(columns[2]).html().trim();
        var txtcnic = $(columns[4]).html().trim();
        var txtphone = $(columns[5]).html().trim();
        var txtmobile = $(columns[6]).html().trim();
        var txtfax = $(columns[7]).html().trim();
        var txtemail = $(columns[8]).html().trim();
        var txtweb = $(columns[9]).html().trim();
        var txtntn = $(columns[11]).html().trim();
        var txtstn = $(columns[12]).html().trim();
        var ckstn = $(columns[10]).html();
        var txtcredays = $(columns[13]).html().trim();
        var txtamountlimit = $(columns[14]).html().trim();
       await $.ajax({
            url: apiUrl + '/Sales/Setup/Customer/create',
            type: "Post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "Token": strkey,
                "Name": txtname,
                "Contact_Person": txtcp,
                "Address": txt_address,
                "CNIC": txtcnic,
                "Phone_No": txtphone,
                "Mobile_No": txtmobile,
                "Fax_No": txtfax,
                "Email": txtemail,
                "Web": txtweb,
                "NTN": txtntn,
                "STN": txtstn,
                "CK_NTN": ckstn,
                "Credit_Days": txtcredays,
                "Amount_Limit": txtamountlimit,
                "Active": true,
                "Status": 'N',
                "Category_ID": 1,
                "SubCategory_ID": 1,
                "Zone_ID": 7
            }),
            beforeSend: function () {
                imgload.show();
                btnnew.hide();
            },
            success: function (response) {
                var jres = response;
                if (jres[0].status == 1) {
                    rowinsert += 1;
                }
                else {
                    customername += '\n'+ response[0].Remarks;
                }

            },
            error: function (error) {
                customername += txtname;

                 imgload.hide();
                 btnnew.show();
                 console.log('Error ' + error)
                 alert('Error ' + error)
            }
        })


    }
    imgload.hide();
    btnnew.show();
    alert(rowinsert +" records insert out of "+rows_create.length + ". \n"+customername  );

    return true;

}



//excel get data

let selectedFiles;
let rowObject;
document.getElementById('input').addEventListener('change', (event) => {
    selectedFiles = event.target.files[0];
})
document.getElementById('button').addEventListener('click', () => {

    if (selectedFiles) {
        $('#Table_View').hide();
        $('#Table_View').show();
        $('#Table_View tbody').empty();
        let filReader = new FileReader();
        filReader.readAsBinaryString(selectedFiles);
        filReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            workbook.SheetNames.forEach(sheet => {
                rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              
                var row = '';
                var count = 0;
                $.each(rowObject, function (i, v) {
                    count = count + 1;                    
                   
                    if (v.Client_Address == undefined)
                    {
                        v.Client_Address = "";
                    }
                    if (v.Contact_Person1 == undefined)
                    {
                        v.Contact_Person1 = "";
                    }
                    if (v.CNIC == undefined)
                    {
                        v.CNIC = "";
                    }
                    if (v.Client_TelNo == undefined)
                    {
                        v.Client_TelNo = "";
                    }
                    if (v.Mobile == undefined)
                    {
                        v.Mobile = "";
                    }
                    if (v.Fax_No == undefined)
                    {
                        v.Fax_No = "";
                    }
                    if (v.Client_Email_No == undefined)
                    {
                        v.Client_Email_No = "";
                    }
                    if (v.Web == undefined)
                    {
                        v.Web = "";
                    }
                    if (v.Client_NTN_No == undefined)
                    {
                        v.Client_NTN_No = "";
                    }
                    if (v.Client_Stax_Reg == undefined)
                    {
                        v.Client_Stax_Reg = "";
                    }
                    if (v.CreditDays == undefined)
                    {
                        v.CreditDays = "0";
                    }
                    if (v.credit_limit == undefined)
                    {
                        v.credit_limit = "0";
                    }

                    row += "<tr><td>" + count + "</td><td>" + v.Client_Name + "</td><td>" + v.Client_Address + "</td><td>" + v.Contact_Person1 + "</td><td>" + v.CNIC + "</td><td>" + v.Client_TelNo + "</td><td>" + v.Mobile + "</td><td>" + v.Fax_No + "</td><td>" + v.Client_Email_No + "</td><td>" + v.Web + "</td><td>" + Boolean(v.CKNTN) + "</td><td >" + v.Client_NTN_No + "</td><td>" + v.Client_Stax_Reg + "</td><td>" + v.CreditDays + "</td><td>" + v.credit_limit + "</td></tr>";
                })
                $("#Table_View").append(row);



            })
        }
    }
    else {
        alert('select file first to upload..');
    }
})




