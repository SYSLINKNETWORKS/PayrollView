var ViewPermissionDashBoard = false;
var CheckPermissionDashBoard = false;
var ApprovedPermissionDashBoard = false;

async function functionDashboardPermissionByName(_MenuName) {
    await $.ajax({
        url: apiUrl + '/api/Auth/v1/LOVServices/GetDashboardPermissionByName',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("MenuName", _MenuName);//"VoucherDashboard");
            // return [ViewPermissionDashBoard, CheckPermissionDashBoard, ApprovedPermissionDashBoard];

        },
        success: function (response) {
            if (response.statusCode == 200) {
                ViewPermissionDashBoard = response["data"].filter(x => x.view_Permission == true).length > 0 ? true : false;
                CheckPermissionDashBoard = response["data"].filter(x => x.check_Permission == true).length > 0 ? true : false;
                ApprovedPermissionDashBoard = response["data"].filter(x => x.approve_Permission == true).length > 0 ? true : false;
            }
        },

    })
    return [ViewPermissionDashBoard, CheckPermissionDashBoard, ApprovedPermissionDashBoard];
}

export { functionDashboardPermissionByName };