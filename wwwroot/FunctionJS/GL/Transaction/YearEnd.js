// var txtdatstr = $("#txt_datstr");
// var txtdatend = $("#txt_datend");
var btnend = $('#btn_end');
var imgload = $("#img_load");



// $(function () {
//     txtdatstr.datetimepicker({ format: 'DD/MMM/YYYY' });
//     txtdatend.datetimepicker({ format: 'DD/MMM/YYYY' });
// });

$(document).ready(function () {
    imgload.hide();
    ComponentsDropdowns.init();
});


function yearend() {
    output = confirm('Are sure wants to year end?');
    if (output == false) {

        return false;
    }
    $.ajax({
        url: apiUrl + '/GL/Transaction/YearEnd/YearClose',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Year_Old_ID": $("#txt_year_old").select2('data').id ,
            "Year_New_ID": $("#txt_year_new").select2('data').id ,
            "Account_ID": $("#txt_acc_pl").select2('data').id ,
            "CK_Account": $("#ck_account").iCheck('Update')[0].checked,
            "CK_Inventory": $("#ck_inventory").iCheck('Update')[0].checked

        }),
        beforeSend: function () {
            imgload.show();
            btnend.hide();
        },
        success: function (response) {
            if (response[0].status == 1) {
                imgload.hide();
                btnend.show();
                alert(response[0].Remarks);
            }
            else {
                imgload.hide();
                btnend.show();
                alert(response[0].Remarks);
            }

        },
        error: function (error) {
            imgload.hide();
            btnend.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
    return true;

}

//Comment Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {
        //Voucher Type Start
        fillYearOld();
        //Voucher Type Start
        //Account Start
        fillYearNew();
        //Account End

        //P/L Account Start
        fillPLAccount();
        //P/L Account End
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
//Comment End


//Year old Start
function fillYearOld() {
    $("#txt_year_old").select2({
        placeholder: "Search Old Year",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/GL/Transaction/YearEnd/OldYear',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Year
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Year old End


//Year New Start
function fillYearNew() {
    $("#txt_year_new").select2({
        placeholder: "Search New Year",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/GL/Transaction/YearEnd/YearNew',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Year
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Year New End

//Profit/Loss Account Start
function fillPLAccount() {
    $("#txt_acc_pl").select2({
        placeholder: "Search P & L Account",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/GL/Transaction/YearEnd/YearPLAccount',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey, // search term
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data
                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {

                        myResults.push({
                            id: item.ID,
                            text: item.Name
                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Profit/Loss Account End